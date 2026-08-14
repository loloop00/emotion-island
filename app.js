const storageKey = "emotion-island.entries.v1";
const dailyEntryLimit = 3;
const dailyEntryLimitMessage = "今天的生活已经收好啦，明天再来继续。";
const {
  analysisVersion,
  featureRules,
  lifeEventRules,
  analyzeText,
  todayKey,
} = globalThis.EmotionIslandAnalyzer;
const {
  buildIslandState,
  buildLifePalette,
  buildMonthlyWeather,
  moodCategory,
  resolvePrimaryTrace,
  dailyTraceSummary,
  visibleEntries,
} = globalThis.EmotionIslandState;

const growthClassPrefixes = [
  "home-level-",
  "travel-level-",
  "family-warmth-",
  "path-level-",
  "social-level-",
  "learning-level-",
  "kitchen-level-",
  "harbor-level-",
];

const emotionCorrectionOptions = [
  {
    value: "开心",
    emotion: "开心",
    mood: "mood-bright",
    label: "开心",
    line: "今天海面闪着光，小岛多了一点轻快。",
    icon: "☀️",
    family: "bright",
    detail: "海面闪着光，小岛多了一点轻快",
    weatherLevel: "weather-light",
  },
  {
    value: "平静",
    emotion: "平静",
    mood: "mood-calm",
    label: "平静",
    line: "海面恢复平静了。",
    icon: "🌤️",
    family: "calm",
    detail: "海面恢复平静了",
    weatherLevel: "weather-light",
  },
  {
    value: "失落",
    emotion: "悲伤",
    mood: "mood-sad",
    label: "失落",
    line: "今天下了小雨，灯塔把路照得更近了。",
    icon: "🌧️",
    family: "melancholy",
    detail: "今天下了小雨，灯塔把路照得更近了",
    weatherLevel: "weather-medium",
  },
  {
    value: "焦虑",
    emotion: "焦虑",
    mood: "mood-anxious",
    label: "焦虑",
    line: "今天风有点大，但灯塔一直亮着。",
    icon: "🌫️",
    family: "wind",
    detail: "天色有点深，灯会替你留着",
    weatherLevel: "weather-heavy",
    windy: true,
  },
  {
    value: "害怕",
    emotion: "焦虑",
    mood: "mood-anxious",
    label: "害怕",
    line: "刚才那一下太近了，灯塔替你留着一盏灯。",
    icon: "🌫️",
    family: "shadow",
    detail: "刚才那一下太近了，灯塔替你留着一盏灯",
    weatherLevel: "weather-heavy",
    windy: true,
  },
  {
    value: "生气",
    emotion: "愤怒",
    mood: "mood-angry",
    label: "生气",
    line: "今天浪高了一点，但岸边还在等你回来。",
    icon: "🌊",
    family: "conflict",
    detail: "海面起了风浪，先把自己抱回来",
    weatherLevel: "weather-heavy",
    windy: true,
  },
  {
    value: "烦躁",
    emotion: "烦躁",
    mood: "mood-irritable",
    label: "阳光有点强",
    line: "今天的阳光有点强，小岛替你挡一会儿。",
    icon: "☀️",
    family: "irritable",
    detail: "阳光有点强，先找一片阴影",
    weatherLevel: "weather-light",
    heatWeather: true,
  },
  {
    value: "疲惫",
    emotion: "疲惫",
    mood: "mood-tired",
    label: "疲惫",
    line: "今天的风慢了一些，小岛也陪你歇一会。",
    icon: "☁️",
    family: "low",
    detail: "今天的风慢了一些，小岛也陪你歇一会",
    weatherLevel: "weather-medium",
  },
];

const elements = {
  body: document.body,
  input: document.querySelector("#daily-input"),
  submit: document.querySelector("#submit-day"),
  mic: document.querySelector("#mic-button"),
  voiceBox: document.querySelector("#voice-box"),
  voiceStatus: document.querySelector("#voice-status"),
  voiceHint: document.querySelector("#voice-hint"),
  islandLine: document.querySelector("#island-line"),
  entryAmbient: document.querySelector("#entry-ambient"),
  entryAmbientCopy: document.querySelector("#entry-ambient-copy"),
  islandFeedback: document.querySelector("#island-feedback"),
  islandFeedbackSummary: document.querySelector("#island-feedback-summary"),
  islandFeedbackConfirm: document.querySelector("#island-feedback-confirm"),
  islandFeedbackEdit: document.querySelector("#island-feedback-edit"),
  islandFeedbackOptions: document.querySelector("#island-feedback-options"),
  islandEventNote: document.querySelector("#island-event-note"),
  islandEventNoteTitle: document.querySelector("#island-event-note-title"),
  islandEventNoteDetail: document.querySelector("#island-event-note-detail"),
  islandArt: document.querySelector("#island-art"),
  sky: document.querySelector("#sky"),
  dayList: document.querySelector("#day-list"),
  memoryDetail: document.querySelector("#memory-detail"),
  memoryTimelineScroll: document.querySelector(".memory-timeline-scroll"),
  memoryMenu: document.querySelector("#memory-menu"),
  toast: document.querySelector("#toast"),
  historyDialog: document.querySelector("#history-dialog"),
  historyContent: document.querySelector("#history-content"),
  showHistory: document.querySelector("#show-history"),
  resetDemo: document.querySelector("#reset-demo"),
  clearToday: document.querySelector("#clear-today"),
  stage: document.querySelector("#island-stage"),
  toggleView: document.querySelector("#toggle-view"),
  toggleViewLabel: document.querySelector(".view-switch-label"),
  travelMarker: document.querySelector("#travel-marker"),
  travelMarkerTitle: document.querySelector("#travel-marker-title"),
  showMonth: document.querySelector("#show-month"),
  monthDialog: document.querySelector("#month-dialog"),
  monthDialogKicker: document.querySelector("#month-dialog-kicker"),
  monthSummary: document.querySelector("#month-summary"),
  monthBalance: document.querySelector("#month-balance"),
  monthCalendar: document.querySelector("#month-calendar"),
  monthProgressLabel: document.querySelector("#month-progress-label"),
  monthPlay: document.querySelector("#month-play"),
  monthProgressRange: document.querySelector("#month-progress-range"),
  monthDayDate: document.querySelector("#island-day-date"),
  monthDayText: document.querySelector("#island-day-text"),
  monthDayTrace: document.querySelector("#island-day-trace"),
  monthTraceOverview: document.querySelector("#month-trace-overview"),
  lifePalette: document.querySelector("#life-palette"),
  monthTraceEmpty: document.querySelector("#month-trace-empty"),
};

let recognition = null;
let listening = false;
let viewRevision = 0;
let selectedMemoryDate = "";
let activeMonthEntries = [];
let lifePaletteRenderer = null;
let monthPlayTimer = 0;

function loadEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(storageKey) || "[]");
    let migrated = false;
    const normalizedEntries = entries.map((entry) => {
      if (!entry.rawText || entry.analysisVersion === analysisVersion) return applyStoredCorrections(entry);

      migrated = true;
      const updated = analyzeText(entry.rawText);
      return applyStoredCorrections({
        ...entry,
        ...updated,
        id: entry.id,
        date: entry.date,
        createdAt: entry.createdAt,
        rawText: entry.rawText,
      });
    });
    if (migrated) localStorage.setItem(storageKey, JSON.stringify(normalizedEntries));
    return normalizedEntries;
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function upsertToday(entry) {
  const entries = loadEntries();
  const entryCount = entries.filter((item) => item.date === entry.date).length;
  if (entryCount >= dailyEntryLimit) {
    return {
      entry: visibleEntries(entries).find((item) => item.date === entry.date) || null,
      entries,
      limitReached: true,
    };
  }
  const storedEntry = {
    ...entry,
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: entry.createdAt || new Date().toISOString(),
  };
  entries.unshift(storedEntry);
  const savedEntries = entries.slice(0, 90);
  saveEntries(savedEntries);
  const dailyEntry = visibleEntries(savedEntries).find((item) => item.date === storedEntry.date) || storedEntry;
  return { entry: dailyEntry, rawEntry: storedEntry, entries: savedEntries };
}

function emotionOptionForEntry(entry) {
  const correctionLabel = entry?.correction?.emotionLabel;
  if (correctionLabel) return emotionCorrectionOptions.find((option) => option.value === correctionLabel) || null;
  return null;
}

function displayEmotionLabel(entry) {
  return entry?.correction?.emotionLabel || (entry?.fear ? "害怕" : null) || {
    悲伤: "失落",
    愤怒: "生气",
    "身体不适": "身体不适",
  }[entry?.emotion] || entry?.emotion || "平静";
}

