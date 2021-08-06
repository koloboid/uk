import { type } from '../../../dist';
export { type };

export const TestDateNow = new Date(2021, 4, 15);
const _Date = Date;

global.Date = jest.fn(() => TestDateNow) as any;
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;

export class AtBy {
    at = type.DateTime().default(() => new Date());
    by = type.One(User, '_id');
}

export class Base {
    _id = type.MongoID().primary().readonly().auto();
    company = type.One(Company, '_id');
    created = AtBy;
    updated = type.Object(AtBy).optional();
    deleted = type.Object(AtBy).optional();
}

import { User } from './user';
import { Company } from './company';
