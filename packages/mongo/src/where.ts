import type from '@uk/type';
import { BSONType, Binary } from 'mongodb';

export type Where<TSchema extends type.Schema<TSchema>> = WhereAny<type.Plain<TSchema>>;

export type WhereAny<T> = {
    [P in keyof T]?: Condition<T[P]>;
} &
    RootQuerySelector<T>;

export type Condition<T> = MongoAltQuery<T> | QuerySelector<MongoAltQuery<T>>;
type RegExpForString<T> = T extends string ? RegExp | T : T;
type MongoAltQuery<T> = T extends ReadonlyArray<infer U> ? T | RegExpForString<U> : RegExpForString<T>;

export type QuerySelector<T> = {
    // Comparison
    $eq?: T;
    $gt?: T;
    $gte?: T;
    $in?: T[];
    $lt?: T;
    $lte?: T;
    $ne?: T;
    $nin?: T[];
    // Logical
    $not?: T extends string ? QuerySelector<T> | RegExp : QuerySelector<T>;
    // Element
    /**
     * When `true`, `$exists` matches the documents that contain the field,
     * including documents where the field value is null.
     */
    $exists?: boolean;
    $type?: BSONType | BSONTypeAlias;
    // Evaluation
    $expr?: any;
    $jsonSchema?: any;
    $mod?: T extends number ? [number, number] : never;
    $regex?: T extends string ? RegExp | string : never;
    $options?: T extends string ? string : never;
    // Geospatial
    // TODO: define better types for geo queries
    $geoIntersects?: { $geometry: object };
    $geoWithin?: object;
    $near?: object;
    $nearSphere?: object;
    $maxDistance?: number;
    // Array
    // TODO: define better types for $all and $elemMatch
    $all?: T extends ReadonlyArray<infer U> ? any[] : never;
    $elemMatch?: T extends ReadonlyArray<infer U> ? object : never;
    $size?: T extends ReadonlyArray<infer U> ? number : never;
    // Bitwise
    $bitsAllClear?: BitwiseQuery;
    $bitsAllSet?: BitwiseQuery;
    $bitsAnyClear?: BitwiseQuery;
    $bitsAnySet?: BitwiseQuery;
};

export type RootQuerySelector<T> = {
    /** https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and */
    $and?: Array<WhereAny<T>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/nor/#op._S_nor */
    $nor?: Array<WhereAny<T>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or */
    $or?: Array<WhereAny<T>>;
    /** https://docs.mongodb.com/manual/reference/operator/query/text */
    $text?: {
        $search: string;
        $language?: string;
        $caseSensitive?: boolean;
        $diacraticSensitive?: boolean;
    };
    /** https://docs.mongodb.com/manual/reference/operator/query/where/#op._S_where */
    $where?: string | ((...args: any[]) => any);
    /** https://docs.mongodb.com/manual/reference/operator/query/comment/#op._S_comment */
    $comment?: string;
    // we could not find a proper TypeScript generic to support nested queries e.g. 'user.friends.name'
    // this will mark all unrecognized properties as any (including nested queries)
    [key: string]: any;
};

type BSONTypeAlias =
    | 'number'
    | 'double'
    | 'string'
    | 'object'
    | 'array'
    | 'binData'
    | 'undefined'
    | 'objectId'
    | 'bool'
    | 'date'
    | 'null'
    | 'regex'
    | 'dbPointer'
    | 'javascript'
    | 'symbol'
    | 'javascriptWithScope'
    | 'int'
    | 'timestamp'
    | 'long'
    | 'decimal'
    | 'minKey'
    | 'maxKey';

type BitwiseQuery =
    | number /** <numeric bitmask> */
    | Binary /** <BinData bitmask> */
    | number[]; /** [ <position1>, <position2>, ... ] */