function withoutEmotionEvents(events) {
  return (Array.isArray(events) ? events : []).filter(
    (event) => !String(event?.key || "").startsWith("emotion-") && event?.key !== "weather-storm",
  );
}

function applyEmotionOption(entry, option) {
  if (!option) return entry;
  const next = {
    ...entry,
    emotion: option.emotion,
    mood: option.mood,
    label: option.label,
    line: option.line,
    icon: option.icon,
    weatherLevel: option.weatherLevel,
    windy: Boolean(option.windy),
    heatWeather: Boolean(option.heatWeather),
    emotionAmbiguous: false,
    correction: {
      ...(entry.correction || {}),
      emotionLabel: option.value,
    },
  };
  next.lifeEvents = [
    ...withoutEmotionEvents(entry.lifeEvents),
    {
      key: `emotion-corrected:${option.value}`,
      sourceWord: "用户修正",
      family: option.family,
      fullLabel: option.label,
      shortLabel: option.value,
      detail: option.detail,
    },
  ];
  return next;
}

function eventRuleForKey(eventKey) {
  const baseKey = String(eventKey || "").split(":")[0];
  return (lifeEventRules || []).find((rule) => rule.key === baseKey) || null;
}

function removeEventFromEntry(entry, eventKey) {
  const rule = eventRuleForKey(eventKey);
  const next = {
    ...entry,
    emotionAmbiguous: false,
    lifeEvents: (Array.isArray(entry.lifeEvents) ? entry.lifeEvents : []).filter((event) => event.key !== eventKey && event.key !== rule?.key),
    correction: {
      ...(entry.correction || {}),
      removedEventKeys: [...new Set([...(entry.correction?.removedEventKeys || []), eventKey])],
    },
  };

  if (rule?.featureKey) next[rule.featureKey] = false;
  if (rule?.signalKey) next[rule.signalKey] = false;
  rule?.signalKeys?.forEach((key) => {
    next[key] = false;
  });
  return next;
}

function applyStoredCorrections(entry) {
  let corrected = { ...entry };
  const emotionOption = emotionOptionForEntry(corrected);
  if (emotionOption) corrected = applyEmotionOption(corrected, emotionOption);
  if (corrected.correction?.emotionConfirmed) corrected.emotionAmbiguous = false;
  (corrected.correction?.removedEventKeys || []).forEach((eventKey) => {
    corrected = removeEventFromEntry(corrected, eventKey);
  });
  return corrected;
}

function replaceStoredEntry(updatedEntry) {
  const entries = loadEntries();
  const index = entries.findIndex((entry) => entry.id === updatedEntry.id);
  if (index < 0) return entries;
  entries[index] = updatedEntry;
  saveEntries(entries);
  return entries;
}

function clearGrowthClasses(element) {
  for (const className of [...element.classList]) {
    if (growthClassPrefixes.some((prefix) => className.startsWith(prefix))) {
      element.classList.remove(className);
    }
  }
}

function syncBusyFleet(workDays) {
  const boats = [...elements.islandArt.querySelectorAll(".busy-boat-position")];
  const visibleBoatCount = workDays
    ? Math.min(boats.length, Math.max(1, Math.ceil((Math.min(workDays, 30) / 30) * boats.length)))
    : 0;

  elements.stage.dataset.busyFleetBoats = String(visibleBoatCount);
  boats.forEach((boat, index) => {
    boat.classList.toggle("is-visible", index < visibleBoatCount);
  });
  return visibleBoatCount;
}

function busyWorkLine(workDays) {
  if (workDays >= 28) return "今天港湾很忙，船影已经绕着小岛一圈了。";
  if (workDays >= 14) return "今天港湾很忙，船影正在沿着海岸铺开。";
  return "今天港湾很忙，船影正在一点点增加。";
}

function busyWorkMonthCopy(workDays) {
  if (workDays >= 28) return `这个月有 ${workDays} 天都在工作，船影已经绕着小岛一圈。`;
  if (workDays >= 14) return `这个月有 ${workDays} 天都在工作，船影也沿着海岸慢慢铺开。`;
  return `这个月有 ${workDays} 天都在工作，船影正在一点点增加。`;
}

function resizeTextInput() {
  if (!elements.input) return;
  const minHeight = 24;
  const maxHeight = 120;
  elements.input.style.height = "0px";
  const nextHeight = Math.min(Math.max(elements.input.scrollHeight, minHeight), maxHeight);
  elements.input.style.height = `${nextHeight}px`;
  elements.input.style.overflowY = elements.input.scrollHeight > maxHeight ? "auto" : "hidden";
}

function setVoiceState(state) {
  const transcript = elements.input.value.trim();
  const copy = {
    idle: ["点一下，慢慢说", "不用组织得很完整", "开始语音输入"],
    listening: ["正在听，慢慢说就好", "再点一下就暂停", "暂停语音输入"],
    recognized: ["听到了，准备更新小岛", "可以继续说，也可以直接更新小岛", "继续语音输入"],
    error: ["语音暂时不可用", "也可以用文字聊聊", "开始语音输入"],
    unsupported: ["可以用文字聊聊", "当前浏览器暂不支持语音输入", "语音输入不可用"],
  };
  const [status, hint, label] = copy[state] || copy.idle;

  elements.voiceBox.dataset.voiceState = state;
  elements.voiceBox.classList.toggle("is-listening", state === "listening");
  elements.voiceBox.classList.toggle("has-transcript", Boolean(transcript) && state !== "idle");
  elements.voiceBox.classList.toggle("is-error", state === "error" || state === "unsupported");
  elements.voiceStatus.textContent = status;
  elements.voiceHint.textContent = hint;
  elements.mic.setAttribute("aria-label", label);
  resizeTextInput();
}

function applyEntry(entry, options = {}) {
  const classes = [
    "mood-calm",
    "mood-bright",
    "mood-anxious",
    "mood-sad",
    "mood-angry",
    "mood-irritable",
    "mood-unwell",
    "mood-tired",
    "mood-flat",
  ];
  const weatherClasses = ["is-windy", "is-clearing", "is-hot", "is-rain", "is-storm", "weather-light", "weather-medium", "weather-heavy"];
  const ambientClasses = ["ambient-calm", "ambient-bright", "ambient-cloud", "ambient-hot", "ambient-rain", "ambient-storm", "ambient-wind"];
  const featureClasses = featureRules.map((rule) => rule.className);
  elements.sky.classList.remove(...classes);
  elements.sky.classList.remove(...weatherClasses);
  elements.stage.classList.remove(...featureClasses);
  elements.stage.classList.remove("is-busy-work-month", "has-busy-fleet");
  elements.stage.classList.remove("has-lighthouse-light");
  elements.islandArt.classList.remove(...featureClasses);
  clearGrowthClasses(elements.stage);

  elements.sky.classList.add(entry.mood || "mood-calm");
  if (entry.windy) elements.sky.classList.add("is-windy");
  if (entry.recovery) elements.sky.classList.add("is-clearing");
  const isStormWeather = Boolean(entry.stormWeather);
  const isHotWeather = !isStormWeather && Boolean(entry.heatWeather || entry.mood === "mood-irritable");
  const isRainWeather = !isStormWeather && !isHotWeather && ["mood-sad", "mood-angry"].includes(entry.mood);
  if (isHotWeather) elements.sky.classList.add("is-hot");
  if (isRainWeather) elements.sky.classList.add("is-rain");
  if (isStormWeather) elements.sky.classList.add("is-storm");
  elements.sky.classList.add(entry.weatherLevel || "weather-medium");
  if (String(entry.line || "").includes("灯塔") || entry.stormWeather) {
    elements.stage.classList.add("has-lighthouse-light");
  }
  elements.entryAmbient?.classList.remove(...ambientClasses);
  const ambientMode = entry.stormWeather
    ? "ambient-storm"
    : entry.heatWeather || entry.mood === "mood-irritable"
      ? "ambient-hot"
      : entry.mood === "mood-sad"
        ? "ambient-rain"
        : entry.mood === "mood-anxious" || entry.mood === "mood-angry" || entry.windy
          ? "ambient-wind"
          : entry.mood === "mood-bright"
            ? "ambient-bright"
            : entry.mood === "mood-tired" || entry.mood === "mood-unwell" || entry.mood === "mood-flat"
              ? "ambient-cloud"
              : "ambient-calm";
  elements.entryAmbient?.classList.add(ambientMode);
  if (elements.entryAmbientCopy) elements.entryAmbientCopy.textContent = ambientSceneLine(entry);
  const entries = options.entries || loadEntries();
  const visibleEntries = options.cutoffDate
    ? entries.filter((item) => item.date <= options.cutoffDate)
    : entries;
  const islandState = buildIslandState(visibleEntries, options.cutoffDate);

  featureRules.forEach((rule) => {
    if (islandState.features[rule.key]) elements.stage.classList.add(rule.className);
  });
  const levelClasses = [
    `home-level-${islandState.levels.home}`,
    `travel-level-${islandState.levels.travel}`,
    `family-warmth-${islandState.levels.family}`,
    `path-level-${islandState.levels.path}`,
    `social-level-${islandState.levels.social}`,
    `learning-level-${islandState.levels.learning}`,
    `kitchen-level-${islandState.levels.kitchen}`,
    `harbor-level-${islandState.levels.harbor}`,
  ];
  elements.stage.classList.add(...levelClasses);
  const visibleBusyBoats = syncBusyFleet(islandState.patterns.monthWorkCount);
  if (visibleBusyBoats) elements.stage.classList.add("has-busy-fleet");
  if (islandState.patterns.busyWork) elements.stage.classList.add("is-busy-work-month");
  elements.stage.dataset.islandDays = String(islandState.dayCount);
  elements.stage.dataset.latestTrace = islandState.latestTrace;

  const latestTravel = islandState.travelMemories[0];
  if (elements.travelMarker) {
    const hasTravel = Boolean(latestTravel);
    elements.travelMarker.setAttribute("aria-hidden", String(!hasTravel));
    elements.travelMarker.setAttribute("tabindex", hasTravel ? "0" : "-1");
    elements.travelMarker.dataset.place = latestTravel?.place || "远方";
    elements.travelMarker.dataset.date = latestTravel?.createdAt || "";
    if (elements.travelMarkerTitle) {
      elements.travelMarkerTitle.textContent = hasTravel
        ? `从${latestTravel.place || "远方"}带回的旅行小旗`
        : "旅行小旗";
    }
  }
  elements.islandLine.textContent = islandState.patterns.busyWork
    ? busyWorkLine(islandState.patterns.monthWorkCount)
    : weatherAwareEntryLine(entry);
  return islandState;
}

