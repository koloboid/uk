import Log from '@uk/log';
import { Field, Shape, type } from '@uk/type';
import type ObjectID from 'bson-objectid';
import {
    BulkWriteOptions,
    ClientSession,
    Collection,
    CreateCollectionOptions,
    Filter,
    InsertManyResult,
    InsertOneOptions,
    InsertOneResult,
    MongoClient,
    ObjectId as MongoObjectID,
} from 'mongodb';
import { SelectQuery } from './select';
import { UpdateQuery } from './update';
import { Where } from './where';

interface IndexSpecification<T extends string | number | symbol> {
    key: { [P in T]?: 1 | -1 };
    name?: string;
    background?: boolean;
    unique?: boolean;
    partialFilterExpression?: object;
    sparse?: boolean;
    expireAfterSeconds?: number;
    storageEngine?: object;
    weights?: object;
    default_language?: string;
    language_override?: string;
    textIndexVersion?: number;
    '2dsphereIndexVersion'?: number;
    bits?: number;
    min?: number;
    max?: number;
    bucketSize?: number;
}

export interface MinMongoSchema {
    _id: Field.Any;
}

export class Model<TSchema extends MinMongoSchema, TDoc = type<TSchema>> extends Shape<TSchema> {
    get collection(): Collection<TDoc> {
        return this.client.db().collection(this.modelName);
    }

    readonly client: MongoClient;
    readonly modelName: string;

    protected readonly log: Log;
    protected readonly session?: ClientSession;

    constructor(schema: type.Class<TSchema>, opts: Model.Options | MongoClient) {
        super(schema);
        if ('client' in opts) {
            this.client = opts.client;
            this.log = opts.log || new Log.Dummy();
            this.session = opts.session;
            this.modelName = opts.modelName ?? schema.name;
        } else {
            this.client = opts;
            this.modelName = schema.name;
            this.log = new Log.Dummy();
        }
    }

    async migrate(opts: CreateCollectionOptions, ...indexes: IndexSpecification<any>[]) {
        const name = this.modelName;
        const coll = await this.client.db().listCollections({ name }).next();
        if (!coll) await this.client.db().createCollection(name, opts);
        indexes && indexes.length && (await this.collection.createIndexes(indexes));
    }

    select<K extends type.Path.Keys<type<TSchema>>>(): SelectQuery<TSchema, '_id'>;
    select<K extends type.Path.Keys<type<TSchema>>>(all: '*'): SelectQuery<TSchema, K>;
    select<K extends type.Path.Keys<type<TSchema>>>(...fields: K[]): SelectQuery<TSchema, K>;
    select(...fields: string[]): any {
        const Q: any = SelectQuery;
        if (fields.length === 0) fields.push('_id');
        return new Q(this).include(...fields);
    }

    insert(
        doc: type.Initial<TSchema>,
        opts?: InsertOneOptions,
    ): Promise<[type<TSchema>, InsertOneResult<type<TSchema>>]>;
    insert(
        docs: type.Initial<TSchema>[],
        opts?: BulkWriteOptions,
    ): Promise<[type<TSchema>[], InsertManyResult<type<TSchema>>]>;
    insert(docs: type.Initial<TSchema> | type.Initial<TSchema>[], opts?: object): Promise<any[]> {
        return this.log.try('Insert into ' + this.modelName, async p => {
            p.finally({ docs });
            if (Array.isArray(docs)) {
                const items: any[] = docs.map(d => this.new(d));
                const rv = await this.collection.insertMany(items, opts ?? {});
                items.forEach((itm, idx) => (itm['_id'] = rv.insertedIds[idx]));
                return [items, rv];
            } else {
                const item: any = this.new(docs);
                const rv = await this.collection.insertOne(item, opts ?? {});
                item['_id'] = rv.insertedId;
                return [item, rv];
            }
        });
    }

    update(
        where: string | ObjectID | Where<type.Plain<TSchema>> | 'YES_I_WANT_UPDATE_ALL',
        set?: Partial<type.Initial<TSchema>>,
    ): UpdateQuery<TSchema> {
        let condition: any;
        const fuckTS: any = where;
        if (typeof fuckTS === 'string') condition = { _id: new MongoObjectID(fuckTS) };
        else if (fuckTS instanceof MongoObjectID) condition = { _id: where };
        else condition = where;
        return new UpdateQuery(this as any, condition, set) as any;
    }

    async delete(where: Filter<TDoc>, warn?: 'YES_I_WANT_REMOVE_ALL') {
        return this.log.try('removeMany ' + this.modelName, async p => {
            p.finally({ where, warn });
            if (
                Object.keys(where).filter(k => where[k] !== undefined).length === 0 &&
                warn !== 'YES_I_WANT_REMOVE_ALL'
            ) {
                throw new Error('removeMany with empty where clause is forbidden: ' + warn);
            }
            const rv = await this.collection.deleteMany(where as any, {
                session: this.session,
            });
            p.success({ rv: { ok: rv['result'].ok, n: rv['result'].n } });
            return rv;
        });
    }
}

export namespace Model {
    export type Any = Model<any, any>;

    export interface Options {
        client: MongoClient;
        log?: Log;
        session?: ClientSession;
        modelName?: string;
    }
}
