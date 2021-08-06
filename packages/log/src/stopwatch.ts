import { Log } from './log';

export class StopWatch {
    #laps?: number[];
    #lap = 0;
    #started = 0;

    constructor(readonly log: Log, readonly label?: string) {}

    get time() {
        return Log.now() - this.#started;
    }

    get lapTime() {
        return this.#lap + this.time;
    }

    get maxTime() {
        return this.#laps ? this.#laps.reduce((p, c) => (c > p ? c : p), this.time) : this.time;
    }

    get avgTime() {
        return this.#laps ? this.#laps.reduce((p, c) => c + p, this.time) / this.#laps.length + 1 : this.time;
    }

    get total() {
        return this.#lap + (this.#laps?.reduce((prev, curr) => prev + curr, 0) ?? 0);
    }

    get started() {
        return this.#started > 0;
    }

    start() {
        this.#started = Log.now();
        return this;
    }

    stop() {
        if (this.#started > 0) {
            this.#lap += Log.now() - this.#started;
            this.#started = 0;
        }
        return this;
    }

    reset() {
        this.#started = 0;
        return this;
    }

    clear() {
        this.#started = 0;
        this.#laps = undefined;
        return this;
    }

    lap() {
        this.#laps ??= [];
        this.#laps.push(this.#lap);
        return this.start();
    }

    write(msg?: string | [lvl: Log.Level, msg: string], unindexed?: object, indexed?: object) {
        this.log.append(
            Array.isArray(msg) ? msg[0] : 'TRACE',
            Array.isArray(msg) ? msg[1] : msg || this.label || 'stopWatch',
            { ...unindexed, lap: this.#laps?.length || undefined, time: this.time },
            indexed,
        );
        return this;
    }
}
