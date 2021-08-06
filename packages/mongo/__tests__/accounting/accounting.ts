import { expectTypeOf } from 'expect-type';
import type from '@uk/type';
import { client } from './stuff/client';
import { TCompany, TUser, TUserGroup, TestDateNow, User } from './stuff/model';
import ObjectId from 'bson-objectid';

const zeroId = type.MongoID.zero();

beforeAll(async () => {
    await client.connect();
});

afterAll(async () => {
    await client.close();
});

describe('@uk/mongo accounting test', () => {
    describe('Cleanup test', cleanupTest);
    describe('Insert test', insertTest);
    describe('Insert test', insertTest);
    describe('Select test', selectTest);
});

function cleanupTest() {
    test('Test forbid deletion with empty where clause', async () => {
        await expect(TCompany.delete({})).rejects.toThrowError(
            'removeMany with empty where clause is forbidden: undefined',
        );
    });

    test('Test delete all data from collections', async () => {
        await expect(TCompany.delete({}, 'YES_I_WANT_REMOVE_ALL')).resolves.toBeTruthy();
        await expect(TUser.delete({}, 'YES_I_WANT_REMOVE_ALL')).resolves.toBeTruthy();
        await expect(TUserGroup.delete({}, 'YES_I_WANT_REMOVE_ALL')).resolves.toBeTruthy();
    });

    test('Test database is empty', async () => {
        expect(await TUser.select('_id').exists()).toBe(false);
        expect(await TCompany.select().notExists()).toBe(true);
        expect(await TUserGroup.select().count()).toBe(0);
    });
}

const users = [] as ObjectId[];

function insertTest() {
    test('Insert documents', async () => {
        const companyId = type.MongoID.create();
        const [company, opComp] = await TCompany.insert({
            _id: companyId,
            created: {
                by: zeroId,
            },
            company: zeroId,
            name: 'RootCompany',
        });
        expect(company).toStrictEqual({
            _id: companyId,
            created: {
                by: zeroId,
                at: TestDateNow,
            },
            company: zeroId,
            name: 'RootCompany',
        });

        const [group, opGroup] = await TUserGroup.insert({
            company: company._id,
            created: {
                at: TestDateNow,
                by: zeroId,
            },
            name: 'RootGroup',
            description: 'Uk Test User Group',
            someObjs: [
                {
                    bar: 0,
                    foo: 'a',
                },
                {
                    bar: 1,
                    foo: 'b',
                },
            ],
        });
        expect(group).toMatchObject({
            company: company._id,
            created: {},
            name: 'RootGroup',
            description: 'Uk Test User Group',
        });
        expect(type.MongoID.isValid(group._id)).toBeTruthy();

        const [user, opUser] = await TUser.insert({
            company: company._id,
            created: {
                by: zeroId,
            },
            friends: [],
            married: false,
            group: group._id,
            name: {
                first: 'Root',
                last: 'Toor',
                mid: 'MidName',
            },
            tags: [],
        });
        users.push(user._id);
        expect(user).toMatchObject({
            company: company._id,
            created: {},
            friends: [],
            group: group._id,
            name: {
                first: 'Root',
                last: 'Toor',
                mid: 'MidName',
            },
            tags: [],
        });
        expect(type.MongoID.isValid(user._id)).toBeTruthy();
    });
}

function checkType<T>(t: T) {}
const _: any = undefined;

function selectTest() {
    test('Select empty', async () => {
        type Rv = { _id: type.MongoID };
        const users = await TUser.select().asArray();
        checkType<Rv[]>(users);
        checkType<typeof users>(_ as Rv[]);
        expectTypeOf(users).toEqualTypeOf<Rv[]>();
        expect(users).toHaveLength(2);
        //        expect(users).toMatchObject(users.map(_id => ({ _id })));
    });
    test('Select all', async () => {
        type Rv = type<User>;
        const users = await TUser.select('*').asArray();
        checkType<Rv[]>(users);
        checkType<typeof users>(_ as Rv[]);
        // expectTypeOf(users[0]).toEqualTypeOf<Rv>(); TODO: readonly disappear
        expect(users).toHaveLength(2);
        console.log(users);
        //        expect(users).toMatchObject(users.map(_id => ({ _id })));
    });
    test('Select some', async () => {
        type Rv = type.Select<User, 'company' | 'created.at' | 'name.last'>;
        const users = await TUser.select('company', 'created.at', 'name.last').asArray();
        checkType<Rv[]>(users);
        checkType<typeof users>(_ as Rv[]);
        // expectTypeOf(users[0]).toEqualTypeOf<Rv>(); TODO: readonly disappear
        expect(users).toHaveLength(2);
        console.log(users);
        //        expect(users).toMatchObject(users.map(_id => ({ _id })));
    });
    test('Select join', async () => {
        type J = type.Joined<User>;
        type Rv = { name: { last: string }; company: { name: string }; created: { at: Date } };
        const users = await TUser.select('created.at', 'name.last').join('company', 'name', 'updated.at').asArray();
        checkType<Rv[]>(users);
        checkType<typeof users>(_ as Rv[]);
        // expectTypeOf(users[0]).toEqualTypeOf<Rv>(); TODO: readonly disappear
        expect(users).toHaveLength(2);
        console.log(users);
        //        expect(users).toMatchObject(users.map(_id => ({ _id })));
    });
}

function updateTest() {
    test('Update empty', async () => {
        type Rv = { _id: type.MongoID };
        const [users] = await TUser.update({
            company: zeroId,
        })
/*            .set({
                created: {
                    by: zeroId,
                },
            })
            .inc('created.at', 2)
            .inc({ 'updated.at': 1 })
            .addToSet('tags', zeroId, zeroId, zeroId)
            .pull('friends', {
                $eq: zeroId,
            })
            .pull('tags', zeroId)
            .push('tags', zeroId)
            .push('friends', zeroId)*/
            .one('name.first', 'name.last');
        checkType<Rv[] |null>(users);
        checkType<typeof users>(_ as Rv[]);
        expectTypeOf(users).toEqualTypeOf<Rv[]>();
        expect(users).toHaveLength(2);
        //        expect(users).toMatchObject(users.map(_id => ({ _id })));
    });
}
