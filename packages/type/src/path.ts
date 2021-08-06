import ObjectID from 'bson-objectid';
import { type } from './type';

export namespace Path {
    export type Keys<T, E = never> = T extends E
        ? never
        : T extends readonly (infer I)[]
        ? I extends Date | ObjectID | Promise<any>
            ? never
            : I extends object
            ? Extract<keyof I, string> | SubKeys<I, Extract<keyof I, string>, E | I>
            : never
        : T extends Date | ObjectID | Promise<any> | Uint8Array | ArrayBuffer
        ? never
        : T extends object
        ? Extract<keyof T, string> | SubKeys<T, Extract<keyof T, string>, E | T>
        : never;

    type SubKeys<T, K extends string, E> = K extends keyof T ? `${K}.${Keys<T[K], E>}` : never;

    export type Prop<T, Path extends string, V = type.Definable<T>> = Path extends keyof V
        ? V[Path]
        : Path extends `${infer K}.${infer R}`
        ? K extends keyof V
            ? Prop<V[K], R>
            : unknown
        : unknown;
}

export default Path;
