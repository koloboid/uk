import { getLog, Log } from './stuff/log';

const [log, t, lastItem] = getLog();

// USE DUMMY

describe('Log.try', () => {
    log.indexed({ i0: 'i0' });
    test('sync', () => {
        expect(
            log.try('trySync1', p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                return 'A';
            }),
        ).toBe('A');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'INFO',
            m: 'trySync1',
            p: { i0: 'i0' },
            u: { f1: 'f1', s1: 's1' },
        });
    });

    test('sync debug', () => {
        expect(
            log.try(['DEBUG', 'trySync1'], p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                return 'A';
            }),
        ).toBe('A');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'DEBUG',
            m: 'trySync1',
            p: { i0: 'i0' },
            u: { f1: 'f1', s1: 's1' },
        });
    });

    test('sync error', () => {
        expect(() =>
            log.try('trySyncError1', p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                throw new Error('BOOM');
            }),
        ).toThrowError('BOOM');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: { name: 'Error', message: 'BOOM' },
            i: 0,
            l: 'ERROR',
            m: 'trySyncError1',
            p: { i0: 'i0' },
            u: { f1: 'f1', e1: 'e1' },
        });
    });

    test('async', async () => {
        await expect(
            log.try('tryAsync1', async p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                return 'S';
            }),
        ).resolves.toBe('S');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: undefined,
            i: 0,
            l: 'INFO',
            m: 'tryAsync1',
            p: { i0: 'i0' },
            u: { f1: 'f1', s1: 's1' },
        });
    });

    test('async error', async () => {
        await expect(
            log.try('tryAsync1', async p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                throw new Error('BOOM');
            }),
        ).rejects.toThrowError('BOOM');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: { name: 'Error', message: 'BOOM' },
            i: 0,
            l: 'ERROR',
            m: 'tryAsync1',
            p: { i0: 'i0' },
            u: { f1: 'f1', e1: 'e1' },
        });
    });

    test('async reject', async () => {
        await expect(
            log.try('tryAsync2', p => {
                p.error({ e1: 'e1' });
                p.finally({ f1: 'f1' });
                p.success({ s1: 's1' });
                return Promise.reject(new Error('BAAM'));
            }),
        ).rejects.toThrowError('BAAM');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: { name: 'Error', message: 'BAAM' },
            i: 0,
            l: 'ERROR',
            m: 'tryAsync2',
            p: { i0: 'i0' },
            u: { f1: 'f1', e1: 'e1' },
        });
    });

    test('logTryAsync3', async () => {
        await expect(logTryAsync3(log)).rejects.toThrowError('BAAM');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: { name: 'Error', message: 'BAAM' },
            i: 0,
            l: 'ERROR',
            m: 'tryAsync3',
            p: { i0: 'i0' },
            u: { f1: 'f1', e1: 'e1' },
        });
    });

    test('async dummy', async () => {
        await expect(logTryAsync3(new Log.Dummy())).rejects.toThrowError('BAAM');
        expect(lastItem()).toMatchObject({
            d: log['lastTime'],
            t,
            e: { name: 'Error', message: 'BAAM' },
            i: 0,
            l: 'ERROR',
            m: 'tryAsync3',
            p: { i0: 'i0' },
            u: { f1: 'f1', e1: 'e1' },
        });
    });
});

async function logTryAsync3(log: Log) {
    return log.try('tryAsync3', async p => {
        p.error({ e1: 'e1' });
        p.finally({ f1: 'f1' });
        p.success({ s1: 's1' });
        throw new Error('BAAM');
    });
}
