import * as readline from 'readline';
import Log from '..';
import * as util from 'util';
import chalk from 'chalk';
import { envConfig } from '@uk/config';

let maxTag = 0;
const tagOffset = {} as {
    [tag: string]: string;
};

const rl = readline.createInterface(process.stdin);
const config = envConfig({
    ARRAY_DEPTH: 5,
    OBJ_DEPTH: 3,
    COLOR: true,
    STRING_WRAP_LEN: 256,
});

rl.on('line', line => {
    let item: Log.Item;
    try {
        item = JSON.parse(line);
    } catch {
        writeItem({
            d: Date.now(),
            i: 0,
            l: 'INFO',
            m: line,
            p: undefined,
            e: undefined,
            u: undefined,
            t: 'STDOUT',
        });
        return;
    }
    if (item && item.d && item.l && typeof item.m === 'string' && item.t) {
        writeItem(item);
    }
});

function writeItem(item: Log.Item) {
    if (!(item.t in tagOffset)) {
        tagOffset[item.t] = '';
        if (item.t.length > maxTag) maxTag = item.t.length;
        for (const tag in tagOffset) {
            let off = '  ';
            let len = tag.length;
            while (len++ < maxTag) off += ' ';
            tagOffset[tag] = off;
        }
    }
    let err = '';
    if (item.e) {
        err =
            chalk.red(item.e.name + ': ' + item.e.message) +
            '\n' +
            chalk.gray(inspect({ ...item.e }) + (item.e.stack ? '\n' + item.e.stack : '')) +
            '\n';
    }
    let payload = '';
    if (item.p) {
        payload = chalk.gray(inspect(item.p));
    }
    if (item.u) {
        if (payload) payload += '\n';
        payload += chalk.gray(inspect(item.u));
    }

    const dt = new Date(item.d);
    const tz = -dt.getTimezoneOffset();
    console.log(
        chalk.white(
            dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) +
                '.' +
                dt.getMilliseconds().toFixed().padStart(3, '0') +
                (tz >= 0 ? '+' : '-') +
                (tz % 60 === 0 ? (tz / 60).toFixed(0) : (tz / 60).toFixed(2)) +
                ' ',
        ) +
            levelColor(item.l) +
            '\t' +
            tagColor(item.t, item.i) +
            chalk.white(item.m) +
            '\t' +
            err +
            payload,
    );
}

function inspect(obj: object) {
    delete obj['stack'];
    let rv = util.inspect(obj, {
        maxArrayLength: config.ARRAY_DEPTH,
        depth: config.OBJ_DEPTH,
        colors: config.COLOR,
    });
    if (rv.length > config.STRING_WRAP_LEN) {
        rv = '\n' + rv;
    }
    return rv;
}

function tagColor(tag: string, instance: number) {
    const inst = instance ? '/' + instance + ' ' : '';
    return tag + inst + tagOffset[tag].substr(inst.length);
}

function levelColor(level: Log.Level) {
    switch (level) {
        case 'TRACE':
            return chalk.gray(level);
        case 'INFO':
            return chalk.yellow(level);
        case 'WARN':
            return chalk.red(level);
        case 'ERROR':
        case 'FATAL':
            return chalk.bgRed(level);
        default:
            return chalk.white(level);
    }
}
