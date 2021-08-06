import { type } from '../../src';
import { expectType } from 'tsd';
import { ObjectID } from 'bson';
import { DatesModel, StringsModel } from './models';

type Base = {
    id: ObjectID;
    uid: string;
};

declare const typeStringsJoined: type.Joined<StringsModel>;
declare const typeStringsInitial: type.Initial<StringsModel>;
declare const typeStringsPlain: type<StringsModel>;

typeStringsJoined.datesOne;
typeStringsInitial.datesOne;
typeStringsPlain.obj;

type TypeDates = {
    date: Date;
    dateDef: Date;
    dateOpt: Date | undefined;
    dateShortDefault: Date;
    dateShort: Date;
    embedSelf: TypeDates;
};

// expectType<
//     Base & {
//         string: string;
//         stringUndefinable: string | undefined;
//         stringNullable: string | null;
//         stringNullableUndefinable: string | null | undefined;
//         stringDef: string;
//         stringOpt: string | undefined;
//         stringShortDefault: string;
//         stringShort: string;

//         datesOne: ObjectID;
//         datesMany: any[];
//         datesEmbed: TypeDates;

//         tuple: [string, number, Date];

//         obj: TypeDates;
//         objPlain: {
//             strShort: string;
//             strDefault: string;
//             str: string;
//         };
//     }
// >(typeStringsPlain);

// expectType<
//     Base & {
//         string: string;
//         stringDef: string;
//         stringOpt?: string;
//         stringShortDefault: string;
//         stringShort: string;

//         datesOne: Base & {
//             date: Date;
//             dateDef: Date;
//             dateOpt?: Date;
//             dateShortDefault: Date;
//             dateShort: Date;
//             embedSelf: object;
//         };
//         datesEmbed: Base & {
//             date: Date;
//             dateDef: Date;
//             dateOpt?: Date;
//             dateShortDefault: Date;
//             dateShort: Date;
//             embedSelf: object;
//         };
//     }
// >(typeStringsJoined);

// declare const typeDates: type<DatesModel>;
// expectType<
//     Base & {
//         date: Date;
//         dateDef: Date;
//         dateOpt?: Date;
//         dateShortDefault: Date;
//         dateShort: Date;
//     }
// >(typeDates);
