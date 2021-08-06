import { A, C, N, O, U } from 'ts-toolbelt';
import { Shape } from './shape';
import ObjectID from 'bson-objectid';
import { Field as FieldClass } from './field';
import PathLib from './path';
import * as uuid from 'uuid';

const symShape = Symbol();
const glob = globalThis;

export function type<T extends C.Class<[], { [P in keyof InstanceType<T>]: type.Declare.Any }>>(
    shapeClass: T,
): Shape<InstanceType<T>> {
    const shape = (<any>shapeClass)[symShape];
    return shape ? shape : ((<any>shapeClass)[symShape] = new Shape(shapeClass));
}

export namespace type {
    export import Field = FieldClass;

    // Scalar types

    export function Int<T = number>(): Field<T> {
        return new Field<T>(type.Int);
    }
    export function UInt<T = number>(): Field<T> {
        return new Field<T>(type.UInt);
    }
    export function Int8<T = number>(): Field<T> {
        return new Field<T>(type.Int8);
    }
    export function Int16<T = number>(): Field<T> {
        return new Field<T>(type.Int16);
    }
    export function Int32<T = number>(): Field<T> {
        return new Field<T>(type.Int32);
    }
    export function UInt8<T = number>(): Field<T> {
        return new Field<T>(type.UInt8);
    }
    export function UInt16<T = number>(): Field<T> {
        return new Field<T>(type.UInt16);
    }
    export function UInt32<T = number>(): Field<T> {
        return new Field<T>(type.UInt32);
    }
    export function Int64(): Field<bigint> {
        return new Field<bigint>(type.Int64);
    }
    export function UInt64(): Field<bigint> {
        return new Field<bigint>(type.UInt64);
    }

    export function BigInt(): Field<bigint> {
        return new Field<bigint>(type.BigInt);
    }

    export function Float(opts?: Float.Options): Field<number, Float.Options> {
        return new Field<number, Float.Options>(type.Float, opts || {});
    }
    export namespace Float {
        export interface Options {
            allowInfinite?: boolean;
        }
    }

    export function String<T extends string = string>(opts?: String.Options): Field<T, String.Options> {
        return new Field<T, String.Options>(type.String, glob.Object.assign({ maxSize: 4096 }, opts));
    }
    export namespace String {
        export interface Options {
            maxSize?: number;
        }
    }

    export function Text(opts?: String.Options): Field<string, String.Options> {
        return new Field<string, String.Options>(type.Text, glob.Object.assign({ maxSize: 256 * 1024 }, opts));
    }

    export function Boolean(): Field<boolean> {
        return new Field<boolean>(type.Boolean);
    }

    export function Date(): Field<Date> {
        return new Field<Date>(type.Date);
    }

    export function DateTime(): Field<Date> {
        return new Field<Date>(type.DateTime);
    }

    export function MongoID(): Field<ObjectID> {
        return new Field<ObjectID>(type.MongoID);
    }
    export namespace MongoID {
        export function create(id?: string | Buffer | number | ObjectID): ObjectID {
            return new ObjectID(id as any);
        }
        export function zero(): ObjectID {
            return new ObjectID('000000000000000000000000');
        }
        export function isValid(id: number | string | ObjectID | Buffer): boolean {
            return ObjectID.isValid(id as any);
        }
        export function equals(
            a: string | ObjectID | null | undefined,
            b: string | ObjectID | null | undefined,
        ): boolean {
            if (!a || !b) return false;
            return a.toString() === b.toString();
        }
    }
    export type MongoID = ObjectID;

    export function UUID() {
        return new Field<UUID>(type.UUID, {});
    }
    export namespace UUID {
        export function equals(a: string | null | undefined, b: string | null | undefined): boolean {
            if (!a || !b) return false;
            return a.toString() === b.toString();
        }
        export function isValid(id: UUID): boolean {
            return uuid.validate(id);
        }
        export function create<V extends 'v1' | 'v2' | 'v3' | 'v4' | 'v5'>(
            ver?: V,
            opts?: V extends 'v4' ? uuid.V4Options : V extends 'v1' ? uuid.V1Options : never,
        ): UUID {
            return uuid[(ver ?? 'v4') as any](opts);
        }
    }
    export type UUID = string;

