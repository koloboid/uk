import { validateSync } from 'class-validator';
import { TestModel1 } from './stuff/model1';
import { TestModel2 } from './stuff/model2';

test('TestModel1', () => {
    const t1 = new TestModel1();
    const t2 = new TestModel2();

    expect(validateSync(t1)).toMatchObject([
        {
            children: [],
            constraints: {
                isString: '_id must be a string',
                minLength: '_id must be longer than or equal to 3 characters',
            },
            property: '_id',
            target: {},
            value: undefined,
        },
        {
            children: [],
            constraints: {
                isInt: 'int32 must be an integer number',
                max: 'int32 must not be greater than 2147483647',
                min: 'int32 must not be less than -2147483648',
            },
            property: 'int32',
            target: {},
            value: undefined,
        },
    ]);
    expect(validateSync(t2)).toMatchObject([
        {
            children: [],
            constraints: {
                isString: '_id must be a string',
                minLength: '_id must be longer than or equal to 5 characters',
            },
            property: '_id',
            target: {},
            value: undefined,
        },
        {
            children: [],
            constraints: {
                isString: 'str must be a string',
                minLength: 'str must be longer than or equal to 3 characters',
            },
            property: 'str',
            target: {},
            value: undefined,
        },
    ]);
});