function applyWaitingForTodayState(entries = []) {
  const hasPreviousRecord = visibleEntries(entries).length > 0;
  applyEntry(
    {
      mood: "mood-calm",
      line: "今天的小岛，正在等你带回一点生活。",
      weatherLevel: "weather-light",
    },
    { entries },
  );
  elements.islandLine.textContent = hasPreviousRecord
    ? "小岛还记得上次的风景，今天在等你。"
    : "今天的小岛，正在等你带回一点生活。";
  if (elements.entryAmbientCopy) {
    elements.entryAmbientCopy.textContent = hasPreviousRecord
      ? "今天还没有新的变化，海面先安静着。"
      : "海面还在轻轻动着。";
  }
}

function animateIslandUpdate(entry, revealKey = "") {
  const revealClasses = featureRules.map((rule) => `reveal-${rule.key}`);
  const requestedKeys = Array.isArray(revealKey) ? revealKey : [revealKey];
  const traces = [...new Set([
    ...requestedKeys.filter((key) => featureRules.some((rule) => rule.key === key)),
    resolvePrimaryTrace(entry),
  ].filter(Boolean))];
  elements.stage.classList.remove("is-updating", ...revealClasses);
  void elements.stage.offsetWidth;
  elements.stage.classList.add("is-updating");
  elements.stage.classList.add(...traces.map((trace) => `reveal-${trace}`));
  window.clearTimeout(animateIslandUpdate.timer);
  animateIslandUpdate.timer = window.setTimeout(() => {
    elements.stage.classList.remove("is-updating", ...revealClasses);
  }, 6500);
}

function describeIslandUpdate(entry) {
  const changes = [];
  const primaryTrace = resolvePrimaryTrace(entry);
  if (entry.stormWeather) changes.push("风雨经过海面");
  if (entry.mood === "mood-anxious") changes.push("云和风出现了");
  if (entry.mood === "mood-sad") changes.push("岛上下起了小雨");
  if (entry.mood === "mood-angry") changes.push("风浪变大了");
  if (entry.mood === "mood-irritable" || entry.heatWeather) changes.push("阳光更强了");
  if (entry.mood === "mood-bright") changes.push("阳光亮起来了");
  if (entry.mood === "mood-unwell") changes.push("岛上起了薄雾");
  if (entry.mood === "mood-tired") changes.push("风慢了下来");
  if (entry.mood === "mood-flat") changes.push("海面安静了一些");
  const traceDescriptions = {
    homeMilestone: "小屋有了新的房间",
    travel: "小船带回了一面旅行小旗",
    exercise: "步道向前延伸了",
    camping: "岛上搭起了一顶帐篷",
    family: "小屋的灯更暖了",
    social: "篝火留下了相聚的温度",
    learning: "书页多了一点痕迹",
    work: "远处的船多了一点动静",
    food: "小屋多了一点烟火气",
    running: "草地上绕出了一圈跑步线",
    cycling: "岛边多了一个自行车架",
    postcard: "远方寄来了一张明信片",
    tent: "远方和脚步搭起了一顶帐篷",
    picnic: "草地上摆开了一张野餐桌",
    drink: "篝火旁多了一杯饮料",
  };
  if (primaryTrace) changes.push(traceDescriptions[primaryTrace]);
  return changes.slice(0, 2).join("，") || "海面有了一点新的变化";
}

function ambientSceneLine(entry) {
  if (!entry) return "海面还在轻轻动着。";
  if (entry.stormWeather) return "狂风经过海面，灯塔替小岛守着光。";
  if (entry.heatWeather || entry.mood === "mood-irritable") return "阳光落在海面上，亮得有些热。";
  if (entry.mood === "mood-sad") return "小雨落下来，海面慢慢起了纹。";
  if (entry.mood === "mood-anxious" || entry.mood === "mood-angry" || entry.windy) return "风从海面经过，树影也跟着动了。";
  if (entry.mood === "mood-bright") return "海面闪着光，远处的云慢慢往右飘。";
  if (entry.mood === "mood-tired") return "风慢了下来，海面陪你歇一会儿。";
  return "海面还在轻轻动着。";
}

function weatherAwareEntryLine(entry) {
  if (entry?.stormWeather) return "狂风暴雨经过海面，灯塔替小岛守着光。";
  if (entry?.heatWeather) return "今天的阳光有点强，小岛替你挡一会儿。";
  return entry?.line || "海面恢复平静了。";
}

function feedbackEventList(entry) {
  return (Array.isArray(entry?.lifeEvents) ? entry.lifeEvents : []).filter(
    (event) => !String(event?.key || "").startsWith("emotion-") && event?.key !== "weather-storm",
  );
}

function feedbackSummary(entry) {
  const emotion = displayEmotionLabel(entry);
  const events = feedbackEventList(entry)
    .map((event) => event.shortLabel || event.fullLabel)
    .filter(Boolean)
    .slice(0, 2);
  return `我听见了：${[emotion, ...events].join(" · ")}`;
}

function renderFeedbackOptions(entry) {
  if (!elements.islandFeedbackOptions) return;
  const currentEmotion = displayEmotionLabel(entry);
  const events = feedbackEventList(entry);
  const emotionButtons = emotionCorrectionOptions
    .map(
      (option) => `
        <button class="feedback-chip ${option.value === currentEmotion ? "is-current" : ""}" type="button" data-feedback-emotion="${escapeHtml(option.value)}">
          ${escapeHtml(option.value)}
        </button>`,
    )
    .join("");
  const eventButtons = events.length
    ? `
      <div class="feedback-option-row">
        <span>痕迹</span>
        ${events
          .map(
            (event) => `
              <button class="feedback-chip feedback-chip-remove" type="button" data-feedback-remove-event="${escapeHtml(event.key)}">
                去掉${escapeHtml(event.shortLabel || event.fullLabel || "这件事")}
              </button>`,
          )
          .join("")}
      </div>`
    : "";
  elements.islandFeedbackOptions.innerHTML = `
    <div class="feedback-option-row">
      <span>情绪</span>
      ${emotionButtons}
    </div>
    ${eventButtons}`;
}

