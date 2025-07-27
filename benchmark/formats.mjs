import { Bench } from 'tinybench';
import * as winston from '../lib/winston.js';
import { saveBenchmarkResults } from './utils.mjs';

// Define a consistent sample log data
const sampleLogData = {
  message: 'This is a test message',
  level: 'info',
  service: 'benchmark-service',
  timestamp: new Date().toISOString(),
  requestId: '1234-5678-9abc-def0',
  user: 'benchmark-user',
  duration: 42.123,
  statusCode: 200,
  path: '/api/test',
  metadata: {
    nested: {
      property: 'value',
      array: [1, 2, 3]
    }
  }
};

// Define the formats to benchmark
const formats = {
  'simple': winston.format.simple(),
  'cli': winston.format.cli(),
  'json': winston.format.json(),
  'printf ([LEVEL]: message)': winston.format.printf(info => `[${info.level}]: ${info.message}`),
  'logstash': winston.format.logstash(),
  'simple + timestamp': winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  'simple + padLevels': winston.format.combine(
    winston.format.padLevels(),
    winston.format.simple()
  ),
  'simple + align': winston.format.combine(
    winston.format.align(),
    winston.format.simple()
  ),
  'json + timestamp + label + metadata': winston.format.combine(
    winston.format.timestamp(),
    winston.format.label({ label: 'benchmark' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    winston.format.json()
  )
};

// Benchmark suite for different formats
const bench = new Bench({ name: 'Built-in Formats' });

// Create loggers with each format and add to benchmark
Object.entries(formats).forEach(([name, format]) => {
  const logger = winston.createLogger({
    level: 'info',
    format: format,
    transports: [new winston.transports.Console({ silent: true })]
  });

  bench.add(name, () => {
    logger.info(sampleLogData);
  });
});

// Also add a benchmark for raw logging without formatting

console.log(`Running ${bench.name} benchmark...`);

await bench.run();

// Display results in the console
console.table(bench.table());

// Save results to a file if requested
if (process.argv.includes('--save')) {
  saveBenchmarkResults(bench);
}

