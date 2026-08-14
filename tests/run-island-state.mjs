import assert from "node:assert/strict";

await import("../island-state.js");

const { buildIslandState, buildMonthlyWeather, mergeDailyEntries, resolvePrimaryTrace, dailyTraceSummary } = globalThis.EmotionIslandState;

function entry(date, features = {}) {
  return {
    date,
    createdAt: `${date}T12:00:00.000Z`,
    mood: "mood-calm",
    ...features,
  };
}

assert.equal(
  resolvePrimaryTrace(entry("2026-07-01", { work: true, exercise: true })),
  "exercise",
  "一天有多个事件时，只选择优先级更高的主要痕迹",
);

const repeatedWork = buildIslandState([
  entry("2026-07-01", { work: true }),
  entry("2026-07-02", { work: true }),
  entry("2026-07-03", { work: true }),
  entry("2026-07-04", { work: true }),
  entry("2026-07-05", { work: true }),
  entry("2026-07-06", { work: true }),
]);
assert.equal(repeatedWork.counts.workCount, 6);
assert.equal(repeatedWork.levels.harbor, 3);
assert.equal(repeatedWork.features.work, true);

const familyDinner = buildIslandState([
  entry("2026-07-01", { family: true, food: true }),
  entry("2026-07-02", { family: true, food: true }),
]);
assert.equal(familyDinner.counts.familyCount, 2);
assert.equal(familyDinner.counts.foodCount, 2);
assert.equal(familyDinner.levels.family, 1);

const weatherOnly = buildIslandState([
  entry("2026-07-01", { mood: "mood-angry", conflict: true }),
  entry("2026-07-02", { mood: "mood-sad", health: true }),
]);
assert.equal(Object.values(weatherOnly.features).every((value) => value === false), true);
assert.equal(weatherOnly.dayCount, 2);

const cutoff = buildIslandState(
  [
    entry("2026-07-01", { exercise: true }),
    entry("2026-07-02", { exercise: true }),
    entry("2026-07-03", { exercise: true }),
  ],
  "2026-07-02",
);
assert.equal(cutoff.counts.exerciseCount, 2);
assert.equal(cutoff.levels.path, 1);

const travel = buildIslandState([
  entry("2026-07-01", { travel: true, travelPlace: "大理" }),
  entry("2026-07-02", { travel: true, travelPlace: "杭州" }),
  entry("2026-07-03", { travel: true, travelPlace: "厦门" }),
  entry("2026-07-04", { travel: true, travelPlace: "青岛" }),
]);
assert.equal(travel.travelMemories.length, 3);
assert.deepEqual(
  travel.travelMemories.map((memory) => memory.place),
  ["青岛", "厦门", "杭州"],
);

const replacement = buildIslandState([
  entry("2026-07-01", { work: true }),
  { ...entry("2026-07-01", { family: true }), createdAt: "2026-07-01T18:00:00.000Z" },
]);
assert.equal(replacement.dayCount, 1);
assert.equal(replacement.latestEntry.dayEntryCount, 2);
assert.deepEqual(replacement.latestEntry.dayTraces, ["family"]);
assert.equal(replacement.counts.familyCount, 1);
assert.equal(replacement.counts.workCount, 1);
assert.equal(replacement.latestTrace, "family");

const travelHomecoming = buildIslandState([
  entry("2026-07-01", { travel: true, travelPlace: "大理" }),
  { ...entry("2026-07-01", { family: true }), createdAt: "2026-07-01T18:00:00.000Z" },
]);
assert.equal(travelHomecoming.dayCount, 1);
assert.equal(travelHomecoming.counts.travelCount, 1);
assert.equal(travelHomecoming.counts.familyCount, 1);
assert.equal(dailyTraceSummary(travelHomecoming.latestEntry), "旅行归来，家里亮起了灯");

const travelDinner = buildIslandState([
  entry("2026-07-02", { travel: true, travelPlace: "大海" }),
  { ...entry("2026-07-02", { food: true, rawText: "回家吃饭了，家里的饭很好吃" }), createdAt: "2026-07-02T18:00:00.000Z" },
]);
assert.equal(dailyTraceSummary(travelDinner.latestEntry), "旅行归来，家里亮起了灯");

const stormAfterDinner = mergeDailyEntries([
  entry("2026-07-03", {
    food: true,
    primaryTrace: "food",
    rawText: "回家吃饭了",
    lifeEvents: [{ key: "food", fullLabel: "厨房烟火" }],
  }),
  {
    ...entry("2026-07-03", {
      stormWeather: true,
      windy: true,
      primaryTrace: "weather-storm",
      rawText: "外面狂风暴雨，不敢出去",
      lifeEvents: [{ key: "weather-storm", fullLabel: "风雨天气" }],
    }),
    createdAt: "2026-07-03T18:00:00.000Z",
  },
]);
assert.equal(stormAfterDinner.stormWeather, true);
assert.equal(stormAfterDinner.windy, true);
assert.equal(stormAfterDinner.food, true);
assert.equal(stormAfterDinner.primaryTrace, "weather-storm");
assert.equal(dailyTraceSummary(stormAfterDinner), "风雨天气");

const ordinaryWorkMonth = buildIslandState(
  Array.from({ length: 6 }, (_, index) =>
    entry(`2026-07-${String(index + 1).padStart(2, "0")}`, { work: true }),
  ),
);
assert.equal(ordinaryWorkMonth.patterns.busyWork, false);

const busyMonth = buildIslandState(
  Array.from({ length: 30 }, (_, index) =>
    entry(`2026-07-${String(index + 1).padStart(2, "0")}`, index < 20 ? { work: true } : { family: true }),
  ),
);
assert.equal(busyMonth.patterns.busyWork, true);
assert.equal(busyMonth.patterns.monthWorkCount, 20);

const monthlyWeather = buildMonthlyWeather(
  [
    entry("2026-07-01", { mood: "mood-bright" }),
    entry("2026-07-02", { mood: "mood-calm" }),
    entry("2026-07-03", { mood: "mood-tired" }),
    entry("2026-07-04", { mood: "mood-anxious", recovery: true }),
    entry("2026-07-05", { mood: "mood-angry" }),
    entry("2026-08-01", { mood: "mood-bright" }),
  ],
  "2026-07",
);
assert.deepEqual(monthlyWeather.counts, { bright: 1, calm: 1, low: 1, wind: 1, storm: 1 });
assert.equal(monthlyWeather.positiveDays, 2);
assert.equal(monthlyWeather.difficultDays, 3);
assert.equal(monthlyWeather.clearing, 1);

console.log(JSON.stringify({ passed: 11, failed: 0 }, null, 2));
