import { Log } from '../../dist/log';
export { Log };

export function getLog(tag = 'TEST') {
    let lastItem: Log.Item;
    Log.loggers = [
        {
            logger: {
                appendItem(item) {
                    lastItem = item;
                },
            },
        },
    ];

    return [new Log(tag), tag, () => lastItem] as const;
}
