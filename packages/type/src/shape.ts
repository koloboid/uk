import ObjectID from 'bson-objectid';
import { O, U } from 'ts-toolbelt';
import { Field } from './field';
import { type } from './type';
import { Validation, Validator } from './validation';

export class Shape<TSchema extends type.Schema<TSchema>> {
    readonly schema: TSchema;
    readonly fields = new Map<string, Field.Any>();
    readonly tree = new Map<string, Field.Any>();
    readonly name: string;

    constructor(shapeClass: type.Class<TSchema>, name?: string) {
        this.schema = shapeClass instanceof Function ? new shapeClass() : shapeClass;
        this.name = name ?? shapeClass.name;
        this.collectFields(this.schema, '', new Set().add(shapeClass));
    }

    toString(mode?: 'full'): string {
        if (mode === 'full') {
            return (
                `[Shape of ${this.name}]:\n` + [...this.fields.values()].map(f => '  ' + f.toString('  ')).join('\n')
            );
        } else {
            return `[Shape of ${this.name}]`;
        }
    }

    protected collectFields(from: object, path: string, processed: Set<any>, parent?: Field.Any): void {
        for (const [propName, val] of Object.entries(from)) {
            const name = path + propName;
            let of, ofVal;
            let fld: Field.Any | undefined = undefined;
            if (val === String) {
                this.fields.set(name, (fld = type.String()));
            } else if (val === Number) {
                this.fields.set(name, (fld = type.Float()));
            } else if (val === Date) {
                this.fields.set(name, (fld = type.DateTime()));
            } else if (val === Boolean) {
                this.fields.set(name, (fld = type.Boolean()));
            } else if (val === ObjectID) {
                this.fields.set(name, (fld = type.MongoID()));
            } else if (val instanceof ArrayBuffer) {
                const len = val.byteLength;
                this.fields.set(name, (fld = type.Blob().default(() => new ArrayBuffer(len))));
            } else if (ArrayBuffer.isView(val)) {
                const len = val.byteLength;
                const ctor: any = val.constructor;
                this.fields.set(name, (fld = type.Blob().default(() => new ctor(new ArrayBuffer(len)))));
            } else if (val === ArrayBuffer) {
                this.fields.set(name, (fld = type.Blob()));
            } else if (
                val === Uint8Array ||
                val === Uint16Array ||
                val === Uint32Array ||
                val === Uint8ClampedArray ||
                val === Int8Array ||
                val === Int16Array ||
                val === Int32Array
            ) {
                this.fields.set(name, (fld = type.Blob(val)));
            } else if (val === BigInt) {
                this.fields.set(name, (fld = type.BigInt()));
            } else if (typeof val === 'string') {
                this.fields.set(name, (fld = type.String().default(val)));
            } else if (typeof val === 'number') {
                this.fields.set(name, (fld = type.Float().default(val)));
            } else if (typeof val === 'boolean') {
                this.fields.set(name, (fld = type.Boolean().default(val)));
            } else if (typeof val === 'bigint') {
                this.fields.set(name, (fld = type.BigInt().default(val)));
            } else if (val && val.constructor === ObjectID) {
                this.fields.set(name, (fld = type.MongoID().default(val)));
            } else if (val && val instanceof Date) {
                this.fields.set(name, (fld = type.DateTime().default(val)));
            } else if (Array.isArray(val)) {
                if (val.length > 1) {
                    this.fields.set(name, (fld = type.Tuple(...val)));
                } else {
                    this.fields.set(name, (fld = type.Array(val).default([])));
                }
            } else if (val && val instanceof Field) {
                this.fields.set(name, (fld = val));
                if (fld.options.of) {
                    of = fld.options.of;
                    ofVal = typeof of === 'function' ? new of() : undefined;
                }
            } else if (val && val instanceof Function) {
                this.fields.set(name, (fld = new Field(type.Object, { of: val })));
                of = val;
                ofVal = new val();
            } else if (val && typeof val === 'object') {
                this.fields.set(name, (fld = new Field(type.Object, { of: val })));
                if (!processed.has(val) && (!val.constructor || !processed.has(val.constructor))) {
                    processed.add(val);
                    this.collectFields(val, name + '.', processed, fld);
                    processed.delete(val);
                }
            }
            if (of && ofVal && !processed.has(of)) {
                processed.add(of);
                this.collectFields(ofVal, name + '.', processed, fld);
                processed.delete(of);
            }

            if (fld) {
                fld.init(this, propName, name, parent);
            }
            if (!path) this.tree.set(name, this.fields.get(name)!);
        }
    }

