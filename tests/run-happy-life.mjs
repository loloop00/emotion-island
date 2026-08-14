import assert from "node:assert/strict";

await import("../analyzer.js");

const analyzer = globalThis.EmotionIslandAnalyzer;
assert.ok(analyzer, "analyzer should be available");

const cases = [
  {
    text: "去杭州旅行，沿着西湖跑步，晚上在湖边搭了帐篷。",
    expected: { travel: true, exercise: true, running: true, tent: true, picnic: false },
  },
  {
    text: "和大学朋友见面聚会，大家一起吃饭，聊到晚上都舍不得走。",
    expected: { social: true, food: true, picnic: false, tent: false },
  },
  {
    text: "今天和朋友在草地上野餐吃饭。",
    expected: { social: true, food: true, picnic: true, tent: false },
  },
  {
    text: "去厦门旅行，在海边看了漂亮的日落，还拍了照片做成明信片。",
    expected: { travel: true, postcard: true, picnic: false },
  },
  {
    text: "今天骑车沿江走了一圈，风吹得很舒服。",
    expected: { exercise: true, cycling: true, tent: false },
  },
  {
    text: "今天吃了百香果。",
    expected: { food: false, social: false, picnic: false },
  },
  {
    text: "出去露营了。",
    expected: { travel: false, camping: true, tent: true, picnic: false },
  },
  {
    text: "今天去了健身房。",
    expected: { exercise: true, camping: false, picnic: false },
  },
  {
    text: "今天散步了。",
    expected: { exercise: true, camping: false, picnic: false },
  },
];

for (const testCase of cases) {
  const result = analyzer.analyzeText(testCase.text);
  for (const [key, expected] of Object.entries(testCase.expected)) {
    assert.equal(result[key], expected, `${testCase.text}: ${key}`);
  }
  if (testCase.text.includes("健身房") || testCase.text.includes("散步")) {
    assert.ok(result.lifeEvents.some((event) => event.fullLabel === "运动"), `${testCase.text}: should use 运动 label`);
  }
}

console.log(JSON.stringify({ passed: cases.length, failed: 0 }, null, 2));
