import { expectTypeOf } from 'expect-type';
import { Enum } from '../src';

const E1 = Enum('APPLE', 'XIAOMI', 'SAMSUNG');
type E1 = Enum<typeof E1>;

const E2 = Enum({ xs: 300, sm: 400, md: 500 });
type E2 = Enum<typeof E2>;

test('TestEnum1', () => {
    expectTypeOf<E1>().toEqualTypeOf<'APPLE' | 'XIAOMI' | 'SAMSUNG'>();
    expectTypeOf(E1).toEqualTypeOf<{
        APPLE: 'APPLE';
        XIAOMI: 'XIAOMI';
        SAMSUNG: 'SAMSUNG';
    }>();
    expectTypeOf(E1.APPLE).toEqualTypeOf<'APPLE'>();
    expectTypeOf(E1.SAMSUNG).toEqualTypeOf<'SAMSUNG'>();

    expectTypeOf<E2>().toEqualTypeOf<'xs' | 'sm' | 'md'>();
    expectTypeOf(E2).toEqualTypeOf<{
        xs: number;
        sm: number;
        md: number;
    }>();
    expectTypeOf(E2.xs).toEqualTypeOf<number>();
    expectTypeOf(E2.sm).toEqualTypeOf<number>();
});
