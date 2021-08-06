import { type } from '../../src';
import { expectType } from 'tsd';
import { ObjectID } from 'bson';
import { Object1, Scalars } from './models';

declare const plainScalars: type.Plain<Scalars>;
declare const plainObject1: type.Plain<Object1>;

export interface PScalars {
    int: number;
    intDef: number;
    intOpt: number | undefined;

    bigInt: bigint;
    bigIntDef: bigint;
    bigIntOpt: bigint | undefined;
    bigIntShortDef: bigint;
    bigIntShort: bigint;

    float: number;
    floatDef: number;
    floatOpt: number | undefined;
    floatShortDef: number;
    floatShort: number;

    string: string;
    stringDef: string;
    stringOpt: string | undefined;
    stringShortDef: string;
    stringShort: string;

    boolean: boolean;
    booleanDef: boolean;
    booleanOpt: boolean | undefined;
    booleanShortDef: boolean;
    booleanShort: boolean;

    date: Date;
    dateDef: Date;
    dateOpt: Date | undefined;
    dateShortDef: Date;
    dateShort: Date;

    uuid: string;
    uuidDef: string;
    uuidOpt: string | undefined;

    mongoId: ObjectID;
    mongoIdDef: ObjectID;
    mongoIdOpt: ObjectID | undefined;
    mongoIdShortDef: ObjectID;
    mongoIdShort: ObjectID;

    blob: Uint8Array;
    blobDef: Uint8Array;
    blobOpt: Uint8Array | undefined;
    blobShortNeverUint8: never;
    blobShortNeverArray: never;
    blobShort1: Uint8Array;
    blobShort2: ArrayBuffer;
}

export interface PObject1 extends PScalars {
    oneObject2: string;
    oneObject2Opt: string | undefined;
    oneObject2Def: string;

    manyObject2: string[];
    manyObject2Opt: string[] | undefined;
    manyObject2Def: string[];

    optArrayObject2: PObject2[] | undefined;
    optArrayInt: number[] | undefined;
    optArrayFloatShort: number[] | undefined;
    optArrayHashScalars: type.Hash<PScalars>[] | undefined;
    optArrayHashBooleans: type.Hash<boolean>[] | undefined;

    arrayObject2: PObject2[];
    arrayInt: number[];
    arrayFloatShort: number[];
    arrayHashScalars: type.Hash<PScalars>[];
    arrayHashBooleans: type.Hash<boolean>[];
    arrayObject2Short: PObject2[];
    arrayShortFloatShort: number[];
    arrayShortHashScalars: type.Hash<PScalars>[];
    arrayShortHashBooleans: type.Hash<boolean>[];

    optHashObject2: type.Hash<PObject2> | undefined;
    optHashObject2Fld: type.Hash<PObject2> | undefined;
    optHashObject2Opt: type.Hash<PObject2 | undefined> | undefined;
    optHashScalars: type.Hash<PScalars> | undefined;
    optHashInt: type.Hash<number> | undefined;
    optHashIntOpt: type.Hash<number | undefined> | undefined;
    optHashIntDef: type.Hash<number> | undefined;
    optHashFloatShort: type.Hash<number> | undefined;
    optHashFloatDate: type.Hash<Date> | undefined;

    hashObject2: type.Hash<PObject2>;
    hashObject2Fld: type.Hash<PObject2>;
    hashObject2Opt: type.Hash<PObject2 | undefined>;
    hashScalars: type.Hash<PScalars>;
    hashInt: type.Hash<number>;
    hashIntOpt: type.Hash<number | undefined>;
    hashIntDef: type.Hash<number>;
    hashFloatShort: type.Hash<number>;
    hashFloatDate: type.Hash<Date>;

    object2: PObject2;
    object2Opt: PObject2 | undefined;
    object2Def: PObject2;
    object2Short: PObject2;
}

export interface PObject2 extends PScalars {
    id: string;

    oneObject3: ObjectID;
    oneObject3Opt: ObjectID | undefined;
    oneObject3Def: ObjectID;

    manyObject3: ObjectID[];
    manyObject3Opt: ObjectID[] | undefined;
    manyObject3Def: ObjectID[];

    optArrayObject3: PObject3[] | undefined;
    optArrayInt: number[] | undefined;
    optArrayFloatShort: number[] | undefined;
    optArrayHashScalars: type.Hash<PScalars>[] | undefined;
    optArrayHashBooleans: type.Hash<boolean>[] | undefined;

    arrayObject3: PObject3[];
    arrayInt: number[];
    arrayFloatShort: number[];
    arrayHashScalars: type.Hash<PScalars>[];
    arrayHashBooleans: type.Hash<boolean>[];
    arrayObject3Short: PObject3[];
    arrayShortFloatShort: number[];
    arrayShortHashScalars: type.Hash<PScalars>[];
    arrayShortHashBooleans: type.Hash<boolean>[];

    optHashObject3: type.Hash<PObject3> | undefined;
    optHashObject3Fld: type.Hash<PObject3> | undefined;
    optHashObject3Opt: type.Hash<PObject3 | undefined> | undefined;
    optHashScalars: type.Hash<PScalars> | undefined;
    optHashInt: type.Hash<number> | undefined;
    optHashIntOpt: type.Hash<number | undefined> | undefined;
    optHashIntDef: type.Hash<number> | undefined;
    optHashFloatShort: type.Hash<number> | undefined;
    optHashFloatDate: type.Hash<Date> | undefined;

    hashObject3: type.Hash<PObject3>;
    hashObject3Fld: type.Hash<PObject3>;
    hashObject3Opt: type.Hash<PObject3 | undefined>;
    hashScalars: type.Hash<PScalars>;
    hashInt: type.Hash<number>;
    hashIntOpt: type.Hash<number | undefined>;
    hashIntDef: type.Hash<number>;
    hashFloatShort: type.Hash<number>;
    hashFloatDate: type.Hash<Date>;

    object3: PObject3;
    object3Opt: PObject3 | undefined;
    object3Def: PObject3;
    object3Short: PObject3;
}

export interface PObject3 {
    id: ObjectID;
}

expectType<typeof plainScalars>(plainScalars as PScalars);
expectType<PScalars>(plainScalars);

expectType<typeof plainObject1>(plainObject1 as PObject1);
expectType<PObject1>(plainObject1);
