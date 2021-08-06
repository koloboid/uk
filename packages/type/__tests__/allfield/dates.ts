import { type, __, assignTest, expectTypeOf, timeTest } from './stuff';

test('Dates shape', () => {
    expect(type(Dates).toString('full')).toMatch(`[Shape of Dates]:
  date: Date [ORDINARY]
  dateDef: Date [HASDEFAULT]
  dateOpt: Date [OPTIONAL]
  dateMay: Date [ORDINARY, UNDEFINABLE, NULLABLE]
  dateConst: Date [ORDINARY, READONLY]
  dateTime: DateTime [ORDINARY]
  dateTimeDef: DateTime [HASDEFAULT]
  dateTimeOpt: DateTime [OPTIONAL]
  dateTimeMay: DateTime [ORDINARY, UNDEFINABLE, NULLABLE]
  dateTimeConst: DateTime [ORDINARY, READONLY]
  dateTimeInst: DateTime [HASDEFAULT]
  dateTimeCtor: DateTime [ORDINARY]`);
});

export const datesInit = {
    date: new Date(2021, 0, 1, 15, 45),
    dateMay: null,
    dateConst: new Date(2021, 0, 2),

    dateTime: new Date(2021, 1, 3, 4, 20),
    dateTimeMay: undefined,
    dateTimeConst: new Date(2021, 3, 20, 16, 20),
    dateTimeCtor: new Date(2021, 5, 5, 21, 35, 45),
};

test('Strings new', () => {
    expect(type(Dates).new(datesInit)).toStrictEqual({
        date: new Date('2021-01-01T00:00:00.000Z'),
        dateConst: new Date('2021-01-02T00:00:00.000Z'),
        dateDef: new Date('2020-05-20T00:00:00.000Z'),
        dateMay: null,
        dateOpt: undefined,
        dateTime: new Date('2021-02-03T04:20:00.000Z'),
        dateTimeConst: new Date('2021-04-20T16:20:00.000Z'),
        dateTimeCtor: new Date('2021-06-05T21:35:45.000Z'),
        dateTimeDef: new Date('2021-05-20T16:20:42.000Z'),
        dateTimeInst: new Date('2021-04-12T23:32:04.000Z'),
        dateTimeMay: undefined,
        dateTimeOpt: undefined,
    });
});

test('Dates undefined/null', () => {
    expect(() =>
        type(Dates).new({
            ...datesInit,
            // @ts-expect-error
            date: undefined,
        }),
    ).toThrow('Field "Dates.date" can not be null or undefined');
    expect(() =>
        type(Dates).new({
            ...datesInit,
            // @ts-expect-error
            date: undefined,
        }),
    ).toThrow('Field "Dates.date" can not be null or undefined');
});

test('Dates new timing', () => {
    timeTest(1_000_000, 8, count => {
        const arr = new Array(count);
        const shape = type(Dates);
        for (let i = 0; i < count; i++) {
            arr[i] = shape.new(datesInit);
        }
    });
});

export class Dates {
    date = type.Date();
    dateDef = type.Date().default(() => new Date(2020, 4, 20, 16, 20, 42));
    dateOpt = type.Date().optional();
    dateMay = type.Date().maybe();
    dateConst = type.Date().readonly();

    dateTime = type.DateTime();
    dateTimeDef = type.DateTime().default(() => new Date(2021, 4, 20, 16, 20, 42));
    dateTimeOpt = type.DateTime().optional();
    dateTimeMay = type.DateTime().maybe();
    dateTimeConst = type.DateTime().readonly();
    dateTimeInst = new Date(2021, 3, 12, 23, 32, 4);
    dateTimeCtor = Date;
}

export interface IDates {
    date: Date;
    dateDef?: Date;
    dateOpt?: Date;
    dateMay: Date | undefined | null;
    dateConst: Date;

    dateTime: Date;
    dateTimeDef?: Date;
    dateTimeOpt?: Date;
    dateTimeMay: Date | undefined | null;
    dateTimeConst: Date;
    dateTimeInst?: Date;
    dateTimeCtor: Date;
}
assignTest<type.Initial<Dates>>(__ as IDates);
assignTest<IDates>(__ as type.Initial<Dates>);
expectTypeOf<type.Initial<Dates>>().toEqualTypeOf<IDates>();

export interface PDates {
    date: Date;
    dateDef: Date;
    dateOpt: Date | undefined;
    dateMay: Date | undefined | null;
    readonly dateConst: Date;

    dateTime: Date;
    dateTimeDef: Date;
    dateTimeOpt: Date | undefined;
    dateTimeMay: Date | undefined | null;
    readonly dateTimeConst: Date;
    dateTimeInst: Date;
    dateTimeCtor: Date;
}
assignTest<type.Plain<Dates>>(__ as PDates);
assignTest<PDates>(__ as type.Plain<Dates>);
expectTypeOf<type.Plain<Dates>>().toEqualTypeOf<PDates>();
