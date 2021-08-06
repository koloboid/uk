Schema declaration:

```typescript
class MySchema {
    i8 = type.Int8();       // integer from -128 to 127
    i16 = type.Int16();     // integer from - to
    i32 = type.Int32();     // integer from - to
    i54 = type.Int();       // JS-like integer, 54bit (include sign bit)
    i64 = type.Int64();     // BigInt from - to
    u8 = type.UInt8();      // integer from 0 to 255
    u16 = type.UInt16();    // integer from 0 to 65535
    u32 = type.UInt32();    // integer from 0 to
    u53 = type.UInt();      // JS-like integer, from 0 to Number.MAX_SAFE_INTEGER
    u64 = type.UInt64();    // BigInt from 0 to

    big = type.BigInt();    // BigInt
    bigDefault = 0n;        // BigInt defaults to 0n

    float = type.Float();   // Floating point number (double)
    floatDef = 0;           // Floating point, defaults to 0
    floatCtor = Number;     // Floating point number (double)

    str = type.String();    // String, up to 4096 chars
    strDef = "abcd";        // String, up to 4096 chars, defaults to "abcd"
    strCtor = String;       // String, up to 4096 chars
    text = type.Text();     // Text, up to 256K chars

    bool = type.Boolean();  // Boolean
    boolDef = false;        // Boolean, defaults to false
    boolCtor = Boolean;     // Boolean

    date = type.Date();             // Date, without time
    dateTime = type.DateTime();     // Date with time
    dateTimeCtor = Date;            // Date with time
    dateTimeDef = new Date(2021);   // Date with time, defaults to 2021-01-01 00:00:00

    objId = type.MongoID();         // BSON ObjectId
    objIdCtor = ObjectId;           // BSON ObjectId
    objIdDef = new ObjectId();      // BSON ObjectId, same as type.MongoID().default(()=> new ObjectID());

    uuid = type.UUID();             // UUID string

    blob = type.Blob();                 // ArrayBuffer
    blobCtor = ArrayBuffer;             // ArrayBuffer
    blobDef = new ArrayBuffer(1024);    // ArrayBuffer, same as type.Blob().default(()=> new ArrayBuffer(1024))
    blobView8 = Uint8Array;             // Uint8Array
    blobView8 = new Uint8Array(256);    // Uint8Array, same as type.Blob(Uint8Array).default(()=> new Uint8Array(1024))
    blobView16 = Uint16Array;           // Uint16Array
    blobView16 = new Uint16Array(256);  // Uint16Array, defaults to new Uint16Array, 512 bytes long

    obj = type.Object(AnotherSchema);   // Embedded object, described by AnotherSchema class
    objCtor = AnotherSchema;            // Embedded object, described by AnotherSchema class
    objInst = new AnotherSchema();      // Embedded object, described by AnotherSchema class
    objLit = {                          // Embedded object, with fields:
        foo: Number,                    // foo: number (i.e. type.Float())
        bar: type.UUID(),               // bar: string (i.e. type.UUID())
    }

    hash = type.Hash(type.Date());      // Hash { [key: string]: Date } i.e. Date without time
    hashNum = type.Hash('number', Date);// Hash { [key: number]: Date } i.e. Date with time

    array = type.Array(type.Text());    // Array of strings (i.e. Texts)
    arrayShort = [AnotherSchema];       // Array of objects described by AnotherSchema class, defaults to []

    // Tuple [number, string, {...AnotherSchema...}]
    tuple = type.Tuple(type.Int(), String, AnotherSchema);
    // Tuple [ObjectId, Date, number] - array size must be greater than 1
    tupleShort = [type.MongoID(), Date, 5);

    // Reference to AnotherSchema model, be the same type as AnotherShema field marked as PRIMARY
    one = type.One(AnotherSchema);
    // Reference to AnotherSchema model, be the same type as AnotherShema.someForeignKey field
    oneFld = type.One(AnotherSchema, 'someForeignKey');

    // Array of references to AnotherSchema model, be the same type as AnotherShema field marked as PRIMARY
    many = type.Many(AnotherSchema);
    // Array of references to AnotherSchema model, be the same type as AnotherShema.someForeignKey field
    manyFld = type.Many(AnotherSchema, 'someForeignKey');

    opt = type.Opt(String); // Make optional string field
}
```

Field modifiers:

```typescript
class FieldKindAndFlags {
    ordinary = type.Int();                  // Required number
    ordUndef = type.Int().undefinable();    // Required number | undefined
    ordNull = type.Int().nullable();        // Required number | null
    ordReadonly = type.Int().readonly();    // Required, readonly after construct
    ordPrimary = type.Int().primary();      // Required, readonly after construct

    def = type.Int().default(10);           // Not required, sets to 10 if not defined
    defFunc = type.Int().default(() => Math.random() * 10); // Not required, sets to random if not defined

    opt = type.Int().optional();            // Not required, can be undefined

    // Required number | null | undefined. Same as Int().undefinable().nullable()
    ordNullUndef = type.Int().maybe();
    // Not required, non-undefined, will be assigned by third-party (autoincrement)
    auto = type.Int().auto();
    // Can use all of theese: { readonly mix?: number | undefined | null }, will set to 4 if not defined
    mix = type.Int().optional().undefinable().nullable().maybe().default(4).primary().readonly();
}
```
