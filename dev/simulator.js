const lifeDays = [
  "去杭州旅行，沿着西湖跑步，晚上在湖边搭了帐篷。",
  "早上跑步五公里，阳光刚好，整个人很轻松。",
  "和大学朋友见面聚会，大家一起吃饭，聊到晚上都舍不得走。",
  "去厦门旅行，在海边看了漂亮的日落，还拍了照片做成明信片。",
  "晚上去健身房运动，练完洗澡特别舒服。",
  "朋友来家里聚餐，我们边吃边聊天。",
  "周末去爬山，路上拍了很多风景。",
  "去了成都旅行，吃了很多当地小吃。",
  "和朋友约会喝咖啡，聊了最近的生活。",
  "今天骑车沿江走了一圈，风吹得很舒服。",
  "去云南度假，换个地方看云，心情很松。",
  "和老同学聚会，大家聊起以前的事。",
  "早上做瑜伽，晚上游泳，运动量有点大。",
  "去海边旅行，听了一整天海浪。",
  "朋友约我去看展，逛完一起吃饭。",
  "今天跑步又拉伸，身体比前几天轻快。",
  "去苏州旅行，沿着老街慢慢逛。",
  "和朋友打球，结束后一起喝饮料聊天。",
  "周末和几位朋友聚餐，笑了一晚上。",
  "去青岛旅行，在海边吹了很久的风。",
  "晚上去健身房运动，顺便给自己放空。",
  "和朋友见面逛街，临时决定一起看电影。",
  "去爬山旅行，累但风景特别好。",
  "晨跑、拉伸，洗完澡后今天身体很有活力。",
  "朋友来家里做客，我们聊天到很晚。",
  "去大理旅游，湖边的风让人很放松。",
  "和朋友聚会，大家一起吃饭聊天。",
  "今天骑车去公园，顺便和朋友碰面。",
  "去澳门旅行，回来后和朋友分享照片。",
  "约朋友去郊外徒步旅行，晚上一起野餐吃饭。",
];

const lifeDaysEnglish = [
  "Traveled to Hangzhou, ran beside West Lake, and camped by the water at night.",
  "Ran five kilometers in the morning. The sunlight was just right, and I felt light.",
  "Met friends from university for dinner and stayed talking until late.",
  "Traveled to Xiamen, watched a beautiful sunset by the sea, and made a postcard.",
  "Worked out at the gym in the evening. The shower afterward felt wonderful.",
  "Friends came over for dinner. We ate and talked at the same time.",
  "Hiked this weekend and took lots of photos of the view.",
  "Traveled to Chengdu and tried lots of local snacks.",
  "Met a friend for coffee and caught up on life lately.",
  "Cycled along the river. The wind felt just right.",
  "Took a break in Yunnan and watched the clouds somewhere new.",
  "Met old classmates and talked about the things we used to do.",
  "Did yoga in the morning and swam at night. It was a lot of exercise.",
  "Traveled to the seaside and listened to the waves all day.",
  "Visited an exhibition with a friend, then had dinner together.",
  "Ran and stretched today. My body feels lighter than it did a few days ago.",
  "Traveled to Suzhou and wandered slowly through the old streets.",
  "Played ball with friends, then had drinks and talked afterward.",
  "Had dinner with a few friends and laughed all evening.",
  "Traveled to Qingdao and stood in the sea wind for a long time.",
  "Worked out at the gym and gave myself some quiet space afterward.",
  "Went shopping with a friend and decided to see a movie on the way.",
  "Hiked while traveling. I was tired, but the view was worth it.",
  "Ran and stretched this morning. After a shower, I felt full of energy.",
  "A friend came over, and we talked late into the night.",
  "Visited Dali. The wind by the lake made everything feel calm.",
  "Got together with friends for food and conversation.",
  "Cycled to the park and happened to meet a friend there.",
  "Traveled to Macau and shared the photos with friends afterward.",
  "Hiked in the countryside with friends, then had a picnic at night.",
];

const scenarioConfigs = {
  life: {
    labelKey: "sim.scenario.life.label",
    copyKey: "sim.scenario.life.copy",
    entries: lifeDays,
  },
};

const traceNameKeys = {
  homeMilestone: "sim.trace.homeMilestone",
  travel: "sim.trace.travel",
  family: "sim.trace.family",
  exercise: "sim.trace.exercise",
  social: "sim.trace.social",
  learning: "sim.trace.learning",
  food: "sim.trace.food",
  work: "sim.trace.work",
  "": "sim.trace.empty",
};

