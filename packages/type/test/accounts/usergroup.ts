import { Base } from "./base";
import { type } from "../../src";
import { User } from './user';

export class UserGroup extends Base {
    name = String;

    users = type.BackLink(User, '_id');
};