function showInterpretationFeedback(entry, { openOptions = false } = {}) {
  if (!elements.islandFeedback) return;
  if (!entry?.emotionAmbiguous) {
    hideInterpretationFeedback();
    return;
  }
  elements.islandFeedback.hidden = false;
  elements.islandFeedback.dataset.entryId = entry.id || "";
  elements.islandFeedbackSummary.textContent = feedbackSummary(entry);
  renderFeedbackOptions(entry);
  elements.islandFeedbackOptions.hidden = !openOptions;
  elements.islandFeedbackEdit.textContent = openOptions ? "收起" : "改一下";
}

function hideInterpretationFeedback() {
  if (!elements.islandFeedback) return;
  elements.islandFeedback.hidden = true;
  elements.islandFeedbackOptions.hidden = true;
  elements.islandFeedback.dataset.entryId = "";
}

function confirmInterpretation() {
  const entryId = elements.islandFeedback?.dataset.entryId;
  if (!entryId) return;
  const current = loadEntries().find((entry) => entry.id === entryId);
  if (!current) {
    hideInterpretationFeedback();
    return;
  }
  replaceStoredEntry({
    ...current,
    emotionAmbiguous: false,
    emotionConfidence: "high",
    correction: {
      ...(current.correction || {}),
      emotionConfirmed: true,
    },
  });
  hideInterpretationFeedback();
}

function updateEntryFromFeedback(entryId, update) {
  const current = loadEntries().find((entry) => entry.id === entryId);
  if (!current) return;
  const updatedEntry = update(current);
  const nextEntries = replaceStoredEntry(updatedEntry);
  selectedMemoryDate = updatedEntry.date;
  applyEntry(updatedEntry, { entries: nextEntries });
  animateIslandUpdate(updatedEntry);
  renderDays();
  renderHistory();
  renderMonthTraces(nextEntries);
  hideInterpretationFeedback();
  showToast("已经按你的意思改好了。");
}

function handleFeedbackEmotion(optionValue) {
  const entryId = elements.islandFeedback?.dataset.entryId;
  const option = emotionCorrectionOptions.find((candidate) => candidate.value === optionValue);
  if (!entryId || !option) return;
  updateEntryFromFeedback(entryId, (entry) => applyEmotionOption(entry, option));
}

function handleFeedbackRemoveEvent(eventKey) {
  const entryId = elements.islandFeedback?.dataset.entryId;
  if (!entryId || !eventKey) return;
  updateEntryFromFeedback(entryId, (entry) => removeEventFromEntry(entry, eventKey));
}

const eventNoteCatalog = {
  homeMilestone: { title: "小屋变化", detail: "小屋正在慢慢长大" },
  travel: { title: "旅行记忆", detail: "岛上留下一段远方" },
  family: { title: "家庭灯光", detail: "窗里亮起一盏灯" },
  exercise: { title: "运动", detail: "草地出现一小段路" },
  social: { title: "朋友相聚", detail: "篝火刚刚点亮" },
  learning: { title: "阅读学习", detail: "屋旁多了一页书" },
  food: { title: "厨房烟火", detail: "屋里渐渐有了饭香" },
  running: { title: "跑步环线", detail: "草地上绕出了一圈轻快的脚步" },
  cycling: { title: "自行车架", detail: "岛边有了一个停放脚步的地方" },
  postcard: { title: "明信片", detail: "远方寄来了一张带着风景的明信片" },
  tent: { title: "帐篷", detail: "远方和脚步，在岛上搭起了一处歇脚处" },
  camping: { title: "露营", detail: "岛上搭起了一顶帐篷" },
  picnic: { title: "野餐桌", detail: "草地上摆开了一张野餐桌" },
  drink: { title: "饮料", detail: "篝火旁多了一杯可以慢慢喝的饮料" },
};

function newlyAddedEvent(entry, previousEntries, nextEntries) {
  const previousState = buildIslandState(previousEntries);
  const nextState = buildIslandState(nextEntries);
  const featureOrder = [
    "camping",
    "tent",
    "picnic",
    "postcard",
    "running",
    "cycling",
    "drink",
    ...Object.keys(eventNoteCatalog),
  ];
  const feature = [...new Set(featureOrder)].find(
    (key) => nextState.features[key] && !previousState.features[key],
  );
  if (feature) return { key: feature, ...eventNoteCatalog[feature] };

  const previousKeys = new Set(previousEntries.flatMap((item) => (item.lifeEvents || []).map((event) => event.key)));
  const event = feedbackEventList(entry).find((item) => !previousKeys.has(item.key));
  if (!event) return null;
  return {
    key: event.key,
    title: event.fullLabel || event.shortLabel || "新的生活",
    detail: event.detail || "岛上留下了一点新的生活痕迹",
  };
}

function showEventNote(note) {
  if (!elements.islandEventNote) return;
  window.clearTimeout(showEventNote.timer);
  if (!note) {
    elements.islandEventNote.hidden = true;
    return;
  }
  elements.islandEventNoteTitle.textContent = note.title;
  elements.islandEventNoteDetail.textContent = note.detail;
  elements.islandEventNote.hidden = false;
  showEventNote.timer = window.setTimeout(() => {
    elements.islandEventNote.hidden = true;
  }, 5000);
}

const soundFeatureByEntryField = {
  homeMilestone: "home",
  travel: "travel",
  family: "family",
  exercise: "nature",
  nature: "nature",
  social: "social",
  learning: "learning",
  food: "food",
  work: "work",
  drink: "drink",
  leisure: "leisure",
  direction: "direction",
  conflict: "conflict",
  health: "health",
};

const soundFeatureFamilies = new Set(Object.values(soundFeatureByEntryField));

function entrySoundFamilies(entry) {
  const eventFamilies = Array.isArray(entry?.lifeEvents)
    ? entry.lifeEvents.map((event) => soundFeatureByEntryField[event.family] || event.family).filter((family) => soundFeatureFamilies.has(family))
    : [];
  if (eventFamilies.length) return [...new Set(eventFamilies)];

  return Object.entries(soundFeatureByEntryField)
    .filter(([field]) => Boolean(entry?.[field]))
    .map(([, family]) => family)
    .filter((family, index, families) => families.indexOf(family) === index);
}

function weatherSoundKey(entry) {
  if (!entry) return "";
  if (entry.heatWeather || entry.mood === "mood-irritable") return "sun";
  if (entry.stormWeather || entry.mood === "mood-angry" || entry.weatherLevel === "weather-heavy") return "storm";
  if (entry.mood === "mood-sad") return "rain";
  if (entry.mood === "mood-anxious" || entry.windy) return "wind";
  if (entry.mood === "mood-bright") return "sun";
  if (entry.mood === "mood-tired" || entry.mood === "mood-unwell" || entry.weatherLevel === "weather-medium") return "cloud";
  return "wave";
}

function lifeFamilyCounts(entries) {
  return new Map(buildLifePalette(entries).map((item) => [item.family, item.count]));
}

function previousSoundEntry(entry, previousEntries) {
  const sameDay = previousEntries.find((item) => item.date === entry.date);
  if (sameDay) return sameDay;
  return previousEntries
    .filter((item) => item.date < entry.date)
    .sort((left, right) => String(left.date).localeCompare(String(right.date)))
    .at(-1);
}

function playEntrySounds(entry, previousEntries, nextEntries) {
  const sound = globalThis.EmotionIslandSound;
  if (!sound?.supported) return;

  const previousEntry = previousSoundEntry(entry, previousEntries);
  const currentWeather = weatherSoundKey(entry);
  const previousWeather = weatherSoundKey(previousEntry);
  const previousCounts = lifeFamilyCounts(previousEntries);
  const nextCounts = lifeFamilyCounts(nextEntries);
  const newFamilies = entrySoundFamilies(entry).filter(
    (family) => (nextCounts.get(family) || 0) > (previousCounts.get(family) || 0),
  );

  let delay = 90;
  if (currentWeather && currentWeather !== previousWeather) {
    window.setTimeout(() => sound.playWeather(currentWeather), delay);
    delay += 460;
  }

  newFamilies.slice(0, 3).forEach((family, index) => {
    window.setTimeout(() => sound.playFeature(family), delay + index * 220);
  });
}

function setIslandView(isFull) {
  elements.stage.classList.toggle("is-full", isFull);
  elements.body.classList.toggle("is-island-view", isFull);
  elements.toggleView.setAttribute("aria-pressed", String(isFull));
  const label = isFull ? "看海岸" : "回到小屋";
  elements.toggleView.setAttribute("aria-label", label);
  elements.toggleViewLabel.textContent = label;
  if (isFull) {
    window.requestAnimationFrame(() => lifePaletteRenderer?.refresh?.());
  }
}

