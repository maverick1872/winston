'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';


// Function to create a logger with n transports
function createLoggerWithTransports(n) {
  const transports = Array(n).fill().map(() => new winston.transports.Console({ silent: true }));
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports
  });
}

const bench = new Bench({ name: 'Winston Logger - Transport Scaling (Fibonacci)' });

const numTransports = [1, 2, 3, 5, 8];
for (const count of numTransports) {
  const logger = createLoggerWithTransports(count);
  bench.add(`${count} transport${count > 1 ? 's' : ''}`, () => {
    logger.info('This is a test message');
  });
}

console.log(`Running ${bench.name} benchmark...`);
console.log(`Testing transport counts: ${numTransports.join(', ')}`);

await bench.run();

console.table(bench.table());

