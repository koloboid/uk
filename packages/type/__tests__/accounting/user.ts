import { expectTypeOf } from 'expect-type';
import { User, type } from './models';

interface IAtBy {
    at?: Date | undefined;
    by: type.MongoID;
}

interface IBase {
    _id?: type.MongoID;
    company: type.MongoID;
    created: IAtBy;
    updated?: IAtBy;
    deleted?: IAtBy;
}

interface IUser extends IBase {
    married: boolean;
    group: type.MongoID;
    name: {
        first: string;
        last: string;
        mid?: string | undefined;
    };
    tags: type.MongoID[];
    friends: type.MongoID[];
}

interface PAtBy {
    at: Date;
    by: type.MongoID;
}

interface PBase {
    readonly _id: type.MongoID;
    company: type.MongoID;
    created: PAtBy;
    updated: PAtBy | undefined;
    deleted: PAtBy | undefined;
}

interface PUser extends PBase {
    married: boolean;
    group: type.MongoID;
    name: {
        first: string;
        last: string;
        mid: string | undefined;
    };
    tags: type.MongoID[];
    friends: type.MongoID[];
}

const userInit: type.Initial<User> = {
    _id: type.MongoID.zero(),
    company: type.MongoID.zero(),
    married: false,
    group: type.MongoID.zero(),
    name: {
        first: 'John',
        last: 'Doe',
    },
    tags: [],
    friends: [],
    created: {
        by: type.MongoID.zero(),
    },
    updated: {
        by: type.MongoID.zero(),
    },
};

function checkType<T>(t: T) {}
const _: any = undefined;

test('User model', () => {
    checkType<IUser>(userInit);
    checkType<typeof userInit>(_ as IUser);
    expectTypeOf(userInit).toEqualTypeOf<IUser>();

    expect(type(User).toString('full')).toMatch(`[Shape of User]:
    _id: MongoID [HASDEFAULT, PRIMARY, READONLY]
    company: One [ORDINARY]
    created: Object [ORDINARY]
      created.at: DateTime [HASDEFAULT]
      created.by: One [ORDINARY]
    updated: Object [OPTIONAL]
      updated.at: DateTime [HASDEFAULT]
      updated.by: One [ORDINARY]
    deleted: Object [OPTIONAL]
      deleted.at: DateTime [HASDEFAULT]
      deleted.by: One [ORDINARY]
    name: Object [ORDINARY]
      name.first: String [ORDINARY]
      name.last: String [ORDINARY]
      name.mid: String [OPTIONAL]
    married: Boolean [ORDINARY]
    group: One [ORDINARY]
    tags: Many [ORDINARY]`);

    const userPlain = type(User).new(userInit);
    checkType<PUser>(userPlain);
    checkType<typeof userPlain>(_ as PUser);
    expectTypeOf(userPlain).toEqualTypeOf<PUser>();
    expectTypeOf(_ as type.Plain<User>).toEqualTypeOf<PUser>();
    expect(userPlain).toEqual({
        _id: type.MongoID.zero(),
        company: type.MongoID.zero(),
        group: type.MongoID.zero(),
        deleted: undefined,
        friends: [],
        married: false,
        tags: [],
        created: {
            by: type.MongoID.zero(),
            at: new Date(0),
        },
        updated: {
            by: type.MongoID.zero(),
            at: new Date(0),
        },
        name: {
            first: 'John',
            last: 'Doe',
            mid: undefined,
        },
    });

    const userOverride = type(User).new({
        ...userInit,
        deleted: {
            at: new Date(1),
            by: type.MongoID.zero(),
        },
    });

    expectTypeOf<never>().toEqualTypeOf<type.Filter.FieldsByType<User, number>>();
    expectTypeOf<'created.at' | 'updated.at' | 'deleted.at'>().toEqualTypeOf<type.Filter.FieldsByType<User, Date>>();
    expectTypeOf<'created.at' | 'updated.at' | 'deleted.at' | 'married'>().toEqualTypeOf<
        type.Filter.FieldsByType<User, Date | boolean>
    >();
});