function toggleIslandView() {
  viewRevision += 1;
  const isFull = !elements.stage.classList.contains("is-full");
  setIslandView(isFull);
  elements.toggleView.blur();
}

function revealPersistentEvent(entry) {
  const fullViewFeatures = [
    "homeMilestone",
    "camping",
    "travel",
    "running",
    "cycling",
    "postcard",
    "tent",
    "picnic",
    "drink",
  ];
  if (!fullViewFeatures.some((key) => Boolean(entry?.[key]))) return;
  const revisionAtSubmit = viewRevision;
  window.clearTimeout(revealPersistentEvent.timer);
  revealPersistentEvent.timer = window.setTimeout(() => {
    if (viewRevision === revisionAtSubmit) setIslandView(true);
  }, 950);
}

function recentDayKeys() {
  const days = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() - offset);
    days.push(todayKey(date));
  }
  return days;
}

function dateFromKey(dateKey) {
  return new Date(`${dateKey}T12:00:00`);
}

function inferMonthKey(entries) {
  const latestDate = (entries || [])
    .map((entry) => entry?.date)
    .filter(Boolean)
    .sort()
    .at(-1);
  return latestDate?.slice(0, 7) || todayKey().slice(0, 7);
}

function chronologicalMonthEntries(entries, monthKey) {
  return visibleEntries((entries || []).filter((entry) => entry?.date?.startsWith(monthKey)));
}

function islandTraceLabel(entry) {
  if (entry?.stormWeather) return "风雨天气";
  if (entry?.heatWeather) return "阳光有点强";
  const labels = {
    homeMilestone: "小屋变化",
    travel: "旅行记忆",
    family: "家庭灯光",
    exercise: "运动",
    social: "朋友相聚",
    learning: "阅读学习",
    food: "厨房烟火",
    work: "工作日常",
  };
  return dailyTraceSummary(entry) || labels[resolvePrimaryTrace(entry)] || "天气变化";
}

function syncMonthPlayButton(totalDays) {
  if (!elements.monthPlay) return;
  const canPlay = totalDays > 1;
  const isPlaying = Boolean(monthPlayTimer);
  elements.monthPlay.disabled = !canPlay;
  elements.monthPlay.classList.toggle("is-playing", isPlaying);
  elements.monthPlay.setAttribute("aria-label", isPlaying ? "暂停播放本月变化" : "播放本月变化");
  elements.monthPlay.title = isPlaying ? "暂停播放本月变化" : "播放本月变化";
}

function stopMonthPlayback() {
  if (monthPlayTimer) window.clearInterval(monthPlayTimer);
  monthPlayTimer = 0;
  syncMonthPlayButton(Number(elements.monthProgressRange?.max || 0));
}

function toggleMonthPlayback() {
  if (monthPlayTimer) {
    stopMonthPlayback();
    return;
  }

  const entries = loadEntries();
  const monthKey = inferMonthKey(entries);
  const monthEntries = chronologicalMonthEntries(entries, monthKey);
  if (monthEntries.length < 2) return;

  let currentIndex = Number(elements.monthProgressRange.value) || 0;
  if (currentIndex >= monthEntries.length) currentIndex = 0;

  const advance = () => {
    currentIndex += 1;
    const entry = monthEntries[currentIndex - 1];
    if (!entry) {
      stopMonthPlayback();
      return;
    }
    selectedMemoryDate = entry.date;
    applyEntry(entry, { entries, cutoffDate: entry.date });
    renderDays();
    renderMonthTraces(entries, entry.date);
    animateIslandUpdate(entry);
    if (currentIndex >= monthEntries.length) stopMonthPlayback();
  };

  monthPlayTimer = window.setInterval(advance, 1600);
  syncMonthPlayButton(monthEntries.length);
  advance();
}

function renderIslandDay(entry, currentIndex, totalDays) {
  if (!elements.monthProgressRange) return;

  if (!entry || !totalDays) {
    elements.monthProgressLabel.textContent = "还没有记录";
    elements.monthProgressRange.min = "0";
    elements.monthProgressRange.max = "0";
    elements.monthProgressRange.value = "0";
    elements.monthProgressRange.disabled = true;
    elements.monthDayDate.textContent = "";
    elements.monthDayText.textContent = "今天说一点生活，岛上就会留下第一道痕迹。";
    elements.monthDayTrace.textContent = "";
    syncMonthPlayButton(0);
    return;
  }

  const date = dateFromKey(entry.date);
  elements.monthProgressLabel.textContent = `第 ${currentIndex} 天`;
  elements.monthProgressRange.min = "1";
  elements.monthProgressRange.max = String(totalDays);
  elements.monthProgressRange.value = String(currentIndex);
  elements.monthProgressRange.disabled = false;
  elements.monthProgressRange.setAttribute("aria-valuemin", "1");
  elements.monthProgressRange.setAttribute("aria-valuemax", String(totalDays));
  elements.monthProgressRange.setAttribute("aria-valuenow", String(currentIndex));
  elements.monthProgressRange.setAttribute("aria-valuetext", `第 ${currentIndex} 天，${entry.rawText || "当天记录"}`);
  elements.monthDayDate.textContent = `${date.getMonth() + 1}月${date.getDate()}日`;
  elements.monthDayText.textContent = entry.rawText || "这一天，小岛留下了一点生活。";
  elements.monthDayTrace.textContent = `主要痕迹：${islandTraceLabel(entry)}`;
  syncMonthPlayButton(totalDays);
}

function renderMonthTraces(entries = loadEntries(), cutoffDate = "") {
  if (!elements.lifePalette) return;

  const monthKey = inferMonthKey(entries);
  const allMonthEntries = chronologicalMonthEntries(entries, monthKey);
  const selectedIndex = cutoffDate
    ? allMonthEntries.findIndex((entry) => entry.date === cutoffDate)
    : allMonthEntries.length - 1;
  const currentIndex = selectedIndex >= 0 ? selectedIndex + 1 : allMonthEntries.length;
  const visibleEntries = cutoffDate ? entries.filter((entry) => entry.date <= cutoffDate) : entries;
  const monthEntries = chronologicalMonthEntries(visibleEntries, monthKey);
  const paletteItems = buildLifePalette(monthEntries);
  const recordedDays = monthEntries.length;

  renderIslandDay(allMonthEntries[currentIndex - 1], currentIndex, allMonthEntries.length);
  if (!lifePaletteRenderer) lifePaletteRenderer = globalThis.EmotionIslandLifePalette.createLifePalette(elements.lifePalette);
  lifePaletteRenderer.render(paletteItems);
  elements.monthTraceOverview.textContent = recordedDays
    ? `这 ${recordedDays} 天，岛上慢慢有了这些动静。`
    : "岛还在等第一段生活。";
  elements.monthTraceEmpty.textContent = recordedDays ? "" : "今天说一点生活，岛上就会留下第一道痕迹。";
}

function memoryDayTitle(dateKey) {
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateKey === today) return "今天";
  if (dateKey === todayKey(yesterday)) return "昨天";
  return formatDay(dateKey);
}

function memoryKind(entry) {
  if (!entry) return "empty";
  if (entry.stormWeather) return "angry";
  if (entry.homeMilestone) return "home";
  if (entry.travel) return "travel";
  if (entry.careerSearch || entry.careerChange) return "direction";
  if (entry.family) return "family";
  if (entry.exercise) return "exercise";
  if (entry.social) return "social";
  if (entry.learning) return "learning";
  if (entry.food) return "food";
  if (entry.work) return "work";
  if (entry.drink) return "drink";
  if (entry.mood === "mood-bright") return "bright";
  if (entry.mood === "mood-sad") return "sad";
  if (entry.mood === "mood-anxious") return "anxious";
  if (entry.mood === "mood-angry") return "angry";
  if (entry.mood === "mood-irritable") return "bright";
  if (entry.mood === "mood-unwell") return "unwell";
  if (entry.mood === "mood-tired") return "tired";
  if (entry.mood === "mood-flat") return "flat";
  return "calm";
}

