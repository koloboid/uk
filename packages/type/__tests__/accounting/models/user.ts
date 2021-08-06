import { Base, type } from './base';
import { Tag } from './tag';
import { UserGroup } from './usergroup';

export class User extends Base {
    name = {
        first: String,
        last: type.String(),
        mid: type.String().optional(),
    };
    married = Boolean;
    group = type.One(UserGroup);
    tags = type.Many(Tag);
    friends = type.Many(User, '_id');
}
