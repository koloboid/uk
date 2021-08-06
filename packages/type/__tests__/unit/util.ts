import { expectTypeOf } from 'expect-type';
import type from '../../dist';

test('type.Definable', () => {
    expectTypeOf<1>().toEqualTypeOf<type.Definable<1>>();
    expectTypeOf<1>().toEqualTypeOf<type.Definable<1 | null>>();
    expectTypeOf<1>().toEqualTypeOf<type.Definable<1 | undefined>>();
    expectTypeOf<1>().toEqualTypeOf<type.Definable<1 | undefined | null>>();
});

test('type.ArrayItem', () => {
    expectTypeOf<number>().toEqualTypeOf<type.ArrayItem<number[]>>();
});