function memoryShortLabel(entry) {
  if (!entry) return "";
  if (entry.stormWeather) return "风雨";
  if (entry.homeMilestone) return "新家";
  if (entry.camping) return "露营";
  if (entry.travel) return entry.travelPlace || "远行";
  if (entry.careerSearch) return "找方向";
  if (entry.careerChange) return "新阶段";
  if (entry.family) return "家人";
  if (entry.exercise) return "运动";
  if (entry.social) return "相聚";
  if (entry.learning) return "学习";
  if (entry.food) return "烟火";
  if (entry.work) return "工作";
  if (entry.drink) return "小饮";
  if (entry.mood === "mood-bright") return "晴朗";
  if (entry.mood === "mood-sad") return "小雨";
  if (entry.mood === "mood-anxious") return "风起";
  if (entry.mood === "mood-angry") return "浪高";
  if (entry.mood === "mood-irritable" || entry.heatWeather) return "强光";
  if (entry.mood === "mood-unwell") return "薄雾";
  if (entry.mood === "mood-tired") return "歇一会";
  if (entry.mood === "mood-flat") return "安静";
  return "平静";
}

function memoryGlyphMarkup(kind, index) {
  const shapes = {
    home: `
      <path class="memory-fill-cream" d="M11 21l11-10 12 10v14H11Z" />
      <path class="memory-stroke-coral" d="M8 22 22 8l15 14" />
      <path class="memory-fill-sun" d="M25 24h6v7h-6Z" />`,
    travel: `
      <path class="memory-stroke-wood" d="M17 35c1-9 1-18 0-27" />
      <path class="memory-fill-coral" d="M18 10c7-4 13-3 19 1-5 5-11 6-19 4Z" />
      <path class="memory-stroke-sea" d="M5 36c8-4 16-3 24 0 5 2 9 1 13-1" />`,
    direction: `
      <path class="memory-stroke-wood" d="M23 42V8" />
      <path class="memory-fill-sand" d="M10 10h26l6 7-7 7H10Z" />
      <path class="memory-stroke-coral" d="M15 17h19" />
      <path class="memory-fill-green" d="M19 36c4-5 9-5 14 0-4 5-9 6-14 2Z" />`,
    drink: `
      <path class="memory-fill-sand" d="M11 16h25l-3 25H15Z" />
      <path class="memory-stroke-coral" d="M10 16h27M27 16l6-11" />
      <path class="memory-fill-sea" d="M16 23h16l-1 13H18Z" />`,
    family: `
      <path class="memory-fill-dark" d="M8 9h28v27H8Z" />
      <path class="memory-fill-sun" d="M13 14h8v8h-8ZM24 14h7v8h-7ZM13 25h8v7h-8ZM24 25h7v7h-7Z" />`,
    exercise: `
      <path class="memory-stroke-cream memory-path-stroke" d="M7 37c2-10 13-8 14-17 1-7 8-8 16-11" />
      <path class="memory-fill-green" d="M7 31c4-3 7-2 9 2-3 4-6 5-9 3ZM29 8c4-3 8-2 10 2-3 4-7 5-10 3Z" />`,
    social: `
      <path class="memory-stroke-wood" d="m9 35 27-9M11 26l24 10" />
      <path class="memory-fill-coral" d="M23 7c9 9 9 17 0 23-10-6-10-13-3-21l2-5Z" />
      <path class="memory-fill-sun" d="M23 17c4 4 4 8 0 11-4-3-5-7-1-11Z" />`,
    learning: `
      <path class="memory-fill-cream" d="M5 13c8-5 14-4 19 2v22c-6-5-12-6-19-2ZM24 15c6-5 12-5 19 0v21c-7-4-13-4-19 1Z" />
      <path class="memory-stroke-dark" d="M24 15v22" />
      <path class="memory-stroke-coral" d="M33 18v13" />`,
    work: `
      <path class="memory-stroke-sea" d="M4 39c8-3 16-3 24 0 6 2 11 1 16-1" />
      <path class="memory-fill-cream" d="M8 29c10-4 21-4 33 0-6 9-15 13-27 10-4-2-6-5-6-10Z" />
      <path class="memory-stroke-coral" d="M8 29c10-4 21-4 33 0" />
      <path class="memory-stroke-wood" d="M24 28V7" />
      <path class="memory-fill-sand" d="M22 9c-7 5-10 11-9 17l9 1ZM26 9c7 5 10 10 10 16l-10 2Z" />`,
    food: `
      <path class="memory-fill-sand" d="M8 25h31c-2 10-7 15-16 15S10 35 8 25Z" />
      <path class="memory-stroke-coral" d="M7 25h33" />
      <path class="memory-stroke-cream" d="M15 21c-4-5 4-7 0-12M25 21c-4-5 4-7 0-12M34 21c-4-5 4-7 0-12" />`,
    bright: `
      <path class="memory-fill-sun" d="M22 8c9 0 15 6 15 14s-6 15-15 15S8 31 8 22 14 8 22 8Z" />
      <path class="memory-stroke-coral" d="M22 2v5M22 38v5M2 22h5M38 22h5" />`,
    sad: `
      <path class="memory-fill-cloud" d="M6 22c2-7 7-10 14-8 5-6 14-3 15 4 6 0 9 4 9 9H6Z" />
      <path class="memory-stroke-sea" d="m14 31-3 8M24 31l-3 8M34 31l-3 8" />`,
    anxious: `
      <path class="memory-fill-cloud" d="M5 20c3-7 9-9 15-6 5-5 13-3 14 4 6 0 9 3 10 8H5Z" />
      <path class="memory-stroke-cream" d="M7 32c8-3 15-2 22 1M17 38c8-2 15-1 21 1" />`,
    angry: `
      <path class="memory-stroke-sea memory-wave-stroke" d="M3 17c8-8 14-8 21 0s13 8 20 0M3 30c8-8 14-8 21 0s13 8 20 0" />`,
    calm: `
      <path class="memory-fill-sea" d="M5 24c8-5 16-5 24 0 5 3 10 3 15 0v12H5Z" />
      <path class="memory-stroke-cream" d="M7 24c7-4 14-4 21 0 6 4 11 4 16 0" />`,
    unwell: `
      <path class="memory-fill-cloud" d="M7 18c4-6 10-8 16-4 6-4 13-1 14 5 5 1 8 4 8 8H7Z" />
      <path class="memory-stroke-sea" d="M5 32c9-2 18-2 27 1M12 39c9-2 19-1 29 1" />`,
    tired: `
      <path class="memory-fill-cloud" d="M7 20c4-6 10-8 16-4 5-4 12-1 13 5 5 0 8 3 9 7H7Z" />
      <path class="memory-stroke-dark" d="M11 36c8 2 16 2 24 0" />`,
    flat: `
      <path class="memory-fill-sea" d="M5 29c12-2 25-2 39 0v9H5Z" />
      <path class="memory-stroke-cream" d="M7 29c12-2 24-2 36 0" />
      <path class="memory-fill-sun" d="M21 16c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5Z" />`,
    empty: `<path class="memory-empty-mark" d="M14 24c0-6 4-10 10-10s10 4 10 10-4 10-10 10-10-4-10-10Z" />`,
  };
  const filterId = `memoryPaint-${index}`;
  return `
    <svg class="memory-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <filter id="${filterId}" x="-18%" y="-18%" width="136%" height="136%">
          <feTurbulence type="fractalNoise" baseFrequency=".04 .13" numOctaves="2" seed="${41 + index}" result="glyphNoise" />
          <feDisplacementMap in="SourceGraphic" in2="glyphNoise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#${filterId})">${shapes[kind] || shapes.calm}</g>
    </svg>`;
}

function renderMemoryDetail(entry, dateKey) {
  const date = dateFromKey(dateKey);
  const dateLabel = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);

  if (!entry) {
    elements.memoryDetail.classList.add("is-empty");
    elements.memoryDetail.innerHTML = `
      <p class="memory-detail-meta"><time datetime="${dateKey}">${escapeHtml(dateLabel)}</time></p>
      <p class="memory-detail-line">这一天，小岛没有留下新的痕迹。</p>`;
    return;
  }

  const memoryLabel = entry.stormWeather
    ? "风雨天气"
    : entry.heatWeather
      ? "阳光有点强"
      : entry.label || entry.emotion || "有了新变化";
  const memoryLine = weatherAwareEntryLine(entry);

  elements.memoryDetail.classList.remove("is-empty");
  elements.memoryDetail.innerHTML = `
    <p class="memory-detail-meta">
      <time datetime="${entry.createdAt}">${escapeHtml(dateLabel)}</time>
      <span aria-hidden="true">·</span>
      <strong>${escapeHtml(memoryLabel)}</strong>
    </p>
    <p class="memory-detail-line">${escapeHtml(memoryLine)}</p>`;
}

