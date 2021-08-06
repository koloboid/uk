import { ObjectID } from 'bson';
import { type } from '../../src';

export class Scalars {
    int = type.Int();
    intDef = type.Int().default(() => 5);
    intOpt = type.Int().optional();

    bigInt = type.BigInt();
    bigIntDef = type.BigInt().default(() => 5n);
    bigIntOpt = type.BigInt().optional();
    bigIntShortDef = 7n;
    bigIntShort = BigInt;

    float = type.Float();
    floatDef = type.Float().default(() => 5.5);
    floatOpt = type.Float().optional();
    floatShortDef = 7;
    floatShort = Number;

    string = type.String();
    stringDef = type.String().default(() => '');
    stringOpt = type.String().optional();
    stringShortDef = '';
    stringShort = String;

    boolean = type.Boolean();
    booleanDef = type.Boolean().default(() => true);
    booleanOpt = type.Boolean().optional();
    booleanShortDef = false;
    booleanShort = Boolean;

    date = type.Date();
    dateDef = type.Date().default(() => new Date());
    dateOpt = type.Date().optional();
    dateShortDef = new Date();
    dateShort = Date;

    uuid = type.UUID();
    uuidDef = type.UUID().default(() => '');
    uuidOpt = type.UUID().optional();

    mongoId = type.MongoID();
    mongoIdDef = type.MongoID().default(() => new ObjectID());
    mongoIdOpt = type.MongoID().optional();
    mongoIdShortDef = new ObjectID();
    mongoIdShort = ObjectID;

    blob = type.Blob();
    blobDef = type.Blob().default(() => new Uint8Array());
    blobOpt = type.Blob().optional();
    blobShortNeverUint8 = new Uint8Array();
    blobShortNeverArray = new ArrayBuffer(0);
    blobShort1 = Uint8Array;
    blobShort2 = ArrayBuffer;
}

export class Object1 extends Scalars {
    oneObject2 = type.One(Object2, 'id');
    oneObject2Opt = type.One(Object2, 'id').optional();
    oneObject2Def = type.One(Object2, 'id').default(() => '');

    manyObject2 = type.Many(Object2, 'id');
    manyObject2Opt = type.Many(Object2, 'id').optional();
    manyObject2Def = type.Many(Object2, 'id').default(() => ['']);

    object2 = type.Object(Object2);
    object2Opt = type.Object(Object2).optional();
    object2Def = type.Object(Object2).default(() => ({} as any));
    object2Short = Object2;

    hashObject2 = type.Hash(Object2);
    hashObject2Fld = type.Hash(type.Object(Object2));
    hashObject2Opt = type.Hash(type.Object(Object2).optional());
    hashScalars = type.Hash(Scalars);
    hashInt = type.Hash(type.Int());
    hashIntOpt = type.Hash(type.Int().optional());
    hashIntDef = type.Hash(type.Int().default(() => 5));
    hashFloatShort = type.Hash(Number);
    hashFloatDate = type.Hash(Date);

    optHashObject2 = type.Hash(Object2).optional();
    optHashObject2Fld = type.Hash(type.Object(Object2)).optional();
    optHashObject2Opt = type.Hash(type.Object(Object2).optional()).optional();
    optHashScalars = type.Hash(Scalars).optional();
    optHashInt = type.Hash(type.Int()).optional();
    optHashIntOpt = type.Hash(type.Int().optional()).optional();
    optHashIntDef = type.Hash(type.Int().default(() => 5)).optional();
    optHashFloatShort = type.Hash(Number).optional();
    optHashFloatDate = type.Hash(Date).optional();

    arrayObject2 = type.Array(Object2);
    arrayInt = type.Array(type.Int());
    arrayFloatShort = type.Array(Number);
    arrayHashScalars = type.Array(type.Hash(Scalars));
    arrayHashBooleans = type.Array(type.Hash(Boolean));
    arrayObject2Short = [Object2];
    arrayShortFloatShort = [Number];
    arrayShortHashScalars = [type.Hash(Scalars)];
    arrayShortHashBooleans = [type.Hash(Boolean)];

    optArrayObject2 = type.Array(Object2).optional();
    optArrayInt = type.Array(type.Int()).optional();
    optArrayFloatShort = type.Array(Number).optional();
    optArrayHashScalars = type.Array(type.Hash(Scalars)).optional();
    optArrayHashBooleans = type.Array(type.Hash(Boolean)).optional();
}

export class Object2 extends Scalars {
    id = type.UUID();

    oneObject3 = type.One(Object3, 'id');
    oneObject3Opt = type.One(Object3, 'id').optional();
    oneObject3Def = type.One(Object3, 'id').default(() => new ObjectID());

    manyObject3 = type.Many(Object3, 'id');
    manyObject3Opt = type.Many(Object3, 'id').optional();
    manyObject3Def = type.Many(Object3, 'id').default(() => [new ObjectID()]);

    object3 = type.Object(Object3);
    object3Opt = type.Object(Object3).optional();
    object3Def = type.Object(Object3).default(() => ({} as any));
    object3Short = Object3;

    hashObject3 = type.Hash(Object3);
    hashObject3Fld = type.Hash(type.Object(Object3));
    hashObject3Opt = type.Hash(type.Object(Object3).optional());
    hashInt = type.Hash(type.Int());
    hashScalars = type.Hash(Scalars);
    hashIntOpt = type.Hash(type.Int().optional());
    hashIntDef = type.Hash(type.Int().default(() => 5));
    hashFloatShort = type.Hash(Number);
    hashFloatDate = type.Hash(Date);

    optHashObject3 = type.Hash(Object3).optional();
    optHashObject3Fld = type.Hash(type.Object(Object3)).optional();
    optHashObject3Opt = type.Hash(type.Object(Object3).optional()).optional();
    optHashScalars = type.Hash(Scalars).optional();
    optHashInt = type.Hash(type.Int()).optional();
    optHashIntOpt = type.Hash(type.Int().optional()).optional();
    optHashIntDef = type.Hash(type.Int().default(() => 5)).optional();
    optHashFloatShort = type.Hash(Number).optional();
    optHashFloatDate = type.Hash(Date).optional();

    arrayObject3 = type.Array(Object3);
    arrayInt = type.Array(type.Int());
    arrayFloatShort = type.Array(Number);
    arrayHashScalars = type.Array(type.Hash(Scalars));
    arrayHashBooleans = type.Array(type.Hash(Boolean));
    arrayObject3Short = [Object3];
    arrayShortFloatShort = [Number];
    arrayShortHashScalars = [type.Hash(Scalars)];
    arrayShortHashBooleans = [type.Hash(Boolean)];

    optArrayObject3 = type.Array(Object3).optional();
    optArrayInt = type.Array(type.Int()).optional();
    optArrayFloatShort = type.Array(Number).optional();
    optArrayHashScalars = type.Array(type.Hash(Scalars)).optional();
    optArrayHashBooleans = type.Array(type.Hash(Boolean)).optional();
}

export class Object3 {
    id = type.MongoID();
}
