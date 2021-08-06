import { type } from '../../src';
import { expectType } from 'tsd';
import { ObjectID } from 'bson';
import { Object1, Object2, Scalars } from './models';

declare const initialScalars: type.Initial<Scalars>;
declare const initialObject1: type.Initial<Object1>;
declare const initialObject2: type.Initial<Object2>;

export interface IScalars {
    int: number;
    intDef?: number;
    intOpt?: number;

    bigInt: bigint;
    bigIntDef?: bigint;
    bigIntOpt?: bigint;
    bigIntShortDef?: bigint;
    bigIntShort: bigint;

    float: number;
    floatDef?: number;
    floatOpt?: number;
    floatShortDef?: number;
    floatShort: number;

    string: string;
    stringDef?: string;
    stringOpt?: string;
    stringShortDef?: string;
    stringShort: string;

    boolean: boolean;
    booleanDef?: boolean;
    booleanOpt?: boolean;
    booleanShortDef?: boolean;
    booleanShort: boolean;

    date: Date;
    dateDef?: Date;
    dateOpt?: Date;
    dateShortDef?: Date;
    dateShort: Date;

    uuid: string;
    uuidDef?: string;
    uuidOpt?: string;

    mongoId: ObjectID;
    mongoIdDef?: ObjectID;
    mongoIdOpt?: ObjectID;
    mongoIdShortDef?: ObjectID;
    mongoIdShort: ObjectID;

    blob: Uint8Array;
    blobDef?: Uint8Array;
    blobOpt?: Uint8Array;
    blobShortNeverUint8: never;
    blobShortNeverArray: never;
    blobShort1: Uint8Array;
    blobShort2: ArrayBuffer;
}

export type IObject1 = type.Compute<
    IScalars & {
        oneObject2: string;
        oneObject2Opt?: string;
        oneObject2Def?: string;

        manyObject2: string[];
        manyObject2Opt?: string[];
        manyObject2Def?: string[];

        object2: IObject2;
        object2Opt?: IObject2;
        object2Def?: IObject2;
        object2Short: IObject2;

        optArrayObject2?: IObject2[];
        optArrayInt?: number[];
        optArrayFloatShort?: number[];
        optArrayHashScalars?: type.Hash<IScalars>[];
        optArrayHashBooleans?: type.Hash<boolean>[];

        arrayObject2: IObject2[];
        arrayInt: number[];
        arrayFloatShort: number[];
        arrayHashScalars: type.Hash<IScalars>[];
        arrayHashBooleans: type.Hash<boolean>[];
        arrayObject2Short: IObject2[];
        arrayShortFloatShort: number[];
        arrayShortHashScalars: type.Hash<IScalars>[];
        arrayShortHashBooleans: type.Hash<boolean>[];

        optHashObject2?: type.Hash<IObject2>;
        optHashObject2Fld?: type.Hash<IObject2>;
        optHashObject2Opt?: type.Hash<IObject2 | undefined>;
        optHashScalars?: type.Hash<IScalars>;
        optHashInt?: type.Hash<number>;
        optHashIntOpt?: type.Hash<number | undefined>;
        optHashIntDef?: type.Hash<number>;
        optHashFloatShort?: type.Hash<number>;
        optHashFloatDate?: type.Hash<Date>;

        hashObject2: type.Hash<IObject2>;
        hashObject2Fld: type.Hash<IObject2>;
        hashObject2Opt: type.Hash<IObject2 | undefined>;
        hashScalars: type.Hash<IScalars>;
        hashInt: type.Hash<number>;
        hashIntOpt: type.Hash<number | undefined>;
        hashIntDef: type.Hash<number>;
        hashFloatShort: type.Hash<number>;
        hashFloatDate: type.Hash<Date>;
    }
>;

export type IObject2 = type.Compute<
    IScalars & {
        id: string;

        oneObject3: ObjectID;
        oneObject3Opt?: ObjectID;
        oneObject3Def?: ObjectID;

        manyObject3: ObjectID[];
        manyObject3Opt?: ObjectID[];
        manyObject3Def?: ObjectID[];

        optArrayObject3?: IObject3[];
        optArrayInt?: number[];
        optArrayFloatShort?: number[];
        optArrayHashScalars?: type.Hash<IScalars>[];
        optArrayHashBooleans?: type.Hash<boolean>[];

        arrayObject3: IObject3[];
        arrayInt: number[];
        arrayFloatShort: number[];
        arrayHashScalars: type.Hash<IScalars>[];
        arrayHashBooleans: type.Hash<boolean>[];
        arrayObject3Short: IObject3[];
        arrayShortFloatShort: number[];
        arrayShortHashScalars: type.Hash<IScalars>[];
        arrayShortHashBooleans: type.Hash<boolean>[];

        optHashObject3?: type.Hash<IObject3>;
        optHashObject3Fld?: type.Hash<IObject3>;
        optHashObject3Opt?: type.Hash<IObject3 | undefined>;
        optHashScalars?: type.Hash<IScalars>;
        optHashInt?: type.Hash<number>;
        optHashIntOpt?: type.Hash<number | undefined>;
        optHashIntDef?: type.Hash<number>;
        optHashFloatShort?: type.Hash<number>;
        optHashFloatDate?: type.Hash<Date>;

        hashObject3: type.Hash<IObject3>;
        hashObject3Fld: type.Hash<IObject3>;
        hashObject3Opt: type.Hash<IObject3 | undefined>;
        hashScalars: type.Hash<IScalars>;
        hashInt: type.Hash<number>;
        hashIntOpt: type.Hash<number | undefined>;
        hashIntDef: type.Hash<number>;
        hashFloatShort: type.Hash<number>;
        hashFloatDate: type.Hash<Date>;

        object3: IObject3;
        object3Opt?: IObject3;
        object3Def?: IObject3;
        object3Short: IObject3;
    }
>;

export interface IObject3 {
    id: ObjectID;
}



expectType<typeof initialScalars>(initialScalars as IScalars);
expectType<IScalars>(initialScalars);

expectType<typeof initialObject2>(initialObject2 as IObject2);
expectType<IObject2>(initialObject2);

expectType<typeof initialObject1>(initialObject1 as IObject1);
expectType<IObject1>(initialObject1);
