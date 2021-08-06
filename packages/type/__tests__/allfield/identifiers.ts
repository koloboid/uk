import { type, __, assignTest, expectTypeOf, ObjectID } from './stuff';

test('Identifiers shape', () => {
    expect(type(Identifiers).toString('full')).toMatch(`[Shape of Identifiers]:
  uuid: UUID [ORDINARY]
  uuidDef: UUID [HASDEFAULT]
  uuidOpt: UUID [OPTIONAL]
  uuidMay: UUID [ORDINARY, UNDEFINABLE, NULLABLE]
  uuidConst: UUID [ORDINARY, READONLY]
  objid: MongoID [ORDINARY]
  objidDef: MongoID [HASDEFAULT]
  objidOpt: MongoID [OPTIONAL]
  objidMay: MongoID [ORDINARY, UNDEFINABLE, NULLABLE]
  objidConst: MongoID [ORDINARY, READONLY]
  objidInst: MongoID [HASDEFAULT]
  objidCtor: MongoID [ORDINARY]`);
});

export const idInit: type.Initial<Identifiers> = {
    uuid: type.UUID.create(),
    uuidMay: null,
    uuidConst: type.UUID.create(),

    objid: type.MongoID.zero(),
    objidMay: undefined,
    objidConst: type.MongoID.create(),
    objidCtor: type.MongoID.create(),
};

test('Identifiers invalid UUID', () => {
    expect(() => type(Identifiers).new({ ...idInit, uuid: '' })).toThrow(
        'Identifiers.uuid should be valid UUID, "" is not',
    );
});

test('Identifiers new', () => {
    const ids = type(Identifiers).new(idInit);
    expect(ids).toStrictEqual({
        uuid: idInit.uuid,
        uuidMay: null,
        uuidDef: uuidDef,
        uuidOpt: undefined,
        uuidConst: idInit.uuidConst,

        objid: type.MongoID.zero(),
        objidMay: undefined,
        objidOpt: undefined,
        objidDef: objidDef,
        objidInst: objidDef,
        objidConst: idInit.objidConst,
        objidCtor: idInit.objidCtor,
    });
});

test('Identifiers undefined/null', () => {
    expect(() =>
        type(Identifiers).new({
            ...idInit,
            // @ts-expect-error
            uuid: undefined,
        }),
    ).toThrow('Field "Identifiers.uuid" can not be null or undefined');
});

const uuidDef = type.UUID.create();
const objidDef = type.MongoID.create();

export class Identifiers {
    uuid = type.UUID();
    uuidDef = type.UUID().default(() => uuidDef);
    uuidOpt = type.UUID().optional();
    uuidMay = type.UUID().maybe();
    uuidConst = type.UUID().readonly();

    objid = type.MongoID();
    objidDef = type.MongoID().default(() => objidDef);
    objidOpt = type.MongoID().optional();
    objidMay = type.MongoID().maybe();
    objidConst = type.MongoID().readonly();
    objidInst = objidDef;
    objidCtor = ObjectID;
}

export interface IIdentifiers {
    uuid: string;
    uuidDef?: string;
    uuidOpt?: string;
    uuidMay: string | undefined | null;
    uuidConst: string;

    objid: ObjectID;
    objidDef?: ObjectID;
    objidOpt?: ObjectID;
    objidMay: ObjectID | undefined | null;
    objidConst: ObjectID;
    objidInst?: ObjectID;
    objidCtor: ObjectID;
}

assignTest<type.Initial<Identifiers>>(__ as IIdentifiers);
assignTest<IIdentifiers>(__ as type.Initial<Identifiers>);
expectTypeOf<type.Initial<Identifiers>>().toEqualTypeOf<IIdentifiers>();

export interface PIdentifiers {
    uuid: string;
    uuidDef: string;
    uuidOpt: string | undefined;
    uuidMay: string | undefined | null;
    readonly uuidConst: string;

    objid: ObjectID;
    objidDef: ObjectID;
    objidOpt: ObjectID | undefined;
    objidMay: ObjectID | undefined | null;
    readonly objidConst: ObjectID;
    objidInst: ObjectID;
    objidCtor: ObjectID;
}

assignTest<type.Plain<Identifiers>>(__ as PIdentifiers);
assignTest<PIdentifiers>(__ as type.Plain<Identifiers>);
expectTypeOf<type.Plain<Identifiers>>().toEqualTypeOf<PIdentifiers>();
