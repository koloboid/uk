//@ts-ignore
import stringify from 'fast-safe-stringify';
import * as path from 'path';
import { StopWatch } from './stopwatch';
import { TryPayload } from './trypayload';

const instances = {} as {
    [tag: string]: number;
};

export class Log {
    readonly tag: string;
    instance: number;

    constructor(tag: string | Log) {
        this.tag = typeof tag === 'string' ? tag : tag.tag;
        this.tag =
            this.tag.endsWith('.ts') || this.tag.endsWith('.js')
                ? this.tag
                      .substring(this.tag.lastIndexOf('/') + 1)
                      .slice(0, -3)
                      .toUpperCase()
                : this.tag;
        this.instance = instances[this.tag] || 0;
        instances[this.tag] = this.instance + 1;
    }

    indexed(): object | undefined;
    indexed(set: object): this;
    indexed(set?: object): this | object | undefined {
        if (set === undefined) return this.#index;
        this.#index = set;
        return this;
    }

    trace(msg: string, unindexed?: object, indexed?: object) {
        this.append('TRACE', msg, unindexed, indexed);
    }

    debug(msg: string, unindexed?: object, indexed?: object) {
        this.append('DEBUG', msg, unindexed, indexed);
    }

    info(msg: string, unindexed?: object, indexed?: object) {
        this.append('INFO', msg, unindexed, indexed);
    }

    warn(msg: string | Error | [string, Error], unindexed?: object, indexed?: object) {
        this._error('WARN', msg, unindexed, indexed);
    }

    error(msg: string | Error | [string, Error], unindexed?: object, indexed?: object): void {
        this._error('ERROR', msg, unindexed, indexed);
    }

    fatal(msg: string | Error | [string, Error], unindexed?: object, indexed?: object): void {
        this._error('FATAL', msg, unindexed, indexed);
    }

    here(msg?: string, unindexed?: object, indexed?: object) {
        const err = new Error();
        let rm = '';
        if (path && require.main?.filename) {
            rm = path.dirname(require.main.filename);
        }
        msg = `Log.here() ${err.stack?.split('\n')[2].trim().replace(rm, '')}`;
        this.append('TRACE', msg, unindexed, indexed);
    }

    append(level: Log.Level, msg: string, unindexed?: object, indexed?: object, error?: Error) {
        this.lastTime = Date.now();
        Log.push({
            d: this.lastTime,
            l: level,
            m: msg,
            e: error,
            u: unindexed,
            p: this.#index ? { ...this.#index, ...indexed } : indexed,
            t: this.tag,
            i: this.instance,
        });
    }
    private lastTime!: number;

    try<T>(message: string | [Log.Level, string] | Log.TryOpts, func: (payload: TryPayload) => T): T {
        let opts: Required<Log.TryOpts> = {} as any;
        if (typeof message === 'string') {
            opts.errMsg = opts.msg = message;
        } else if (Array.isArray(message)) {
            opts.errMsg = opts.msg = message[1];
            opts.lvl = message[0];
        } else {
            opts = message as any;
        }
        opts.errLvl = opts.errLvl || 'ERROR';
        opts.errMsg = opts.errMsg || opts.msg;
        opts.lvl = opts.lvl || 'INFO';

        const start = Log.now();
        const payload = new TryPayload();
        let rv;

        try {
            rv = func(payload);
        } catch (err) {
            this.append(
                opts.errLvl,
                opts.errMsg,
                payload['uError'],
                { execTime: Log.timeSpan(start), ...payload['iError'] },
                err,
            );
            throw err;
        }
        const execTime = Log.timeSpan(start);
        if (rv instanceof Promise) {
            rv = rv.then(
                val => {
                    this.append(opts.lvl, opts.msg, payload['uSuccess'], {
                        execTime,
                        asyncTime: Log.timeSpan(start),
                        ...payload['iSuccess'],
                    });
                    return val;
                },
                err => {
                    this.append(
                        opts.errLvl,
                        opts.msg,
                        payload['uError'],
                        {
                            execTime,
                            asyncTime: Log.timeSpan(start),
                            ...payload['iError'],
                        },
                        err,
                    );
                    throw err;
                },
            );
        } else {
            this.append(opts.lvl, opts.msg, payload['uSuccess'], {
                ...payload['iSuccess'],
                execTime,
            });
        }
        return rv as T;
    }

    get catch() {
        return (err: Error | string | null | undefined) => {
            if (err) this.error(err);
        };
    }

    get hcf() {
        return (err: Error) => {
            this.fatal(err);
            process.exit(1);
        };
    }

    stopWatch(stopped?: boolean): StopWatch;
    stopWatch(label: string): StopWatch;
    stopWatch<R>(func: () => R): [R, StopWatch];
    stopWatch<R>(label: string, func: () => R): [R, StopWatch];
    stopWatch(lblOrFuncOrStop: any, fun?: () => any): any {
        const t = typeof lblOrFuncOrStop;
        const lbl = t === 'string' ? lblOrFuncOrStop : undefined;
        let sw;
        if (lbl) {
            this.#stopwatches ??= new Map();
            sw = this.#stopwatches.get(lbl);
            if (!sw) {
                this.#stopwatches.set(lbl, (sw = new StopWatch(this, lbl)));
            }
        } else {
            sw = new StopWatch(this, lbl);
        }
        const f = fun ?? (t === 'function' ? lblOrFuncOrStop : undefined);
        if (t !== 'boolean' || lblOrFuncOrStop === false) sw.start();
        if (f) {
            const rv = f();
            return [rv, sw];
        } else {
            return sw;
        }
    }