function renderDays() {
  const entries = loadEntries();
  const dayKeys = recentDayKeys();
  const dailyEntries = visibleEntries(entries);
  const entryByDate = new Map(dailyEntries.map((entry) => [entry.date, entry]));
  const latestVisibleEntry = [...dailyEntries].reverse().find((entry) => dayKeys.includes(entry.date));

  if (!selectedMemoryDate || !dayKeys.includes(selectedMemoryDate)) {
    selectedMemoryDate = latestVisibleEntry?.date || todayKey();
  }

  elements.dayList.innerHTML = dayKeys
    .map((dateKey, index) => {
      const entry = entryByDate.get(dateKey);
      const isSelected = dateKey === selectedMemoryDate;
      const date = dateFromKey(dateKey);
      const entryCount = entry?.dayEntryCount || 1;
      const entryCountLabel = entryCount > 1 ? `，今天记录了${entryCount}段` : "";
      return `
        <button
          class="memory-day ${entry ? "has-memory" : "is-empty"} ${isSelected ? "is-selected" : ""} ${dateKey === todayKey() ? "is-today" : ""}"
          type="button"
          data-memory-date="${dateKey}"
          aria-pressed="${String(isSelected)}"
          aria-label="${escapeHtml(`${memoryDayTitle(dateKey)}${entry ? `，${memoryShortLabel(entry)}${entryCountLabel}` : "，没有记录"}`)}"
          ${entry ? "" : "disabled"}
        >
          <span class="memory-day-heading">
            <span class="memory-day-week">${escapeHtml(memoryDayTitle(dateKey))}</span>
            <span class="memory-day-date">${date.getDate()}</span>
          </span>
          <span class="memory-day-marker">${memoryGlyphMarkup(memoryKind(entry), index)}</span>
          <span class="memory-day-label">${escapeHtml(memoryShortLabel(entry))}</span>
          ${entryCount > 1 ? `<span class="memory-day-count">${entryCount}段</span>` : ""}
        </button>`;
    })
    .join("");

  renderMemoryDetail(entryByDate.get(selectedMemoryDate), selectedMemoryDate);
  window.requestAnimationFrame(() => {
    const selectedDay = elements.dayList.querySelector(".memory-day.is-selected");
    if (!selectedDay) return;
    const targetLeft =
      selectedDay.offsetLeft -
      (elements.memoryTimelineScroll.clientWidth - selectedDay.offsetWidth) / 2;
    elements.memoryTimelineScroll.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  });
}

function selectMemoryDay(dateKey) {
  const entry = visibleEntries(loadEntries()).find((item) => item.date === dateKey);
  if (!entry) return;
  selectedMemoryDate = dateKey;
  renderDays();
  applyEntry(entry, { cutoffDate: dateKey });
  renderMonthTraces(loadEntries(), dateKey);
  animateIslandUpdate(entry, eventNote?.key);
}

function monthSkyMarkup(entry, index) {
  const filterId = `monthPaint-${index}`;
  return `
    <svg class="month-sky-mark" viewBox="0 0 54 54" aria-hidden="true">
      <defs>
        <filter id="${filterId}" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency=".035 .12" numOctaves="2" seed="${117 + index}" result="monthNoise" />
          <feDisplacementMap in="SourceGraphic" in2="monthNoise" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#${filterId})">
        <path class="month-sky-base" d="M6 8c10-5 29-4 38 2 7 6 7 26 0 34-9 7-29 6-38-1-6-7-6-28 0-35Z" />
        <circle class="month-sky-sun" cx="31" cy="23" r="9" />
        <path class="month-sky-cloud" d="M9 27c2-7 8-10 15-7 5-7 15-4 16 4 5 0 8 4 8 9H9Z" />
        <path class="month-sky-wind" d="M8 35c10-4 19-3 28 1M17 42c9-3 17-2 24 1" />
        <path class="month-sky-rain" d="m16 36-3 9M27 36l-3 9M38 36l-3 9" />
        <path class="month-sky-water" d="M8 31c8-4 15-4 22 0 6 3 11 3 16-1M12 39c7-3 13-2 19 1 5 2 10 2 14-1" />
        <path class="month-sky-clearing" d="M38 10c4 3 6 7 6 12" />
      </g>
    </svg>`;
}

