import { getLog } from './stuff/log';

const [log, t, lastItem] = getLog();

describe('Log.append test', () => {
    log.indexed({ i0: 'i0' });
    test('Log.here test', () => {
        log.here();
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'TRACE',
            m: 'Execution at Object.<anonymous> (/here.ts:8:13)',
            p: { i0: 'i0' },
            u: undefined,
        });
    });
});
