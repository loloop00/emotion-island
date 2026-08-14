import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

await import("../analyzer.js");

const corpusUrl = new URL("./emotion-corpus.json", import.meta.url);
const corpus = JSON.parse(await readFile(corpusUrl, "utf8"));
const { analyzeText } = globalThis.EmotionIslandAnalyzer;
const failures = [];

for (const testCase of corpus) {
  const actual = analyzeText(testCase.text);
  try {
    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      assert.deepEqual(
        actual[key],
        expectedValue,
        `${testCase.id} expected ${key}=${JSON.stringify(expectedValue)}, received ${JSON.stringify(actual[key])}`,
      );
    }
  } catch (error) {
    failures.push({
      id: testCase.id,
      text: testCase.text,
      message: error.message,
      actual: Object.fromEntries(Object.keys(testCase.expected).map((key) => [key, actual[key]])),
    });
  }
}

if (failures.length) {
  console.error(JSON.stringify({ passed: corpus.length - failures.length, failed: failures.length, failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ passed: corpus.length, failed: 0 }, null, 2));
}