    export function Blob<T extends Blob.Type = ArrayBufferConstructor>(
        dataType?: T,
        opts?: Blob.Options,
    ): Field<InstanceType<T>, Blob.Options> {
        dataType ??= ArrayBuffer as any;
        return new Field<InstanceType<T>, Blob.Options>(
            type.Blob,
            glob.Object.assign({ dataType, maxSize: 1024 * 1024 }, opts),
        );
    }
    export namespace Blob {
        export type Type =
            | ArrayBufferConstructor
            | Uint8ClampedArrayConstructor
            | Uint8ArrayConstructor
            | Uint16ArrayConstructor
            | Uint32ArrayConstructor
            | Int8ArrayConstructor
            | Int16ArrayConstructor
            | Int32ArrayConstructor;

        export interface Options {
            maxSize?: number;
            dataType?: Type;
        }
    }

    export function Union<T extends type.Declare.Any[]>(...types: T): Field<type.ArrayItem<T>> {
        return new Field<type.ArrayItem<T>>(type.Union);
    }

    // Complex types

    export function Object<
        T extends object | C.Class = object,
        I extends object = T extends C.Class ? InstanceType<T> : T,
    >(of: T): Field<I, { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED> {
        return new Field<I, { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED>(type.Object, { of });
    }
    export namespace Object {
        export type Empty = Rekord<string, never>;
    }

    export function Hash<T extends type.Declare.Fields>(
        of: T,
    ): Field<{ [key: string]: T }, { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED>;
    export function Hash<T extends type.Declare.Fields, TKey extends 'number' | 'string'>(
        key: TKey,
        of: T,
    ): Field<{ [key: string]: T }, { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED>;
    export function Hash(key: any, of?: any): Field.Any {
        of = of ?? key;
        return new Field(type.Hash, { of }, Field.Flags.EMBED);
    }

    export function Array<T extends type.Declare.Fields>(
        of: T,
    ): Field<Unbox<T, 'plain'>[], { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED> {
        return new Field<Unbox<T, 'plain'>[], { of: T }, Field.Kind.ORDINARY, Field.Flags.EMBED>(type.Array, {
            of,
        });
    }

    export function Tuple<T extends type.Declare.Fields[]>(...of: T): Field<Unbox<T, 'plain'>, { of: object }> {
        return new Field<Unbox<T, 'plain'>, { of: object }>(type.Tuple, {
            of: of as [...T],
        });
    }

    // Link types

    export function One<
        T extends SchemaClass,
        K extends type.Filter.FieldsByFlags<InstanceType<T>, Field.Flags.PRIMARY>,
    >(
        ref: T,
    ): K extends never
        ? never
        : Field<Unbox<InstanceType<T>[K], 'plain'>, One.Options, Field.Kind.ORDINARY, Field.Flags.REF, T>;
    export function One<T extends SchemaClass, K extends keyof InstanceType<T>>(
        ref: T,
        to: K,
    ): Field<Unbox<InstanceType<T>[K], 'plain'>, One.Options, Field.Kind.ORDINARY, Field.Flags.REF, T>;
    export function One(ref: C.Class, to?: string) {
        if (!to) {
            const refschema = type(ref);
            to = [...refschema.fields.values()].find(f => f.isPrimary)?.name;
            if (!to) throw new Error(`One: primary key not found in ${refschema.name}`);
        }
        return new Field(type.One, { ref, to }) as any;
    }
    export namespace One {
        export interface Options {
            ref: C.Class;
            to: string;
        }
    }

    export function Many<
        T extends SchemaClass,
        K extends type.Filter.FieldsByFlags<InstanceType<T>, Field.Flags.PRIMARY>,
    >(
        ref: T,
    ): K extends never
        ? never
        : Field<Unbox<InstanceType<T>[K], 'plain'>[], Many.Options, Field.Kind.ORDINARY, Field.Flags.REF, T>;
    export function Many<T extends SchemaClass, K extends keyof InstanceType<T>>(
        ref: T,
        to: K,
    ): Field<Unbox<InstanceType<T>[K], 'plain'>[], Many.Options, Field.Kind.ORDINARY, Field.Flags.REF, T>;
    export function Many(ref: C.Class, to?: string) {
        return new Field(type.Many, { ref, to }) as any;
    }
    export namespace Many {
        export interface Options {
            ref: C.Class;
            to: string;
        }
    }

    export function Opt<T extends type.Declare.Constructors | type.Class | object>(
        ofCtor: T,
    ): Field<type.Unbox<T, 'plain'> | undefined, object, Field.Kind.OPTIONAL> {
        let rv;
        if (ofCtor === Number) {
            rv = type.Float().optional();
        } else if (ofCtor === global.String) {
            rv = type.String().optional();
        } else if (ofCtor === global.Boolean) {
            rv = type.Boolean().optional();
        } else if (ofCtor === glob.Date) {
            rv = type.Date().optional();
        } else if (glob.Array.isArray(ofCtor)) {
            rv = type.Array(ofCtor[0]).optional();
        } else if (ofCtor === ArrayBuffer) {
            rv = type.Blob().optional();
        } else if (ofCtor === glob.BigInt) {
            rv = type.BigInt();
        } else {
            rv = type.Object(ofCtor);
        }
        return rv as any;
    }

    export function match(what: any): Matcher {
        return new Matcher(what);
    }

    export function omit<T, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> {
        return global.Object.fromEntries(global.Object.entries(obj).filter(([n]) => !props.includes(n as K))) as Omit<
            T,
            K
        >;
    }

    export function pick<T extends object, K extends keyof T>(obj: T, ...props: K[]): A.Compute<Pick<T, K>> {
        return global.Object.fromEntries(global.Object.entries(obj).filter(([n]) => props.includes(n as K))) as any;
    }

    export function writeable<T extends object>(obj: T): O.Writable<T, keyof any, 'deep'> {
        return obj as any;
    }

    export function extract<T, F extends T = T>(from: F, mask: Rekord<keyof T, 1 | 0 | boolean>): T;
    export function extract<T, F extends T = T>(
        from: F | undefined | null,
        mask: Rekord<keyof T, 1 | 0 | boolean>,
    ): T | null | undefined;
    export function extract<T, F extends T = T>(
        from: F | undefined | null,
        mask: Rekord<keyof T, 1 | 0 | boolean>,
    ): T | null | undefined {
        if (!from) return from;
        return global.Object.fromEntries(global.Object.entries(from).filter(([n]) => !!mask[n])) as any;
    }
}

type Part<T> = Partial<T>;
type Rekord<K extends keyof any, V> = Record<K, V>;

export type type<
    TAny,
    TSelect extends (TAny extends object ? type.Path.Keys<type.Compute<type.Unbox<TAny, 'plain'>>> : '*') | '*' = '*',
> = TAny extends type.Schema<TAny> ? type.Selector<type.Unbox<TAny, 'plain'>, TSelect> : type.Unbox<TAny, 'plain'>;

export namespace type {
    export import Path = PathLib;

    export type Plain<T extends Schema<T>> = Unbox.Object<T, 'plain'>;
    export type Initial<T extends Schema<T>> = Unbox.Object<T, 'init'>;
    export type Joined<T extends Schema<T>> = Unbox.Object<T, 'join'>;

    export type Compute<T> = T extends object
        ? T extends Date
            ? T
            : T extends ObjectID
            ? T
            : T extends Promise<any>
            ? T
            : T extends [...any[]]
            ? T
            : T extends Array<infer I>
            ? Compute<I>[]
            : {
                  [P in keyof T]: T[P];
                  // eslint-disable-next-line
              } & {}
        : T;

    export type Schema<T> = object; //{ [P in keyof T]: Declare.Any };

    export type Class<T extends object = object> = C.Class<[], T>;

    export type SchemaClass = C.Class<[], Schema<unknown>>;

    export type Hash<TKey extends 'number' | 'string', TVal> = TKey extends 'number'
        ? {
              [key: number]: TVal;
          }
        : {
              [key: string]: TVal;
          };

    export type Callable<T, TArgs extends any[] = []> = T | ((...args: TArgs) => T);
    export type Promised<T> = T | Promise<T>;
    export type Arrayed<T> = T | T[];
    export type Maybe<T> = T | undefined;
    export type Nullable<T> = T | undefined;
    export type Partial<TSchema extends type.Schema<TSchema>> = Part<type.Plain<TSchema>>;
    export type Record<TSchema extends type.Schema<TSchema>, TValue> = Rekord<Path.Keys<type.Plain<TSchema>>, TValue>;
    export type ArrayItem<T> = T extends ReadonlyArray<infer I> ? I : never;
    export type Unpack<T> = T extends ReadonlyArray<infer I> ? I : T extends Promise<infer R> ? R : T;
    export type Value<TSchema extends type.Schema<TSchema>, TKey extends Path.Keys<TSchema>> = Path.Prop<
        type.Plain<TSchema>,
        TKey
    >;
    export type UnpackAnyProp<TSchema extends Schema<TSchema>, K extends string> = type.Unpack<
        type.Path.Prop<type.Plain<TSchema>, K>
    >;

    export type IsPlainObject<T> = T extends Date | Promise<any> | ObjectID | Array<any> | Uint8Array | ArrayBuffer
        ? false
        : T extends object
        ? true
        : false;

    export namespace Declare {
        export type Any = Defaults | Fields | Fields[];

        export type Fields = Class<any> | object | Constructors | Field.Any;

        export type Defaults =
            | string
            | number
            | boolean
            | Date
            | bigint
            | ObjectID
            | ArrayBuffer
            | Uint8ClampedArray
            | Uint8Array
            | Uint16Array
            | Uint32Array
            | Int8Array
            | Int16Array
            | Int32Array;

        export type Constructors =
            | StringConstructor
            | NumberConstructor
            | DateConstructor
            | BooleanConstructor
            | BigIntConstructor
            | { new (..._: any[]): ObjectID }
            | ArrayBufferConstructor
            | Uint8ClampedArrayConstructor
            | Uint8ArrayConstructor
            | Uint16ArrayConstructor
            | Uint32ArrayConstructor
            | Int8ArrayConstructor
            | Int16ArrayConstructor
            | Int32ArrayConstructor;
    }

    export type Unbox<T, M extends Unbox.Mode> = 0 extends 1 & T
        ? never
        : T extends Field.Any
        ? type.Unbox.Fld<T, M>
        : T extends Class<ObjectID>
        ? ObjectID
        : T extends StringConstructor
        ? string
        : T extends DateConstructor
        ? Date
        : T extends BooleanConstructor
        ? boolean
        : T extends NumberConstructor
        ? number
        : T extends BigIntConstructor
        ? bigint
        : T extends {
              readonly [Symbol.toStringTag]:
                  | 'Uint8Array'
                  | 'Uint16Array'
                  | 'Uint32Array'
                  | 'Int8Array'
                  | 'Int16Array'
                  | 'Int32Array'
                  | 'Uint8ClampedArray';
          }
        ? T
        : T extends ArrayBuffer
        ? ArrayBuffer
        : T extends ArrayBufferConstructor
        ? ArrayBuffer
        : T extends {
              new (...args: any): {
                  readonly [Symbol.toStringTag]:
                      | 'Uint8Array'
                      | 'Uint16Array'
                      | 'Uint32Array'
                      | 'Int8Array'
                      | 'Int16Array'
                      | 'Int32Array'
                      | 'Uint8ClampedArray';
              };
          }
        ? InstanceType<T>
        : T extends number
        ? number
        : T extends bigint
        ? bigint
        : T extends string
        ? string
        : T extends boolean
        ? boolean
        : T extends Date
        ? Date
        : T extends ObjectID
        ? ObjectID
        : T extends { length: 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 }
        ? { [I in keyof T]: Unbox<T[I], M> }
        : T extends Array<infer I>
        ? Unbox<I, M>[]
        : T extends Class<infer I>
        ? Unbox.Object<I, M>
        : T extends object
        ? Unbox.Object<T, M>
        : T extends null
        ? null
        : T extends undefined
        ? undefined
        : 'NOT_SUPPORTED_BY_UK_TYPE';

    export namespace Unbox {
        export type Mode = 'join' | 'plain' | 'init';

        export type MapKind<T extends object> = keyof T extends never
            ? 'UNKNOWN_NOT_SUPPORTED'
            : 0 extends 1 & T
            ? 'ANY_NOT_SUPP'
            : {
                  [P in keyof T]: T[P] extends
                      | string
                      | number
                      | bigint
                      | boolean
                      | Date
                      | ObjectID
                      | Uint8Array
                      | ArrayBuffer
                      ? 'HASDEFAULT'
                      : T[P] extends Field.Any
                      ? FieldFlag<T[P]>
                      : 'ORDINARY';
              };

        export type Tuple<T extends { length: any }, TMode extends Mode> = { [I in keyof T]: Unbox<T[I], TMode> };

        type FieldFlag<T extends Field.Any> = A.Compute<
            T['kind'] extends Field.Kind.HASDEFAULT
                ? 'HASDEFAULT'
                : T['kind'] extends Field.Kind.OPTIONAL
                ? 'OPTIONAL'
                : 'ORDINARY'
        >;

        export type Object<T extends object, M extends Mode, TMapKinds extends MapKind<T> = MapKind<T>> =
            M extends 'init'
                ? TMapKinds extends object
                    ? Compute<
                          {
                              [P in O.SelectKeys<TMapKinds, 'ORDINARY'>]: Unbox<T[P], M>;
                          } &
                              {
                                  [P in O.SelectKeys<TMapKinds, 'OPTIONAL'>]?: Unbox<T[P], M>;
                              } &
                              {
                                  [P in O.SelectKeys<TMapKinds, 'HASDEFAULT'>]?: Unbox<T[P], M>;
                              }
                      >
                    : 'ANY_NOT_SUPP'
                : Compute<
                      {
                          [P in keyof T]: Unbox<T[P], M>;
                      } &
                          {
                              +readonly [P in Extract<keyof T, Filter.FieldsByFlags<T, Field.Flags.READONLY>>]: Unbox<
                                  T[P],
                                  M
                              >;
                          }
                  >;

        export type Fld<TField extends Field.Any, TMode extends Mode> = TField extends Field<
            infer TType,
            infer _TOpts,
            infer _TKind,
            infer TFlags,
            infer TRef
        >
            ? Field.Flags.REF extends TFlags
                ? TMode extends 'join'
                    ? Unbox<TRef, TMode>
                    : Unbox<TType, TMode>
                : Unbox<TType, TMode>
            : 'NOT_A_FIELD';
    }

    export namespace Filter {
        export type FieldsByFlags<T, TFlt extends Field.Flags.All> = Exclude<
            O.FilterKeys<
                {
                    [P in keyof T]: T[P] extends Field<any, any, any, infer TFlags> ? U.Has<TFlags, TFlt> : 0;
                },
                0
            >,
            number | symbol
        >;
        export type ArrayFields<TSchema extends Schema<TSchema>> = Exclude<
            O.FilterKeys<
                {
                    [P in keyof TSchema]: TSchema[P] extends Field<infer TType, any, any, any, any>
                        ? TType extends Array<any>
                            ? 1
                            : 0
                        : TSchema[P] extends Array<any>
                        ? 1
                        : 0;
                },
                0
            >,
            number | symbol
        >;
        export type FieldsByType<TSchema extends Schema<TSchema>, TMatchType> = Exclude<
            O.FilterKeys<
                {
                    [P in Path.Keys<type.Plain<TSchema>>]: Path.Prop<type.Plain<TSchema>, P> extends Field<
                        infer TType,
                        any,
                        any,
                        any,
                        any
                    >
                        ? TType extends TMatchType
                            ? 1
                            : 0
                        : Path.Prop<type.Plain<TSchema>, P> extends TMatchType
                        ? 1
                        : 0;
                },
                0
            >,
            number | symbol
        >;
    }
    export type Definable<T> = Exclude<T, null | undefined>;

    export type Select<TSchema extends Schema<TSchema>, TKeys extends type.Path.Keys<type.Plain<TSchema>>> = Selector<
        type.Compute<type.Unbox<TSchema, 'plain'>>,
        TKeys
    >;

    export type Selector<
        T,
        K,
        Parent extends string = '',
        E = never,
        HasStar extends boolean = K extends '*' ? true : false,
    > = T extends E
        ? never
        : [K] extends ['*']
        ? T
        : FilterEmptyNever<
              {
                  [P in keyof T]: P extends string
                      ? AddUndefined<T[P], ResolveField<T, P, K, T[P], Parent, E, HasStar>>
                      : never;
              }
          >;

    type AddUndefined<V, R> = R extends never ? never : undefined extends V ? R | undefined : R;

    type ResolveField<
        T,
        P extends string,
        K,
        V,
        Parent extends string = '',
        E = never,
        HasStar extends boolean = K extends '*' ? true : false,
    > = type.IsPlainObject<V> extends false
        ? // Scalar field
          HasStar extends true
            ? V
            : `${Parent}${P}` extends K
            ? V
            : never
        : // Object field
        true extends HasStar
        ? // Has star on top level!
          V extends { __fk: infer FK }
            ? // Ref FK
              Selector<V, K, `${Parent}${P}.`, E | T, false> extends never
                ? // Has no joins
                  `${Parent}${P}.*` extends K
                    ? // But has a star
                      Selector<V, K, `${Parent}${P}.`, E | T, true>
                    : // Use FK type
                      FK
                : Selector<V, K, `${Parent}${P}.`, E | T, false>
            : // Embedded
              Selector<V, K, `${Parent}${P}.`, E | T, HasStar>
        : // No star on top level
        V extends { __fk: infer FK }
        ? // Ref FK
          Selector<V, K, `${Parent}${P}.`, E | T, false> extends never
            ? // Has no joins
              `${Parent}${P}.*` extends K
                ? // But has a star
                  Selector<V, K, `${Parent}${P}.`, E | T, true>
                : `${Parent}${P}` extends K
                ? // Field requested directly
                  FK
                : never
            : // Embedded
              Selector<V, K, `${Parent}${P}.`, E | T, false>
        : `${Parent}${P}` extends K
        ? Selector<V, K, `${Parent}${P}.`, E | T, true>
        : `${Parent}${P}.*` extends K
        ? Selector<V, K, `${Parent}${P}.`, E | T, true>
        : Selector<V, K, `${Parent}${P}.`, E | T, false> extends never
        ? never
        : Selector<V, K, `${Parent}${P}.`, E | T, false>;
}

type KeysNotExtends<T, E> = { [K in keyof T]: T[K] extends E ? never : K }[keyof T];

type FilterEmptyNever<T extends object> = KeysNotExtends<T, never> extends never
    ? never
    : type.Compute<
          {
              [P in KeysNotExtends<T, never>]: T[P];
          }
      >;

export class Matcher<TRv = undefined> {
    constructor(private what: any) {}

    on<T extends type.Declare.Fields, H extends (value: type<T>) => any>(
        type: T,
        handler: H,
    ): Matcher<TRv | ReturnType<H>> {
        return this;
    }

    default<R>(handler: (() => R) | R): Exclude<TRv, undefined> | R {
        throw new Error('Not implemented yet');
    }
}

function int(min: number, max: number, name: string) {
    return `!isFinite($val) || $val < ${min} || $val > ${max} ? $throw('${name} = ' + $val + ' must be between ${min} and ${max}') : Math.floor($val)`;
}

function bigInt(min: bigint, max: bigint, name: string) {
    return `typeof $val !== 'bigint' || $val < ${min}n || $val > ${max}n ? $throw('${name} = ' + $val + 'n must be between ${min}n and ${max}n') : BigInt($val)`;
}

Shape.registerFieldCodegens(
    type,
    {
        Int: ({ absName }) => int(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, absName),
        Int8: ({ absName }) => int(-128, 127, absName),
        Int16: ({ absName }) => int(-32768, 32767, absName),
        Int32: ({ absName }) => int(-(2 ** 31), 2 ** 31 - 1, absName),
        Int64: ({ absName }) => bigInt(-9223372036854775808n, 9223372036854775807n, absName),

        UInt: ({ absName }) => int(0, Number.MAX_SAFE_INTEGER, absName),
        UInt8: ({ absName }) => int(0, 0x100, absName),
        UInt16: ({ absName }) => int(0, 0x1_0000, absName),
        UInt32: ({ absName }) => int(0, 0x1_0000_0000, absName),
        UInt64: ({ absName }) => bigInt(0n, 1_0000_0000_0000_0000n, absName),

        String({ options, absName }) {
            return options.maxSize
                ? `$val.toString().length > ${options.maxSize} ? $throw('${absName} should be less than ${options.maxSize}.') : $val.toString()`
                : `$val.toString()`;
        },
        Text: 'String',
        BigInt() {
            return 'BigInt($val)';
        },
        Float({ options, absName }) {
            if (!options.allowInfinite) return `!isFinite(+$val) ? $throw('${absName} must be finite number') : +$val`;
            return '+$val';
        },
        Boolean() {
            return `!!$val`;
        },
        Date() {
            return `$deps.createDate($val)`;
        },
        DateTime() {
            return `new Date($val)`;
        },
        Blob({ options, absName }) {
            const rv = options.maxSize
                ? `($val.byteLength > ${options.maxSize} ? $throw('${absName} should be less than ${options.maxSize} bytes. Requested size = ' + $val.byteLength) : $val)`
                : `$val`;
            return `$val && ($val instanceof ArrayBuffer || ArrayBuffer.isView($val)) ? ${rv} : $throw('${absName} should be instance of ArrayBuffer or TypedArray')`;
        },
        UUID({ absName }) {
            return `$deps.UUID.isValid($val) ? $val : $throw('${absName} should be valid UUID, "' + $val + '" is not')`;
        },
        MongoID() {
            return `$deps.ObjectID($val)`;
        },
        One({ options, absName }) {
            const refshape = type(options.ref);
            const fk = refshape.fields.get(options.to);
            if (!fk) throw new Error(`Foreign key for ${absName} => ${refshape.name}.${options.to} not found`);
            return Shape['fieldCodegens'].codegens.get(fk!.factory)!(fk);
        },
        Many: undefined,
        Array: undefined,
        Hash: undefined,
        Object: undefined,
        Tuple: undefined,
        Union: undefined,
        Opt: undefined,
        extract: undefined,
        omit: undefined,
        pick: undefined,
        writeable: undefined,
    },
    {
        ObjectID,
        UUID: type.UUID,
        createDate(from: any) {
            const dt = new Date(from);
            dt.setHours(0, 0, 0, 0);
            return dt;
        },
    },
);
