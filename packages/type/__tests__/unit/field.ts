import { type, Field } from '../../src';
import { expectTypeOf } from 'expect-type';

test('Field kinds and flags', () => {
    const tInt = type.Int();
    expectTypeOf(tInt).toEqualTypeOf<Field<number, object, Field.Kind.ORDINARY>>();
    expect(tInt.kind).toBe(Field.Kind.ORDINARY);
    expect(tInt.flags).toEqual(new Set());
    expect(tInt.isDefaulted).toBe(false);
    expect(tInt.isNullable).toBe(false);
    expect(tInt.isOptional).toBe(false);
    expect(tInt.isOrdinary).toBe(true);
    expect(tInt.isPrimary).toBe(false);
    expect(tInt.isReadonly).toBe(false);
    expect(tInt.isUndefinable).toBe(false);
    expect(tInt.isVirtual).toBe(false);
    expect(tInt.typeName).toBe('Int');

    const tIntNull = type.Int().nullable();
    expectTypeOf(tIntNull).toEqualTypeOf<
        Field<number | null, object, Field.Kind.ORDINARY, Field.Flags.NULLABLE>
    >();
    expect(tIntNull.flags).toEqual(new Set([Field.Flags.NULLABLE]));

    const tIntNotUndefined = type.Int().undefinable(false);
    expectTypeOf(tIntNotUndefined).toEqualTypeOf<Field<number, object, Field.Kind.ORDINARY>>();
    expect(tIntNotUndefined.flags).toEqual(new Set());

    const tIntUndefined1 = type.Int().undefinable();
    expectTypeOf(tIntUndefined1).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.ORDINARY, Field.Flags.UNDEFINABLE>
    >();
    expect(tIntUndefined1.flags).toEqual(new Set([Field.Flags.UNDEFINABLE]));

    const tIntUndefined2 = type.Int().undefinable(true);
    expectTypeOf(tIntUndefined2).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.ORDINARY, Field.Flags.UNDEFINABLE>
    >();
    expect(tIntUndefined2.flags).toEqual(new Set([Field.Flags.UNDEFINABLE]));

    const tIntMaybe = type.Int().maybe(true);
    expectTypeOf(tIntMaybe).toEqualTypeOf<
        Field<
            number | undefined | null,
            object,
            Field.Kind.ORDINARY,
            Field.Flags.UNDEFINABLE | Field.Flags.NULLABLE
        >
    >();
    expect(tIntMaybe.flags).toEqual(new Set([Field.Flags.UNDEFINABLE, Field.Flags.NULLABLE]));

    expectTypeOf(type.Int().nullable().undefinable()).toEqualTypeOf<
        Field<
            number | null | undefined,
            object,
            Field.Kind.ORDINARY,
            Field.Flags.NULLABLE | Field.Flags.UNDEFINABLE
        >
    >();
    expectTypeOf(type.Int().maybe()).toEqualTypeOf<
        Field<
            number | null | undefined,
            object,
            Field.Kind.ORDINARY,
            Field.Flags.NULLABLE | Field.Flags.UNDEFINABLE
        >
    >();
    expectTypeOf(type.Int().nullable(true)).toEqualTypeOf<
        Field<number | null, object, Field.Kind.ORDINARY, Field.Flags.NULLABLE>
    >();
    expectTypeOf(type.Int().nullable(false)).toEqualTypeOf<
        Field<number, object, Field.Kind.ORDINARY, never>
    >();

    // @ts-expect-error
    expectTypeOf(type.Int().nullable(true)).toEqualTypeOf<
        Field<number | null, object, Field.Kind.ORDINARY, never>
    >();
    // @ts-expect-error
    expectTypeOf(type.Int().undefinable(true)).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.ORDINARY, never>
    >();
    // @ts-expect-error
    expectTypeOf(type.Int().nullable(false)).toEqualTypeOf<
        Field<number | null, object, Field.Kind.ORDINARY, Field.Flags.NULLABLE>
    >();
    // @ts-expect-error
    expectTypeOf(type.Int().undefinable(false)).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.ORDINARY, Field.Flags.UNDEFINABLE>
    >();
    // @ts-expect-error
    expectTypeOf(type.Int().maybe(false)).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.ORDINARY, Field.Flags.UNDEFINABLE | Field.Flags.NULLABLE>
    >();

    expectTypeOf(type.Int().primary()).toEqualTypeOf<
        Field<number, object, Field.Kind.ORDINARY, Field.Flags.PRIMARY>
    >();

    expectTypeOf(type.Int().readonly()).toEqualTypeOf<
        Field<number, object, Field.Kind.ORDINARY, Field.Flags.READONLY>
    >();

    expectTypeOf(type.Int().optional()).toEqualTypeOf<
        Field<number | undefined, object, Field.Kind.OPTIONAL, Field.Flags.UNDEFINABLE>
    >();

    expectTypeOf(type.Int().default(0)).toEqualTypeOf<Field<number, object, Field.Kind.HASDEFAULT, never>>();

    expectTypeOf(type.Int().default(() => 5)).toEqualTypeOf<
        Field<number, object, Field.Kind.HASDEFAULT, never>
    >();

    const tAllFlags = type.Int().nullable().optional().primary().readonly().undefinable();
    expectTypeOf(tAllFlags).toEqualTypeOf<
        Field<
            number | null | undefined,
            object,
            Field.Kind.OPTIONAL,
            Field.Flags.NULLABLE | Field.Flags.PRIMARY | Field.Flags.READONLY | Field.Flags.UNDEFINABLE
        >
    >();
    expect(tAllFlags.kind).toBe(Field.Kind.OPTIONAL);
    expect(tAllFlags.flags).toEqual(
        new Set([Field.Flags.NULLABLE, Field.Flags.PRIMARY, Field.Flags.READONLY, Field.Flags.UNDEFINABLE]),
    );
    expect(tAllFlags.isDefaulted).toBe(false);
    expect(tAllFlags.isNullable).toBe(true);
    expect(tAllFlags.isOptional).toBe(true);
    expect(tAllFlags.isOrdinary).toBe(false);
    expect(tAllFlags.isPrimary).toBe(true);
    expect(tAllFlags.isReadonly).toBe(true);
    expect(tAllFlags.isUndefinable).toBe(true);
    expect(tAllFlags.isVirtual).toBe(false);
});
