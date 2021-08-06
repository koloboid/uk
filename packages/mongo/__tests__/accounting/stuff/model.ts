import Log from '@uk/log';
import { Company, User, UserGroup, TestDateNow, type } from '@uk/type/__tests__/accounting/models';
import { client, Model } from './client';

export { TestDateNow, User };

const opts = client; //{ client, log: new Log('MODEL') };

export const TUser = new Model(User, opts);
export const TCompany = new Model(Company, opts);
export const TUserGroup = new Model(UserGroup, opts);

class Context {
    get TUser() {
        return new Model(User, opts);
    }
}
