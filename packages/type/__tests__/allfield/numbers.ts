import { type, __, assignTest, expectTypeOf, timeTest } from './stuff';

test('Numbers shape', () => {
    expect(type(Numbers).toString('full')).toMatch(`[Shape of Numbers]:
  i8: Int8 [ORDINARY]
  i8Def: Int8 [HASDEFAULT]
  i8Opt: Int8 [OPTIONAL]
  i8May: Int8 [ORDINARY, UNDEFINABLE, NULLABLE]
  i8Const: Int8 [ORDINARY, READONLY]
  i16: Int16 [ORDINARY]
  i16Def: Int16 [HASDEFAULT]
  i16Opt: Int16 [OPTIONAL]
  i16May: Int16 [ORDINARY, UNDEFINABLE, NULLABLE]
  i16Const: Int16 [ORDINARY, READONLY]
  i32: Int32 [ORDINARY]
  i32Def: Int32 [HASDEFAULT]
  i32Opt: Int32 [OPTIONAL]
  i32May: Int32 [ORDINARY, UNDEFINABLE, NULLABLE]
  i32Const: Int32 [ORDINARY, READONLY]
  int: Int [ORDINARY]
  intDef: Int [HASDEFAULT]
  intOpt: Int [OPTIONAL]
  intMay: Int [ORDINARY, UNDEFINABLE, NULLABLE]
  intConst: Int [ORDINARY, READONLY]
  i64: Int64 [ORDINARY]
  i64Def: Int64 [HASDEFAULT]
  i64Opt: Int64 [OPTIONAL]
  i64May: Int64 [ORDINARY, UNDEFINABLE, NULLABLE]
  i64Const: Int64 [ORDINARY, READONLY]
  u8: UInt8 [ORDINARY]
  u8Def: UInt8 [HASDEFAULT]
  u8Opt: UInt8 [OPTIONAL]
  u8May: UInt8 [ORDINARY, UNDEFINABLE, NULLABLE]
  u8Const: UInt8 [ORDINARY, READONLY]
  u16: UInt16 [ORDINARY]
  u16Def: UInt16 [HASDEFAULT]
  u16Opt: UInt16 [OPTIONAL]
  u16May: UInt16 [ORDINARY, UNDEFINABLE, NULLABLE]
  u16Const: UInt16 [ORDINARY, READONLY]
  u32: UInt32 [ORDINARY]
  u32Def: UInt32 [HASDEFAULT]
  u32Opt: UInt32 [OPTIONAL]
  u32May: UInt32 [ORDINARY, UNDEFINABLE, NULLABLE]
  u32Const: UInt32 [ORDINARY, READONLY]
  uint: UInt [ORDINARY]
  uintDef: UInt [HASDEFAULT]
  uintOpt: UInt [OPTIONAL]
  uintMay: UInt [ORDINARY, UNDEFINABLE, NULLABLE]
  uintConst: UInt [ORDINARY, READONLY]
  u64: UInt64 [ORDINARY]
  u64Def: UInt64 [HASDEFAULT]
  u64Opt: UInt64 [OPTIONAL]
  u64May: UInt64 [ORDINARY, UNDEFINABLE, NULLABLE]
  u64Const: UInt64 [ORDINARY, READONLY]
  bigInt: BigInt [ORDINARY]
  bigIntDef: BigInt [HASDEFAULT]
  bigIntOpt: BigInt [OPTIONAL]
  bigIntConst: BigInt [ORDINARY, READONLY]
  bigIntMay: BigInt [ORDINARY, UNDEFINABLE, NULLABLE]
  bigIntInst: BigInt [HASDEFAULT]
  bigIntCtor: BigInt [ORDINARY]
  float: Float [ORDINARY]
  floatDef: Float [HASDEFAULT]
  floatOpt: Float [OPTIONAL]
  floatMay: Float [ORDINARY, UNDEFINABLE, NULLABLE]
  floatConst: Float [ORDINARY, READONLY]
  floatInst: Float [HASDEFAULT]
  floatCtor: Float [ORDINARY]`);
});

export const numbersInit = {
    i8: 1,
    i8May: null,
    i8Const: 2,
    i16: 3,
    i16May: undefined,
    i16Const: 4,
    i32: 5,
    i32May: 6,
    i32Const: 7,
    int: 8,
    intDef: 9,
    intOpt: 10,
    intMay: 11,
    intConst: 12,
    i64: 13n,
    i64May: null,
    i64Const: 14n,

    u8: 15,
    u8May: 16,
    u8Const: 17,
    u16: 18,
    u16Def: 19,
    u16Opt: 20,
    u16May: undefined,
    u16Const: 21,
    u32: 22,
    u32May: 23,
    u32Const: 24,
    uint: 25,
    uintMay: 26,
    uintConst: 27,
    u64: 28n,
    u64Def: 29n,
    u64Opt: 30n,
    u64May: 31n,
    u64Const: 32n,

    bigInt: 33n,
    bigIntDef: 34n,
    bigIntOpt: 35n,
    bigIntMay: 36n,
    bigIntConst: 37n,
    bigIntInst: 38n,
    bigIntCtor: 39n,

    float: 40.1,
    floatDef: 41.2,
    floatOpt: 42.3,
    floatMay: null,
    floatConst: 43.4,
    floatInst: 44.5,
    floatCtor: 45.6,
};

