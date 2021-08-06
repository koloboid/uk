import { type } from "../../src";
import { User } from './user';

export class Base {
    _id = type.MongoID();
    createdAt = type.DateTime();
    updatedAt = type.DateTime();
    createdBy = type.One(User, '_id');
    updatedBy = type.One(User, 'name');
}
