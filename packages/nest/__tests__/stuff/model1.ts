import { Int32, One, String } from '../../src';
import { TestModel2 } from './model2';

export class TestModel1 {
    @String({ min: 3 })
    _id: string;

    @Int32()
    int32: number;

    @One(() => TestModel2)
    testModel2: string;
}
