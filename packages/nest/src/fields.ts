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

export function Enum<K extends string>(...values: K[]): Record<K, K> {
    return global.Object.fromEntries(values.map(val => [val, val])) as any;
}
export type Enum<E> = keyof E;

export type Field<TOpts extends FieldOpts = FieldOpts> = PropertyDecorator & {
    [SymFieldOpts]: TOpts & FieldInternalOpts;
};

export function int32<O extends MinMaxFieldOpts>(opts?: O) {
    const { min, max } = typeof opts === 'object' ? opts : ({} as MinMax);
    return uniteDecorators(
        opts,
        GQLInt,
        ...minMax({ min: min ?? -2147483648, max: max ?? 2147483647 }, Min, Max),
        IsInt(),
    );
}
export const Int32 = int32;

export function int53<O extends MinMaxFieldOpts>(opts?: O) {
    return uniteDecorators(opts, Number, ...minMax(opts, Min, Max), IsInt());
}
export const Int53 = int53;

export function float<O extends MinMaxFieldOpts>(opts?: O & IsNumberOptions) {
    return uniteDecorators(opts, GQLFloat, ...minMax(opts, Min, Max), IsNumber(typeof opts === 'object' ? opts : {}));
}
export const Float = float;

export function string<O extends MinMaxFieldOpts>(opts?: O) {
    return uniteDecorators(opts, global.String, ...minMax(opts, MinLength, MaxLength), IsString());
}
export const String = string;

export function bool<O extends FieldOpts>(opts?: O) {
    return uniteDecorators(opts, Boolean, IsBoolean());
}
export const Bool = bool;

export function object<O extends FieldOpts>(type: C.Class, opts?: O) {
    return uniteDecorators(opts, type, ValidateNested(), IsObject());
}
export const Object = object;
export const Obj = object;

export function one<O extends FieldOpts, C extends C.Class<any, { _id: string | number | object }>>(
    type: C,
    fk: keyof InstanceType<C> = '_id',
    opts?: O,
) {
    return uniteDecorators({ ...opts, fk }, undefined, IsObject());
}
export const One = one;

export function many<O extends FieldOpts, C extends C.Class<any, { _id: string | number | object }>>(
    type: C,
    fk: keyof InstanceType<C> = '_id',
    opts?: O,
) {
    return uniteDecorators({ ...opts, fk }, undefined, IsObject());
}
export const Many = many;

export function enumeration<T extends Record<string, Record<string, string>>, O extends FieldOpts>(
    type: T,
    opts?: O,
): L.Length<U.ListOf<keyof T>> extends 1 ? Field<FieldOpts> : never {
    const [name, enm] = global.Object.entries(type)[0];
    registerEnumType(enm, { name });
    return uniteDecorators(opts, enm, IsEnum(enm)) as any;
}
export const Enumeration = enumeration;

export function id<O extends FieldOpts>(opts?: O) {
    return uniteDecorators(opts, GQLID, IsString(), ...minMax({ max: 25, min: 1 }, Min, Max));
}
export const ID = id;

export function date<O extends FieldOpts>(opts?: O & { min?: Date; max?: Date }) {
    const minmax =
        opts && typeof opts === 'object'
            ? [opts.min ? MinDate(opts.min) : undefined, opts.max ? MaxDate(opts.max) : undefined]
            : [];
    return uniteDecorators(opts, global.Date, IsDate(), ...minmax);
}
export const Date = date;
export const DateTime = date;

export function array<O extends MinMaxFieldOpts>(of: Field & { [SymFieldEach]: true }, opts?: O) {
    const ofOpts = of[SymFieldOpts];
    const intOpts = {
        ...opts,
        of,
        gqlType: NestField(() => [ofOpts.gqlType], {
            nullable: ofOpts.optional ? (opts?.optional ? 'itemsAndList' : 'items') : opts?.optional,
        }),
    };

    return uniteDecorators(intOpts, null, ...minMax(opts, MinLength, MaxLength), IsArray());
}
export const Array = array;
export const List = array;

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

type FieldInternalOpts = {
    gqlType?: any;
    of?: Field;
};
type FieldOpts = { optional?: boolean; each?: boolean };
type MinMax = { min?: number; max?: number };
type MinMaxFieldOpts = FieldOpts & MinMax;

function uniteDecorators<TOpts extends FieldOpts, O = Exclude<TOpts, undefined>>(
    opts: (TOpts & FieldInternalOpts) | undefined,
    gqlType: any,
    ...decorators: Array<PropertyDecorator | undefined>
): Exclude<TOpts, undefined>['each'] extends true ? Field<O> & { [SymFieldEach]: true } : Field<O> {
    opts = (opts ?? {}) as TOpts;
    decorators.push(opts.gqlType ?? NestField(() => gqlType, { nullable: !!opts.optional }));
    if (opts.optional) {
        decorators.push(IsOptional(opts));
    }
    const rv = ((target: any, propertyKey?: string | symbol) => {
        for (const decorator of decorators) {
            propertyKey && decorator && decorator(target, propertyKey);
        }
    }) as any;
    rv[SymFieldOpts] = {
        ...opts,
        gqlType,
    };
    return rv;
}

function minMax(
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
