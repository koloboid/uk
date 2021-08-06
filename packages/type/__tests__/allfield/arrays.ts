import { type, __, assignTest, expectTypeOf, ObjectID } from './stuff';

export class Arrays {
    ofInt = type.Array(type.Int());
    ofFloatDef = type.Array(type.Float()).default([]);
    ofDate = [Date];
    ofOpt = type.Array(type.Text().optional());
    ofMay = type.Array(type.BigInt().maybe());
    ofMayInst = [type.BigInt().maybe()];

    tuple = type.Tuple(type.Int64(), Date, String, type.Array(ObjectID));
    tupleInst = [type.Boolean(), String, Number] as const;
    tupleDef = type.Tuple(type.Int64(), Date, String, type.Array(ObjectID)).default(() => [0n, new Date(), '', []]);
}

export interface IArrays {
    ofInt: number[];
    ofFloatDef?: number[];
    ofDate: Date[];
    ofOpt: Array<string | undefined>;
    ofMay: Array<bigint | undefined | null>;
    ofMayInst: Array<bigint | undefined | null>;

    tuple: [bigint, Date, string, ObjectID[]];
    tupleInst: readonly [boolean, string, number];
    tupleDef?: [bigint, Date, string, ObjectID[]];
}
assignTest<type.Initial<Arrays>>(__ as IArrays);
assignTest<IArrays>(__ as type.Initial<Arrays>);
expectTypeOf<type.Initial<Arrays>>().toEqualTypeOf<IArrays>();

export interface PArrays {
    ofInt: number[];
    ofFloatDef: number[];
    ofDate: Date[];
    ofOpt: Array<string | undefined>;
    ofMay: Array<bigint | undefined | null>;
    ofMayInst: Array<bigint | undefined | null>;

    tuple: [bigint, Date, string, ObjectID[]] & { length: 4 };
    tupleInst: readonly [boolean, string, number] & { length: 3 };
    tupleDef: [bigint, Date, string, ObjectID[]] & { length: 4 };
}
assignTest<type.Plain<Arrays>>(__ as PArrays);
assignTest<PArrays>(__ as type.Plain<Arrays>);
expectTypeOf<type.Plain<Arrays>>().toMatchTypeOf<PArrays>();
