import { Bench } from 'tinybench';
import * as winston from '../lib/winston.js';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { saveBenchmarkResults } from './utils.mjs';

// Helper function to get temp log file path
function getTempLogFile(prefix) {
  return path.join(os.tmpdir(), `winston-benchmark-${prefix}-${Date.now()}`);
}

const consoleTransport = new winston.transports.Console({ silent: true });

const tempFile = getTempLogFile('file');
const fileTransport = new winston.transports.File({
  filename: tempFile,
  silent: true
});
const nullStream = new winston.transports.Stream({
  stream: fs.createWriteStream('/dev/null')
});
const httpTransport = new winston.transports.Http({
  host: 'localhost',
  port: 8080,
  path: '/logs',
  silent: true
});
httpTransport.request = function (options, callback) {
  setImmediate(() => callback(null, { statusCode: 200 }, ''));
  return {
    on: () => {},
    end: () => {}
  };
};

const transports = {
  console: consoleTransport,
  file: fileTransport,
  null: nullStream,
  http: httpTransport
};

// Benchmark suite for different transports
const bench = new Bench({ name: 'Built-in Transports' });

// Use Object.entries to properly iterate over the transports object
Object.entries(transports).forEach(([name, transport]) => {
  const newLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [transport]
  });

  bench.add(`${name} transport`, () => {
    newLogger.info('This is a test message');
  });
});

console.log(`Running ${bench.name} benchmark...`);
console.log('Temp file for file transport:', tempFile);

await bench.run();

console.table(bench.table());

// Save results to a file if requested
if (process.argv.includes('--save')) {
  saveBenchmarkResults(bench);
}


