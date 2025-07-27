'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';
import { saveBenchmarkResults } from './utils.mjs';

const bench = new Bench({ name: 'Logger Instantiation' });

bench
  .add('No Arguments', () => {
    winston.createLogger();
  })
  .add('Explicit Transport', () => {
    winston.createLogger({
      transports: [new winston.transports.Console({ silent: true })]
    });
  })
  .add('JSON Format', () => {
    winston.createLogger({
      format: winston.format.json()
    });
  })
  .add('Explicit Transport & JSON Format', () => {
    winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console({ silent: true })]
    });
  });

console.log(`Running ${bench.name} benchmark...`)

await bench.run()

console.table(bench.table())

// Save results to a file if requested
if (process.argv.includes('--save')) {
  saveBenchmarkResults(bench);
}

