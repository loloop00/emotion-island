(function attachIslandState(global) {
  const stateVersion = 7;

  const traceRules = [
    { key: "homeMilestone", stateKey: "homeMilestones" },
    { key: "travel", stateKey: "travelCount" },
    { key: "family", stateKey: "familyCount" },
    { key: "exercise", stateKey: "exerciseCount" },
    { key: "social", stateKey: "socialCount" },
    { key: "learning", stateKey: "learningCount" },
    { key: "food", stateKey: "foodCount" },
    { key: "work", stateKey: "workCount" },
  ];

  const traceCatalog = [
    { label: "小屋变化", key: "home", countKey: "homeMilestones", unit: "次变化", stages: ["", "新生活刚刚安顿", "小屋正在慢慢长大", "这里越来越像家"] },
    { label: "旅行记忆", key: "travel", countKey: "travelCount", unit: "段远方", stages: ["", "岛上留下一段远方", "远方的痕迹慢慢变多", "岛上已经有了许多远方"] },
    { label: "家庭灯光", key: "family", countKey: "familyCount", unit: "次相聚", stages: ["", "窗里亮起一盏灯", "门前有了暖光", "屋里常有灯火"] },
    { label: "运动", key: "path", countKey: "exerciseCount", unit: "天运动", stages: ["", "草地出现一小段路", "步道正在慢慢延伸", "路已经绕过草坡"] },
    { label: "朋友相聚", key: "social", countKey: "socialCount", unit: "次见面", stages: ["", "篝火刚刚点亮", "篝火旁有了几次相聚", "篝火旁常有人围坐"] },
    { label: "阅读学习", key: "learning", countKey: "learningCount", unit: "次阅读", stages: ["", "屋旁多了一页书", "书页正在慢慢变厚", "阅读留下了安静的一角"] },
    { label: "厨房烟火", key: "kitchen", countKey: "foodCount", unit: "次烟火", stages: ["", "烟囱升起一缕炊烟", "屋里渐渐常有饭香", "厨房已经很有烟火气"] },
    { label: "工作日常", key: "harbor", countKey: "workCount", unit: "天忙碌", stages: ["", "港口出现第一道船影", "船影正在慢慢变密", "港湾已经很忙碌"] },
  ];

  const lifePaletteBases = {
    home: "#ef6c3f",
    travel: "#f5c96d",
    work: "#1478c8",
    family: "#f5c96d",
    nature: "#4c9b42",
    social: "#ef6c3f",
    learning: "#6ea9ca",
    food: "#d49a69",
    "travel-exercise": "#e7b95f",
    "social-food": "#ef784d",
    camping: "#e7b95f",
    drink: "#68a4a6",
    leisure: "#9a78a5",
    direction: "#f1e1b7",
    conflict: "#31584b",
    storm: "#3f7695",
    health: "#6ea9ca",
    boredom: "#718896",
    melancholy: "#6e8fa4",
    shadow: "#102a1d",
    wind: "#31584b",
    low: "#6ea9ca",
    bright: "#f5c96d",
    calm: "#6ea9ca",
    irritable: "#ef6c3f",
    other: "#68a4a6",
  };

  const brightLifeFamilies = new Set([
    "home",
    "travel",
    "family",
    "nature",
    "social",
    "learning",
    "food",
    "travel-exercise",
    "social-food",
    "camping",
    "drink",
    "leisure",
    "bright",
  ]);

  const dimLifeFamilies = new Set([
    "conflict",
    "storm",
    "health",
    "boredom",
    "melancholy",
    "shadow",
    "wind",
    "low",
    "irritable",
  ]);

  const legacyLifeEventRules = [
    { key: "homeMilestone", field: "homeMilestone", family: "home", fullLabel: "小屋变化", shortLabel: "新家", detail: "小屋正在慢慢长大" },
    { key: "travel", field: "travel", family: "travel", fullLabel: "旅行记忆", shortLabel: "旅行", detail: "岛上留下一段远方" },
    { key: "work", field: "work", family: "work", fullLabel: "工作日常", shortLabel: "工作", detail: "船影正在慢慢变密" },
    { key: "family", field: "family", family: "family", fullLabel: "家庭灯光", shortLabel: "家人", detail: "窗里亮起一盏灯" },
    { key: "exercise", field: "exercise", family: "nature", fullLabel: "运动", shortLabel: "运动", detail: "草地出现一小段路" },
    { key: "social", field: "social", family: "social", fullLabel: "朋友相聚", shortLabel: "相聚", detail: "篝火刚刚点亮" },
    { key: "learning", field: "learning", family: "learning", fullLabel: "阅读学习", shortLabel: "阅读", detail: "屋旁多了一页书" },
    { key: "food", field: "food", family: "food", fullLabel: "厨房烟火", shortLabel: "烟火", detail: "屋里渐渐有了饭香" },
    { key: "tent", field: "tent", family: "travel-exercise", fullLabel: "远行与运动", shortLabel: "帐篷", detail: "远方和脚步，在岛上搭起了一处歇脚处" },
    { key: "camping", field: "camping", family: "camping", fullLabel: "露营记忆", shortLabel: "露营", detail: "岛上搭起了一顶帐篷" },
    { key: "picnic", field: "picnic", family: "social-food", fullLabel: "相聚与饮食", shortLabel: "野餐", detail: "草地上摆开了一张野餐桌" },
    { key: "drink", field: "drink", family: "drink", fullLabel: "喜欢的饮品", shortLabel: "饮品", detail: "今天留住了一口喜欢的味道" },
  ];

  const lifeVisualCatalog = {
    home: { fullLabel: "小屋变化", shortLabel: "新家", detail: "小屋正在慢慢长大" },
    travel: { fullLabel: "旅行记忆", shortLabel: "旅行", detail: "岛上留下一段远方" },
    work: { fullLabel: "工作日常", shortLabel: "工作", detail: "船影正在慢慢变密" },
    family: { fullLabel: "家庭灯光", shortLabel: "家人", detail: "窗里亮起一盏灯" },
    nature: { fullLabel: "运动", shortLabel: "运动", detail: "草地出现一小段路" },
    social: { fullLabel: "朋友相聚", shortLabel: "相聚", detail: "篝火刚刚点亮" },
    learning: { fullLabel: "阅读学习", shortLabel: "阅读", detail: "屋旁多了一页书" },
    food: { fullLabel: "厨房烟火", shortLabel: "烟火", detail: "屋里渐渐有了饭香" },
    "travel-exercise": { fullLabel: "远行与运动", shortLabel: "帐篷", detail: "远方和脚步，在岛上搭起了一处歇脚处" },
    "social-food": { fullLabel: "相聚与饮食", shortLabel: "野餐", detail: "草地上摆开了一张野餐桌" },
    camping: { fullLabel: "露营记忆", shortLabel: "露营", detail: "岛上搭起了一顶帐篷" },
    drink: { fullLabel: "喜欢的饮品", shortLabel: "饮品", detail: "今天留住了一口喜欢的味道" },
    leisure: { fullLabel: "闲暇时光", shortLabel: "闲暇", detail: "岛上留了一小段只属于你的时间" },
    direction: { fullLabel: "生活方向", shortLabel: "方向", detail: "海风翻开了生活新的一页" },
    conflict: { fullLabel: "关系波动", shortLabel: "吵架", detail: "海面起了风浪，先把自己抱回来" },
    health: { fullLabel: "身体状态", shortLabel: "身体", detail: "岛上起了薄雾，先让风慢一点" },
    boredom: { fullLabel: "无聊时刻", shortLabel: "无聊", detail: "海面暂时没有故事，也可以安静一会" },
    bright: { fullLabel: "明亮时刻", shortLabel: "开心", detail: "海面闪着光，小岛多了一点轻快" },
    calm: { fullLabel: "安静时刻", shortLabel: "平静", detail: "海面恢复平静了" },
    wind: { fullLabel: "风起的时候", shortLabel: "焦虑", detail: "天色有点深，灯会替你留着" },
    melancholy: { fullLabel: "失落时刻", shortLabel: "失落", detail: "今天下了小雨，灯塔把路照得更近了" },
    shadow: { fullLabel: "暗处", shortLabel: "害怕", detail: "今天的光很远，但灯会替你留着" },
    storm: { fullLabel: "风雨天气", shortLabel: "风雨", detail: "狂风暴雨经过海面，灯塔替小岛守着光" },
    irritable: { fullLabel: "烦躁时刻", shortLabel: "烦躁", detail: "阳光有点强，先找一片阴影" },
    low: { fullLabel: "低云时刻", shortLabel: "疲惫", detail: "今天的风慢了一些，小岛也陪你歇一会" },
    other: { fullLabel: "生活片段", shortLabel: "生活", detail: "这段生活在岛上留下了痕迹" },
  };

  function resolvePrimaryTrace(entry) {
    return entry?.primaryTrace || traceRules.find((rule) => Boolean(entry?.[rule.key]))?.key || "";
  }

  function dailyTraceSummary(entry) {
    const ordered = Array.isArray(entry?.dayEntries) ? entry.dayEntries : [];
    if (ordered.length < 2) return "";

    const previous = ordered.slice(0, -1);
    const latest = ordered.at(-1) || {};
    if (latest.stormWeather) return "风雨天气";
    if (latest.heatWeather) return "阳光有点强";
    const hasEarlier = (key) => previous.some((item) => Boolean(item?.[key]));
    const newlyAdded = traceRules
      .filter((rule) => latest[rule.key] && !hasEarlier(rule.key))
      .map((rule) => rule.key);

    const latestText = String(latest.rawText || "");
    const homecomingFood = newlyAdded.includes("food") && /回家|家里|家中|家人/.test(latestText);
    if (hasEarlier("travel") && (newlyAdded.includes("family") || homecomingFood)) return "旅行归来，家里亮起了灯";
    if (hasEarlier("travel") && newlyAdded.includes("food")) return "旅行归来，屋里有了饭香";
    if (hasEarlier("work") && newlyAdded.includes("family")) return "忙完一天，家里的灯亮了";
    if (hasEarlier("exercise") && newlyAdded.includes("family")) return "走过一段路，回家时灯亮着";
    if (hasEarlier("travel") && newlyAdded.includes("social")) return "旅行归来，篝火已经亮起";

    const latestTrace = newlyAdded.at(-1) || resolvePrimaryTrace(entry);
    const labels = {
      homeMilestone: "小屋又长大了一点",
      travel: "又带回了一段远方",
      family: "家里亮起了灯",
      exercise: "草地上多了一条路",
      social: "篝火亮起了",
      learning: "屋旁多了一页书",
      food: "屋里有了饭香",
      work: "港口又忙了一点",
    };
    return labels[latestTrace] || "";
  }

  function mergeDailyEntries(dayEntries) {
    const ordered = [...dayEntries].sort((left, right) =>
      String(left.createdAt || "").localeCompare(String(right.createdAt || "")),
    );
    const latest = ordered.at(-1) || {};
    const merged = { ...latest };
    const booleanKeys = new Set(
      ordered.flatMap((entry) =>
        Object.entries(entry)
          .filter(([, value]) => typeof value === "boolean")
          .map(([key]) => key),
      ),
    );

    for (const key of booleanKeys) {
      merged[key] = ["stormWeather", "heatWeather", "windy", "recovery", "emotionAmbiguous"].includes(key)
        ? Boolean(latest[key])
        : ordered.some((entry) => Boolean(entry[key]));
    }

    for (const key of ["travelPlace", "travelType"]) {
      merged[key] = [...ordered].reverse().find((entry) => entry[key])?.[key] || "";
    }

    const events = new Map();
    ordered.forEach((entry) => {
      (Array.isArray(entry.lifeEvents) ? entry.lifeEvents : []).forEach((event) => {
        if (event?.key) events.set(event.key, event);
      });
    });
    merged.lifeEvents = [...events.values()];
    merged.dayEntries = ordered;
    merged.dayEntryCount = ordered.length;
    merged.primaryTrace = resolvePrimaryTrace(latest) || "";
    merged.dayTraces = merged.primaryTrace ? [merged.primaryTrace] : [];
    const latestTravel = [...ordered].reverse().find((entry) => entry.travel);
    merged.dayTravelMemories = latestTravel
      ? [{
        date: latestTravel.date,
        createdAt: latestTravel.createdAt || "",
        place: latestTravel.travelPlace || "远方",
        type: latestTravel.travelType || "",
      }]
      : [];
    return merged;
  }

  function growthLevel(count) {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    return 3;
  }

  function visibleEntries(entries, cutoffDate) {
    const entriesByDate = new Map();
    for (const entry of entries || []) {
      if (!entry?.date || (cutoffDate && entry.date > cutoffDate)) continue;
      const dayEntries = entriesByDate.get(entry.date) || [];
      dayEntries.push(entry);
      entriesByDate.set(entry.date, dayEntries);
    }
    return [...entriesByDate.values()]
      .map(mergeDailyEntries)
      .sort((a, b) => {
        const dateOrder = String(a.date).localeCompare(String(b.date));
        if (dateOrder) return dateOrder;
        return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
      });
  }

  function moodCategory(entry) {
    const mood = entry?.mood || "mood-calm";
    if (mood === "mood-bright") return "bright";
    if (mood === "mood-irritable") return "low";
    if (mood === "mood-anxious") return "wind";
    if (mood === "mood-sad" || mood === "mood-angry") return "storm";
    if (mood === "mood-unwell" || mood === "mood-tired" || mood === "mood-flat") return "low";
    return "calm";
  }

  function hexToRgb(hex) {
    const value = hex.replace("#", "");
    const normalized = value.length === 3 ? value.split("").map((char) => char + char).join("") : value;
    return {
      r: Number.parseInt(normalized.slice(0, 2), 16),
      g: Number.parseInt(normalized.slice(2, 4), 16),
      b: Number.parseInt(normalized.slice(4, 6), 16),
    };
  }

  function rgbToHex({ r, g, b }) {
    return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
  }

  function mixHex(left, right, amount) {
    const a = hexToRgb(left);
    const b = hexToRgb(right);
    const ratio = Math.max(0, Math.min(1, amount));
    return rgbToHex({
      r: a.r + (b.r - a.r) * ratio,
      g: a.g + (b.g - a.g) * ratio,
      b: a.b + (b.b - a.b) * ratio,
    });
  }

  function luminance(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
  }

  function lifeMoodScore(entry) {
    const scores = {
      "mood-bright": 0.9,
      "mood-calm": 0.25,
      "mood-flat": -0.22,
      "mood-tired": -0.48,
      "mood-unwell": -0.62,
      "mood-anxious": -0.76,
      "mood-sad": -0.86,
      "mood-angry": -0.92,
      "mood-irritable": -0.58,
    };
    return scores[entry?.mood || "mood-calm"] ?? 0;
  }

  function lifeEventMoodScore(entry, event) {
    const family = event?.family || "other";
    if (brightLifeFamilies.has(family)) return 0.78;
    if (dimLifeFamilies.has(family)) return -0.78;
    return lifeMoodScore(entry);
  }

  function lifeColor(family, moodScore) {
    const base = lifePaletteBases[family] || lifePaletteBases.other;
    const isDim = moodScore <= -0.2;
    let fill = base;
    if (moodScore >= 0.2) fill = mixHex(fill, "#f5c96d", Math.min(0.18, 0.03 + moodScore * 0.12));
    if (moodScore <= -0.2) fill = mixHex(fill, "#173328", Math.min(0.48, 0.08 + Math.abs(moodScore) * 0.35));
    if (family === "shadow") fill = mixHex(fill, "#102a1d", 0.3);
    const dark = luminance(fill) < 0.43;
    return {
      fill,
      edge: isDim ? mixHex(fill, "#173328", 0.18) : mixHex(fill, "#f1e1b7", 0.18),
      glow: mixHex(fill, isDim ? "#173328" : "#fff9e8", isDim ? 0.16 : 0.26),
      text: dark ? "#fff8e8" : "#173328",
    };
  }

  function fallbackLifeEvents(entry) {
    const events = legacyLifeEventRules
      .filter((rule) => Boolean(entry?.[rule.field]))
      .map(({ key, family, fullLabel, shortLabel, detail }) => ({ key, family, fullLabel, shortLabel, detail }));
    if (events.length) return events;
    const fallback = {
      "mood-bright": { key: "emotion-bright", family: "bright", fullLabel: "开心", shortLabel: "开心", detail: "海面闪着光，小岛多了一点轻快" },
      "mood-anxious": { key: "emotion-anxious", family: "wind", fullLabel: "焦虑", shortLabel: "焦虑", detail: "天色有点深，灯会替你留着" },
      "mood-sad": { key: "emotion-sad", family: "melancholy", fullLabel: "失落时刻", shortLabel: "失落", detail: "今天下了小雨，灯塔把路照得更近了" },
      "mood-angry": { key: "emotion-angry", family: "conflict", fullLabel: "生气", shortLabel: "生气", detail: "海面起了风浪，先把自己抱回来" },
      "mood-irritable": { key: "emotion-irritable", family: "irritable", fullLabel: "烦躁时刻", shortLabel: "烦躁", detail: "阳光有点强，先找一片阴影" },
      "mood-tired": { key: "emotion-tired", family: "low", fullLabel: "疲惫", shortLabel: "疲惫", detail: "今天的风慢了一些，小岛也陪你歇一会" },
      "mood-unwell": { key: "emotion-unwell", family: "health", fullLabel: "身体", shortLabel: "身体", detail: "岛上起了薄雾，先让风慢一点" },
      "mood-flat": { key: "emotion-flat", family: "boredom", fullLabel: "无聊", shortLabel: "无聊", detail: "海面暂时没有故事，也可以安静一会" },
    };
    return [fallback[entry?.mood || "mood-calm"] || { key: "emotion-calm", family: "calm", fullLabel: "平静", shortLabel: "平静", detail: "海面恢复平静了" }];
  }

  function buildLifePalette(entries) {
    const groups = new Map();
    const sourceEntries = visibleEntries(entries);
    const recordedDays = sourceEntries.length;
    for (const entry of sourceEntries) {
      const events = Array.isArray(entry?.lifeEvents) && entry.lifeEvents.length ? entry.lifeEvents : fallbackLifeEvents(entry);
      const entryGroups = new Set();
      for (const event of events) {
        const family = event.family || "other";
        const descriptor = lifeVisualCatalog[family] || lifeVisualCatalog.other;
        const key = `life:${family}`;
        const group = groups.get(key) || {
          key,
          family,
          fullLabel: descriptor.fullLabel,
          shortLabel: descriptor.shortLabel,
          count: 0,
          moodTotal: 0,
          detail: event.detail || descriptor.detail,
          sourceLabels: [],
          recordedDays,
        };
        if (event.detail) group.detail = event.detail;
        if (!entryGroups.has(key)) {
          group.count += 1;
          group.moodTotal += lifeEventMoodScore(entry, event);
          entryGroups.add(key);
        }
        const sourceLabel = String(event.key || "").startsWith("emotion-")
          ? ""
          : event.sourceWord || event.shortLabel || event.fullLabel;
        if (sourceLabel && !group.sourceLabels.includes(sourceLabel)) group.sourceLabels.push(sourceLabel);
        groups.set(key, group);
      }
    }

    return [...groups.values()]
      .map((group) => {
        const moodScore = group.moodTotal / group.count;
        const sourceLabels = group.sourceLabels.filter((label) => label !== group.shortLabel && label !== group.fullLabel);
        return {
          ...group,
          moodScore,
          mood: moodScore >= 0.2 ? "bright" : moodScore <= -0.2 ? "dim" : "soft",
          color: lifeColor(group.family, moodScore),
          sourceSummary: sourceLabels.length ? `这月还留下了：${sourceLabels.slice(0, 4).join("、")}` : "",
        };
      })
      .sort((left, right) => right.count - left.count || left.fullLabel.localeCompare(right.fullLabel, "zh-CN"));
  }

  function currentMonthKey() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  function isBusyWorkMonth(workDays, recordedDays) {
    if (recordedDays < 7) return false;
    return workDays >= Math.max(7, Math.ceil(recordedDays * (2 / 3)));
  }

  function buildMonthlyWeather(entries, monthKey = currentMonthKey()) {
    const monthEntries = visibleEntries(entries).filter((entry) => entry.date.startsWith(monthKey));
    const counts = { bright: 0, calm: 0, low: 0, wind: 0, storm: 0 };
    let clearing = 0;
    const workDays = monthEntries.filter((entry) => entry.work).length;

    for (const entry of monthEntries) {
      counts[moodCategory(entry)] += 1;
      if (entry.recovery) clearing += 1;
    }

    return {
      monthKey,
      entries: monthEntries,
      entryByDate: Object.fromEntries(monthEntries.map((entry) => [entry.date, entry])),
      recordedDays: monthEntries.length,
      counts,
      clearing,
      workDays,
      busyWork: isBusyWorkMonth(workDays, monthEntries.length),
      positiveDays: counts.bright + counts.calm,
      difficultDays: counts.low + counts.wind + counts.storm,
    };
  }

  function buildIslandState(entries, cutoffDate) {
    const visible = visibleEntries(entries, cutoffDate);
    const counts = Object.fromEntries(traceRules.map((rule) => [rule.stateKey, 0]));
    const traceByDate = {};
    const travelMemories = [];

    for (const entry of visible) {
      const primaryTrace = resolvePrimaryTrace(entry);
      traceByDate[entry.date] = primaryTrace;
      traceRules.forEach((rule) => {
        if (entry?.[rule.key]) counts[rule.stateKey] += 1;
      });
      if (entry.dayTravelMemories?.length) travelMemories.push(...entry.dayTravelMemories);
      else if (entry.travel) {
        travelMemories.push({
          date: entry.date,
          createdAt: entry.createdAt || "",
          place: entry.travelPlace || "远方",
          type: entry.travelType || "",
        });
      }
    }

    const latestEntry = visible.at(-1) || null;
    const latestTrace = latestEntry ? traceByDate[latestEntry.date] : "";
    const latestMonthKey = latestEntry?.date?.slice(0, 7) || currentMonthKey();
    const monthEntries = visible.filter((entry) => entry.date.startsWith(latestMonthKey));
    const monthWorkCount = monthEntries.filter((entry) => entry.work).length;
    const levels = {
      home: Math.min(3, 1 + counts.homeMilestones),
      travel: Math.min(3, counts.travelCount),
      family: growthLevel(counts.familyCount),
      path: growthLevel(counts.exerciseCount),
      social: growthLevel(counts.socialCount),
      learning: growthLevel(counts.learningCount),
      kitchen: growthLevel(counts.foodCount),
      harbor: growthLevel(counts.workCount),
    };

    return {
      stateVersion,
      dayCount: visible.length,
      latestEntry,
      latestTrace,
      traceByDate,
      counts,
      levels,
      patterns: {
        busyWork: isBusyWorkMonth(monthWorkCount, monthEntries.length),
        monthWorkCount,
        monthRecordedDays: monthEntries.length,
      },
      features: {
        homeMilestone: counts.homeMilestones > 0,
        travel: counts.travelCount > 0,
        family: counts.familyCount > 0,
        exercise: counts.exerciseCount > 0,
        camping: visible.some((entry) => Boolean(entry.camping)),
        social: counts.socialCount > 0,
        learning: counts.learningCount > 0,
        food: counts.foodCount > 0,
        work: counts.workCount > 0,
        drink: visible.some((entry) => Boolean(entry.drink)),
        running: visible.some((entry) => Boolean(entry.running)),
        cycling: visible.some((entry) => Boolean(entry.cycling)),
        postcard: visible.some((entry) => Boolean(entry.postcard)),
        tent: visible.some((entry) => Boolean(entry.tent)),
        picnic: visible.some((entry) => Boolean(entry.picnic)),
      },
      travelMemories: travelMemories.slice(-3).reverse(),
    };
  }

  global.EmotionIslandState = {
    stateVersion,
    traceRules,
    traceCatalog,
    resolvePrimaryTrace,
    dailyTraceSummary,
    visibleEntries,
    mergeDailyEntries,
    buildIslandState,
    buildLifePalette,
    buildMonthlyWeather,
    isBusyWorkMonth,
    growthLevel,
    moodCategory,
  };
})(globalThis);
