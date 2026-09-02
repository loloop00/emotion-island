# 项目契约 / Project contract

这份参考记录这个简笔画视频工作流中真正影响制作决策的固定事实。它不是对所有视频项目的通用规则；安装到其他项目时，应以用户提供的本地素材和明确要求为准。

## 文件映射 / Source map

当当前目录是本项目时，优先读取：

| 目的 | 来源 |
|---|---|
| 视觉风格与禁用项 | `library/STYLE_GUIDE.md` |
| 动画节奏与两种模式 | `library/ANIMATION_RULES.md` |
| 文案方向与新隐喻池 | `library/COPY_DIRECTION.md` |
| 画面寓意和白话门槛 | `library/VISUAL_MEANING_RULES.md` |
| 极短文案长度与类型规则 | `library/COPY_RULES.md` |
| 日更选题和布局轮换 | `library/TOPIC_RULES.md`、`library/workflows/daily-autonomous-video.md` |
| 静态/视频金标准 | `library/examples/stills/manifest.json`、`library/examples/golden/manifest.json` |
| 人物集合与姿态状态 | `library/characters/character-sheet.md` |
| 模板槽位 | `library/templates/*.json` |
| 已做主题和交付状态 | `library/CASE_INDEX.md`、`jobs/daily-ledger.md` |

如果这些文件不存在，不要假称自己读过本项目规则；使用本包的固定基线，并把项目特有缺口写进交付说明。

## 固定视觉 / Fixed visual language

- 画布：9:16、1080 × 1920、30 fps；默认 10 秒，通常允许 8–12 秒。
- 背景：干净白底；核心为简洁黑色手绘线稿、大留白、无纹理和无阴影。
- 人物：`duo-v1` 光头圆脸、极少面部特征、细黑线身体和四肢；不增加头发、服装细节或装饰物。
- 表情：中性或轻微微笑；情绪主要通过姿态表达。
- 颜色：黑白是基础；少量红、橙黄、绿等颜色只能由模板或对象语义决定，不扩展成无授权配色表。
- 中文：确定性后期文字层；接近普通黑笔/马克笔的手写标注感，略不齐但端正；不使用毛笔、书法、粗楷、粗黑描边或系统印刷感。

## 固定素材 / Fixed assets

项目中已确认的透明人物 PNG：

- `library/characters/person-a-v1.png`：推动重物的基准姿态。
- `library/characters/person-b-v1.png`：轻快跑动的基准姿态。
- `library/characters/poses/push-heavy-v1.png`、`push-round-v1.png`、`push-circle-v1.png`、`run-v1.png`。

攀爬、跳跃、放砖、失败后回落等姿态若没有独立可复核附件，只能标记 `[待补素材]`；不能用一个提示词声称姿态已固定，也不能随机重画新脸型。

本公开 skill 包默认不复制工作区人物 PNG、静帧、视频、字体或临时文件。若用户要在另一个项目复现，应明确提供或授权相应素材，并保持素材路径可追溯。

## 文案与寓意 / Copy and meaning

文案是画面标签，不是口播稿：单个文字槽优先 2–6 个中文字符，全画面主要中文字优先 6–20 个字符。内容必须落到普通人的小烦恼、具体动作和可见结果。

进入渲染前必须能写出：

```text
文案 A → 画面 A → 结果 A
文案 B → 画面 B → 结果 B
```

并能用一句白话复述最后一帧。只剩“坚持会变好”“低谷会过去”等总结，或文字必须替画面解释时，视为未通过。

## 典型交付文件 / Typical job files

```text
jobs/YYYY-MM-DD/
├── brief.md
├── static-spec.json
└── motion-spec.json
outputs/YYYY-MM-DD-<case-family>-doodle.mp4
```

规格是渲染前的事实记录，不是渲染后补写的装饰。验收不通过的 MP4 留在工作区或临时目录，不放进 `outputs/`，也不追加为“已交付”。