    pick<K extends keyof TSchema>(...keys: K[]): { new (): { [P in K]: TSchema[P] } } {
        throw new Error('Not implemented yet');
    }

    new(from: type.Initial<TSchema>, noRuntimeChecks?: 'noRuntimeChecks'): type.Plain<TSchema> {
        if (noRuntimeChecks) return from as any;

        if (!this.#docFactory) {
            const code = 'return ' + this.generateObjectBuilder(Shape.fieldCodegens.codegens, this.tree.values());
            // console.log('code', code);
            this.#docFactory = new Function('$from', '$deps', '$fields', '$throw', code) as any;
        }

        return this.#docFactory?.(from, Shape.fieldCodegens.deps, this.fields, Shape.$throw);
    }

    // newObj(from: type.Initial<TSchema>, noRuntimeChecks?: 'noRuntimeChecks'): type.Plain<TSchema> {
    //     if (!Shape.fldMap) {
    //         Shape.fldMap = new Map<Field.Factory, (from: any, fld: Field.Any) => any>([
    //             [
    //                 type.String,
    //                 (from: any, fld: Field.Any) =>
    //                     fld.options.maxSize && `${from}`.length > fld.options.maxSize
    //                         ? Shape.$throw(`Length maxSize`)
    //                         : `${from}`,
    //             ],
    //             [
    //                 type.Text,
    //                 (from: any, fld: Field.Any) =>
    //                     fld.options.maxSize && `${from}`.length > fld.options.maxSize
    //                         ? Shape.$throw(`Length maxSize`)
    //                         : `${from}`,
    //             ],
    //             [
    //                 type.Int,
    //                 (from: any, fld: Field.Any) =>
    //                     fld.options.bits && `${from}`.length > fld.options.maxSize
    //                         ? Shape.$throw(`Length maxSize`)
    //                         : `${from}`,
    //             ],
    //         ]);
    //     }
    //     const rv = {};
    //     for (const [key, fld] of this.tree) {
    //         const src = from[key];
    //         let val;
    //         const convert = Shape.fldMap.get(fld.factory);
    //         if (!convert) console.log('!!!!!!!!!!!!!!!!!!convert not found', fld.factory);

    //         if (fld.isDefaulted && (src === null || src === undefined)) val = fld.getDefault();
    //         else if (fld.isNullable && src === null) val = null;
    //         else if ((fld.isUndefinable || fld.isOptional) && src === undefined) val = undefined;
    //         else if (src === null || src === undefined) throw new Error('Can not be null or undefined');
    //         else val = convert!(src, fld);

    //         rv[key] = val;
    //     }
    //     return rv as any;
    // }

    protected generateObjectBuilder(
        codegens: Map<Field.Factory, Shape.FieldCodegen<any, any>>,
        fields: IterableIterator<Field.Any>,
        parenttab = '',
    ): string {
        const tab = parenttab + '    ';
        let code = '{\n';
        for (const fld of fields) {
            const generator = codegens.get(fld.factory);
            let fldCode = '(' + (generator ? generator(fld) : '$val') + ')';

            if (fld.typeName === 'Object') {
                fldCode = this.generateObjectBuilder(
                    Shape.fieldCodegens.codegens,
                    [...this.fields.values()].filter(f => f.parent === fld).values(),
                    tab,
                );
            }

            if (fld.isDefaulted) {
                const def = fldCode.replace(/\$val/g, `$fields.get('${fld.fullName}').getDefault()`);
                fldCode = `$val === null || $val === undefined ? ${def} : ${fldCode}`;
            } else if (fld.isNullable && fld.isUndefinable) {
                fldCode = '$val === null || $val === undefined ? $val : ' + fldCode;
            } else if (fld.isNullable) {
                fldCode = '$val === null ? null : ' + fldCode;
            } else if (fld.isUndefinable || fld.isOptional) {
                fldCode = '$val === undefined ? undefined : ' + fldCode;
            } else {
                fldCode =
                    `$val === undefined || $val === null ? $throw('Field "${this.name}.${fld.fullName}" can not be null or undefined') : ` +
                    fldCode;
            }
            fldCode = fldCode.replace(/\$val/g, '$from.' + fld.fullName);
            code += `${tab}${fld.name}: ${fldCode},\n`;
        }
        code += `${parenttab}}`;
        return code;
    }

