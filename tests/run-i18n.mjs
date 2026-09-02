import assert from "node:assert/strict";

await import("../i18n.js");

const i18n = globalThis.EmotionIslandI18n;

i18n.setLanguage("en");
assert.equal(i18n.t("hero.title"), "How was today?");
assert.equal(i18n.t("month.summary.overview", { days: 3 }), "Across these 3 days, the island slowly came alive.");
assert.equal(i18n.translate("小屋变化"), "Home growth");
assert.equal(i18n.locale(), "en-US");

i18n.setLanguage("zh");
assert.equal(i18n.t("hero.title"), "今天过得怎么样？");
assert.equal(i18n.translate("小屋变化"), "小屋变化");
assert.equal(i18n.locale(), "zh-CN");

console.log(JSON.stringify({ passed: 7, failed: 0 }, null, 2));
