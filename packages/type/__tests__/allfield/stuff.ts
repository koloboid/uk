import { type } from '../../dist/index';
import ObjectID from 'bson-objectid';

export { expectTypeOf } from 'expect-type';
export { type, ObjectID };

export function assignTest<T>(t: T) {}
export const __: any = undefined;

export function timeTest(count: number, iterTimeUs: number, func: (count: number) => void) {
    const start = process.hrtime.bigint();
    func(count);
    const time = Number(process.hrtime.bigint() - start) / 1000 / count;
    expect(time).toBeLessThan(iterTimeUs);
}