const numbers = {
    ...numbersInit,
    i16Def: 30000,
    i16Opt: undefined,
    i32Def: 0xb00b,
    i32Opt: undefined,
    i64Def: 100504n,
    i64Opt: undefined,
    i8Def: 100,
    i8Opt: undefined,
    u32Def: 0xf000_0000,
    u32Opt: undefined,
    u8Def: 254,
    u8Opt: undefined,
    uintDef: 0xff_0000_0000,
    uintOpt: undefined,
};

test('Numbers new', () => {
    expect(type(Numbers).new(numbersInit)).toStrictEqual({
        ...numbers,
    });
});

test('Numbers limits', () => {
    expect(() => type(Numbers).new({ ...numbersInit, i16: 0x1_0000 })).toThrow(
        'Numbers.i16 = 65536 must be between -32768 and 32767',
    );
    expect(() => type(Numbers).new({ ...numbersInit, i32: 0x1_0000_0000 })).toThrow(
        'Numbers.i32 = 4294967296 must be between -2147483648 and 2147483647',
    );
});

test('Numbers undefined/null', () => {
    expect(() =>
        type(Numbers).new({
            ...numbersInit,
            // @ts-expect-error
            i16: undefined,
        }),
    ).toThrow('Field "Numbers.i16" can not be null or undefined');
    expect(() =>
        type(Numbers).new({
            ...numbersInit,
            // @ts-expect-error
            u16: undefined,
        }),
    ).toThrow('Field "Numbers.u16" can not be null or undefined');
    expect(() =>
        type(Numbers).new({
            ...numbersInit,
            // @ts-expect-error
            floatCtor: null,
        }),
    ).toThrow('Field "Numbers.floatCtor" can not be null or undefined');
    expect(() =>
        type(Numbers).new({
            ...numbersInit,
            // @ts-expect-error
            bigIntConst: undefined,
        }),
    ).toThrow('Field "Numbers.bigIntConst" can not be null or undefined');
    expect(() =>
        type(Numbers).new({
            ...numbersInit,
            // @ts-expect-error
            u64: null,
        }),
    ).toThrow('Field "Numbers.u64" can not be null or undefined');
});

test('Numbers new timing', () => {
    timeTest(100_000, 30, count => {
        const shape = type(Numbers);
        const arr = new Array(count);
        for (let i = 0; i < count; i++) {
            arr[i] = shape.new(numbersInit);
        }
    });
});

export class Numbers {
    i8 = type.Int8();
    i8Def = type.Int8().default(() => 100);
    i8Opt = type.Int8().optional();
    i8May = type.Int8().maybe();
    i8Const = type.Int8().readonly();
    i16 = type.Int16();
    i16Def = type.Int16().default(() => 30000);
    i16Opt = type.Int16().optional();
    i16May = type.Int16().maybe();
    i16Const = type.Int16().readonly();
    i32 = type.Int32();
    i32Def = type.Int32().default(() => 0xb00b);
    i32Opt = type.Int32().optional();
    i32May = type.Int32().maybe();
    i32Const = type.Int32().readonly();
    int = type.Int();
    intDef = type.Int().default(() => 0x2b00bb00b);
    intOpt = type.Int().optional();
    intMay = type.Int().maybe();
    intConst = type.Int().readonly();
    i64 = type.Int64();
    i64Def = type.Int64().default(() => 100504n);
    i64Opt = type.Int64().optional();
    i64May = type.Int64().maybe();
    i64Const = type.Int64().readonly();

    u8 = type.UInt8();
    u8Def = type.UInt8().default(() => 254);
    u8Opt = type.UInt8().optional();
    u8May = type.UInt8().maybe();
    u8Const = type.UInt8().readonly();
    u16 = type.UInt16();
    u16Def = type.UInt16().default(() => 60000);
    u16Opt = type.UInt16().optional();
    u16May = type.UInt16().maybe();
    u16Const = type.UInt16().readonly();
    u32 = type.UInt32();
    u32Def = type.UInt32().default(() => 0xf000_0000);
    u32Opt = type.UInt32().optional();
    u32May = type.UInt32().maybe();
    u32Const = type.UInt32().readonly();
    uint = type.UInt();
    uintDef = type.UInt().default(() => 0xff_0000_0000);
    uintOpt = type.UInt().optional();
    uintMay = type.UInt().maybe();
    uintConst = type.UInt().readonly();
    u64 = type.UInt64();
    u64Def = type.UInt64().default(() => 100509n);
    u64Opt = type.UInt64().optional();
    u64May = type.UInt64().maybe();
    u64Const = type.UInt64().readonly();

