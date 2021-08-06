import { type } from '../../src';
import { expectType } from 'tsd';
import { Object1 } from './models';
import { ObjectID } from 'bson';
import { FK } from './common';

declare const joinedObject1: type.Joined<Object1>;
// declare const joinedKeys: type.Path.Keys<typeof joinedObject1>;

// joinedKeys === 'manyObject2.hashObject3';

class Base {
    _id = type.MongoID().primary();
    company = type.One(Company, '_id');
    createdAt = type.DateTime();
    createdBy = type.One(User, '_id');
    updatedAt = type.DateTime().optional();
    updatedBy = type.One(User, '_id').optional();
}

class User extends Base {
    groups = type.Array(type.One(Group, '_id'));

    name = {
        first: String,
        last: String,
    };
    blocked = type
        .Object({
            at: Date,
            by: type.One(User, '_id'),
        })
        .optional();
    birthday = type.Date().optional();
    address = Address;
    location = type.Object(Location).optional();
}

class Address {
    city = String;
    street = String;
}

class Location {
    lat = Number;
    lng = Number;
}

class Group extends Base {
    name = String;
    description = type.String().optional();
}

class Company extends Base {
    name = type.String();
    address = type.Object(Address);
    location = type.Object(Location).optional();
}

////// Plain //////

interface PBase {
    _id: ObjectID;
    company: ObjectID;
    createdAt: Date;
    createdBy: ObjectID;
    updatedAt: Date | undefined;
    updatedBy: ObjectID | undefined;
}

interface PAddress {
    city: string;
    street: string;
}

interface PLocation {
    lat: number;
    lng: number;
}

interface PUser extends PBase {
    groups: ObjectID[];
    name: { first: string; last: string };
    blocked: { at: Date; by: ObjectID } | undefined;
    birthday: Date | undefined;
    address: PAddress;
    location: PLocation | undefined;
}

declare const plainUser: type.Plain<User>;
expectType<typeof plainUser>({} as PUser);
expectType<PUser>(plainUser);

////// Initial //////

interface IBase {
    _id: ObjectID;
    company: ObjectID;
    createdAt: Date;
    createdBy: ObjectID;
    updatedAt?: Date;
    updatedBy?: ObjectID;
}

interface IAddress {
    city: string;
    street: string;
}

interface IUser extends IBase {
    groups: ObjectID[];
    name: { first: string; last: string };
    blocked?: { at: Date; by: ObjectID };
    birthday?: Date | undefined;
    address: IAddress;
}

declare const initUser: type.Initial<User>;
expectType<typeof initUser>({} as IUser);
expectType<IUser>(initUser);

////// Joined //////

interface JBase {
    _id: ObjectID;
    company: FK<JCompany, ObjectID>;
    createdAt: Date;
    createdBy: FK<JUser, ObjectID>;
    updatedAt: Date | undefined;
    updatedBy: FK<JUser, ObjectID> | undefined;
}

interface JAddress {
    city: string;
    street: string;
}

interface JUser extends JBase {
    groups: FK<JGroup, ObjectID>[];
    name: { first: string; last: string };
    blocked: { at: Date; by: FK<JUser, ObjectID> } | undefined;
    birthday: Date | undefined;
    address: JAddress;
    location: PLocation | undefined;
}

interface JCompany extends JBase {
    name: string;
    address: JAddress;
    location: PLocation | undefined;
}

interface JGroup extends JBase {
    name: string;
    description: string | undefined;
}

declare const joinUser: type.Joined<User>;

expectType<typeof joinUser>({} as JUser);
expectType<JUser>(joinUser);

declare const selection1: type.Select<User, 'address' | 'blocked' | 'name' | 'birthday'>;
expectType<typeof selection1>(
    {} as {
        address: JAddress;
        blocked: { at: Date; by: ObjectID };
        name: { first: string; last: string };
        birthday: Date;
    },
);
expectType<{
    address: JAddress;
    blocked: { at: Date; by: ObjectID } | undefined;
    name: { first: string; last: string };
    birthday: Date | undefined;
}>(selection1);

declare const selection2: type.Select<User, 'address.city' | 'blocked.by' | 'name' | 'company'>;
expectType<typeof selection2>(
    {} as {
        address: { city: string };
        blocked: { by: ObjectID } | undefined;
        name: { first: string; last: string };
        company: ObjectID;
    },
);
expectType<{
    address: { city: string };
    blocked: { by: ObjectID } | undefined;
    name: { first: string; last: string };
    company: ObjectID;
}>(selection2);

declare const selection3: type.Select<User, 'address.city' | 'blocked.by' | 'name' | 'company.address.*'>;
expectType<typeof selection3>(
    {} as {
        address: { city: string };
        blocked: { by: ObjectID };
        name: { first: string; last: string };
        company: { address: { city: string; street: string } };
    },
);
expectType<{
    address: { city: string };
    blocked: { by: ObjectID } | undefined;
    name: { first: string; last: string };
    company: { address: { city: string; street: string } };
}>(selection3);


declare const rootSelection3: type<User, 'address.city' | 'blocked.by' | 'name' | '' | 'location'>;
expectType<typeof rootSelection3>(
    {} as {
        address: { city: string };
        blocked: { by: ObjectID };
        name: { first: string; last: string };
        company: { address: { city: string; street: string } };
        location: PLocation | undefined;
    },
);
expectType<{
    address: { city: string };
    blocked: { by: ObjectID } | undefined;
    name: { first: string; last: string };
    company: { address: { city: string; street: string } };
    location: PLocation | undefined;
}>(rootSelection3);
