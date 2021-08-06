import type, { Field } from '@uk/type';
import { FindOptions, ObjectId } from 'mongodb';
import { SortDir } from '.';
import { DLoader } from './dloader';
import { Model } from './model';
import { Where } from './where';

type Prefix<TPrefix extends string, T extends string> = `${TPrefix}.${T}`;

export class SelectQuery<
    TSchema extends { _id: Field.Any },
    TKeys extends string,
    TJoined extends 'joined' | 'plain' = 'plain',
    TResult = type.Selector<TJoined extends 'joined' ? type.Joined<TSchema> : type.Plain<TSchema>, TKeys>,
    TAllKeys extends type.Path.Keys<type.Plain<TSchema>> = type.Path.Keys<type.Plain<TSchema>>,
> {
    private opts = {} as FindOptions<any>;
    private condition = {} as any;

    constructor(private model: Model.Any) {}

    include(all: '*'): SelectQuery<TSchema, TAllKeys, TJoined>;
    include<K extends TAllKeys>(...fields: K[]): SelectQuery<TSchema, TKeys | K, TJoined>;
    include(...fields: any[]): any {
        if (fields.length === 0) return this as any;
        if (fields.includes('*' as any)) {
            this.opts.projection = undefined;
        } else {
            this.opts.projection = { ...this.opts.projection, ...Object.fromEntries(fields.map(f => [f, 1])) };
        }
        return this as any;
    }

    exclude(all: '*'): SelectQuery<TSchema, '_id', TJoined>;
    exclude<K extends TAllKeys>(...fields: K[]): SelectQuery<TSchema, Exclude<TKeys, K>, TJoined>;
    exclude(...fields: any[]): any {
        if (fields.length === 0) return this as any;
        if (fields.includes('*' as any)) {
            this.opts.projection = { _id: 1 };
        } else {
            this.opts.projection = { ...this.opts.projection, ...Object.fromEntries(fields.map(f => [f, 0])) };
        }
        return this as any;
    }

    where(condition: Where<TSchema>): this {
        this.condition = condition;
        return this;
    }

    andWhere(condition: Where<TSchema> | undefined): this {
        if (condition && typeof condition === 'object') {
            if (this.condition && this.condition.$and) {
                this.condition.$and.push(condition);
            } else {
                const cond = { $and: [condition] };
                if (this.condition) cond.$and.push(this.condition as any);
                this.condition = cond;
            }
        }
        return this;
    }

    join<
        K extends type.Filter.FieldsByFlags<TSchema, type.Field.Flags.REF>,
        JK extends type.Path.Keys<
            type.Unbox<
                type.Path.Prop<TSchema, K> extends Field<any, any, any, any, infer R> ? R : 'NOT_A_FIELD',
                'plain'
            >
        >,
    >(fk1: K, ...fields: JK[]): SelectQuery<TSchema, TKeys | Prefix<K, JK>, 'joined'> {
        throw new Error('Not implemented yet');
    }

    hook(handler: Select.Hook<TResult>): this {
        this.hooks ??= [];
        this.hooks.push(handler);
        return this;
    }

    limit(count: number, skip?: number): this {
        this.opts.limit = count;
        if (skip !== undefined) this.opts.skip = skip;
        return this;
    }

    sort(key: TAllKeys, dir: SortDir): this;
    sort(doc: Partial<Record<TAllKeys, SortDir>>): this;
    sort(fieldOrSorts: string | object, dir?: SortDir): this {
        if (typeof fieldOrSorts === 'string') {
            this.opts.sort ??= { [fieldOrSorts]: dir === 1 || dir === 'ASC' || dir === 'asc' ? 1 : 0 } as any;
        } else if (typeof fieldOrSorts === 'object') {
            this.opts.sort = fieldOrSorts;
        }
        return this;
    }

    dataLoader(): DLoader<TSchema> {
        throw new Error('Not implemented yet');
    }

    async one(id?: string | type.MongoID | undefined | null): Promise<TResult | undefined> {
        if (arguments.length > 0) {
            if (!id) return this.runHooks(undefined);
            this.where({ _id: type.MongoID.create(id) } as any);
        }
        return this.runHooks((await this.limit(1).runCursor().toArray())[0]);
    }

    async oneRequire(id?: string | type.MongoID | undefined | null): Promise<TResult> {
        const rv = id ? await this.one(id) : await this.one();
        if (!rv) {
            const _id = id || this.condition['_id'];
            if (_id) {
                throw new Error(`Unable to find document with _id=${_id} from ${this.model.modelName}`);
            } else {
                throw new Error(`Unable to find document from ${this.model.modelName}`);
            }
        }
        return rv as any;
    }

    async oneOrCreate(create: () => type.Initial<TSchema> | Promise<type.Initial<TSchema>>): Promise<TResult>;
    async oneOrCreate(
        id: string | type.MongoID,
        create: () => type.Initial<TSchema> | Promise<type.Initial<TSchema>>,
    ): Promise<TResult>;
    async oneOrCreate(_id: any, create?: any): Promise<TResult> {
        if (typeof _id === 'string') this.where({ _id: type.MongoID.create(_id) } as any);
        if (_id instanceof ObjectId) this.where({ _id } as any);
        create = typeof _id === 'function' ? _id : create;
        const rv = (await this.limit(1).runCursor().toArray())[0];
        return this.runHooks(rv || this.model.new(await create()));
    }

    async asArray(): Promise<TResult[]> {
        return this.runHooks(await this.runCursor().toArray());
    }

    async asHash(byField?: TAllKeys): Promise<{ [key: string]: TResult }>;
    async asHash(byField: TAllKeys, group?: 'group'): Promise<{ [key: string]: TResult[] }>;
    async asHash(byField?: TAllKeys, group?: 'group'): Promise<any> {
        const arr = await this.asArray();
        const rv = {} as any;
        for (const i of arr) {
            const item = i as any;
            if (group) {
                const k = item[byField].toString();
                let v = rv[k];
                if (v) v.push(i);
                else rv[k] = v = [i];
            } else {
                rv[item[byField]] = i;
            }
        }
        return rv;
    }

    async map<T>(handler: (doc: TResult, idx: number) => T): Promise<T[]> {
        const rv: T[] = [];
        await this.forEach(async (doc, idx) => {
            rv.push(handler(doc, idx));
        });
        return this.runHooks(rv);
    }

    async mapAsync<T>(handler: (doc: TResult, idx: number) => T | Promise<T>): Promise<T[]> {
        const rv: T[] = [];
        await this.forEach(async (doc, idx) => {
            rv.push(await handler(doc, idx));
        });
        return this.runHooks(rv);
    }

    async forEach(handler: (doc: TResult, idx: number) => any): Promise<any> {
        const cursor = this.runCursor();
        try {
            let idx = 0;
            while (await cursor.hasNext()) {
                const result = await cursor.next();
                if (result) await handler(result, idx++);
            }
        } finally {
            cursor.close().catch(this.model['log'].catch);
        }
    }

    async count(): Promise<number> {
        return this.model.collection.find(this.condition, this.opts).count();
    }

    async exists(): Promise<boolean> {
        return (await this.model.collection.find(this.condition, { ...this.opts, limit: 1 }).count()) > 0;
    }

    async notExists(): Promise<boolean> {
        return !(await this.exists());
    }

    protected runHooks<T>(result: T): T {
        if (this.hooks && this.hooks.length) {
            const a = Array.isArray(result) ? result : [result];
            this.hooks.forEach(c => c(a as any));
        }
        return result;
    }

    protected runCursor() {
        if (this.joins) {
            return this.model.collection.aggregate(this.getAggregations(), {
                session: this.opts.session,
            });
        } else {
            return this.model.collection.find(this.condition, this.opts);
        }
    }

    protected getAggregations() {
        const aggregations = [] as object[];

        if (this.condition) {
            aggregations.push({
                $match: this.condition,
            });
        }
        const proj: any = { ...this.opts.projection };
        if (!this.opts.projection && this.joins) {
            for (const n of this.model.fields.keys()) {
                if (!(n in this.joins)) proj[n] = 1;
            }
        }
        for (const refName in this.joins) {
            const refField = this.model[refName];
            if (refField.typename === 'BackLink') {
                aggregations.push({
                    $lookup: {
                        from: refField.options.ref.modelName || refField.options.ref.name,
                        localField: '_id',
                        foreignField: refField.options.refFk,
                        as: refName,
                    },
                });
            } else {
                aggregations.push({
                    $lookup: {
                        from: refField.options.ref.modelName || refField.options.ref.name,
                        localField: refName,
                        foreignField: '_id',
                        as: refName,
                    },
                });
            }
            if (refField.typename === 'One') {
                aggregations.push({
                    $unwind: {
                        path: '$' + refName,
                        preserveNullAndEmptyArrays: true,
                    },
                });
            }
            Object.assign(proj, this.joins[refName]);
        }
        aggregations.push({
            $project: proj,
        });
        if (this.opts.limit) {
            aggregations.push({
                $limit: this.opts.limit,
            });
        }
        if (this.opts.skip) {
            aggregations.push({
                $skip: this.opts.limit,
            });
        }
        if (this.opts.sort) {
            aggregations.push({
                $sort: this.opts.sort,
            });
        }
        return aggregations;
    }

    private joins: any;
    private hooks?: Select.Hook<TResult>[];
}

export namespace Select {
    export type Hook<TResult> = (rows: TResult[]) => any;
}
