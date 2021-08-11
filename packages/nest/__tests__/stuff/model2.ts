import { One, String } from '../../src';
import { TestModel1 } from './model1';

export class TestModel2 {
    @String({ min: 5 })
    _id: string;

    @String({ min: 3 })
    str: string;

    @One(() => TestModel1)
    testModel1: string;
}
