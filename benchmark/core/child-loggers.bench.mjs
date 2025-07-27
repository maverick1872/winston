'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ silent: true })]
});
const childLogger = logger.child({ module: 'test' });

const bench = new Bench({ name: 'Winston Logger - Child Loggers' })

bench
  .add('Parent Logger', () => {
    logger.info('Parent logger message');
  })
  .add('Child Logger', () => {
    childLogger.info('Child logger message');
  });

console.log(`Running ${bench.name} benchmark...`)

await bench.run()

console.table(bench.table())

