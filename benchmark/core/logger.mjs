'use strict';
import { Bench } from 'tinybench';
import * as winston from '../../lib/winston.js';
import { saveBenchmarkResults } from '../utils.mjs';

// Create sample data with varying complexity
const testData = {
  // Simple string
  string: 'This is a simple string message',

  // Simple object
  simpleObject: {
    id: 123,
    name: 'Test Object',
    active: true
  },

  // Array data
  array: [1, 2, 3, 4, 5, 'string', true, { nested: 'value' }],

  // Deeply nested object
  nestedObject: {
    level1: {
      level2: {
        level3: {
          level4: {
            level5: {
              value: 'deeply nested value',
              array: [1, 2, 3],
              object: { key: 'value' }
            }
          }
        }
      }
    }
  },

  // Large payload (5KB of data)
  largePayload: (() => {
    const large = {};
    for (let i = 0; i < 500; i++) {
      large[`key${i}`] = `This is value ${i} with some extra text to increase the size of the payload`;
    }
    return large;
  })(),

  // Error object
  error: new Error('Test error message'),

  // Object with circular reference
  circularRef: (() => {
    const obj = {
      name: 'Circular Object',
      created: new Date(),
      nestedArray: [1, 2, 3, { name: 'nested' }]
    };
    obj.self = obj; // Create circular reference
    return obj;
  })()
};

// Add a function for more complex objects
testData.functionProp = function () { return 'test function'; };

// Create logger with consistent format
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console({ silent: true })]
});

const bench = new Bench({ name: 'Log Payload Complexity' });

// Add benchmarks for each data type
bench.add('Simple String', () => {
  logger.info(testData.string);
});

bench.add('Simple Object', () => {
  logger.info(testData.simpleObject);
});

bench.add('Array Data', () => {
  logger.info(testData.array);
});

bench.add('Deeply Nested Object', () => {
  logger.info(testData.nestedObject);
});

bench.add('Large Payload (5KB)', () => {
  logger.info(testData.largePayload);
});

bench.add('Error Object', () => {
  logger.info(testData.error);
});

bench.add('Error Object with message', () => {
  logger.info('An error occurred', testData.error);
});

bench.add('Object with Circular Reference', () => {
  logger.info(testData.circularRef);
});

bench.add('Object with Function Property', () => {
  logger.info(testData.functionProp);
});

// Mixed complex scenario
bench.add('Complex Mixed Data', () => {
  logger.info('Mixed data log', {
    error: testData.error,
    payload: testData.simpleObject,
    nested: testData.nestedObject.level1,
    array: testData.array.slice(0, 3),
    circular: testData.circularRef
  });
});

console.log(`Running ${bench.name} benchmark...`);

await bench.run();

console.table(bench.table());

// Save results to a file if requested
if (process.argv.includes('--save')) {
  saveBenchmarkResults(bench);
}

