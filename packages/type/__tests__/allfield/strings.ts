import { type, __, assignTest, expectTypeOf, timeTest } from './stuff';

test('Strings shape', () => {
    expect(type(Strings).toString('full')).toMatch(`[Shape of Strings]:
  string: String [ORDINARY]
  stringDef: String [HASDEFAULT]
  stringOpt: String [OPTIONAL]
  stringMay: String [ORDINARY, UNDEFINABLE, NULLABLE]
  stringConst: String [ORDINARY, READONLY]
  stringInst: String [HASDEFAULT]
  stringCtor: String [ORDINARY]
  text: Text [ORDINARY]
  textDef: Text [HASDEFAULT]
  textOpt: Text [OPTIONAL]
  textMay: Text [ORDINARY, UNDEFINABLE, NULLABLE]
  textConst: Text [ORDINARY, READONLY]`);
});

export const stringsInit = {
    string: '1',
    stringConst: '2',
    stringCtor: '3',
    stringMay: null,
    text: '4',
    textConst: '5',
    textMay: '6',
};

test('Strings new', () => {
    expect(type(Strings).new(stringsInit)).toStrictEqual({
        string: '1',
        stringConst: '2',
        stringCtor: '3',
        stringDef: 'stringDefault',
        stringInst: 'instant initialization',
        stringMay: null,
        stringOpt: undefined,
        text: '4',
        textConst: '5',
        textDef: 'textDefault',
        textMay: '6',
        textOpt: undefined,
    });
});

test('Strings limits', () => {
    expect(() =>
        type(Strings).new({
            ...stringsInit,
            stringOpt: new Array(4097).fill('a', 0, 4097).join(''),
        }),
    ).toThrow('Strings.stringOpt should be less than 4096');
    expect(() =>
        type(Strings).new({
            ...stringsInit,
            textOpt: new Array(262145).fill('a', 0, 262145).join(''),
        }),
    ).toThrow('Strings.textOpt should be less than 262144');
});

test('Strings undefined/null', () => {
    expect(() =>
        type(Strings).new({
            ...stringsInit,
            // @ts-expect-error
            string: undefined,
        }),
    ).toThrow('Field "Strings.string" can not be null or undefined');
    expect(() =>
        type(Strings).new({
            ...stringsInit,
            // @ts-expect-error
            text: undefined,
        }),
    ).toThrow('Field "Strings.text" can not be null or undefined');
});

test('Strings new timing', () => {
    timeTest(1_000_000, 2.5, count => {
        const arr = new Array(count);
        const shape = type(Strings);
        for (let i = 0; i < count; i++) {
            arr[i] = shape.new(stringsInit);
        }
    });
});

// test('Strings newObj timing', () => {
//     timeTest(1_000_000, 2, count => {
//         const arr = new Array(count);
//         const shape = type(Strings);
//         for (let i = 0; i < count; i++) {
//             arr[i] = shape.newObj(stringsInit);
//         }
//     });
// });

// test('Strings newEntries timing', () => {
//     const count = 1_000_000;
//     const arr = new Array(count);
//     const shape = type(Strings);
//     const start = process.hrtime.bigint();
//     for (let i = 0; i < count; i++) {
//         arr[i] = shape.newEntries(stringsInit);
//     }
//     const time = (process.hrtime.bigint() - start) / 1_000_000n;
//     console.log('Strings.newEntries time = ' + time);
//     expect(time).toBeLessThan(1500);
// });

// test('Strings newObj timing', () => {
//     const count = 1_000_000;
//     const arr = new Array(count);
//     const shape = type(Strings);
//     const start = process.hrtime.bigint();
//     for (let i = 0; i < count; i++) {
//         arr[i] = shape.newObj(stringsInit);
//     }
//     const time = (process.hrtime.bigint() - start) / 1_000_000n;
//     console.log('Strings.newObj time = ' + time);
//     expect(time).toBeLessThan(1500);
// });

export class Strings {
    string = type.String();
    stringDef = type.String().default(() => 'stringDefault');
    stringOpt = type.String().optional();
    stringMay = type.String().maybe();
    stringConst = type.String().readonly();
    stringInst = 'instant initialization';
    stringCtor = String;

    text = type.Text();
    textDef = type.Text().default(() => 'textDefault');
    textOpt = type.Text().optional();
    textMay = type.Text().maybe();
    textConst = type.Text().readonly();
}

export interface IStrings {
    string: string;
    stringDef?: string;
    stringOpt?: string;
    stringMay: string | undefined | null;
    stringConst: string;
    stringInst?: string;
    stringCtor: string;

    text: string;
    textDef?: string;
    textOpt?: string;
    textMay: string | undefined | null;
    textConst: string;
}

assignTest<type.Initial<Strings>>(__ as IStrings);
assignTest<IStrings>(__ as type.Initial<Strings>);
expectTypeOf<type.Initial<Strings>>().toEqualTypeOf<IStrings>();

export interface PStrings {
    string: string;
    stringDef: string;
    stringOpt: string | undefined;
    stringMay: string | undefined | null;
    readonly stringConst: string;
    stringInst: string;
    stringCtor: string;

    text: string;
    textDef: string;
    textOpt: string | undefined;
    textMay: string | undefined | null;
    readonly textConst: string;
}

assignTest<type.Plain<Strings>>(__ as PStrings);
assignTest<PStrings>(__ as type.Plain<Strings>);
expectTypeOf<type.Plain<Strings>>().toEqualTypeOf<PStrings>();
