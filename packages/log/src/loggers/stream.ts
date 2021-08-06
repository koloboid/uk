import { Log } from "../log";

export interface WritableStream {
    write(data: string, encoding?: string, cb?: () => void): boolean;
}

export class StreamLogger implements Log.JsonLogger {
    constructor(protected stream: WritableStream) {}

    appendJson(item: string) {
        this.stream.write(item);
        this.stream.write("\n");
    }
}