const i18n = globalThis.EmotionIslandI18n;
const t = (key, vars = {}) => i18n?.t(key, vars) ?? key;

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSampleEntries(texts) {
  const firstDay = new Date();
  firstDay.setHours(12, 0, 0, 0);
  firstDay.setDate(1);

  return texts.map((text, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    const analyzed = globalThis.EmotionIslandAnalyzer.analyzeText(text);
    return {
      ...analyzed,
      id: `sim-day-${index + 1}`,
      date: formatDateKey(date),
      createdAt: new Date(date.getTime() + 8 * 60 * 60 * 1000).toISOString(),
    };
  });
}

const scenarioKey = "life";
const scenarioConfig = scenarioConfigs[scenarioKey];
let entries = buildSampleEntries(scenarioConfig.entries);
const range = document.querySelector("#day-range");
const frame = document.querySelector("#island-frame");
const scenarioKicker = document.querySelector("#sim-scenario-kicker");
const scenarioTitle = document.querySelector("#sim-scenario-title");
const scenarioCopy = document.querySelector("#sim-scenario-copy");
const dayOutput = document.querySelector("#day-output");
const dateOutput = document.querySelector("#date-output");
const textOutput = document.querySelector("#text-output");
const traceOutput = document.querySelector("#trace-output");
const summaryOverview = document.querySelector("#sim-month-summary-overview");
const summaryPalette = document.querySelector("#sim-life-palette");
const summaryEmpty = document.querySelector("#sim-month-summary-empty");
const playButton = document.querySelector("#play-days");
const summaryPaletteRenderer = globalThis.EmotionIslandLifePalette.createLifePalette(summaryPalette);
let playTimer = 0;

function applyScenarioCopy() {
  document.title = `${t("app.title")} · ${t(scenarioConfig.labelKey)}`;
  scenarioKicker.textContent = t("sim.kicker");
  scenarioTitle.textContent = t(scenarioConfig.labelKey);
  scenarioCopy.textContent = t(scenarioConfig.copyKey);
}

applyScenarioCopy();

function syncPlaybackLabel() {
  const label = t(playTimer ? "sim.pause" : "sim.play");
  playButton.setAttribute("aria-label", label);
  playButton.title = label;
}

syncPlaybackLabel();
function syncPreviewHeight() {
  window.requestAnimationFrame(() => {
    const previewHeight = frame.contentDocument?.documentElement.scrollHeight;
    if (previewHeight) frame.style.height = `${previewHeight}px`;
  });
}

function renderSummary(state, visibleEntries) {
  const paletteItems = globalThis.EmotionIslandState.buildLifePalette(visibleEntries);
  summaryPaletteRenderer.render(paletteItems);
  summaryOverview.textContent = state.dayCount
    ? t("sim.overview", { days: state.dayCount })
    : t("sim.emptyOverview");
  summaryEmpty.textContent = state.dayCount ? "" : t("sim.emptyPrompt");
}

function renderDay(dayNumber) {
  const index = Math.max(0, Math.min(entries.length - 1, Number(dayNumber) - 1));
  const entry = entries[index];
  range.value = String(index + 1);
  dayOutput.textContent = t("sim.day", { day: index + 1 });
  dateOutput.textContent = entry.date;
  textOutput.textContent = i18n?.getLanguage?.() === "en" ? lifeDaysEnglish[index] : entry.rawText;

  const previewApp = frame.contentWindow?.EmotionIslandApp;
  if (!previewApp) return;
  const state = previewApp.previewEntries(entries, entry.date);
  traceOutput.textContent = t(traceNameKeys[state.latestTrace] || traceNameKeys[""]);
  renderSummary(state, entries.filter((item) => item.date <= entry.date));
  syncPreviewHeight();
}

function stopPlayback() {
  window.clearInterval(playTimer);
  playTimer = 0;
  playButton.classList.remove("is-playing");
  syncPlaybackLabel();
}

function togglePlayback() {
  if (playTimer) {
    stopPlayback();
    return;
  }
  if (Number(range.value) >= 30) renderDay(1);
  playButton.classList.add("is-playing");
  syncPlaybackLabel();
  playTimer = window.setInterval(() => {
    const nextDay = Number(range.value) + 1;
    if (nextDay > 30) {
      stopPlayback();
      return;
    }
    renderDay(nextDay);
  }, 750);
}

range.addEventListener("input", () => {
  stopPlayback();
  renderDay(range.value);
});

playButton.addEventListener("click", togglePlayback);
frame.addEventListener("load", () => renderDay(30));
document.querySelector("#language-toggle")?.addEventListener("click", () => i18n?.toggle?.());
document.addEventListener("emotion-island-language-change", () => {
  applyScenarioCopy();
  i18n?.applyStatic?.(document);
  syncPlaybackLabel();
  frame.contentWindow?.EmotionIslandI18n?.setLanguage(i18n?.getLanguage?.());
  renderDay(range.value);
});
