import { type, __, assignTest, expectTypeOf, ObjectID } from './stuff';

export class Hashes {
    hash = type.Hash({ id: type.MongoID() });
    hashOpt = type.Hash(type.Int()).optional();
    hashDef = type.Hash([Date]).default(() => ({}));
    hashMay = type.Hash(type.Hash(type.Array(ObjectID))).maybe();
    hashConst = type
        .Hash(
            class {
                foo = type.Boolean();
                bar = 4;
            },
        )
        .readonly();

    hashNum = type.Hash('number', { id: ObjectID });
    hashNumOpt = type.Hash('number', type.Int()).optional();
    hashNumDef = type.Hash('number', [Date]).default(() => ({}));
    hashNumMay = type.Hash('number', type.Hash(type.Array(ObjectID))).maybe();
    hashNumConst = type
        .Hash(
            'number',
            class {
                foo = type.Boolean();
                bar = 4;
            },
        )
        .readonly();
}

export interface IHashes {
    hash: { [x: string]: { id: ObjectID } };
    hashOpt?: { [key: string]: number };
    hashDef?: { [key: string]: Date[] };
    hashMay: { [key: string]: { [key: string]: ObjectID[] } } | undefined | null;
    hashConst: { [key: string]: { foo: boolean; bar?: number } };

    hashNum: { [key: number]: { id: ObjectID } };
    hashNumOpt?: { [key: number]: number };
    hashNumDef?: { [key: number]: Date[] };
    hashNumMay: { [key: number]: { [key: string]: ObjectID[] } } | undefined | null;
    hashNumConst: { [key: number]: { foo: boolean; bar?: number } };
}

assignTest<type.Initial<Hashes>>(__ as IHashes);
assignTest<IHashes>(__ as type.Initial<Hashes>);
expectTypeOf<type.Initial<Hashes>>().toMatchTypeOf<IHashes>();
