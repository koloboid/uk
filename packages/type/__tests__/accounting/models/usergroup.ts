import { Base, type } from './base';

export type Permissions = 'userAdd' | 'userUpdate' | 'userDelete';

export class UserGroup extends Base {
    name = String;
    description = '';
    permissions = type.Array(type.String<Permissions>()).default([]);
    someObjs = type.Array({
        foo: String,
        bar: Number,
    });
}
