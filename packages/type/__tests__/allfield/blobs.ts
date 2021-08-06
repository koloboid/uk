import { type, __, assignTest, expectTypeOf } from './stuff';

test('Blobs shape', () => {
    expect(type(Blobs).toString('full')).toMatch(`[Shape of Blobs]:
  blob: Blob [ORDINARY]
  blobDef: Blob [HASDEFAULT]
  blobOpt: Blob [OPTIONAL]
  blobMay: Blob [ORDINARY, UNDEFINABLE, NULLABLE]
  blobConst: Blob [ORDINARY, READONLY]
  blobInst: Blob [HASDEFAULT]
  blobCtor: Blob [ORDINARY]
  blobU8: Blob [ORDINARY]
  blobU8Def: Blob [HASDEFAULT]
  blobU8Opt: Blob [OPTIONAL]
  blobU8May: Blob [ORDINARY, UNDEFINABLE, NULLABLE]
  blobU8Const: Blob [ORDINARY, READONLY]
  blobU8Inst: Blob [HASDEFAULT]
  blobU8Ctor: Blob [ORDINARY]
  blobI32: Blob [ORDINARY]
  blobI32Def: Blob [HASDEFAULT]
  blobI32Opt: Blob [OPTIONAL]
  blobI32May: Blob [ORDINARY, UNDEFINABLE, NULLABLE]
  blobI32Const: Blob [ORDINARY, READONLY]
  blobI32Inst: Blob [HASDEFAULT]
  blobI32Ctor: Blob [ORDINARY]`);
});

const blobsInit: type.Initial<Blobs> = {
    blob: new ArrayBuffer(0),
    blobMay: null,
    blobConst: new ArrayBuffer(0),
    blobCtor: new ArrayBuffer(0),

    blobU8: new Uint8Array(),
    blobU8May: undefined,
    blobU8Const: new Uint8Array(),
    blobU8Ctor: new Uint8Array(),

    blobI32: new Int32Array(),
    blobI32Opt: new Int32Array(),
    blobI32May: new Int32Array(),
    blobI32Const: new Int32Array(),
    blobI32Ctor: new Int32Array(),
};

test('Blobs new', () => {
    const blobs = type(Blobs).new(blobsInit);
    expect(blobs).toStrictEqual({
        blob: new ArrayBuffer(0),
        blobMay: null,
        blobConst: new ArrayBuffer(0),
        blobCtor: new ArrayBuffer(0),
        blobDef: new ArrayBuffer(2),
        blobInst: new ArrayBuffer(3),
        blobOpt: undefined,

        blobU8: new Uint8Array(),
        blobU8May: undefined,
        blobU8Const: new Uint8Array(),
        blobU8Ctor: new Uint8Array(),
        blobU8Def: new Uint8Array(4),
        blobU8Inst: new Uint8Array(5),
        blobU8Opt: undefined,

        blobI32: new Int32Array(),
        blobI32Def: new Int32Array(6),
        blobI32Opt: new Int32Array(),
        blobI32May: new Int32Array(),
        blobI32Const: new Int32Array(),
        blobI32Inst: new Int32Array(7),
        blobI32Ctor: new Int32Array(),
    });
    expect(blobs.blobDef.byteLength).toEqual(2);
    expect(blobs.blobInst.byteLength).toEqual(3);
});

test('Blobs limits', () => {
    expect(() =>
        type(Blobs).new({
            ...blobsInit,
            blobOpt: new ArrayBuffer(1024 * 1024 + 1),
        }),
    ).toThrow('Blobs.blobOpt should be less than 1048576');
    expect(() =>
        type(Blobs).new({
            ...blobsInit,
            blobI32Const: new Int32Array(1024 * 256 + 1),
        }),
    ).toThrow('Blobs.blobI32Const should be less than 1048576');
});

