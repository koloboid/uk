import { Log } from '../log';

const colorMap = new Map<string, string>();
const logFuncs = {
    TRACE: console.log,
    DEBUG: console.log,
    INFO: console.info,
    WARN: console.warn,
    ERROR: console.error,
    FATAL: console.error,
};

function hue2rgb(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

function hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    if (s == 0) {
        r = g = b = l;
    } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export class BrowserLogger implements Log.ItemLogger {
    constructor(private opts: { monochrome?: boolean } = {}) {}

    appendItem(item: Log.Item) {
        const msgcolor = item.l === 'TRACE' ? 'color: rgba(0, 0, 0, 0.5)' : '';
        const func = logFuncs[item.l];

        let tagcolor;
        if (!this.opts.monochrome) {
            tagcolor = colorMap.get(item.t);
            if (!tagcolor) {
                //            tagcolor = `color: hsla(${Math.random() * 360}, 100%, 50%, ${item.l === 'TRACE' ? 0.2 : 1})`;
                const color = hslToRgb(Math.random(), 1, 0.5);
                tagcolor = `color: rgb(${color.r},${color.g},${color.b})`;
                colorMap.set(item.t, tagcolor);
            }
        }
        if (item.e) {
            const args: any[] = [item.e];
            if (item.u) args.push(item.u);
            if (item.p) args.push(item.p);
            func.apply(console, args);
        } else {
            const args: any[] = this.opts.monochrome
                ? [`${item.t} ${item.m}`]
                : [`%c${item.t} %c${item.m}`, tagcolor, msgcolor];
            if (item.u) args.push(item.u);
            if (item.p) args.push(item.p);
            func.apply(console, args as any);
        }
    }
}
