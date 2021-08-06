import { type, __, assignTest, expectTypeOf, ObjectID } from './stuff';

test('Flags shape', () => {
    expect(type(Flags).toString('full')).toMatch(`[Shape of Flags]:
  bool: Boolean [ORDINARY]
  boolDef: Boolean [HASDEFAULT]
  boolOpt: Boolean [OPTIONAL]
  boolMay: Boolean [ORDINARY, UNDEFINABLE, NULLABLE]
  boolConst: Boolean [ORDINARY, READONLY]
  boolInst: Boolean [HASDEFAULT]
  boolCtor: Boolean [ORDINARY]`);
});

export const flagsInit: type.Initial<Flags> = {
    bool: true,
    boolMay: null,
    boolConst: true,
    boolCtor: false,
};

test('Flags new', () => {
    const flags = type(Flags).new(flagsInit);
    expect(flags).toStrictEqual({
        bool: true,
        boolMay: null,
        boolConst: true,
        boolCtor: false,
        boolDef: true,
        boolInst: false,
        boolOpt: undefined,
    });
});

test('Flags undefined/null', () => {
    expect(() =>
        type(Flags).new({
            ...flagsInit,
            // @ts-expect-error
            bool: undefined,
        }),
    ).toThrow('Field "Flags.bool" can not be null or undefined');
});

export class Flags {
    bool = type.Boolean();
    boolDef = type.Boolean().default(() => true);
    boolOpt = type.Boolean().optional();
    boolMay = type.Boolean().maybe();
    boolConst = type.Boolean().readonly();
    boolInst = false;
    boolCtor = Boolean;
}

export interface IFlags {
    bool: boolean;
    boolDef?: boolean;
    boolOpt?: boolean;
    boolMay: boolean | undefined | null;
    boolConst: boolean;
    boolInst?: boolean;
    boolCtor: boolean;
}

assignTest<type.Initial<Flags>>(__ as IFlags);
assignTest<IFlags>(__ as type.Initial<Flags>);
expectTypeOf<type.Initial<Flags>>().toEqualTypeOf<IFlags>();

export interface PFlags {
    bool: boolean;
    boolDef: boolean;
    boolOpt: boolean | undefined;
    boolMay: boolean | undefined | null;
    readonly boolConst: boolean;
    boolInst: boolean;
    boolCtor: boolean;
}

assignTest<type.Plain<Flags>>(__ as PFlags);
assignTest<PFlags>(__ as type.Plain<Flags>);
expectTypeOf<type.Plain<Flags>>().toEqualTypeOf<PFlags>();