    validate(doc: type.Plain<TSchema>): type.Plain<TSchema> {
        this.#validator?.validate(doc);
        return doc;
    }

    validator(validation: Validation<TSchema>): Validator<TSchema> {
        if (!this.#validator) {
            this.#validator = new Validator<TSchema>(this, validation);
        }
        return this.#validator;
    }

    toJSON(from: type.Plain<TSchema>): string {
        if (!this.#docFactory) {
            const code = 'return ' + this.generateObjectBuilder(Shape.fieldCodegens.codegens, this.tree.values());
            console.log('code', code);
            this.#docFactory = new Function('$from', code) as any;
        }

        return this.#docFactory?.(from, Shape.fieldCodegens.deps, this.fields, Shape.$throw);
    }

    static registerFieldCodegens<TFieldFactory>(
        fields: TFieldFactory,
        codeGen: Shape.FieldCreateCodegens<TFieldFactory>,
        dependencies?: object,
    ): void {
        for (const [name, factory] of Object.entries(fields)) {
            if (name in codeGen) {
                const gen = codeGen[name];
                if (this.fieldCodegens.codegens.has(factory)) continue;
                if (typeof factory === 'function') {
                    if (typeof gen === 'function') {
                        this.fieldCodegens.codegens.set(factory, gen);
                    } else {
                        this.fieldCodegens.codegens.set(factory, codeGen[gen]);
                    }
                }
            }
        }
        if (dependencies) this.fieldCodegens.deps = Object.assign(dependencies, this.fieldCodegens.deps);
    }

    static registerJsonCodegens<TFieldFactory>(
        fields: TFieldFactory,
        codeGen: Shape.FieldCreateCodegens<TFieldFactory>,
    ) {
        for (const [name, factory] of Object.entries(fields)) {
            const gen = codeGen[name];
            if (typeof factory === 'function' && typeof gen === 'function') {
            }
        }
    }

    protected static $throw(msg: string): never {
        throw new Shape.DocInitError(msg);
    }

    #docFactory?: ($from: any, $deps: any, $fields: any, $throw: any) => any;
    #jsonFactory?: ($from: any) => any;
    private static fieldCodegens = {
        deps: {},
        codegens: new Map<Field.Factory, Shape.FieldCodegen<any>>(),
    };
    #validator?: Validator<TSchema>;
}

export namespace Shape {
    export class DocInitError extends Error {}

    export interface Codegen {
        deps: object;
        codegens: Map<Field.Factory, Shape.FieldCodegen<any>>;
    }
    export type FieldCodegen<TField, TKeys = never> =
        | TKeys
        | undefined
        | ((opts: Exclude<TField, undefined>) => string);
    export type FieldCreateCodegens<T> = O.Filter<
        {
            [P in keyof T]: T[P] extends (..._: any[]) => any
                ? ReturnType<T[P]> extends Field.Any
                    ? FieldCodegen<ReturnType<T[P]>, keyof T>
                    : U.Has<ReturnType<T[P]>, Field.Any> extends 1
                    ? FieldCodegen<ReturnType<T[P]>, keyof T>
                    : never
                : never;
        },
        never,
        'equals'
    >;
    export type Any = Shape<any>;
}
