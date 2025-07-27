# Winston Benchmarks

This directory contains performance benchmarks for the Winston logger library using the [tinybench](https://github.com/tinylibs/tinybench) benchmarking library.

## Running the Benchmarks

To run a benchmark you just need to invoke with `node`. The following is an example.
```zsh
node benchmark/core/logger.mjs
```


## Benchmark Categories

### Core Benchmarks

- **Logger Operations** (`core/logger-benchmarks.mjs`): General logger operations performance
- **Instantiation** (`core/instantiation.bench.mjs`): Measures the performance of creating new logger instances
- **Child Loggers** (`core/child-loggers.bench.mjs`): Benchmarks creating and using child loggers
- **Levels** (`core/levels.bench.mjs`): Tests the performance of logging at different levels

### Format Benchmarks

- **Formats** (`formats.mjs`): Compares the performance of different format types and combinations

### Transport Benchmarks

- **Transports** (`transports.mjs`): Compares the performance of different transport types

## Understanding the Transport Benchmarks

The transport benchmarks (`transports.mjs`) compare the internal overhead of Winston's different transport types. Important notes:

1. **Silent Mode**: Most transports are configured with `silent: true`, which means they don't actually write logs to their destinations. This isolates the measurement to Winston's internal dispatch mechanism rather than measuring actual I/O operations.

2. **What's Being Measured**: These benchmarks primarily measure:
   - The overhead of Winston's logging infrastructure
   - The speed of creating log objects and passing them to transports
   - The internal transport dispatch mechanism

3. **What's NOT Being Measured**:
   - Actual I/O performance to different destinations
   - Real-world performance differences between transport types
   - Performance under load or with different message sizes

4. **Null Stream**: The null stream transport provides a baseline comparison as it performs minimal operations.

## Interpreting Results

When interpreting benchmark results, keep in mind:

1. Relative performance between different configurations is more meaningful than absolute numbers
2. Your application's specific logging patterns may produce different real-world performance
3. In production environments, I/O operations and network latency will typically dominate performance considerations

## Contributing New Benchmarks

When adding new benchmarks:

1. Use the existing patterns and organization
2. Add descriptions of what your benchmark is testing
4. Update this README with information about your benchmark