test('Blobs undefined/null', () => {
    expect(() =>
        type(Blobs).new({
            ...blobsInit,
            // @ts-expect-error
            blob: undefined,
        }),
    ).toThrow('Field "Blobs.blob" can not be null or undefined');
    expect(() =>
        type(Blobs).new({
            ...blobsInit,
            // @ts-expect-error
            blobU8Ctor: undefined,
        }),
    ).toThrow('Field "Blobs.blobU8Ctor" can not be null or undefined');
});

export class Blobs {
    blob = type.Blob();
    blobDef = type.Blob().default(() => new ArrayBuffer(2));
    blobOpt = type.Blob().optional();
    blobMay = type.Blob().maybe();
    blobConst = type.Blob().readonly();
    blobInst = new ArrayBuffer(3);
    blobCtor = ArrayBuffer;

    blobU8 = type.Blob(Uint8Array);
    blobU8Def = type.Blob(Uint8Array).default(() => new Uint8Array(4));
    blobU8Opt = type.Blob(Uint8Array).optional();
    blobU8May = type.Blob(Uint8Array).maybe();
    blobU8Const = type.Blob(Uint8Array).readonly();
    blobU8Inst = new Uint8Array(5);
    blobU8Ctor = Uint8Array;

    blobI32 = type.Blob(Int32Array);
    blobI32Def = type.Blob(Int32Array).default(() => new Int32Array(6));
    blobI32Opt = type.Blob(Int32Array).optional();
    blobI32May = type.Blob(Int32Array).maybe();
    blobI32Const = type.Blob(Int32Array).readonly();
    blobI32Inst = new Int32Array(7);
    blobI32Ctor = Int32Array;
}

export interface IBlobs {
    blob: ArrayBuffer;
    blobDef?: ArrayBuffer;
    blobOpt?: ArrayBuffer;
    blobMay: ArrayBuffer | undefined | null;
    blobConst: ArrayBuffer;
    blobInst?: ArrayBuffer;
    blobCtor: ArrayBuffer;

    blobU8: Uint8Array;
    blobU8Def?: Uint8Array;
    blobU8Opt?: Uint8Array;
    blobU8May: Uint8Array | undefined | null;
    blobU8Const: Uint8Array;
    blobU8Inst?: Uint8Array;
    blobU8Ctor: Uint8Array;

    blobI32: Int32Array;
    blobI32Def?: Int32Array;
    blobI32Opt?: Int32Array;
    blobI32May: Int32Array | undefined | null;
    blobI32Const: Int32Array;
    blobI32Inst?: Int32Array;
    blobI32Ctor: Int32Array;
}
assignTest<type.Initial<Blobs>>(__ as IBlobs);
assignTest<IBlobs>(__ as type.Initial<Blobs>);
expectTypeOf<type.Initial<Blobs>>().toEqualTypeOf<IBlobs>();

export interface PBlobs {
    blob: ArrayBuffer;
    blobDef: ArrayBuffer;
    blobOpt: ArrayBuffer | undefined;
    blobMay: ArrayBuffer | undefined | null;
    readonly blobConst: ArrayBuffer;
    blobInst: ArrayBuffer;
    blobCtor: ArrayBuffer;

    blobU8: Uint8Array;
    blobU8Def: Uint8Array;
    blobU8Opt: Uint8Array | undefined;
    blobU8May: Uint8Array | undefined | null;
    readonly blobU8Const: Uint8Array;
    blobU8Inst: Uint8Array;
    blobU8Ctor: Uint8Array;

    blobI32: Int32Array;
    blobI32Def: Int32Array;
    blobI32Opt: Int32Array | undefined;
    blobI32May: Int32Array | undefined | null;
    readonly blobI32Const: Int32Array;
    blobI32Inst: Int32Array;
    blobI32Ctor: Int32Array;
}
assignTest<type.Plain<Blobs>>(__ as PBlobs);
assignTest<PBlobs>(__ as type.Plain<Blobs>);
expectTypeOf<type.Plain<Blobs>>().toEqualTypeOf<PBlobs>();
