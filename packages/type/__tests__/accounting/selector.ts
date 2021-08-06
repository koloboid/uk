import { expectTypeOf } from 'expect-type';
import { User, type } from './models';

function checkType<T>(t: T) {}
const _: any = undefined;

test('Field kinds and flags', () => {
    type U = type.Plain<User>;

    type U1 = type.Compute<type<User, "_id" | "deleted.by">>;
    type U2 = type<User>;

    let t: U1;

    expectTypeOf<type.Selector<U, '_id'>>(_ as { _id: type.MongoID });
    expectTypeOf<type.Selector<type<User>, '_id'>>(_ as { _id: type.MongoID });
    expectTypeOf<type.Select<U, '_id'>>(_ as { _id: type.MongoID });
    expectTypeOf<type.Select<User, '_id'>>(_ as { _id: type.MongoID });
});
