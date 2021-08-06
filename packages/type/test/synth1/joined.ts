import { type } from '../../src';
import { expectType } from 'tsd';
import { ObjectID } from 'bson';
import { Object1, Scalars } from './models';
import { FK } from './common';

declare const joinScalars: type.Joined<Scalars>;
declare const joinObject1: type.Joined<Object1>;

export interface JScalars {
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

export interface JObject1 extends JScalars {
    oneObject2: FK<JObject2, string>;
    oneObject2Opt: FK<JObject2, string> | undefined;
    oneObject2Def: FK<JObject2, string>;

    manyObject2: FK<JObject2, string>[];
    manyObject2Opt: FK<JObject2, string>[] | undefined;
    manyObject2Def: FK<JObject2, string>[];

    optArrayObject2: JObject2[] | undefined;
    optArrayInt: number[] | undefined;
    optArrayFloatShort: number[] | undefined;
    optArrayHashScalars: type.Hash<JScalars>[] | undefined;
    optArrayHashBooleans: type.Hash<boolean>[] | undefined;

    arrayObject2: JObject2[];
    arrayInt: number[];
    arrayFloatShort: number[];
    arrayHashScalars: type.Hash<JScalars>[];
    arrayHashBooleans: type.Hash<boolean>[];
    arrayObject2Short: JObject2[];
    arrayShortFloatShort: number[];
    arrayShortHashScalars: type.Hash<JScalars>[];
    arrayShortHashBooleans: type.Hash<boolean>[];

    optHashObject2: type.Hash<JObject2> | undefined;
    optHashObject2Fld: type.Hash<JObject2> | undefined;
    optHashObject2Opt: type.Hash<JObject2 | undefined> | undefined;
    optHashScalars: type.Hash<JScalars> | undefined;
    optHashInt: type.Hash<number> | undefined;
    optHashIntOpt: type.Hash<number | undefined> | undefined;
    optHashIntDef: type.Hash<number> | undefined;
    optHashFloatShort: type.Hash<number> | undefined;
    optHashFloatDate: type.Hash<Date> | undefined;

    hashObject2: type.Hash<JObject2>;
    hashObject2Fld: type.Hash<JObject2>;
    hashObject2Opt: type.Hash<JObject2 | undefined>;
    hashScalars: type.Hash<JScalars>;
    hashInt: type.Hash<number>;
    hashIntOpt: type.Hash<number | undefined>;
    hashIntDef: type.Hash<number>;
    hashFloatShort: type.Hash<number>;
    hashFloatDate: type.Hash<Date>;

    object2: JObject2;
    object2Opt: JObject2 | undefined;
    object2Def: JObject2;
    object2Short: JObject2;
}

export interface JObject2 extends JScalars {
    id: string;

    oneObject3: FK<JObject3, ObjectID>;
    oneObject3Opt: FK<JObject3, ObjectID> | undefined;
    oneObject3Def: FK<JObject3, ObjectID>;

    manyObject3: FK<JObject3, ObjectID>[];
    manyObject3Opt: FK<JObject3, ObjectID>[] | undefined;
    manyObject3Def: FK<JObject3, ObjectID>[];

    optArrayObject3: JObject3[] | undefined;
    optArrayInt: number[] | undefined;
    optArrayFloatShort: number[] | undefined;
    optArrayHashScalars: type.Hash<JScalars>[] | undefined;
    optArrayHashBooleans: type.Hash<boolean>[] | undefined;

    arrayObject3: JObject3[];
    arrayInt: number[];
    arrayFloatShort: number[];
    arrayHashScalars: type.Hash<JScalars>[];
    arrayHashBooleans: type.Hash<boolean>[];
    arrayObject3Short: JObject3[];
    arrayShortFloatShort: number[];
    arrayShortHashScalars: type.Hash<JScalars>[];
    arrayShortHashBooleans: type.Hash<boolean>[];

    optHashObject3: type.Hash<JObject3> | undefined;
    optHashObject3Fld: type.Hash<JObject3> | undefined;
    optHashObject3Opt: type.Hash<JObject3 | undefined> | undefined;
    optHashScalars: type.Hash<JScalars> | undefined;
    optHashInt: type.Hash<number> | undefined;
    optHashIntOpt: type.Hash<number | undefined> | undefined;
    optHashIntDef: type.Hash<number> | undefined;
    optHashFloatShort: type.Hash<number> | undefined;
    optHashFloatDate: type.Hash<Date> | undefined;

    hashObject3: type.Hash<JObject3>;
    hashObject3Fld: type.Hash<JObject3>;
    hashObject3Opt: type.Hash<JObject3 | undefined>;
    hashScalars: type.Hash<JScalars>;
    hashInt: type.Hash<number>;
    hashIntOpt: type.Hash<number | undefined>;
    hashIntDef: type.Hash<number>;
    hashFloatShort: type.Hash<number>;
    hashFloatDate: type.Hash<Date>;

    object3: JObject3;
    object3Opt: JObject3 | undefined;
    object3Def: JObject3;
    object3Short: JObject3;
}

export interface JObject3 {
    id: ObjectID;
}

expectType<typeof joinScalars>(joinScalars as JScalars);
expectType<JScalars>(joinScalars);

expectType<typeof joinObject1>(joinObject1 as JObject1);
expectType<JObject1>(joinObject1);
