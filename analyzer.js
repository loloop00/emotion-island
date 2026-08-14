(function attachEmotionAnalyzer(global) {
  const analysisVersion = 19;

  const emotionRules = [
    {
      emotion: "愤怒",
      mood: "mood-angry",
      words: [
        "一肚子火",
        "气不打一处来",
        "特别生气",
        "非常生气",
        "气炸了",
        "气死了",
        "气死",
        "气到了",
        "气到",
        "生气",
        "愤怒",
        "火大",
        "一肚火",
        "来气",
        "窝火",
        "恼火",
        "骂人",
        "被骂",
        "大吼",
        "大喊",
        "吵架",
        "吵了一架",
        "吵起来",
        "争吵",
        "烦死",
        "被气",
        "不爽",
      ],
      line: "今天浪高了一点，但岸边还在等你回来。",
      label: "风浪很大",
      icon: "🌊",
    },
    {
      emotion: "悲伤",
      mood: "mood-sad",
      words: [
        "难过",
        "伤心",
        "哭了",
        "想哭",
        "委屈",
        "失落",
        "孤独",
        "心酸",
        "压抑",
        "心塞",
        "郁闷",
        "破防",
        "emo",
        "想家",
        "累哭",
        "沮丧",
        "失望",
        "伤感",
        "绝望",
      ],
      line: "今天下了小雨，灯塔把路照得更近了。",
      label: "下了小雨",
      icon: "🌧️",
    },
    {
      emotion: "烦躁",
      mood: "mood-irritable",
      words: [
        "烦躁",
        "焦躁",
        "暴躁",
        "不耐烦",
        "抓狂",
        "心浮气躁",
        "烦闷",
        "燥热",
        "闷热",
        "好热",
        "很热",
        "太热",
        "热死了",
        "晒死了",
        "好晒",
        "太晒",
        "晒得慌",
        "晒得难受",
        "热得难受",
        "晒得我难受",
        "太阳太大",
      ],
      line: "今天的阳光有点强，小岛替你挡一会儿。",
      label: "阳光有点强",
      icon: "☀️",
    },
    {
      emotion: "焦虑",
      mood: "mood-anxious",
      words: [
        "坐立难安",
        "心烦意乱",
        "喘不过气",
        "特别焦虑",
        "非常焦虑",
        "焦虑",
        "压力",
        "紧张",
        "不安",
        "心慌",
        "害怕",
        "恐惧",
        "惊慌",
        "慌张",
        "惊恐",
        "无助",
        "黑暗",
        "黑漆漆",
        "阴暗",
        "忐忑",
        "担心",
        "崩溃",
        "内耗",
        "失眠",
        "慌了",
        "发慌",
        "赶",
      ],
      line: "今天风有点大，但灯塔一直亮着。",
      label: "风有点大",
      icon: "🌫️",
    },
    {
      emotion: "身体不适",
      mood: "mood-unwell",
      words: [
        "身体不适",
        "头痛",
        "头疼",
        "胃痛",
        "胃疼",
        "肚子痛",
        "肚子疼",
        "腰疼",
        "牙疼",
        "经期痛",
        "痛经",
        "发烧",
        "感冒",
        "生病",
        "恶心",
        "眩晕",
      ],
      line: "今天岛上起了薄雾，灯还温柔地亮着。",
      label: "起了薄雾",
      icon: "🌫️",
    },
    {
      emotion: "疲惫",
      mood: "mood-tired",
      words: [
        "精疲力尽",
        "筋疲力尽",
        "提不起精神",
        "没睡好",
        "睡不够",
        "没力气",
        "疲惫",
        "疲倦",
        "疲劳",
        "乏力",
        "精疲力竭",
        "好倦",
        "很倦",
        "心累",
        "身体累",
        "累死了",
        "累坏了",
        "好累",
        "很累",
        "累了一天",
        "困死了",
        "好困",
        "很困",
        "困",
        "累",
      ],
      line: "今天的风慢了一些，小岛也陪你歇一会。",
      label: "风慢了下来",
      icon: "☁️",
    },
    {
      emotion: "无聊",
      mood: "mood-flat",
      words: ["提不起劲", "没意思", "无聊", "没劲", "无趣", "闲得慌", "空虚", "麻木", "发呆", "摆烂"],
      line: "今天海面很安静，像在等一点新的声音。",
      label: "海面很安静",
      icon: "🌥️",
    },
    {
      emotion: "开心",
      mood: "mood-bright",
      words: [
        "很有成就感",
        "如释重负",
        "笑死了",
        "开心",
        "快乐",
        "幸福",
        "高兴",
        "安心",
        "舒服",
        "放松",
        "顺利",
        "喜欢",
        "满足",
        "治愈",
        "期待",
        "兴奋",
        "惊喜",
        "感动",
        "释然",
        "轻松",
        "成就感",
        "被夸",
        "哈哈",
        "太爽了",
        "爽",
        "自在",
        "享受",
      ],
      line: "今天海面闪着光，小岛多了一点轻快。",
      label: "阳光很好",
      icon: "☀️",
    },
  ];

  const featureRules = [
    {
      key: "homeMilestone",
      className: "has-home-milestone",
      words: ["搬新家", "搬进新家", "搬家", "新房", "入住新家", "入住新房", "入住新居", "乔迁", "住进新家", "新住处"],
    },
    {
      key: "travel",
      className: "has-travel",
      words: ["旅游", "旅行", "出游", "度假", "去玩", "出去玩", "去海边", "去爬山", "去了景点"],
    },
    {
      key: "camping",
      className: "has-camping",
      words: ["露营", "野营", "搭帐篷", "住帐篷", "帐篷"],
    },
    {
      key: "work",
      className: "has-work",
      words: [
        "工作",
        "上班",
        "老板",
        "同事",
        "会议",
        "开会",
        "方案",
        "项目",
        "客户",
        "汇报",
        "加班",
        "赶稿",
        "出差",
      ],
    },
    {
      key: "family",
      className: "has-family",
      words: ["妈妈", "爸爸", "家人", "一家人", "父母", "姐姐", "哥哥", "妹妹", "弟弟", "奶奶", "爷爷", "外婆", "外公"],
    },
    {
      key: "exercise",
      className: "has-exercise",
      words: [
        "健身房",
        "健身训练",
        "力量训练",
        "器械训练",
        "撸铁",
        "健身",
        "跑步",
        "运动",
        "瑜伽",
        "散步",
        "走路",
        "走一走",
        "走了一走",
        "走了走",
        "出去走",
        "走了很多路",
        "走了一大圈",
        "走了很久",
        "走了好久",
        "步行",
        "徒步",
        "遛弯",
        "骑车",
        "骑行",
        "骑自行车",
        "自行车",
        "骑单车",
        "游泳",
        "爬山",
        "打球",
        "羽毛球",
        "篮球",
        "跳舞",
        "爬楼",
        "遛狗",
      ],
    },
    {
      key: "social",
      className: "has-social",
      words: ["朋友", "约会", "聊天", "聚餐", "聚会", "同学", "见面", "团建", "见网友"],
    },
    {
      key: "learning",
      className: "has-learning",
      words: [
        "学习",
        "学到了",
        "学到",
        "读书",
        "看书",
        "课程",
        "上课",
        "考试",
        "复习",
        "英语",
        "写作",
        "研究",
        "作业",
        "论文",
        "刷题",
        "背单词",
      ],
    },
    {
      key: "food",
      className: "has-food",
      words: [
        "吃饭",
        "吃了饭",
        "吃了一顿",
        "吃晚饭",
        "吃了晚饭",
        "吃午饭",
        "吃了午饭",
        "吃早餐",
        "吃了早餐",
        "吃东西",
        "吃了东西",
        "吃外卖",
        "吃了外卖",
        "火锅",
        "晚饭",
        "午饭",
        "早餐",
        "甜品",
        "面包",
        "做饭",
        "做了一顿饭",
        "煮饭",
        "下厨",
        "外卖",
        "烧菜",
        "烘焙",
      ],
    },
    {
      key: "drink",
      className: "has-drink",
      words: [],
    },
    {
      key: "running",
      className: "has-running",
      words: ["跑步", "晨跑", "夜跑", "慢跑", "长跑"],
    },
    {
      key: "cycling",
      className: "has-cycling",
      words: ["骑车", "骑行", "骑自行车", "自行车", "骑单车"],
    },
    {
      key: "postcard",
      className: "has-postcard",
      words: ["明信片", "拍照", "拍了照片", "照片", "拍风景"],
    },
    {
      key: "tent",
      className: "has-tent",
      words: [],
    },
    {
      key: "picnic",
      className: "has-picnic",
      words: [],
    },
  ];

  const lifeEventRules = [
    {
      key: "homeMilestone",
      source: "feature",
      featureKey: "homeMilestone",
      family: "home",
      fullLabel: "小屋变化",
      shortLabel: "新家",
      words: ["搬进新家", "搬新家", "搬家", "新房", "入住新家", "入住新房", "入住新居", "乔迁", "住进新家", "新住处"],
      detail: "小屋正在慢慢长大",
    },
    {
      key: "camping",
      source: "feature",
      featureKey: "camping",
      family: "camping",
      fullLabel: "露营记忆",
      shortLabel: "露营",
      words: ["露营", "野营", "搭帐篷", "住帐篷", "帐篷"],
      detail: "岛上搭起了一顶帐篷",
    },
    {
      key: "travel",
      source: "feature",
      featureKey: "travel",
      family: "travel",
      fullLabel: "旅行记忆",
      shortLabel: "旅行",
      words: ["旅游", "旅行", "出游", "度假", "出去玩", "去玩", "去海边", "去爬山", "去了景点"],
      detail: "岛上留下一段远方",
    },
    {
      key: "work",
      source: "feature",
      featureKey: "work",
      family: "work",
      fullLabel: "工作日常",
      shortLabel: "工作",
      words: ["改方案", "加班", "开会", "会议", "项目", "老板", "同事", "汇报", "客户", "出差", "工作", "上班"],
      specificLabels: { 改方案: "改方案", 加班: "加班", 开会: "开会" },
      specificShortLabels: { 改方案: "方案" },
      detail: "船影正在慢慢变密",
    },
    {
      key: "family",
      source: "feature",
      featureKey: "family",
      family: "family",
      fullLabel: "家庭灯光",
      shortLabel: "家人",
      words: ["妈妈", "爸爸", "家人", "一家人", "父母", "姐姐", "哥哥", "妹妹", "弟弟", "奶奶", "爷爷", "外婆", "外公"],
      specificLabels: { 妈妈: "妈妈", 爸爸: "爸爸", 父母: "父母", 奶奶: "奶奶", 爷爷: "爷爷" },
      detail: "窗里亮起一盏灯",
    },
    {
      key: "exercise",
      source: "feature",
      featureKey: "exercise",
      family: "nature",
      fullLabel: "运动",
      shortLabel: "运动",
      words: ["健身房", "健身训练", "力量训练", "器械训练", "撸铁", "健身", "跑步", "运动", "瑜伽", "散步", "走路", "走了一走", "出去走", "走了很多路", "走了一大圈", "步行", "徒步", "骑车", "游泳", "爬山", "打球", "跳舞", "遛狗"],
      detail: "草地出现一小段路",
    },
    {
      key: "social",
      source: "feature",
      featureKey: "social",
      family: "social",
      fullLabel: "朋友相聚",
      shortLabel: "相聚",
      words: ["朋友", "约会", "聊天", "聚餐", "聚会", "同学", "见面", "团建", "见网友"],
      specificLabels: { 朋友: "朋友", 约会: "约会", 聚会: "聚会", 见面: "见面" },
      detail: "篝火刚刚点亮",
    },
    {
      key: "learning",
      source: "feature",
      featureKey: "learning",
      family: "learning",
      fullLabel: "阅读学习",
      shortLabel: "阅读",
      words: ["学习", "学到了", "学到", "读书", "看书", "课程", "上课", "考试", "复习", "写作", "研究", "作业", "论文", "刷题", "背单词"],
      specificLabels: { 学习: "学习", 读书: "阅读", 看书: "阅读", 课程: "课程", 考试: "考试" },
      detail: "屋旁多了一页书",
    },
    {
      key: "food",
      source: "feature",
      featureKey: "food",
      family: "food",
      fullLabel: "厨房烟火",
      shortLabel: "烟火",
      words: [
        "吃饭",
        "吃了饭",
        "吃了一顿",
        "吃晚饭",
        "吃了晚饭",
        "吃午饭",
        "吃了午饭",
        "吃早餐",
        "吃了早餐",
        "吃东西",
        "吃了东西",
        "吃外卖",
        "吃了外卖",
        "晚饭",
        "午饭",
        "早餐",
        "家宴",
        "火锅",
        "甜品",
        "面包",
        "做饭",
        "做了一顿饭",
        "煮饭",
        "下厨",
        "外卖",
        "烧菜",
        "烘焙",
      ],
      specificLabels: { 吃饭: "吃饭", 晚饭: "晚饭", 午饭: "午饭", 早餐: "早餐", 家宴: "家宴", 火锅: "火锅", 面包: "面包", 做饭: "做饭", 煮饭: "煮饭", 外卖: "外卖", 烘焙: "烘焙" },
      detail: "屋里渐渐有了饭香",
    },
    {
      key: "running",
      source: "feature",
      featureKey: "running",
      family: "nature",
      fullLabel: "跑步环线",
      shortLabel: "跑步",
      words: ["跑步", "晨跑", "夜跑", "慢跑", "长跑"],
      detail: "草地上绕出了一圈轻快的脚步",
    },
    {
      key: "cycling",
      source: "feature",
      featureKey: "cycling",
      family: "nature",
      fullLabel: "自行车架",
      shortLabel: "骑行",
      words: ["骑车", "骑行", "骑自行车", "自行车", "骑单车"],
      detail: "岛边多了一个停放脚步的地方",
    },
    {
      key: "postcard",
      source: "feature",
      featureKey: "postcard",
      family: "travel",
      fullLabel: "旅行明信片",
      shortLabel: "明信片",
      words: ["明信片", "拍照", "拍了照片", "照片", "拍风景"],
      detail: "远方寄来了一张带着风景的明信片",
    },
    {
      key: "tent",
      source: "feature",
      featureKey: "tent",
      family: "travel-exercise",
      fullLabel: "远行与运动",
      shortLabel: "帐篷",
      words: [],
      detail: "远方和脚步，在岛上搭起了一处歇脚处",
    },
    {
      key: "picnic",
      source: "feature",
      featureKey: "picnic",
      family: "social-food",
      fullLabel: "相聚与饮食",
      shortLabel: "野餐",
      words: [],
      detail: "草地上摆开了一张野餐桌",
    },
    {
      key: "drink",
      source: "signal",
      signalKey: "drink",
      family: "drink",
      fullLabel: "喜欢的饮品",
      shortLabel: "饮品",
      words: ["奶茶", "咖啡", "果茶", "喝茶", "可乐", "饮料"],
      detail: "今天留住了一口喜欢的味道",
    },
    {
      key: "leisure",
      source: "signal",
      signalKey: "leisure",
      family: "leisure",
      fullLabel: "闲暇时光",
      shortLabel: "闲暇",
      words: ["看电影", "追剧", "打游戏", "听歌", "唱歌", "逛街", "购物", "看展"],
      specificLabels: { 看电影: "电影", 追剧: "追剧", 打游戏: "游戏", 听歌: "听歌", 逛街: "逛街" },
      detail: "岛上留了一小段只属于你的时间",
    },
    {
      key: "career",
      source: "signal",
      signalKeys: ["careerSearch", "careerChange"],
      family: "direction",
      fullLabel: "生活方向",
      shortLabel: "方向",
      words: ["找工作", "求职", "投简历", "面试", "入职", "辞职", "离职", "失业", "裁员", "升职", "转岗", "换工作"],
      specificLabels: { 找工作: "找工作", 面试: "面试", 入职: "入职", 辞职: "辞职", 离职: "离职" },
      detail: "海风翻开了生活新的一页",
    },
    {
      key: "conflict",
      source: "signal",
      signalKey: "conflict",
      family: "conflict",
      fullLabel: "关系波动",
      shortLabel: "吵架",
      words: ["吵了一架", "吵架", "争吵", "被骂", "骂人", "大吼", "大喊"],
      specificLabels: { 吵了一架: "吵架", 吵架: "吵架", 争吵: "争吵", 被骂: "被骂", 骂人: "骂人" },
      detail: "海面起了风浪，先把自己抱回来",
    },
    {
      key: "health",
      source: "signal",
      signalKey: "health",
      family: "health",
      fullLabel: "身体状态",
      shortLabel: "身体",
      words: ["头痛", "头疼", "胃痛", "胃疼", "肚子疼", "腰疼", "牙疼", "痛经", "发烧", "感冒", "恶心", "眩晕", "不舒服"],
      specificLabels: { 头痛: "头痛", 头疼: "头疼", 胃痛: "胃痛", 感冒: "感冒", 发烧: "发烧" },
      detail: "岛上起了薄雾，先让风慢一点",
    },
    {
      key: "boredom",
      source: "signal",
      signalKey: "boredom",
      family: "boredom",
      fullLabel: "无聊时刻",
      shortLabel: "无聊",
      words: ["无聊", "没劲", "空虚", "麻木", "发呆", "摆烂"],
      detail: "海面暂时没有故事，也可以安静一会",
    },
  ];

  const calmEmotion = {
    emotion: "平静",
    mood: "mood-calm",
    line: "海面恢复平静了。",
    label: "心情很平静",
    icon: "🌤️",
  };

  const calmWords = ["平静", "安静", "安稳", "还好", "踏实"];

  const recoveryWords = [
    "好一点",
    "好多了",
    "好一些",
    "缓过来",
    "缓了一下",
    "放松了",
    "轻松了",
    "平静下来",
    "舒服一些",
    "不焦虑了",
    "不生气了",
    "没那么难过",
    "没那么累",
  ];

  const stormWeatherWords = [
    "台风",
    "狂风暴雨",
    "暴风雨",
    "大暴雨",
    "雷暴",
    "飓风",
    "龙卷风",
    "风暴",
  ];

  const fearWords = [
    "差点被摩托车撞到",
    "差点被单车撞到",
    "差点被自行车撞到",
    "差点被车撞到",
    "差点被撞到",
    "险些被摩托车撞到",
    "险些被单车撞到",
    "险些被自行车撞到",
    "险些被车撞到",
    "差点撞上单车",
    "差点撞上自行车",
    "差点撞上车",
    "差点出车祸",
    "被摩托车吓到",
    "被单车吓到",
    "被自行车吓到",
    "被车吓到",
    "吓了一跳",
    "吓死我了",
    "吓坏了",
    "惊魂未定",
  ];

  const heatWeatherWords = [
    "燥热",
    "闷热",
    "好热",
    "很热",
    "太热",
    "热死了",
    "晒死了",
    "晒得难受",
    "热得难受",
    "晒得我难受",
    "太阳太大",
    "大太阳",
    "太阳很大",
    "太阳好大",
    "太阳太晒",
    "太阳很晒",
    "烈日",
    "暴晒",
    "高温",
    "天气很热",
    "天气太热",
    "天很热",
  ];

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function hasAny(text, words) {
    return words.some((word) => text.includes(word));
  }

  function hasHeatWeather(text) {
    if (hasAny(text, heatWeatherWords)) return true;
    return /天天[^，。！？]{0,12}(?:晒|太阳)|太阳[^，。！？]{0,8}(?:晒|热)|(?:晒|热)[^，。！？]{0,8}(?:天气|太阳)/.test(text);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function protectSemanticNegatives(text) {
    return text
      .replaceAll("不舒服", "身体不适")
      .replaceAll("不安", "心慌")
      .replaceAll("不爽", "恼火");
  }

  function maskNegatedEmotionText(text) {
    let masked = protectSemanticNegatives(text);
    masked = masked.replace(
      /差(?:点|一点)(?:就)?.{0,6}(?:吵架|吵了一架|争吵|骂人|大吼|大喊)/g,
      (match) => " ".repeat(match.length),
    );
    const words = [...new Set(emotionRules.flatMap((rule) => rule.words))]
      .filter((word) => !word.startsWith("不"))
      .sort((left, right) => right.length - left.length);
    const prefix = "(?:没有|没再|没|不再|已经不|并不|一点也不|完全不|不太|不怎么)";
    const bridge = "(?:觉得|感到|那么|很|再)?";
    words.forEach((word) => {
      masked = masked.replace(
        new RegExp(`${prefix}${bridge}${escapeRegExp(word)}`, "g"),
        (match) => " ".repeat(match.length),
      );
    });
    return masked;
  }

  function ruleMatchPosition(text, rule) {
    return rule.words.reduce((latest, word) => Math.max(latest, text.lastIndexOf(word)), -1);
  }

  function detectEmotionInSegment(segment) {
    const text = maskNegatedEmotionText(segment);
    const positiveRule = emotionRules.find((rule) => rule.emotion === "开心");
    const strongAngerWords = ["生气", "愤怒", "火大", "气炸", "气死", "窝火", "恼火", "吵架", "争吵", "骂"];
    if (
      hasAny(text, positiveRule.words) &&
      hasAny(text, ["大喊", "大叫", "尖叫", "欢呼"]) &&
      !hasAny(text, strongAngerWords)
    ) {
      return positiveRule;
    }

    let matchedRule = null;
    let matchedPosition = -1;
    emotionRules.forEach((rule) => {
      const position = ruleMatchPosition(text, rule);
      if (position > matchedPosition) {
        matchedRule = rule;
        matchedPosition = position;
      }
    });
    return matchedRule;
  }

  function matchedEmotionRules(segment) {
    const text = maskNegatedEmotionText(segment);
    return emotionRules.filter((rule) => rule.words.some((word) => text.includes(word)));
  }

  function isEmotionAmbiguous(text) {
    if (hasAny(text, stormWeatherWords) || hasHeatWeather(text) || hasAny(text, fearWords)) return false;
    const segments = text.split(/但是|不过|后来|最后|结果|可是|好在|幸好|终于|但/).filter(Boolean);
    const ending = segments.at(-1) || text;
    const endingMatches = matchedEmotionRules(ending);
    const allMatches = matchedEmotionRules(text);
    const hasCalmCue = hasAny(maskNegatedEmotionText(text), calmWords);

    if (!allMatches.length) return !hasCalmCue;
    if (endingMatches.length > 1) return true;
    if (!endingMatches.length && allMatches.length > 1) return true;
    return false;
  }

  function detectEmotion(text) {
    const segments = text.split(/但是|不过|后来|最后|结果|可是|好在|幸好|终于|但/).filter(Boolean);
    const ending = segments.at(-1) || text;
    const endingEmotion = detectEmotionInSegment(ending);
    if (segments.length > 1 && endingEmotion) return endingEmotion;
    return detectEmotionInSegment(text) || calmEmotion;
  }

  function occurrenceIsExcluded(text, index, word) {
    const before = text.slice(Math.max(0, index - 16), index);
    const after = text.slice(index + word.length, index + word.length + 10);
    const nonOccurrenceBefore =
      /(?:没有|没(?:能|来得及|去|喝|吃)?|不想|不打算|取消|差点|差一点|本来想|原本想|计划|准备|打算|想去|想要|希望|考虑|期待|明天|后天|下周|下个月|以后(?:想|准备|计划))/;
    const nonOccurrenceAfter = /(?:没去|没做|没成|没喝|没吃|取消|作罢|改天|再说)/;
    return nonOccurrenceBefore.test(before) || nonOccurrenceAfter.test(after);
  }

  function hasOccurredKeyword(text, words) {
    return words.some((word) => {
      let fromIndex = 0;
      while (fromIndex < text.length) {
        const index = text.indexOf(word, fromIndex);
        if (index === -1) return false;
        if (!occurrenceIsExcluded(text, index, word)) return true;
        fromIndex = index + word.length;
      }
      return false;
    });
  }

  function firstOccurredWord(text, words) {
    return [...words]
      .sort((left, right) => right.length - left.length)
      .find((word) => hasOccurredKeyword(text, [word])) || "";
  }

  function eventLabel(rule, matchedWord) {
    return rule.specificLabels?.[matchedWord] || rule.fullLabel;
  }

  function eventShortLabel(rule, matchedWord, fullLabel) {
    return rule.specificShortLabels?.[matchedWord] || rule.specificLabels?.[matchedWord] || rule.shortLabel || fullLabel.slice(0, 2);
  }

  function emotionLifeEvent(text, emotion, signals = {}) {
    if (signals.stormWeather) {
      return {
        key: "weather-storm",
        sourceWord: firstOccurredWord(text, stormWeatherWords),
        family: "storm",
        fullLabel: "风雨天气",
        shortLabel: "风雨",
        detail: "狂风暴雨经过海面，灯塔替小岛守着光",
      };
    }
    if (signals.fear) {
      return {
        key: "emotion-fear",
        sourceWord: firstOccurredWord(text, fearWords),
        family: "shadow",
        fullLabel: "害怕",
        shortLabel: "害怕",
        detail: "刚才那一下太近了，灯塔替你留着一盏灯",
      };
    }
    const matchedRule = emotionRules.find((rule) => rule.emotion === emotion.emotion);
    const matchedWord = matchedRule ? firstOccurredWord(text, matchedRule.words) : "";
    const relationshipDetail = signals.relationshipNeglect ? "有些话没有被接住，灯塔还在远处亮着" : "今天下了小雨，灯塔把路照得更近了";
    const emotionEvents = {
      开心: { family: "bright", fullLabel: "开心", shortLabel: "开心", detail: "海面闪着光，小岛多了一点轻快" },
      焦虑: { family: matchedWord === "害怕" || matchedWord === "恐惧" || matchedWord === "黑暗" ? "shadow" : "wind", fullLabel: matchedWord || "焦虑", shortLabel: matchedWord || "焦虑", detail: "天色有点深，灯会替你留着" },
      愤怒: { family: "conflict", fullLabel: matchedWord || "生气", shortLabel: matchedWord || "生气", detail: "海面起了风浪，先把自己抱回来" },
      烦躁: { family: "irritable", fullLabel: matchedWord || "烦躁", shortLabel: matchedWord || "烦躁", detail: "阳光有点强，先找一片阴影" },
      悲伤: { family: "melancholy", fullLabel: matchedWord || "难过", shortLabel: matchedWord || "难过", detail: relationshipDetail },
      "身体不适": { family: "health", fullLabel: matchedWord || "身体", shortLabel: matchedWord || "身体", detail: "岛上起了薄雾，先让风慢一点" },
      疲惫: { family: "low", fullLabel: matchedWord || "疲惫", shortLabel: matchedWord || "疲惫", detail: "今天的风慢了一些，小岛也陪你歇一会" },
      无聊: { family: "boredom", fullLabel: matchedWord || "无聊", shortLabel: matchedWord || "无聊", detail: "海面暂时没有故事，也可以安静一会" },
      平静: { family: "calm", fullLabel: "平静", shortLabel: "平静", detail: "海面恢复平静了" },
    };
    const event = emotionEvents[emotion.emotion] || emotionEvents.平静;
    return {
      key: `emotion-${emotion.emotion}`,
      sourceWord: matchedWord,
      ...event,
    };
  }

  function extractLifeEvents(text, features, signals, emotion) {
    const events = [];
    const seen = new Set();

    lifeEventRules.forEach((rule) => {
      if (rule.key === "tent" && features.camping) return;
      const matchedWord = firstOccurredWord(text, rule.words);
      const isSignalActive = rule.signalKey
        ? Boolean(signals[rule.signalKey])
        : rule.signalKeys?.some((key) => Boolean(signals[key]));
      const isFeatureActive = rule.featureKey ? Boolean(features[rule.featureKey]) : false;
      const isSpecificFoodActivity = rule.key === "food" && ["外卖", "火锅", "做饭", "煮饭", "下厨", "烘焙"].includes(matchedWord);

      if (!isSignalActive && !isFeatureActive && !isSpecificFoodActivity) return;
      const fullLabel = eventLabel(rule, matchedWord);
      const key = `${rule.key}:${fullLabel}`;
      if (seen.has(key)) return;
      seen.add(key);
      events.push({
        key: rule.key,
        sourceWord: matchedWord,
        family: rule.family,
        fullLabel,
        shortLabel: eventShortLabel(rule, matchedWord, fullLabel),
        detail: rule.detail,
      });
    });

    if (!events.length) events.push(emotionLifeEvent(text, emotion, signals));
    return events.slice(0, 8);
  }

  function detectSignals(text) {
    const healthWords = emotionRules.find((rule) => rule.emotion === "身体不适").words;
    const boredomWords = emotionRules.find((rule) => rule.emotion === "无聊").words;
    const conflictWords = ["吵架", "争吵", "被骂", "骂人", "大吼", "大喊"];
    const drinkWords = ["奶茶", "咖啡", "果茶", "喝茶", "可乐", "饮料"];
    const leisureWords = ["看电影", "追剧", "打游戏", "听歌", "唱歌", "逛街", "购物", "看展"];
    const careerSearchWords = ["找工作", "求职", "投简历", "面试", "待业"];
    const careerChangeWords = ["入职", "辞职", "离职", "失业", "裁员", "升职", "转岗", "换工作", "拿到offer", "拿到 offer"];
    const relationshipNeglectWords = [
      "不理我",
      "不搭理我",
      "不回复",
      "不回我",
      "不回消息",
      "已读不回",
      "冷落我",
      "忽略我",
      "不联系我",
      "不接我电话",
    ];
    const stormWeather = hasAny(text, stormWeatherWords);
    const heatWeather = hasHeatWeather(text);
    const fear = hasAny(text, fearWords);

    const conflict =
      hasOccurredKeyword(text, conflictWords) ||
      /被[^，。！？\s]{0,4}骂|跟[^，。！？\s]{0,8}(?:吵起来|吵了一架)/.test(text);

    return {
      health: hasAny(protectSemanticNegatives(text), healthWords),
      boredom: hasAny(text, boredomWords),
      conflict,
      drink: hasOccurredKeyword(text, drinkWords),
      leisure: hasOccurredKeyword(text, leisureWords),
      careerSearch: hasAny(text, careerSearchWords),
      careerChange: hasOccurredKeyword(text, careerChangeWords),
      relationshipNeglect: hasAny(text, relationshipNeglectWords),
      stormWeather,
      heatWeather,
      fear,
    };
  }

  function extractTravelPlace(text) {
    const everydayPlaces = [
      "朋友家",
      "同学家",
      "公司",
      "办公室",
      "健身房",
      "楼下",
      "附近",
      "家里",
      "哪里",
      "商场",
      "公园",
    ];
    const patterns = [
      /(?:去|到|在)([^，。！？\s]{1,10}?)(?:玩|逛|度假|旅行|旅游)/,
      /(?:去了|来到)([^，。！？\s]{1,10}?)(?:，|。|！|？|玩|旅行|旅游)/,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match?.[1]) {
        const place = match[1].replace(/^(了|一趟)/, "").replace(/(一趟|那边)$/, "");
        if (!everydayPlaces.some((item) => place.includes(item))) return place;
      }
    }
    if (hasAny(text, ["海边", "沙滩", "海岛"])) return "海边";
    if (hasAny(text, ["山里", "山上", "森林", "草原"])) return "山里";
    return "";
  }

  function detectTravelType(text, place) {
    const subject = `${text}${place}`;
    if (hasAny(subject, ["海边", "沙滩", "海岛", "看海", "海风"])) return "seaside";
    if (hasAny(subject, ["爬山", "山里", "山上", "森林", "草原", "徒步", "露营", "自然"])) return "nature";
    if (place) return "city";
    return "unknown";
  }

  function detectFeatures(text, signals) {
    const features = featureRules.reduce((result, rule) => {
      result[rule.key] = hasOccurredKeyword(text, rule.words);
      return result;
    }, {});

    const otherPersonHome =
      /(?:朋友|同事|同学|别人|亲戚).{0,7}(?:搬家|搬新家|新房|乔迁)|帮(?:朋友|同事|同学|别人|亲戚|家人)搬家/.test(text);
    const onlyLookingAtHome = /(?:看房|看了房|看新房|看了新房|参观新房)/.test(text);
    if (otherPersonHome || onlyLookingAtHome) features.homeMilestone = false;
    if (otherPersonHome) features.social = false;

    const travelPlace = extractTravelPlace(text);
    if (!features.travel && travelPlace) {
      features.travel =
        /(?:去|到|在)[^，。！？\s]{1,10}(?:玩|逛|度假|旅行|旅游)/.test(text) &&
        hasOccurredKeyword(text, [travelPlace]);
    }

    const plannedTravel = /旅行计划|旅游计划|出游计划|度假计划/.test(text);
    const otherPersonTravel =
      /(?:^|今天|听说|得知)(?:我的)?(?:朋友|同事|同学|家人|他|她).{0,6}(?:去|去了|在).{0,10}(?:旅行|旅游|度假|玩)/.test(
        text,
      );
    if (plannedTravel || otherPersonTravel) features.travel = false;
    if (otherPersonTravel) features.social = false;

    if (/和AI聊天|跟AI聊天|和机器人聊天|跟机器人聊天|客服聊天|工作群聊天|自言自语/.test(text)) {
      features.social = false;
    }

    if (signals.relationshipNeglect) features.social = false;

    const explicitSocialActivity = hasAny(text, [
      "聚会",
      "聚餐",
      "见面",
      "约会",
      "聊天",
      "相聚",
      "团建",
      "见网友",
      "一起吃饭",
      "一起吃晚饭",
      "一起吃午饭",
      "一起吃早餐",
      "野餐",
    ]);
    if (features.travel && !explicitSocialActivity) features.social = false;
    if (hasOccurredKeyword(text, ["野餐", "户外聚餐", "户外吃饭", "露天吃饭"])) features.social = true;

    if (/开了[^，。！？]{0,6}会/.test(text)) features.work = true;
    if (/读了[^，。！？]{0,6}书/.test(text)) features.learning = true;
    if (/打了[^，。！？]{0,6}游戏/.test(text)) signals.leisure = true;

    const activeWorkWords = ["上班", "老板", "同事", "开会", "会议", "项目", "客户", "加班", "出差"];
    if ((signals.careerSearch || signals.careerChange) && !hasOccurredKeyword(text, activeWorkWords)) {
      features.work = false;
    }

    if (signals.drink && !hasOccurredKeyword(text, ["吃", "做饭", "煮饭", "下厨", "晚饭", "午饭", "早餐", "火锅"])) {
      features.food = false;
    }

    if (features.family && features.food) features.food = false;

    if (/公司聚会|同事聚会|公司团建|同事团建/.test(text)) features.work = false;

    if (signals.conflict) {
      features.family = false;
      features.social = false;
      features.food = false;
    }

    if (features.homeMilestone) {
      Object.keys(features).forEach((key) => {
        if (key !== "homeMilestone") features[key] = false;
      });
      features.travel = false;
    }

    features.drink = Boolean(signals.drink && !features.homeMilestone);
    features.postcard = Boolean(features.travel && features.postcard);
    const explicitPicnic = hasOccurredKeyword(text, [
      "野餐",
      "户外吃饭",
      "户外聚餐",
      "在草地吃饭",
      "在公园吃饭",
      "露天吃饭",
      "野餐垫",
      "野餐桌",
    ]);
    features.tent = Boolean(features.camping || (features.travel && features.exercise));
    features.picnic = Boolean(features.social && features.food && explicitPicnic);

    return { features, travelPlace: features.travel ? travelPlace : "" };
  }

  function detectWeatherLevel(text, emotion, recovery) {
    if (hasAny(text, stormWeatherWords)) return "weather-heavy";
    if (hasHeatWeather(text)) return "weather-light";
    if (["平静", "开心", "无聊"].includes(emotion)) return "weather-light";

    let level = 2;
    if (
      hasAny(text, [
        "崩溃",
        "喘不过气",
        "压力很大",
        "特别焦虑",
        "非常焦虑",
        "很心累",
        "累死了",
        "一肚火",
        "一肚子火",
        "气死",
        "特别生气",
        "非常生气",
        "疼得受不了",
        "痛得受不了",
      ])
    ) {
      level = 3;
    }
    if (
      hasAny(text, [
        "有点累",
        "有点烦",
        "一点焦虑",
        "稍微紧张",
        "有点不舒服",
        "有点无聊",
        "有点失落",
        "有些失落",
        "有点难过",
        "有些难过",
        "有点委屈",
        "有点沮丧",
      ])
    ) {
      level = 1;
    }
    if (recovery) level = Math.max(1, level - 1);
    return ["weather-light", "weather-medium", "weather-heavy"][level - 1];
  }

  function chooseLabel(emotion, features, signals, travelPlace) {
    if (features.homeMilestone) return "搬进了新家";
    if (features.camping) return "岛上搭起了一顶帐篷";
    if (features.travel) return travelPlace ? `从${travelPlace}带回风景` : "从远方带回风景";
    if (signals.careerChange) return "工作翻到了新的一页";
    if (signals.careerSearch) return "在寻找新的方向";
    if (signals.stormWeather) return "风雨经过海面";
    if (signals.heatWeather) return "阳光有点强";
    if (signals.fear) return "害怕";
    if (signals.relationshipNeglect) return "海面有点远";
    if (signals.conflict) return emotion.label;
    if (signals.health) return "身体有点不舒服";
    if (signals.boredom) return "海面有些安静";
    if (signals.drink && !features.social) return "喝到喜欢的味道";
    if (signals.leisure) return "留了一点自己的时间";
    if (features.exercise) return "走出一条新路";
    if (features.family) return "小屋亮起了灯";
    if (features.social) return "岛上有了篝火";
    if (features.learning) return "岸边多了一本书";
    if (features.work) return "港口忙了起来";
    if (features.food) return "多了一点烟火气";
    return emotion.label;
  }

  function chooseIcon(emotion, features, signals) {
    if (features.homeMilestone) return "🔑";
    if (features.camping) return "⛺";
    if (features.travel) return "⛵";
    if (signals.careerSearch || signals.careerChange) return "🧭";
    if (signals.stormWeather) return "🌊";
    if (signals.heatWeather) return "☀️";
    if (signals.health) return "🌫️";
    if (signals.drink) return "🥤";
    if (features.exercise) return "🌿";
    if (features.family) return "🏠";
    if (features.social) return "🔥";
    if (features.learning) return "📖";
    if (features.work) return "⛵";
    if (features.food) return "🍲";
    return emotion.icon;
  }

  function chooseLine(emotion, features, signals) {
    if (features.homeMilestone) return "岛上的门，今天通向了一个新家。";
    if (features.camping) return "岛上搭起了一顶帐篷，风也有了落脚处。";
    if (features.travel) return "小船从远方回来，带回了一点新的风景。";
    if (signals.careerChange) return "今天的海风，翻开了生活新的一页。";
    if (signals.careerSearch) return "今天的海风，正在帮你辨认新的方向。";
    if (signals.stormWeather) return "狂风暴雨经过海面，灯塔替小岛守着光。";
    if (signals.heatWeather) return "今天的阳光有点强，小岛替你挡一会儿。";
    if (signals.fear) return "刚才那一下太近了，灯塔替你留着一盏灯。";
    if (signals.relationshipNeglect) return "今天海面有点远，灯塔还在等一声回应。";
    if (signals.conflict) return emotion.line;
    if (signals.health) return "今天岛上起了薄雾，先让风慢一点。";
    if (signals.boredom) return "海面暂时没有故事，也可以安静一会。";
    if (signals.drink && !features.social) return "今天的岛上，留住了一口喜欢的味道。";
    if (signals.leisure) return "今天的小岛，留了一小段只属于你的时间。";
    if (features.family) return "小木屋亮起灯，像有人在等你回家。";
    if (features.exercise) return "岛上多了一条路，风也跟着松了一点。";
    if (features.learning) return "今天有一本书，安静地留在了岸边。";
    return emotion.line;
  }

  function estimateEnergy(text, emotion, eventCount) {
    let score = 54 + eventCount * 6;
    if (emotion === "开心") score += 16;
    if (emotion === "焦虑") score -= 8;
    if (emotion === "悲伤") score -= 14;
    if (emotion === "愤怒") score -= 10;
    if (emotion === "烦躁") score -= 8;
    if (emotion === "疲惫") score -= 20;
    if (emotion === "身体不适") score -= 18;
    if (emotion === "无聊") score -= 12;
    if (text.length > 80) score += 7;
    return Math.max(18, Math.min(92, score));
  }

  function estimateStress(text, emotion) {
    let score = 32;
    if (emotion === "开心") score -= 12;
    if (emotion === "焦虑") score += 28;
    if (emotion === "悲伤") score += 18;
    if (emotion === "愤怒") score += 24;
    if (emotion === "烦躁") score += 18;
    if (emotion === "身体不适") score += 8;
    if (emotion === "疲惫") score += 6;
    if (emotion === "无聊") score -= 6;
    if (hasAny(text, ["老板", "加班", "赶", "压力", "方案", "考试"])) score += 12;
    return Math.max(8, Math.min(88, score));
  }

  function summarize(emotion, activeEvents, travelPlace) {
    const eventLabels = {
      homeMilestone: "搬进新家",
      camping: "露营",
      travel: travelPlace ? `去${travelPlace}旅行` : "旅行",
      work: "工作",
      family: "家人",
      exercise: "运动",
      social: "朋友",
      learning: "学习",
      food: "饮食",
      health: "身体状态",
      boredom: "一段安静时间",
      drink: "喜欢的饮品",
      leisure: "休闲",
      careerSearch: "求职",
      careerChange: "工作变化",
      conflict: "一次冲突",
      relationshipNeglect: "关系疏远",
      stormWeather: "台风天气",
      heatWeather: "炎热天气",
      fear: "害怕",
    };
    const events = activeEvents.map((key) => eventLabels[key]).filter(Boolean).join("、");
    if (!events) return `今天整体偏${emotion}，小岛记录了这段平凡的日子。`;
    return `今天有${events}相关的片段，整体情绪偏${emotion}。`;
  }

  function analyzeText(rawText) {
    const text = String(rawText || "").trim();
    let emotion = detectEmotion(text);
    const signals = detectSignals(text);
    if (
      signals.stormWeather &&
      emotion.emotion === "平静" &&
      !hasAny(maskNegatedEmotionText(text), calmWords)
    ) {
      emotion = emotionRules.find((rule) => rule.emotion === "焦虑") || emotion;
    }
    if (signals.heatWeather && emotion.emotion === "平静" && !hasAny(maskNegatedEmotionText(text), calmWords)) {
      emotion = emotionRules.find((rule) => rule.emotion === "烦躁") || emotion;
    }
    if (signals.fear) {
      emotion = {
        ...(emotionRules.find((rule) => rule.emotion === "焦虑") || emotion),
        label: "害怕",
        line: "刚才那一下太近了，灯塔替你留着一盏灯。",
      };
    }
    if (
      emotion.emotion === "开心" &&
      hasAny(text, ["大喊", "大叫", "尖叫", "欢呼"]) &&
      !hasAny(text, ["生气", "愤怒", "火大", "气炸", "气死", "窝火", "恼火", "吵架", "争吵", "骂"])
    ) {
      signals.conflict = false;
    }
    const { features, travelPlace } = detectFeatures(text, signals);
    const recovery = hasAny(text, recoveryWords);
    const windy = hasAny(text, ["吹风", "吹了吹风", "海风", "起风", "风很大", "大风"]) || signals.stormWeather || signals.fear;
    const emotionAmbiguous = isEmotionAmbiguous(text);
    const activeEvents = [
      ...featureRules.filter((rule) => features[rule.key]).map((rule) => rule.key),
      ...Object.keys(signals).filter((key) => signals[key]),
    ];
    const lifeEvents = extractLifeEvents(text, features, signals, emotion);

    return {
      analysisVersion,
      id: global.crypto?.randomUUID ? global.crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      date: todayKey(),
      createdAt: new Date().toISOString(),
      rawText: text,
      emotion: emotion.emotion,
      mood: emotion.mood,
      label: chooseLabel(emotion, features, signals, travelPlace),
      icon: chooseIcon(emotion, features, signals),
      line: chooseLine(emotion, features, signals),
      windy,
      recovery,
      energy: estimateEnergy(text, emotion.emotion, activeEvents.length),
      stress: estimateStress(text, emotion.emotion),
      weatherLevel: detectWeatherLevel(text, emotion.emotion, recovery),
      emotionAmbiguous,
      emotionConfidence: emotionAmbiguous ? "low" : "high",
      travelPlace,
      travelType: features.travel ? detectTravelType(text, travelPlace) : "",
      lifeEvents,
      ...signals,
      ...features,
      summary: summarize(emotion.emotion, activeEvents, travelPlace),
    };
  }

  global.EmotionIslandAnalyzer = {
    analysisVersion,
    emotionRules,
    lifeEventRules,
    featureRules,
    analyzeText,
    detectEmotion,
    isEmotionAmbiguous,
    todayKey,
  };
})(globalThis);
