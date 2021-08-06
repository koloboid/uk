import { getLog } from './stuff/log';

const [log, t, lastItem] = getLog();

describe('Log.append test', () => {
    log.indexed({ i0: 'i0' });
    test('Simple log writes', () => {
        log.debug('debugtest', { u1: 'u1' }, { i1: 'i1' });
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'DEBUG',
            m: 'debugtest',
            p: { i1: 'i1', i0: 'i0' },
            u: { u1: 'u1' },
        });
        log.error('errortest', { u1: 'u1', u2: 42 });
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'ERROR',
            m: 'errortest',
            p: { i0: 'i0' },
            u: { u1: 'u1', u2: 42 },
        });
        log.warn('warntest');
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'WARN',
            m: 'warntest',
            p: { i0: 'i0' },
            u: undefined,
        });
        log.info('infotest', undefined, { i1: 'i1' });
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'INFO',
            m: 'infotest',
            p: { i0: 'i0', i1: 'i1' },
            u: undefined,
        });
        const e = { message: 'Exception', name: 'TestError', stack: 'No stacktrace' };
        log.fatal(['fataltest', e], { u1: 42 }, { i1: 'i1' });
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e,
            i: 0,
            l: 'FATAL',
            m: 'fataltest',
            p: { i0: 'i0', i1: 'i1' },
            u: { u1: 42 },
        });

        log.append('TRACE', 'tracetest', {}, {});
        expect(lastItem()).toStrictEqual({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'TRACE',
            m: 'tracetest',
            p: { i0: 'i0' },
            u: {},
        });
    });
});