    bigInt = type.BigInt();
    bigIntDef = type.BigInt().default(() => 100510n);
    bigIntOpt = type.BigInt().optional();
    bigIntConst = type.BigInt().readonly();
    bigIntMay = type.BigInt().maybe();
    bigIntInst = 100511n;
    bigIntCtor = BigInt;

    float = type.Float();
    floatDef = type.Float().default(() => 100.5);
    floatOpt = type.Float().optional();
    floatMay = type.Float().maybe();
    floatConst = type.Float().readonly();
    floatInst = 7;
    floatCtor = Number;
}

export interface INumbers {
    i8: number;
    i8Def?: number;
    i8Opt?: number;
    i8May: number | undefined | null;
    i8Const: number;
    i16: number;
    i16Def?: number;
    i16Opt?: number;
    i16May: number | undefined | null;
    i16Const: number;
    i32: number;
    i32Def?: number;
    i32Opt?: number;
    i32May: number | undefined | null;
    i32Const: number;
    int: number;
    intDef?: number;
    intOpt?: number;
    intMay: number | undefined | null;
    intConst: number;
    i64: bigint;
    i64Def?: bigint;
    i64Opt?: bigint;
    i64May: bigint | undefined | null;
    i64Const: bigint;

    u8: number;
    u8Def?: number;
    u8Opt?: number;
    u8May: number | undefined | null;
    u8Const: number;
    u16: number;
    u16Def?: number;
    u16Opt?: number;
    u16May: number | undefined | null;
    u16Const: number;
    u32: number;
    u32Def?: number;
    u32Opt?: number;
    u32May: number | undefined | null;
    u32Const: number;
    uint: number;
    uintDef?: number;
    uintOpt?: number;
    uintMay: number | undefined | null;
    uintConst: number;
    u64: bigint;
    u64Def?: bigint;
    u64Opt?: bigint;
    u64May: bigint | undefined | null;
    u64Const: bigint;

    bigInt: bigint;
    bigIntDef?: bigint;
    bigIntOpt?: bigint;
    bigIntMay: bigint | undefined | null;
    bigIntConst: bigint;
    bigIntInst?: bigint;
    bigIntCtor: bigint;

    float: number;
    floatDef?: number;
    floatOpt?: number;
    floatMay: number | undefined | null;
    floatConst: number;
    floatInst?: number;
    floatCtor: number;
}
assignTest<type.Initial<Numbers>>(__ as INumbers);
assignTest<INumbers>(__ as type.Initial<Numbers>);
expectTypeOf<type.Initial<Numbers>>().toEqualTypeOf<INumbers>();

export interface PNumbers {
    i8: number;
    i8Def: number;
    i8Opt: number | undefined;
    i8May: number | undefined | null;
    readonly i8Const: number;
    i16: number;
    i16Def: number;
    i16Opt: number | undefined;
    i16May: number | undefined | null;
    readonly i16Const: number;
    i32: number;
    i32Def: number;
    i32Opt: number | undefined;
    i32May: number | undefined | null;
    readonly i32Const: number;
    int: number;
    intDef: number;
    intOpt: number | undefined;
    intMay: number | undefined | null;
    readonly intConst: number;
    i64: bigint;
    i64Def: bigint;
    i64Opt: bigint | undefined;
    i64May: bigint | undefined | null;
    readonly i64Const: bigint;

    u8: number;
    u8Def: number;
    u8Opt: number | undefined;
    u8May: number | undefined | null;
    readonly u8Const: number;
    u16: number;
    u16Def: number;
    u16Opt: number | undefined;
    u16May: number | undefined | null;
    readonly u16Const: number;
    u32: number;
    u32Def: number;
    u32Opt: number | undefined;
    u32May: number | undefined | null;
    readonly u32Const: number;
    uint: number;
    uintDef: number;
    uintOpt: number | undefined;
    uintMay: number | undefined | null;
    readonly uintConst: number;
    u64: bigint;
    u64Def: bigint;
    u64Opt: bigint | undefined;
    u64May: bigint | undefined | null;
    readonly u64Const: bigint;

    bigInt: bigint;
    bigIntDef: bigint;
    bigIntOpt: bigint | undefined;
    bigIntMay: bigint | undefined | null;
    readonly bigIntConst: bigint;
    bigIntInst: bigint;
    bigIntCtor: bigint;

    float: number;
    floatDef: number;
    floatOpt: number | undefined;
    floatMay: number | undefined | null;
    readonly floatConst: number;
    floatInst: number;
    floatCtor: number;
}
assignTest<type.Plain<Numbers>>(__ as PNumbers);
assignTest<INumbers>(__ as type.Plain<Numbers>);
expectTypeOf<type.Plain<Numbers>>().toEqualTypeOf<PNumbers>();
