'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';

const bench = new Bench({ name: 'Logger Instantiation' })

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

