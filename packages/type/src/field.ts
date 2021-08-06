import { O } from 'ts-toolbelt';
import { Shape } from './shape';
import { type } from './type';

export class Field<
    TType,
    TOptions extends object = object,
    TKind extends Field.Kind = Field.Kind.ORDINARY,
    TFlags extends Field.Flags = never,
    TRef = never,
> {
    readonly name!: string;
    readonly typeName!: string;
    readonly fullName!: string;
    readonly absName!: string;
    readonly options!: TOptions;
    readonly flags = new Set<TFlags>();
    readonly shape?: Shape.Any;
    readonly parent?: Field.Any;

    readonly kind: TKind = Field.Kind.ORDINARY as TKind;

    readonly isNullable: boolean = false;
    readonly isReadonly: boolean = false;
    readonly isPrimary: boolean = false;
    readonly isUndefinable: boolean = false;

    get isOrdinary(): boolean {
        return this.kind === Field.Kind.ORDINARY;
    }
    get isVirtual(): boolean {
        return this.kind === Field.Kind.VIRTUAL;
    }
    get isOptional(): boolean {
        return this.kind === Field.Kind.OPTIONAL;
    }
    get isDefaulted(): boolean {
        return this.kind === Field.Kind.HASDEFAULT;
    }

    constructor(readonly factory: Field.Factory, options?: TOptions, ...flags: TFlags[]) {
        this.options = options ?? ({} as TOptions);
        this.typeName = factory.name;
        flags.forEach(f => this.flags.add(f));
    }

    init(shape: Shape.Any, name: string, fullName: string, parent?: Field.Any): this {
        if (this.shape) {
            throw new Error(
                `Field ${fullName} already added to another shape ${this.shape.name} while adding to ${shape.name}`,
            );
        }
        this.self.shape = shape;
        this.self.name = name;
        this.self.fullName = fullName;
        this.self.parent = parent;
        this.self.absName = shape.name + '.' + fullName;
        this.#fullPath = this.fullName.split('.');
        return this;
    }

    readonly<V extends boolean = true>(value?: V): Field<TType, TOptions, TKind, TFlags | Field.Flags.READONLY, TRef> {
        return this.setFlag(value, 'isReadonly', Field.Flags.READONLY);
    }

    primary<V extends boolean = true>(value?: V): Field<TType, TOptions, TKind, TFlags | Field.Flags.PRIMARY, TRef> {
        return this.setFlag(value, 'isPrimary', Field.Flags.PRIMARY);
    }

    nullable(value: true): Field<TType | null, TOptions, TKind, TFlags | Field.Flags.NULLABLE, TRef>;
    nullable(value: false): Field<Exclude<TType, null>, TOptions, TKind, Exclude<TFlags, Field.Flags.NULLABLE>, TRef>;
    nullable(): Field<TType | null, TOptions, TKind, TFlags | Field.Flags.NULLABLE, TRef>;
    nullable(value?: boolean): any {
        return this.setFlag(value, 'isNullable', Field.Flags.NULLABLE);
    }

    undefinable<V extends boolean = true>(
        set?: V,
    ): Field<
        V extends true ? TType | undefined : Exclude<TType, undefined>,
        TOptions,
        TKind,
        V extends true ? TFlags | Field.Flags.UNDEFINABLE : Exclude<TFlags, Field.Flags.UNDEFINABLE>,
        TRef
    > {
        return this.setFlag(set, 'isUndefinable', Field.Flags.UNDEFINABLE);
    }

    private setFlag(value: boolean | undefined, propName: keyof this, flag: Field.Flags): any {
        if (value || value === undefined) {
            (<any>this)[propName] = true;
            this.flags.add(flag as any);
        } else {
            this.self.isUndefinable = true;
            this.flags.delete(flag as any);
        }
        return this as any;
    }

    default(val: type.Callable<TType>): Field<TType, TOptions, Field.Kind.HASDEFAULT, TFlags, TRef> {
        this.#defaultValue = val as any;
        this.self.kind = Field.Kind.HASDEFAULT as any;
        return this as any;
    }

    auto(): Field<TType, TOptions, Field.Kind.HASDEFAULT, TFlags, TRef> {
        this.self.kind = Field.Kind.HASDEFAULT as any;
        return this as any;
    }

    maybe<V extends boolean = true>(
        set?: V,
    ): Field<
        V extends true ? TType | undefined | null : Exclude<TType, undefined | null>,
        TOptions,
        TKind,
        V extends true
            ? TFlags | Field.Flags.UNDEFINABLE | Field.Flags.NULLABLE
            : Exclude<TFlags, Field.Flags.UNDEFINABLE | Field.Flags.NULLABLE>,
        TRef
    > {
        this.setFlag(set, 'isUndefinable', Field.Flags.UNDEFINABLE);
        return this.setFlag(set, 'isNullable', Field.Flags.NULLABLE);
    }

    optional<V extends boolean = true>(
        set?: V,
    ): Field<
        V extends true ? TType | undefined : Exclude<TType, undefined>,
        TOptions,
        V extends true ? Field.Kind.OPTIONAL : Field.Kind.ORDINARY,
        V extends true ? TFlags | Field.Flags.UNDEFINABLE : Exclude<TFlags, undefined>,
        TRef
    > {
        this.self.kind = (set || set === undefined ? Field.Kind.OPTIONAL : Field.Kind.ORDINARY) as any;
        return this as any;
    }

    doc(): string | undefined;
    doc(set: string): this;
    doc(set?: string) {
        if (set === undefined) return this.#doc;
        this.#doc = set;
        return this;
    }

    get(document: any): TType {
        let rv;
        if (this.#fullPath && this.#fullPath.length > 1) {
            rv = this.#fullPath.reduce((prev, curr) => (prev ? prev[curr] : undefined), document);
        } else {
            rv = document[this.name];
        }
        if (rv === undefined) return this.getDefault();
        else return rv;
    }

    set(document: any, value: TType, opts: { convert?: boolean; createParents?: boolean } = {}): this {
        if (this.#fullPath && this.#fullPath.length > 1) {
            let v = document;
            for (const n of this.#fullPath.slice(0, -1)) {
                if (v[n]) {
                    v = v[n];
                } else {
                    if (opts.createParents) {
                        v = v[n] = {};
                    } else {
                        v = undefined;
                        break;
                    }
                }
            }
            if (v) v[this.name] = value;
        } else {
            document[this.name] = value;
        }
        return this;
    }

    getDefault(): TType {
        return this.#defaultValue instanceof Function ? this.#defaultValue() : this.#defaultValue;
    }

    toString(offset = ''): string {
        const off = offset && this.#fullPath ? offset.repeat(this.#fullPath?.length - 1) : '';
        return `${off || ''}${this.name}: ${this.typeName} [${[this.kind, ...this.flags].join(', ')}]`;
    }

    private get self(): O.Writable<this> {
        return this as any;
    }

    #defaultValue!: TType | (() => TType);
    #doc?: string;
    #fullPath?: string[];
}

export namespace Field {
    export const enum Kind {
        ORDINARY = 'ORDINARY',
        HASDEFAULT = 'HASDEFAULT',
        OPTIONAL = 'OPTIONAL',
        VIRTUAL = 'VIRTUAL',
    }

    export const enum Flags {
        PRIMARY = 'PRIMARY',
        READONLY = 'READONLY',
        NULLABLE = 'NULLABLE',
        UNDEFINABLE = 'UNDEFINABLE',
        REF = 'REF',
        EMBED = 'EMBED',
    }
    export namespace Flags {
        export type All = Flags;
    }

    export type Any = Field<any, any, any, any, any>;

    export interface ConvertOpts {
        useDefault?: boolean;
    }

    export type Factory = (...args: any[]) => any & object;
}