function currentMonthKeys(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${monthKey}-${day}`;
  });
}

function renderMonth(entries = loadEntries(), monthKey = todayKey().slice(0, 7), options = {}) {
  activeMonthEntries = entries;
  const weather = buildMonthlyWeather(entries, monthKey);
  const [year, month] = monthKey.split("-").map(Number);
  const monthLabel = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
  }).format(new Date(year, month - 1, 1));

  elements.monthDialogKicker.textContent = monthLabel;
  if (!weather.recordedDays) {
    elements.monthSummary.textContent = "这个月的天空，还在等第一段生活。";
  } else {
    const clearingCopy = weather.clearing ? `其中 ${weather.clearing} 天，后来慢慢转晴。` : "";
    const weatherCopy =
      `这个月有 ${weather.counts.bright} 天放晴，${weather.counts.calm} 天平静，` +
      `${weather.counts.low} 天低云，${weather.counts.wind} 天风起，${weather.counts.storm} 天雨浪。${clearingCopy}`;
    const workCopy = weather.busyWork ? ` ${busyWorkMonthCopy(weather.workDays)}` : "";
    elements.monthSummary.textContent = `${weatherCopy}${workCopy}`;
  }

  const lighterDetails = [
    weather.counts.bright ? `${weather.counts.bright} 天放晴` : "",
    weather.counts.calm ? `${weather.counts.calm} 天平静` : "",
  ].filter(Boolean).join(" · ") || "还没有记录";
  const heavierDetails = [
    weather.counts.low ? `${weather.counts.low} 天低云` : "",
    weather.counts.wind ? `${weather.counts.wind} 天风起` : "",
    weather.counts.storm ? `${weather.counts.storm} 天雨浪` : "",
  ].filter(Boolean).join(" · ") || "还没有记录";

  elements.monthBalance.innerHTML = `
    <p><span>心里比较轻松</span><strong>${weather.positiveDays} 天</strong><small>${lighterDetails}</small></p>
    <p><span>心里有点辛苦</span><strong>${weather.difficultDays} 天</strong><small>${heavierDetails}</small></p>`;

  const today = todayKey();
  elements.monthCalendar.innerHTML = currentMonthKeys(monthKey)
    .map((dateKey, index) => {
      const entry = weather.entryByDate[dateKey];
      const category = entry ? moodCategory(entry) : "calm";
      const isFuture = !options.allowFuture && dateKey > today;
      const dayNumber = Number(dateKey.slice(-2));
      const label = entry
        ? `${dayNumber}日，${memoryShortLabel(entry)}`
        : `${dayNumber}日，没有记录`;
      return `
        <button
          class="month-day month-weather-${category} ${entry ? "has-memory" : "is-empty"} ${entry?.recovery ? "is-clearing" : ""} ${isFuture ? "is-future" : ""}"
          type="button"
          data-month-date="${dateKey}"
          aria-label="${escapeHtml(label)}"
          ${entry && !isFuture ? "" : "disabled"}
        >
          <span class="month-day-date">${dayNumber}</span>
          ${monthSkyMarkup(entry, index)}
        </button>`;
    })
    .join("");
}

function selectMonthDay(dateKey) {
  const entry = visibleEntries(activeMonthEntries).find((item) => item.date === dateKey);
  if (!entry) return;
  elements.monthDialog.close();
  selectedMemoryDate = dateKey;
  applyEntry(entry, { entries: activeMonthEntries, cutoffDate: dateKey });
  renderMonthTraces(activeMonthEntries, dateKey);
  setIslandView(false);
  animateIslandUpdate(entry);
  elements.stage.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast(`${dateKey.slice(5).replace("-", "月")}日，回到那天的小岛。`);
}

function renderHistory() {
  const entries = loadEntries();
  if (!entries.length) {
    elements.historyContent.innerHTML = '<p class="history-empty">还没有记录。今天聊一分钟，小岛就会留下第一道痕迹。</p>';
    return;
  }

  elements.historyContent.innerHTML = entries
    .map(
      (entry) => `
        <article class="history-item">
          <time datetime="${entry.createdAt}">${formatFullDate(entry.createdAt)}</time>
          <strong>${escapeHtml(entry.line)}</strong>
          <p class="history-item-raw">${escapeHtml(entry.rawText)}</p>
        </article>
      `,
    )
    .join("");
}

function formatDay(value) {
  const formatter = new Intl.DateTimeFormat("zh-CN", { weekday: "short" });
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? dateFromKey(value) : new Date(value);
  return formatter.format(date);
}

function formatFullDate(value) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2600);
}

function showTravelDetails() {
  const place = elements.travelMarker.dataset.place || "远方";
  const date = elements.travelMarker.dataset.date
    ? formatFullDate(elements.travelMarker.dataset.date)
    : "";
  showToast(`${date ? `${date}，` : ""}小船从${place}带回了这面小旗。`);
}

function submitToday() {
  const text = elements.input.value.trim();
  if (!text) {
    showToast("先说一点今天发生的事。");
    elements.input.focus();
    return;
  }

  const previousEntries = loadEntries();
  const analyzedEntry = analyzeText(text);
  const result = upsertToday(analyzedEntry);
  if (result.limitReached) {
    showToast(dailyEntryLimitMessage);
    return;
  }
  const { entry, rawEntry, entries: nextEntries } = result;
  const currentEntry = rawEntry || entry;
  const eventNote = newlyAddedEvent(currentEntry, previousEntries, nextEntries);
  selectedMemoryDate = entry.date;
  applyEntry(entry, { entries: nextEntries });
  animateIslandUpdate(entry, eventNote?.key);
  revealPersistentEvent(entry);
  renderDays();
  renderHistory();
  renderMonthTraces(nextEntries);
  playEntrySounds(currentEntry, previousEntries, nextEntries);
  showInterpretationFeedback(currentEntry);
  showEventNote(eventNote);
  elements.input.value = "";
  setVoiceState(recognition ? "idle" : "unsupported");
  elements.stage.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
    inline: "nearest",
  });
  showToast(`今天的小岛更新了：${describeIslandUpdate(entry)}。`);
}

function setupSpeech() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceState("unsupported");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.addEventListener("result", (event) => {
    let transcript = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }
    elements.input.value = `${elements.input.value.replace(/\s+$/, "")}${transcript}`.trim();
    setVoiceState("listening");
  });

  recognition.addEventListener("start", () => {
    listening = true;
    setVoiceState("listening");
  });

  recognition.addEventListener("end", () => {
    listening = false;
    setVoiceState(elements.input.value.trim() ? "recognized" : "idle");
  });

  recognition.addEventListener("error", (event) => {
    listening = false;
    setVoiceState("error");
    const message = event.error === "not-allowed"
      ? "麦克风权限未开启，请直接使用文字输入。"
      : "语音输入暂时不可用，请直接使用文字输入。";
    showToast(message);
  });
}

function toggleSpeech() {
  if (!recognition) {
    setVoiceState("unsupported");
    showToast("当前预览暂不支持语音输入，请直接写下今天。");
    return;
  }

  if (listening) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch {
      listening = false;
      setVoiceState("error");
      showToast("语音输入暂时不可用，请直接使用文字输入。");
    }
  }
}

function resetDemoData() {
  stopMonthPlayback();
  localStorage.removeItem(storageKey);
  selectedMemoryDate = todayKey();
  elements.input.value = "";
  showEventNote(null);
  hideInterpretationFeedback();
  resizeTextInput();
  applyWaitingForTodayState([]);
  renderDays();
  renderHistory();
  renderMonthTraces([]);
  if (elements.memoryMenu) elements.memoryMenu.open = false;
  showToast("演示数据已清空。");
}

function clearToday() {
  stopMonthPlayback();
  const today = todayKey();
  const entries = loadEntries().filter((entry) => entry.date !== today);
  saveEntries(entries);
  showEventNote(null);
  hideInterpretationFeedback();
  selectedMemoryDate = today;
  resizeTextInput();
  applyWaitingForTodayState(entries);
  renderDays();
  renderHistory();
  renderMonthTraces(entries);
  if (elements.memoryMenu) elements.memoryMenu.open = false;
  showToast("今天的记录已清空。");
}

function handleMemoryMenuAction(event) {
  const target = event.target instanceof Element ? event.target : null;
  const button = target?.closest("#clear-today, #reset-demo");
  if (!button || !elements.memoryMenu?.contains(button)) return;

  event.preventDefault();
  event.stopPropagation();
  if (button.id === "clear-today") clearToday();
  else resetDemoData();
}

function init() {
  if (new URLSearchParams(window.location.search).get("embed") === "simulator") {
    elements.body.classList.add("simulator-preview");
  }
  setupSpeech();
  const storedEntries = loadEntries();
  const today = todayKey();
  const todayEntry = visibleEntries(storedEntries).find((entry) => entry.date === today);
  selectedMemoryDate = today;
  if (todayEntry) applyEntry(todayEntry, { entries: storedEntries });
  else applyWaitingForTodayState(storedEntries);
  renderDays();
  renderHistory();
  renderMonthTraces(storedEntries);

  elements.submit.addEventListener("click", submitToday);
  elements.mic.addEventListener("click", toggleSpeech);
  elements.input.addEventListener("input", resizeTextInput);
  elements.clearToday?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearToday();
  });
  elements.resetDemo?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetDemoData();
  });
  elements.islandFeedbackConfirm?.addEventListener("click", confirmInterpretation);
  elements.islandFeedbackEdit?.addEventListener("click", () => {
    const isOpen = !elements.islandFeedbackOptions.hidden;
    elements.islandFeedbackOptions.hidden = isOpen;
    elements.islandFeedbackEdit.textContent = isOpen ? "改一下" : "收起";
  });
  elements.islandFeedbackOptions?.addEventListener("click", (event) => {
    const emotionButton = event.target.closest("[data-feedback-emotion]");
    if (emotionButton) {
      handleFeedbackEmotion(emotionButton.dataset.feedbackEmotion);
      return;
    }
    const removeButton = event.target.closest("[data-feedback-remove-event]");
    if (removeButton) handleFeedbackRemoveEvent(removeButton.dataset.feedbackRemoveEvent);
  });
  resizeTextInput();
  elements.showHistory.addEventListener("click", () => {
    renderHistory();
    elements.historyDialog.showModal();
  });
  elements.showMonth.addEventListener("click", () => {
    renderMonth();
    elements.monthDialog.showModal();
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("dialog")?.close();
    });
  });
  elements.dayList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-memory-date]");
    if (!button || button.disabled) return;
    selectMemoryDay(button.dataset.memoryDate);
  });
  elements.monthCalendar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-month-date]");
    if (!button || button.disabled) return;
    selectMonthDay(button.dataset.monthDate);
  });
  elements.monthProgressRange.addEventListener("input", () => {
    stopMonthPlayback();
    const entries = loadEntries();
    const monthKey = inferMonthKey(entries);
    const monthEntries = chronologicalMonthEntries(entries, monthKey);
    const index = Number(elements.monthProgressRange.value) - 1;
    const entry = monthEntries[index];
    if (!entry) return;
    selectedMemoryDate = entry.date;
    applyEntry(entry, { entries, cutoffDate: entry.date });
    renderDays();
    renderMonthTraces(entries, entry.date);
    animateIslandUpdate(entry);
  });
  elements.monthPlay?.addEventListener("click", toggleMonthPlayback);
  elements.toggleView.addEventListener("click", toggleIslandView);
  elements.travelMarker?.addEventListener("click", showTravelDetails);
  elements.travelMarker?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showTravelDetails();
    }
  });
  document.addEventListener("click", (event) => {
    if (elements.memoryMenu?.open && !elements.memoryMenu.contains(event.target)) {
      elements.memoryMenu.open = false;
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.memoryMenu?.open) {
      elements.memoryMenu.open = false;
      elements.memoryMenu.querySelector("summary")?.focus();
    }
  });
}

globalThis.EmotionIslandApp = {
  previewEntries(entries, cutoffDate) {
    const islandState = buildIslandState(entries, cutoffDate);
    const entry = islandState.latestEntry || {
      mood: "mood-calm",
      line: "今天的小岛，正在等你带回一点生活。",
    };
    applyEntry(entry, { entries, cutoffDate });
    renderMonthTraces(entries, cutoffDate);
    setIslandView(true);
    return islandState;
  },
  previewMonth(entries, options = {}) {
    const monthKey = options.monthKey || inferMonthKey(entries);
    if (options.syncPreview) {
      const latestEntry = chronologicalMonthEntries(entries, monthKey).at(-1);
      if (latestEntry) globalThis.EmotionIslandApp.previewEntries(entries, latestEntry.date);
    }
    renderMonth(entries, monthKey, { allowFuture: options.allowFuture });
    elements.monthDialog.showModal();
    return buildMonthlyWeather(entries, monthKey);
  },
  getIslandState(cutoffDate) {
    return buildIslandState(loadEntries(), cutoffDate);
  },
  setIslandView,
};

init();
