import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNumber,
    IsNumberOptions,
    IsObject,
    IsOptional,
    IsString,
    Max,
    MaxDate,
    MaxLength,
    Min,
    MinDate,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { C, L, U } from 'ts-toolbelt';
import { Args, Float as GQLFloat, ID as GQLID, Int as GQLInt, NestField, registerEnumType } from './shim-graphql';

const SymFieldOpts = '__SymFieldOpts';
const SymFieldEach = '__SymFieldEach';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Field internals
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type Field<TOpts extends Field.Opts = Field.Opts> = PropertyDecorator & {
    [SymFieldOpts]: TOpts & Field.InternalOpts;
};
export namespace Field {
    export type InternalOpts = {
        gqlType?: any;
        of?: Field;
    };
    export type Opts = { optional?: boolean; each?: boolean };

    export function uniteDecorators<TOpts extends Opts, O = Exclude<TOpts, undefined>>(
        opts: (TOpts & InternalOpts) | undefined,
        gqlType: any,
        decoratorsFactory: () => Array<PropertyDecorator | undefined>,
    ): Exclude<TOpts, undefined>['each'] extends true ? Field<O> & { [SymFieldEach]: true } : Field<O> {
        const options: TOpts & InternalOpts = (opts ?? {}) as TOpts;
        const rv = ((target: any, propertyKey?: string | symbol) => {
            const decorators = decoratorsFactory();
            decorators.push(options.gqlType ?? NestField(() => gqlType, { nullable: !!options.optional }));
            if (options.optional) {
                decorators.push(IsOptional(options));
            }
            for (const decorator of decorators) {
                propertyKey && decorator && decorator(target, propertyKey);
            }
        }) as any;
        rv[SymFieldOpts] = {
            ...options,
            gqlType,
        };
        return rv;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MinMax helper
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export type MinMax = { min?: number; max?: number };
export namespace MinMax {
    export type FieldOpts = Field.Opts & MinMax;

    export function decorators(
        opts: string | MinMax | undefined,
        minDecor: (val: number) => PropertyDecorator,
        maxDecor: (val: number) => PropertyDecorator,
    ) {
        return opts && typeof opts === 'object'
            ? [
                  opts.min !== undefined && isFinite(opts.min) ? minDecor(opts.min) : undefined,
                  opts.max !== undefined && isFinite(opts.max) ? maxDecor(opts.max) : undefined,
              ]
            : [];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Enum factory
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function Enum<T extends Record<string, string | number>>(map: T): T;
export function Enum<K extends string>(...values: K[]): { [P in K]: P };
export function Enum(...values: any[]): any {
    if (values.length === 1 && typeof values[0] === 'object') return values[0];
    else return global.Object.fromEntries(values.map(val => [val, val])) as any;
}
export type Enum<E> = keyof E;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Int32 type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function int32<O extends MinMax.FieldOpts>(opts?: O) {
    const { min, max } = typeof opts === 'object' ? opts : ({} as MinMax);
    return Field.uniteDecorators(opts, GQLInt, () => [
        ...MinMax.decorators({ min: min ?? -2147483648, max: max ?? 2147483647 }, Min, Max),
        IsInt(),
    ]);
}
export const Int32 = int32;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Int53 type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function int53<O extends MinMax.FieldOpts>(opts?: O) {
    return Field.uniteDecorators(opts, Number, () => [...MinMax.decorators(opts, Min, Max), IsInt()]);
}
export const Int53 = int53;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Float type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function float<O extends MinMax.FieldOpts>(opts?: O & IsNumberOptions) {
    return Field.uniteDecorators(opts, GQLFloat, () => [
        ...MinMax.decorators(opts, Min, Max),
        IsNumber(typeof opts === 'object' ? opts : {}),
    ]);
}
export const Float = float;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// String type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function string<O extends MinMax.FieldOpts>(opts?: O) {
    return Field.uniteDecorators(opts, global.String, () => [
        ...MinMax.decorators(opts, MinLength, MaxLength),
        IsString(),
    ]);
}
export const String = string;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Bool type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function bool<O extends Field.Opts>(opts?: O) {
    return Field.uniteDecorators(opts, Boolean, () => [IsBoolean()]);
}
export const Bool = bool;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Object type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function object<O extends Field.Opts>(type: C.Class, opts?: O) {
    return Field.uniteDecorators(opts, type, () => [ValidateNested(), IsObject()]);
}
export const Object = object;
export const Obj = object;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// One type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function one<O extends Field.Opts, C extends C.Class<any, { _id: string | number | object }>>(
    type: () => C,
    fk: keyof InstanceType<C> = '_id',
    opts?: O,
) {
    return Field.uniteDecorators({ ...opts, fk }, undefined, () => []);
    //     () => {
    //     const storage = getMetadataStorage();
    //     const fkValidators = storage
    //         .getTargetValidationMetadatas(type(), '', true, false)
    //         .filter(p => p.propertyName === fk)
    //         .map(({ constraintCls, constraints, validationTypeOptions }) =>
    //             Validate(constraintCls, constraints, validationTypeOptions),
    //         );
    //     return fkValidators;
    // });
}
export const One = one;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Many type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function many<O extends Field.Opts, C extends C.Class<any, { _id: string | number | object }>>(
    type: C,
    fk: keyof InstanceType<C> = '_id',
    opts?: O,
) {
    return Field.uniteDecorators({ ...opts, fk }, undefined, () => [IsArray()]);
}
export const Many = many;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Enumeration type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function enumeration<T extends Record<string, Record<string, string | number>>, O extends Field.Opts>(
    type: T,
    opts?: O,
): L.Length<U.ListOf<keyof T>> extends 1 ? Field<Field.Opts> : never {
    const [name, enm] = global.Object.entries(type)[0];
    registerEnumType(enm, { name });
    return Field.uniteDecorators(opts, enm, () => [IsEnum(enm)]) as any;
}
export const Enumeration = enumeration;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ID type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function id<O extends Field.Opts>(opts?: O) {
    return Field.uniteDecorators(opts, GQLID, () => [IsString(), ...MinMax.decorators({ max: 25, min: 1 }, Min, Max)]);
}
export const ID = id;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DateTime type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function date<O extends Field.Opts>(opts?: O & { min?: Date; max?: Date }) {
    const minmax =
        opts && typeof opts === 'object'
            ? [opts.min ? MinDate(opts.min) : undefined, opts.max ? MaxDate(opts.max) : undefined]
            : [];
    return Field.uniteDecorators(opts, global.Date, () => [IsDate(), ...minmax]);
}
export const Date = date;
export const DateTime = date;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Array type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function array<O extends MinMax.FieldOpts>(of: Field & { [SymFieldEach]: true }, opts?: O) {
    const ofOpts = of[SymFieldOpts];
    const intOpts = {
        ...opts,
        of,
        gqlType: NestField(() => [ofOpts.gqlType], {
            nullable: ofOpts.optional ? (opts?.optional ? 'itemsAndList' : 'items') : opts?.optional,
        }),
    };

    return Field.uniteDecorators(intOpts, null, () => [...MinMax.decorators(opts, MinLength, MaxLength), IsArray()]);
}
export const Array = array;
export const List = array;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Arg type
////////////////////////////////////////////////////////////////////////////////////////////////////////////
export function Arg(type: C.Class): ReturnType<typeof Args>;
export function Arg(name: string, field: Field): ReturnType<typeof Args>;
export function Arg(name: string | C.Class, field?: Field) {
    return typeof name === 'string' && field
        ? Args(name, {
              type: () => field[SymFieldOpts].gqlType,
              nullable: field[SymFieldOpts].optional,
          })
        : Args({
              type: () => name,
          });
}
