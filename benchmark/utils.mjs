import fs from 'fs';
import path from 'path';

export function saveBenchmarkResults(bench) {
  console.log(`\nSaving benchmark results for: ${bench.name}`);
  const resultsDir = path.resolve('./results');

  // Create results directory if it doesn't exist
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const filename = path.join(resultsDir, `${bench.name}.json`);

  // Convert benchmark results to a storable format
  const results = {
    name: bench.name,
    date: new Date().toISOString(),
    results: bench.table(),
    system: {
      platform: process.platform,
      arch: process.arch,
      version: process.version
    }
  };

  try {
    let existingData = [];
    if (fs.existsSync(filename)) {
      const fileContent = fs.readFileSync(filename, 'utf8');
      existingData = JSON.parse(fileContent);
      if (!Array.isArray(existingData)) {
        existingData = [existingData];
      }
    }
    existingData.push(results);
    fs.writeFileSync(filename, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error(`Error appending benchmark results: ${error.message}`);
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  }
  console.log(`\nResults saved to: ${filename}`);
}
