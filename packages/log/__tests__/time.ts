import { getLog } from './stuff/log';

const [log, t, lastItem] = getLog();

describe('Log.time', () => {
    test('watchTime', () => {
        for (let j = 0; j < 10; j++) {
            log.watchTime('time1', () => {
                const arr = [];
                for (let i = 0; i < 10 ** 6; i++) {
                    arr.push(i);
                }
            });
        }
        expect(log.watchTime('timeUnexists')).toStrictEqual({ count: 0, avg: 0, time: 0 });
        const w = log.watchTime('time1');
        expect(w.count).toBe(10);
        expect(w.time).toBeGreaterThan(100);
        expect(w.time).toBeLessThan(10000);
    });
    test('stopWatch', () => {
        expect(log.stopWatch(true)).toMatchObject({
            label: undefined,
        });
        expect(log.stopWatch()).toMatchObject({
            started: true,
            label: undefined,
        });
        expect(log.stopWatch('sometime')).toMatchObject({
            started: true,
            label: 'sometime',
        });
        expect(log.stopWatch(() => 'foo')).toMatchObject([
            'foo',
            {
                started: true,
                label: undefined,
            },
        ]);
        expect(log.stopWatch('bar', () => 'foo')).toMatchObject([
            'foo',
            {
                started: true,
                label: 'bar',
            },
        ]);
    });
    test('stopWatch complex', () => {
        const watch = log.stopWatch(true);
        const totalWatch = log.stopWatch('total');
        expect(log.stopWatch('total').started).toBe(true);
        for (let j = 0; j < 10; j++) {
            watch.lap();
            const arr = [];
            for (let i = 0; i < 10 ** 6; i++) {
                arr.push(i);
            }
            watch.stop();
            for (let i = 0; i < 10 ** 6; i++) {
                arr.push(i);
            }
        }
        watch.write();
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'TRACE',
            m: 'stopWatch',
            u: { lap: 10 },
        });
        watch.clear();
        watch.write(['INFO', 'foo'], { bar: 0 }, { baz: 1 });
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'INFO',
            m: 'foo',
            p: { baz: 1 },
            u: { lap: undefined, bar: 0 },
        });
        log.stopWatch('total').write('total');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'TRACE',
            m: 'total',
            p: undefined,
            u: { lap: undefined },
        });
        expect(log.stopWatch('total')).toEqual(totalWatch);
    });
});
