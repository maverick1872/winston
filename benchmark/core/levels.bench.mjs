'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';
import { saveBenchmarkResults } from './utils.mjs';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
const bench = new Bench({ name: 'Log Levels' });

bench
  .add('Logger debug message', () => {
    logger.debug('message');
  })
  .add('Console debug message', () => {
    console.debug('message');
  })
  .add('Logger info message', () => {
    logger.info('message');
  })
  .add('Console info message', () => {
    console.info('message');
  })
  .add('Logger warn message', () => {
    logger.warn('message');
  })
  .add('Console warn message', () => {
    console.warn('message');
  })
  .add('Logger error message', () => {
    logger.error('message');
  })
  .add('Console error message', () => {
    console.error('message');
  })

console.log(`Running ${bench.name} benchmark...`);

await bench.run();

console.table(bench.table());

// Save results to a file if requested
if (process.argv.includes('--save')) {
  saveBenchmarkResults(bench);
}

