import assert from "node:assert/strict";

await import("../analyzer.js");
await import("../island-state.js");

const { analyzeText } = globalThis.EmotionIslandAnalyzer;
const { buildLifePalette } = globalThis.EmotionIslandState;

function entry(date, text) {
  return {
    ...analyzeText(text),
    date,
    createdAt: `${date}T12:00:00.000Z`,
  };
}

const conflict = entry("2026-08-01", "今天和同事吵架了，心里很堵");
const takeout = entry("2026-08-02", "今天点了外卖，吃完感觉很幸福");
const fear = entry("2026-08-03", "今天很黑暗，很害怕");
const disappointed = entry("2026-08-04", "今天很失落");
const neglected = entry("2026-08-05", "今天有点失落，女朋友不理我");
const travelWithoutExactWord = entry("2026-08-06", "昨天去大海玩了，度完假回来很开心");
const homeDinner = entry("2026-08-07", "回家吃饭了，家里的饭很好吃");
const passionFruit = entry("2026-08-08", "今天吃了百香果");
const storm = entry("2026-08-09", "外面狂风暴雨，不敢出去");
const ordinaryFriendDinner = entry("2026-08-10", "和朋友一起吃饭，聊了很久");
const camping = entry("2026-08-11", "今天出去露营了");
const gym = entry("2026-08-12", "今天去了健身房");
const palette = buildLifePalette([conflict, takeout, fear, disappointed, neglected]);
const byLabel = Object.fromEntries(palette.map((item) => [item.fullLabel, item]));
const travelOnAnxiousDay = {
  ...entry("2026-08-10", "今天有点焦虑，但旅行回来很开心"),
  mood: "mood-anxious",
  lifeEvents: [{ key: "travel", family: "travel", fullLabel: "旅行记忆", shortLabel: "旅行" }],
};
const stormTrace = {
  ...entry("2026-08-11", "外面狂风暴雨，不敢出去"),
  lifeEvents: [{ key: "weather-storm", family: "storm", fullLabel: "风雨天气", shortLabel: "风雨" }],
};
const semanticPalette = Object.fromEntries(
  buildLifePalette([travelOnAnxiousDay, stormTrace]).map((item) => [item.family, item]),
);
const melancholyTerms = ["失落", "难过", "委屈", "沮丧"];
assert.equal(analyzeText("今天很开心").emotionAmbiguous, false);
assert.equal(analyzeText("今天很平静").emotionAmbiguous, false);
assert.equal(analyzeText("今天煮饭，和家人吃饭").emotionAmbiguous, true);
assert.equal(analyzeText("今天开心又累").emotionAmbiguous, true);

assert.ok(conflict.lifeEvents.some((event) => event.fullLabel === "吵架"));
assert.ok(takeout.lifeEvents.some((event) => event.fullLabel === "外卖"));
assert.ok(fear.lifeEvents.some((event) => event.fullLabel === "害怕"));
assert.equal(disappointed.emotion, "悲伤");
assert.ok(disappointed.lifeEvents.some((event) => event.family === "melancholy" && event.fullLabel === "失落"));
assert.equal(neglected.emotion, "悲伤");
assert.equal(neglected.social, false);
assert.equal(neglected.relationshipNeglect, true);
assert.ok(neglected.lifeEvents.some((event) => event.family === "melancholy"));
assert.equal(neglected.line, "今天海面有点远，灯塔还在等一声回应。");
assert.equal(neglected.lifeEvents[0].detail, "有些话没有被接住，灯塔还在远处亮着");
assert.ok(travelWithoutExactWord.lifeEvents.some((event) => event.key === "travel"));
assert.ok(homeDinner.lifeEvents.some((event) => event.key === "food"));
assert.equal(passionFruit.food, false);
assert.equal(passionFruit.lifeEvents.some((event) => event.key === "food" || event.family === "social"), false);
assert.equal(storm.emotion, "焦虑");
assert.equal(storm.mood, "mood-anxious");
assert.equal(storm.stormWeather, true);
assert.equal(storm.emotionAmbiguous, false);
assert.deepEqual(storm.lifeEvents.map((event) => event.fullLabel), ["风雨天气"]);
for (const term of melancholyTerms) {
  const analyzed = entry(`2026-08-${String(melancholyTerms.indexOf(term) + 5).padStart(2, "0")}`, `今天很${term}`);
  assert.equal(analyzed.emotion, "悲伤");
  assert.ok(analyzed.lifeEvents.some((event) => event.family === "melancholy"));
}
assert.equal(byLabel.关系波动.count, 1);
assert.equal(byLabel.厨房烟火.count, 1);
assert.equal(byLabel.暗处.count, 1);
assert.equal(byLabel.失落时刻.count, 2);
assert.equal(byLabel.朋友相聚, undefined);
assert.equal(byLabel.失落时刻.detail, "有些话没有被接住，灯塔还在远处亮着");
assert.match(byLabel.厨房烟火.sourceSummary, /外卖/);
assert.notEqual(byLabel.关系波动.color.fill, byLabel.厨房烟火.color.fill);
assert.notEqual(byLabel.失落时刻.color.fill, byLabel.暗处.color.fill);
assert.equal(buildLifePalette([ordinaryFriendDinner]).some((item) => item.fullLabel === "相聚与饮食"), false);
assert.ok(buildLifePalette([camping]).some((item) => item.fullLabel === "露营记忆"));
assert.equal(buildLifePalette([camping]).some((item) => item.fullLabel === "旅行记忆"), false);
assert.equal(buildLifePalette([gym]).find((item) => item.family === "nature")?.fullLabel, "运动");
assert.equal(semanticPalette.travel.mood, "bright");
assert.equal(semanticPalette.storm.mood, "dim");

function luminance(hex) {
  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
}

assert.ok(luminance(byLabel.暗处.color.fill) < 0.25);
assert.ok(luminance(byLabel.失落时刻.color.fill) > luminance(byLabel.暗处.color.fill));

console.log(JSON.stringify({ passed: 38, failed: 0 }, null, 2));
