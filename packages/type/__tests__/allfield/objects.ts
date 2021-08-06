import { type, __, assignTest, expectTypeOf } from './stuff';
import { INumbers, Numbers, numbersInit, PNumbers } from './numbers';
import { IStrings, PStrings, Strings, stringsInit } from './strings';
import { Identifiers } from './identifiers';
import { Flags, flagsInit, IFlags, PFlags } from './flags';
import { Dates, datesInit, IDates, PDates } from './dates';

test('Objects shape', () => {
    expect(type(Objects).toString('full')).toMatch(`[Shape of Objects]:
  obj: Object [ORDINARY]
    string: String [ORDINARY]
    stringDef: String [HASDEFAULT]
    stringOpt: String [OPTIONAL]
    stringMay: String [ORDINARY, UNDEFINABLE, NULLABLE]
    stringConst: String [ORDINARY, READONLY]
    stringInst: String [HASDEFAULT]
    stringCtor: String [ORDINARY]
    text: Text [ORDINARY]
    textDef: Text [HASDEFAULT]
    textOpt: Text [OPTIONAL]
    textMay: Text [ORDINARY, UNDEFINABLE, NULLABLE]
    textConst: Text [ORDINARY, READONLY]
  objCtor: Object [ORDINARY]
    date: Date [ORDINARY]
    dateDef: Date [HASDEFAULT]
    dateOpt: Date [OPTIONAL]
    dateMay: Date [ORDINARY, UNDEFINABLE, NULLABLE]
    dateConst: Date [ORDINARY, READONLY]
    dateTime: DateTime [ORDINARY]
    dateTimeDef: DateTime [HASDEFAULT]
    dateTimeOpt: DateTime [OPTIONAL]
    dateTimeMay: DateTime [ORDINARY, UNDEFINABLE, NULLABLE]
    dateTimeConst: DateTime [ORDINARY, READONLY]
    dateTimeInst: DateTime [HASDEFAULT]
    dateTimeCtor: DateTime [ORDINARY]
  objInst: Object [ORDINARY]
    bool: Boolean [ORDINARY]
    boolDef: Boolean [HASDEFAULT]
    boolOpt: Boolean [OPTIONAL]
    boolMay: Boolean [ORDINARY, UNDEFINABLE, NULLABLE]
    boolConst: Boolean [ORDINARY, READONLY]
    boolInst: Boolean [HASDEFAULT]
    boolCtor: Boolean [ORDINARY]
  objLit: Object [ORDINARY]
    i8Def: Int8 [HASDEFAULT]
    i16: Int16 [ORDINARY]
    i32May: Int32 [ORDINARY, UNDEFINABLE, NULLABLE]
    intOpt: Int [OPTIONAL]
    i64Const: Int64 [ORDINARY, READONLY]
    floatInst: Float [HASDEFAULT]
    floatCtor: Float [ORDINARY]
    strings: Object [ORDINARY]
      string: String [ORDINARY]
      stringDef: String [HASDEFAULT]
      stringOpt: String [OPTIONAL]
      stringMay: String [ORDINARY, UNDEFINABLE, NULLABLE]
      stringConst: String [ORDINARY, READONLY]
      stringInst: String [HASDEFAULT]
      stringCtor: String [ORDINARY]`);
});

const objectsInit: type.Initial<Objects> = {
    obj: stringsInit,
    objCtor: datesInit,
    objInst: flagsInit,
    objLit: {
        i16: 123,
        i32May: null,
        i64Const: 124n,
        floatCtor: 125,
        strings: {
            string: 'A',
            stringMay: undefined,
            stringConst: 'B',
            stringCtor: 'C',
        },
    },
};

test('Objects new', () => {
    const ids = type(Objects).new(objectsInit);
    expect(ids).toStrictEqual({});
});

test('Objects undefined/null', () => {
    expect(() =>
        type(Objects).new({
            ...objectsInit,
            // @ts-expect-error
            uuid: undefined,
        }),
    ).toThrow('Field "Objects.uuid" can not be null or undefined');
});

export class Objects {
    obj = type.Object(Strings);
    objCtor = Dates;
    objInst = new Flags();
    objLit = {
        i8Def: type.Int8().default(() => 100500),
        i16: type.Int16(),
        i32May: type.Int32().maybe(),
        intOpt: type.Int().optional(),
        i64Const: type.Int64().readonly(),
        floatInst: 7.4,
        floatCtor: Number,
        strings: {
            string: type.String(),
            stringDef: type.String().default(() => 'stringDefault'),
            stringOpt: type.String().optional(),
            stringMay: type.String().maybe(),
            stringConst: type.String().readonly(),
            stringInst: 'instant initialization',
            stringCtor: String,
        },
    };
    objOpt = type.Object(Flags).optional();
    objOptOpt = type.Opt(Flags);
    objDef = type.Object(Dates).default(datesInit as any);
    objMay = type.Object(Strings).maybe();
}

export interface IObjects {
    obj: IStrings;
    objCtor: IDates;
    objInst: IFlags;
    objLit: {
        i8Def?: number;
        i16: number;
        i32May: number | undefined | null;
        intOpt?: number;
        i64Const: bigint;
        floatInst?: number;
        floatCtor: number;
        strings: {
            string: string;
            stringDef?: string;
            stringOpt?: string;
            stringMay: string | undefined | null;
            stringConst: string;
            stringInst?: string;
            stringCtor: string;
        };
    };
    objOpt?: IFlags;
    objOptOpt?: IFlags;
    objDef?: IDates;
}

assignTest<type.Initial<Objects>>(__ as IObjects);
assignTest<IObjects>(__ as type.Initial<Objects>);
expectTypeOf<type.Initial<Objects>>().toEqualTypeOf<IObjects>();

export interface PObjects {
    obj: PStrings;
    objCtor: PDates;
    objInst: PFlags;
    objLit: {
        i8Def: number;
        i16: number;
        i32May: number | undefined | null;
        intOpt: number | undefined;
        readonly i64Const: bigint;
        floatInst: number;
        floatCtor: number;
        strings: {
            string: string;
            stringDef: string;
            stringOpt: string | undefined;
            stringMay: string | undefined | null;
            readonly stringConst: string;
            stringInst: string;
            stringCtor: string;
        };
    };
}

assignTest<type.Plain<Objects>>(__ as PObjects);
assignTest<PObjects>(__ as type.Plain<Objects>);
expectTypeOf<type.Plain<Objects>>().toEqualTypeOf<PObjects>();