    #stopwatches?: Map<string, StopWatch>;

    watchTime<R>(label: string): Log.WatchTimer;
    watchTime<R>(label: string, func: () => R): R;
    watchTime<R>(label: string, func?: () => R): R | Log.WatchTimer {
        if (!this.#watchTimers) this.#watchTimers = {};
        let timer = this.#watchTimers[label];
        if (!func) return timer ? { ...timer, avg: timer.time / timer.count } : { count: 0, time: 0, avg: 0 };
        if (!timer) timer = this.#watchTimers[label] = { count: 0, time: 0, avg: 0 };
        const startAt = Log.now();
        const rv = func();
        timer.time += Log.timeSpan(startAt);
        timer.count++;
        return rv;
    }

    httpMiddleware(options?: Log.HttpLogOptions) {
        const prod = process.env.NODE_ENV === 'production';
        const opts = options || {
            level: 'INFO',
            body: !prod,
            params: !prod,
        };
        opts.level = opts.level || 'INFO';
        return (req: any, resp: any, next: () => void) => {
            const startedAt = (req.startedAt = Log.now());
            resp.on('finish', () => {
                const status = resp.statusCode;
                let level = opts.level || 'DEBUG';
                if (status >= 500) {
                    level = 'ERROR';
                } else if (status >= 400) {
                    level = 'WARN';
                }
                if (opts.ignore && opts.ignore.exec(req.originalUrl) && level < 'WARN') return;
                this.append(level, `${req.method} ${req.originalUrl} => ${status}`, {
                    time: Log.timeSpan(startedAt),
                    from: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    fresh: opts.fresh ? req.fresh : undefined,
                    body: opts.body ? req.body : undefined,
                    cookies: opts.cookies ? req.cookies : undefined,
                    params: opts.params ? req.params : undefined,
                    xhr: opts.xhr ? req.xhr : undefined,
                });
            });
            next();
        };
    }

    private _error(lvl: Log.Level, msg: string | Error | [string, Error], unindexed?: object, indexed?: object): void {
        if (typeof msg === 'string') {
            this.append(lvl, msg, unindexed, indexed);
        } else {
            if (Array.isArray(msg)) {
                this.append(lvl, msg[0], unindexed, indexed, msg[1]);
            } else {
                this.append(lvl, msg.message, unindexed, indexed, msg);
            }
        }
    }

    #index?: object;
    #watchTimers?: Record<string, Log.WatchTimer>;
}

export namespace Log {
    export interface TryOpts {
        lvl?: Level;
        msg: string;
        errLvl?: Level;
        errMsg?: string;
    }

    export interface WatchTimer {
        count: number;
        time: number;
        avg: number;
    }

    export interface Item {
        d: number; // Event time, Unix ms
        t: string; // Tag
        i: number; // Instance
        l: Level; // Level
        m: string; // Message
        e?: Error; // Error
        p?: object; // Indexed payload
        u?: object; // Unindexed payload
    }

    export type Level = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

    export interface HttpLogOptions {
        level?: Level;
        body?: boolean;
        cookies?: boolean;
        fresh?: boolean;
        params?: boolean;
        xhr?: boolean;
        ignore?: RegExp;
    }

    export type Logger = JsonLogger | ItemLogger;
    export interface ItemLogger {
        appendItem(item: Item): void;
    }
    export interface JsonLogger {
        appendJson(item: string): void;
    }

    export let loggers: { logger: Logger; filter?: (item: Item) => boolean }[] = [];

    export function push(item: Item) {
        if (item.e) {
            item.e = {
                ...item.e,
                message: item.e.message,
                name: item.e.name,
                stack: item.e.stack ? item.e.stack.toString() : 'No stacktrace',
            };
        }
        let json;
        for (const { logger, filter } of loggers) {
            if (filter && !filter(item)) continue;
            if ('appendJson' in logger) {
                if (!json) json = stringify(item);
                logger.appendJson(json);
            } else {
                logger.appendItem(item);
            }
        }
    }
    export function timeSpan(from: number, to?: number) {
        if (!to) to = now();
        return Math.abs(Math.round((to - from) * 1000) / 1000);
    }

    export function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let nodeProcess = typeof process !== 'undefined' && process;

    export function now() {
        if (nodeProcess) {
            const hr = process.hrtime();
            return hr[0] * 1000 + hr[1] / 1000000;
        } else {
            return Date.now();
        }
    }

    export class Dummy extends Log {
        constructor() {
            super('');
        }

        indexed(): object | undefined;
        indexed(set: object): this;
        indexed(set?: object): this | object | undefined {
            return {};
        }

        trace() {}

        debug() {}

        info() {}

        warn() {}

        error(): void {}

        fatal(): void {}

        append() {}

        try<T>(_message: string | [Log.Level, string] | Log.TryOpts, func: (payload: TryPayload) => T): T {
            const rv = func(new TryPayload());
            if (rv instanceof Promise) {
                return rv.finally(() => {}) as any;
            } else {
                return rv;
            }
        }

        now() {
            return Log.now();
        }

        watchTime<R>(label: string): Log.WatchTimer;
        watchTime<R>(label: string, func: () => R): R;
        watchTime<R>(label: string, func?: () => R): R | Log.WatchTimer {
            return Dummy.zeroWatchResult;
        }

        private static zeroWatchResult = { count: 0, avg: 0, time: 0 };

        httpMiddleware(options?: Log.HttpLogOptions) {
            return (_req: any, _resp: any, next: Function) => next();
        }
    }

    const dummyLog = new Dummy();
    export function dummy() {
        return dummyLog;
    }
}
