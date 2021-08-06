import type from '@uk/type';
import { ArrayOperator, FindOneAndUpdateOptions, ModifyResult, UpdateFilter } from 'mongodb';
import { MinMongoSchema, Model } from './model';
import { Where } from './where';

export class UpdateQuery<
    TSchema extends MinMongoSchema,
    TWhere extends Where<type.Unbox<TSchema, 'plain'>> = Where<type.Unbox<TSchema, 'plain'>>,
    TAllKeys extends type.Path.Keys<type.Plain<TSchema>> = type.Path.Keys<type.Plain<TSchema>>,
> {
    #operators: UpdateFilter<unknown> = {};
    #update: any = {};
    #options: FindOneAndUpdateOptions = {};

    constructor(private model: Model<TSchema>, private condition: TWhere, setIt?: object) {
        if (setIt) this.set(setIt);
    }

    resetState() {
        this.condition = { _id: null } as any;
        this.#operators = {};
        this.#options = {};
        this.#update = {};
    }

    where(condition: TWhere) {
        this.condition = condition;
        return this;
    }

    upsert(setOnInsert: type.Initial<TSchema>) {
        this.#options.upsert = true;
        if (setOnInsert) this.#operators.$setOnInsert = this.model.new(setOnInsert);
        return this;
    }

    inc(key: type.Filter.FieldsByType<TSchema, number | Date>, amount?: number): this;
    inc(keys: Partial<Record<type.Filter.FieldsByType<TSchema, number | Date>, number>>): this;
    inc(keys: string | object, amount = 1): this {
        if (typeof keys === 'string') {
            this.#operators.$inc = { ...this.#operators.$inc, [keys]: amount };
        } else {
            this.#operators.$inc = { ...this.#operators.$inc, ...keys };
        }
        return this;
    }

    min(key: type.Filter.FieldsByType<TSchema, number | Date>, value: number): this;
    min(keys: Partial<Record<type.Filter.FieldsByType<TSchema, number | Date>, number>>): this;
    min(keys: string | object, value?: number): this {
        if (typeof keys === 'string') {
            this.#operators.$min = { ...this.#operators.$min, [keys]: value };
        } else {
            this.#operators.$min = { ...this.#operators.$min, ...keys };
        }
        return this;
    }

    max(key: type.Filter.FieldsByType<TSchema, number | Date>, value: number): this;
    max(keys: Partial<Record<type.Filter.FieldsByType<TSchema, number | Date>, number>>): this;
    max(keys: string | object, value?: number): this {
        if (typeof keys === 'string') {
            this.#operators.$max = { ...this.#operators.$max, [keys]: value };
        } else {
            this.#operators.$max = { ...this.#operators.$max, ...keys };
        }
        return this;
    }

    mul(key: type.Filter.FieldsByType<TSchema, number | Date>, multiplier: number): this;
    mul(keys: Partial<Record<type.Filter.FieldsByType<TSchema, number | Date>, number>>): this;
    mul(keys: string | object, multiplier?: number): this {
        if (typeof keys === 'string') {
            this.#operators.$mul = { ...this.#operators.$mul, [keys]: multiplier };
        } else {
            this.#operators.$mul = { ...this.#operators.$mul, ...keys };
        }
        return this;
    }

    unset(...keys: type.Filter.FieldsByFlags<TSchema, type.Field.Flags.UNDEFINABLE>[]) {
        this.#operators.$unset = { ...this.#operators.$unset, ...Object.fromEntries(keys.map(k => [k, 1])) };
        return this;
    }

    addToSet<K extends type.Filter.ArrayFields<TSchema>>(
        key: K,
        value: type.UnpackAnyProp<TSchema, K>,
        ...values: type.UnpackAnyProp<TSchema, K>[]
    ): this {
        this.#operators.$addToSet = {
            ...this.#operators.$addToSet,
            [key]: values.length === 0 ? value : { $each: [value, ...values] },
        };
        return this;
    }

    pull<
        K extends type.Filter.ArrayFields<TSchema>,
        V extends type.UnpackAnyProp<TSchema, K> = type.UnpackAnyProp<TSchema, K>,
    >(
        key: K,
        value: V | ObjectQuerySelector<type.IsPlainObject<V> extends true ? QuerySelector<V> : ObjectQuerySelector<V>>,
    ) {
        this.#operators.$pull = {
            ...this.#operators.$pull,
            [key]: value,
        };
        return this;
    }

    push<
        K extends type.Filter.ArrayFields<TSchema>,
        V extends type.UnpackAnyProp<TSchema, K> = type.UnpackAnyProp<TSchema, K>,
    >(key: K, value: V | ArrayOperator<V>) {
        this.#operators.$push = {
            ...this.#operators.$push,
            [key]: value,
        };
        return this;
    }

    pop<K extends type.Filter.ArrayFields<TSchema>>(key: K, position: -1 | 1 | 'begin' | 'end' = 1) {
        this.#operators.$pop = {
            ...this.#operators.$pop,
            [key]: position === 'begin' || position === -1 ? -1 : 1,
        };
        return this;
    }

    shift<K extends type.Filter.ArrayFields<TSchema>>(key: K) {
        this.#operators.$pop = {
            ...this.#operators.$pop,
            [key]: -1,
        };
        return this;
    }

    unshift<
        K extends type.Filter.ArrayFields<TSchema>,
        V extends type.UnpackAnyProp<TSchema, K> = type.UnpackAnyProp<TSchema, K>,
    >(key: K, value: V) {
        this.#operators.$push = {
            ...this.#operators.$push,
            [key]: {
                $each: [value],
                $position: 0,
            },
        };
        return this;
    }

    set(update: Partial<type.Initial<TSchema>>) {
        this.#operators.$set = {
            ...update,
            _id: undefined,
        };
        return this;
    }

    replace(doc: type.Initial<TSchema>) {
        this.#update = doc;
        return this;
    }

    async many(requireCount = 0) {
        const rv = await this.model.collection.updateMany(
            this.condition as any,
            {
                ...this.#update,
                ...this.#operators,
            },
            this.#options,
        );
        if (rv.modifiedCount < requireCount)
            throw new Error(`Update many - ${rv.modifiedCount} modified less than ${requireCount} required`);
        return rv;
    }

    async oneRequire<K extends TAllKeys>(all: '*'): Promise<[type.Plain<TSchema>, ModifyResult<TSchema>]>;
    async oneRequire<K extends TAllKeys>(...fields: K[]): Promise<[type.Selector<TSchema, K>, ModifyResult<TSchema>]>;
    async oneRequire<K extends TAllKeys>(
        returnOriginal: 'original' | 'modified',
        fields: K[],
    ): Promise<[type.Selector<TSchema, K>, ModifyResult<TSchema>]>;
    async oneRequire(origStarOrField?: string, f?: string[] | string, ...fields: string[]): Promise<object> {
        const [doc, rv] = await this.one(origStarOrField as TAllKeys, f as TAllKeys, ...(fields as TAllKeys[]));
        if (!doc) throw new Error('oneRequire');
        return [doc, rv];
    }

    async one<K extends TAllKeys>(all: '*'): Promise<[type.Plain<TSchema> | null, ModifyResult<TSchema>]>;
    async one<K extends TAllKeys>(
        ...fields: K[]
    ): Promise<[type.Selector<type.Plain<TSchema>, K> | null, ModifyResult<TSchema>]>;
    async one<K extends TAllKeys>(
        returnOriginal: 'original' | 'modified',
        fields: K[],
    ): Promise<[type.Selector<type.Plain<TSchema>, K> | null, ModifyResult<TSchema>]>;
    async one(origStarOrField?: string, f?: string[] | string, ...fields: string[]): Promise<object> {
        let returnOriginal;
        if (Array.isArray(f)) {
            returnOriginal = origStarOrField === 'original';
        } else {
            returnOriginal = false;
            origStarOrField && fields.unshift(origStarOrField);
            f && fields.unshift(f);
        }
        const projection = origStarOrField === '*' ? undefined : Object.fromEntries(fields.map(k => [k, 1]));
        const rv = await this.model.collection.findOneAndUpdate(
            this.condition as any,
            {
                ...this.#update,
                ...this.#operators,
            },
            {
                ...this.#options,
                returnOriginal,
                projection,
            } as any,
        );
        if (rv.ok !== 1) throw new Error('update rv.ok = 0');
        return [rv.value, rv];
    }
}
