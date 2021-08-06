import { ObjectID } from 'bson';
import { type } from '../../src';

export class BaseModel {
    id = type.MongoID();
    uid = type.UUID();
}

export class StringsModel extends BaseModel {
    string = type.String();
    stringUndefinable = type.String().undefinable();
    stringNullable = type.String().nullable();
    stringNullableUndefinable = type.String().nullable().undefinable();
    stringDef = type.String().default('foo');
    stringOpt = type.String().optional();
    stringShortDefault = 'defaultValue';
    stringShort = String;

    selfOne = type.One(StringsModel, 'id');
    datesOne = type.One(DatesModel, 'id');
    datesMany = type.Many(DatesModel, 'id');
    datesEmbed = DatesModel;

    tuple = type.Tuple(String, Number, Date);

    obj = type.Object(DatesModel);
    objPlain = type.Object({
        strShort: String,
        strDefault: '',
        str: type.String(),
    });
}

export class DatesModel extends BaseModel {
    date = type.Date();
    dateDef = type.Date().default(() => new Date());
    dateOpt = type.Date().optional();
    dateShortDefault = new Date(2000, 1, 1);
    dateShort = Date;
    embedSelf = DatesModel;
}
