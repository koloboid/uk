export class BinStream<
    TSource extends ArrayBuffer | DataView | SharedArrayBuffer = ArrayBuffer | DataView | SharedArrayBuffer,
> {
    readonly view;

    #isLE = false;
    #pos = 0;

    constructor(readonly source: TSource, readonly endian: 'BE' | 'LE' = 'LE') {
        const from: any = source;
        this.view = from instanceof DataView ? from : 'buffer' in from ? new DataView(from.buffer) : new DataView(from);
        this.#isLE = endian === 'LE';
    }

    get pos() {
        return this.#pos;
    }

    get eof() {
        return this.#pos >= this.source.byteLength;
    }

    seek(to: number): this {
        this.#pos = to;
        return this;
    }

    slice(size: number) {
        return new BinStream(new DataView(this.view.buffer, this.pos, size));
    }

    readBuf(len: number) {
        return this.view.buffer.slice(this.#pos, (this.#pos += len));
    }

    readUInt8() {
        return this.view.getUint8(this.#pos++);
    }

    readUInt16() {
        const rv = this.view.getUint16(this.#pos, this.#isLE);
        this.#pos += 2;
        return rv;
    }

    readUInt32() {
        const rv = this.view.getUint32(this.#pos, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    readUInt64() {
        const rv = this.view.getBigUint64(this.#pos, this.#isLE);
        this.#pos += 8;
        return rv;
    }

    readInt8() {
        return this.view.getUint8(this.#pos++);
    }

    readInt16() {
        const rv = this.view.getUint16(this.#pos, this.#isLE);
        this.#pos += 2;
        return rv;
    }

    readInt32() {
        const rv = this.view.getUint32(this.#pos, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    readInt64() {
        const rv = this.view.getBigInt64(this.#pos, this.#isLE);
        this.#pos += 8;
        return rv;
    }

    readFloat32() {
        const rv = this.view.getFloat32(this.#pos, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    readFloat64() {
        const rv = this.view.getFloat64(this.#pos, this.#isLE);
        this.#pos += 8;
        return rv;
    }

    writeUInt8(val: number) {
        return this.view.setUint8(this.#pos++, val);
    }

    writeUInt16(val: number) {
        const rv = this.view.setUint16(this.#pos, val, this.#isLE);
        this.#pos += 2;
        return rv;
    }

    writeUInt32(val: number) {
        const rv = this.view.setUint32(this.#pos, val, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    writeUInt64(val: bigint | number) {
        const rv = this.view.setBigUint64(this.#pos, BigInt(val), this.#isLE);
        this.#pos += 8;
        return rv;
    }

    writeInt8(val: number) {
        return this.view.setInt8(this.#pos++, val);
    }

    writeInt16(val: number) {
        const rv = this.view.setInt16(this.#pos, val, this.#isLE);
        this.#pos += 2;
        return rv;
    }

    writeInt32(val: number) {
        const rv = this.view.setInt32(this.#pos, val, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    writeInt64(val: bigint | number) {
        const rv = this.view.setBigInt64(this.#pos, BigInt(val), this.#isLE);
        this.#pos += 8;
        return rv;
    }

    writeFloat32(val: number) {
        const rv = this.view.setFloat32(this.#pos, val, this.#isLE);
        this.#pos += 4;
        return rv;
    }

    writeFloat64(val: number) {
        const rv = this.view.setFloat64(this.#pos, val, this.#isLE);
        this.#pos += 8;
        return rv;
    }

    writeBuf(val: ArrayBuffer | DataView | SharedArrayBuffer) {
        const dv = val instanceof DataView ? val : new DataView(val);
        let i = 0;
        for (; i < val.byteLength; i += 4) {
            this.view.setUint32(this.#pos, dv.getUint32(i));
            this.#pos += 4;
        }
        if (val.byteLength % 4 !== 0) {
            for (; i < val.byteLength; i++) {
                this.view.setUint8(this.#pos++, dv.getUint32(i));
            }
        }
    }
}
