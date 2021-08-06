import * as sms from 'source-map-support';
import { Log } from './log';
import { BrowserLogger } from './loggers/browser';
import { StreamLogger } from './loggers/stream';

if (sms && sms.install) sms.install();

export { StopWatch } from './stopwatch';
export { Log, BrowserLogger, StreamLogger };

export default Log;

if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    process.env.NODE_ENV === 'debugger'
        ? Log.loggers.push({ logger: new BrowserLogger({ monochrome: true }) })
        : process.env.NODE_ENV === 'production'
        ? Log.loggers.push(
              {
                  logger: new StreamLogger(process.stderr),
                  filter: item => item.l === 'ERROR' || item.l === 'FATAL',
              },
              {
                  logger: new StreamLogger(process.stdout),
                  filter: item => item.l !== 'ERROR' && item.l !== 'FATAL',
              },
          )
        : Log.loggers.push({ logger: new StreamLogger(process.stdout) });
} else {
    Log.loggers.push({ logger: new BrowserLogger() });
}
