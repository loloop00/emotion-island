---
name: doodle-video
description: "固定制作并验收 9:16 黑白简笔画哲理短视频：从主题生成极短画面文案，选择构图模板，生成静帧与 HyperFrames 动画规格，渲染并完成视觉、文字和技术检查。适用于简笔画/轻鸡汤视频，不适用于通用剪辑、工具教程或热点评论。 / Standardize and validate 9:16 black-and-white doodle videos: turn an idea into short visual copy, route it to a composition template, create still and HyperFrames motion specs, render, and run visual, text, and technical QA. For doodle and reflective short videos, not general editing, tool tutorials, or news commentary."
metadata:
  short-description: "简笔画短视频制作与验收 / Doodle video production and QA"
---

# 简笔画视频制作 / Doodle Video Production

把已验证的简笔画短视频制作方式固定成一条可复用、可验收的生产线。目标不是“让图片动起来就算完成”，而是让极短文案、画面动作、可见结果和最终定格彼此对应。

Use this skill when the user asks to create, standardize, or review this specific kind of short doodle video. Respect the user's scope: a request to discuss or design is not permission to render, publish, or perform other external mutations.

## 固定产出 / Required outcome

除非用户另有要求，采用以下默认值：

- 9:16，1080 × 1920，30 fps，8–12 秒；默认 10 秒。
- 白底、细黑线、充分留白；颜色只由模板或画面语义决定。
- 固定人物集合 `duo-v1`，优先使用现有透明 PNG；不以提示词替代人物素材。
- 中文由 HyperFrames/HTML/SVG 等确定性后期文字层生成，不能交给图片模型。
- 默认只做线条揭示、元素出现、局部动作和微小位移；无镜头移动、缩放、切镜或复杂转场。
- 最后一帧必须完整、可独立理解，并保留至少约 1 秒的定格时间。

如果工作目录存在本项目的 `library/`，它是风格、人物、案例和模板的唯一来源。开始前按项目 `AGENTS.md` 的读取顺序读取它们；如果 skill 被安装到其他目录，则使用本包的 references 作为基线，并明确标记缺失的项目资产或规则，不要凭空补齐。

## 两种制作模式 / Two production modes

先判断模式，不要把两种模式混在一起：

- `source-lock`：已有完整静态图，只让原图按顺序出现或做局部动作。原图是底图，使用精确裁切和白色遮罩；不重设计核心构图，不重新解释原图文字。
- `template-build`：需要系列化新图。先固定布局、人物、图形槽位和文字槽，再生成静帧规格和动画规格，最后渲染。使用已有人物 PNG 和模板，不用图片模型随机重画人物或中文。

已有完整原图时默认优先 `source-lock`；没有原图但主题需要系列化时使用 `template-build`。

## 标准流程 / Standard workflow

### 1. 读取与归一化输入 / Read and normalize

若是本项目，先读：

1. `AGENTS.md`
2. `library/STYLE_GUIDE.md`
3. `library/ANIMATION_RULES.md`
4. `library/COPY_DIRECTION.md`
5. `library/VISUAL_MEANING_RULES.md`
6. `library/COPY_RULES.md`
7. `library/TOPIC_RULES.md`
8. `library/examples/stills/manifest.json`
9. `library/examples/golden/manifest.json`
10. `library/characters/character-sheet.md`
11. 与类型对应的 `library/templates/*.json`
12. `library/CASE_INDEX.md` 和 `jobs/daily-ledger.md`

最小输入可以只有主题；缺省按 `copy_mode: auto_short`、类型 `auto`、比例 `9:16`、时长 `10` 秒、人物集合 `duo-v1` 处理。用户提供完整文案时也要先压缩成画面文字，不要把长口播直接塞进画面。

### 2. 内容 Gate / Content gate

只接受人生哲理、鼓励、轻鸡汤和个人成长方向。排除工作效率、工具教程、职场流程、协作沟通、知识科普和热点评论。

选题先落到普通人的一个小烦恼或小反应，再谈道理。必须能回答：

- 观众会不会有“我也这样过”的生活入口？
- 画面能否只用一个核心隐喻讲清楚？
- 能否在约 1 秒内看懂问题、动作和反差？
- 是否避开已用金标准案例的原文案和核心寓意图形？

没有生活入口、只能解释成抽象大道理，或与旧隐喻重复时，换主题或换隐喻，不进入规格和渲染。

### 3. 生成极短文案 / Generate short visual copy

只生成一组默认文案，不先铺一堆备选。每个文字槽优先 2–6 个中文字符，全画面主要中文优先 6–20 个字符；默认不用标点。

把内容压缩成：

```text
具体处境 → 具体动作 → 可见结果
```

然后写出可检查的对应关系：

```text
文案 A → 画面 A → 结果 A
文案 B → 画面 B → 结果 B
```

文案不能只写“光、希望、成长、未来、坚持、慢慢来”等抽象词，也不能只写脱离画面的动作碎片。补一句白话释义：`这句话就是人物在____，结果____`。如果文字或画面仍需要额外解释，退回重写。

### 4. 类型、案例与模板路由 / Route to a case and template

先根据关系匹配 `choice`、`timeline`、`obstacle` 或 `comparison_action`，再读取对应模板 JSON。`comparison` 和 `action` 是常用布局/动作模板，可组合使用；它们不是绕过内容 Gate 的新类型。

路由细节、模板槽位和已用隐喻见 [references/template-routing.md](references/template-routing.md)。只借鉴静态图和金标准视频的结构、留白和节奏，不复用它们的原文案、人物身份或核心寓意图形。

### 5. 先写规格，再做图 / Write specs before rendering

在 `jobs/YYYY-MM-DD/`（或当前项目约定的 job 目录）建立：

- `brief.md`：主题、极短文案、类型、静态参考、视频参考、`文案 → 画面 → 结果`、白话复述和内容 Gate。
- `static-spec.json`：画布、人物集合、素材路径、布局、图形槽、文字槽和语义映射。
- `motion-spec.json`：时间点、揭示顺序、人物微动作、断言和最后定格。

静帧必须先固定布局、留白、人物比例、图形位置和文字内容；动画只改变出现顺序、局部动作或微小位移，不借动画阶段重画核心构图。

### 6. HyperFrames 渲染 / Render with HyperFrames

优先使用 job 或工作目录 `package.json` 中已经固定的 HyperFrames 版本和脚本。没有现成脚本时，按当前环境可用版本运行 `check` 和 `render`；不要把“命令能启动”当成视频完成。

进入渲染前必须通过三句白话测试：

1. 文字说了什么？
2. 人物具体做什么？
3. 最后结果变成什么？

再做一次“遮字看画面”和“遮画面读文字”测试。任一项失败，先改文案、构图或隐喻，不进入 HyperFrames。

### 7. 双重验收 / Two-layer QA

技术检查和内容/视觉检查缺一不可。至少完成：

- HyperFrames `check`，并保存 snapshots/keyframes 等可复核证据。
- 逐字核对所有中文：不改字、不漏字、不加字、不乱码；确认是黑色手写标注感，而不是毛笔、书法、粗楷或规整系统印刷字。
- 检查 1080 × 1920、9:16、30 fps、8–12 秒，以及最后一帧定格时间。
- 观看静帧、关键帧和最终帧：对比是否一眼可见，人物脸型/头身比/线条是否保持，是否出现无关物件、颜色、阴影或镜头运动。
- 用 FFprobe 核对输出文件的分辨率、帧率、时长和帧数。

只通过结构检查、只生成了 MP4、或只看了渲染页面，都不能单独宣称验收完成。详细命令与检查表见 [references/validation.md](references/validation.md)。

### 8. 归档与交付 / Archive and hand off

验收通过后才把 MP4 放进 `outputs/`，并在 `jobs/daily-ledger.md` 追加一行。临时渲染文件、未验收截图、失败版本不升级为固定资产。台账只记录本次视频事实，不把单条视频的坐标、时码、对话或临时材料推成全局规则。

最终交付简要说明主题、画面文案、类型/模板、视频路径和验收结果；如果某一层没有证据，明确写“未验证”，不要用推测代替。

## 硬边界 / Hard boundaries

- 不用提示词代替固定人物素材；缺姿态时使用同一集合的已确认近似姿态，或明确标记 `[待补素材]`。
- 不让图片模型生成中文；不使用重新生成的文字覆盖原图文字，除非明确采用确定性后期文字层或精确裁切。
- 不为了“丰富”加入背景纹理、阴影、装饰边框、无关道具、复杂转场、镜头推拉或大幅人物变形。
- 不把旧案例的成功当成新选题；四个金标准只提供结构与节奏证据。
- HyperFrames、字体、素材或网络不可用时，报告具体缺口并停在对应门槛；不要伪造渲染结果或把搜索结果当成平台热度。
- 发布到 GitHub、上传媒体或修改外部系统不属于普通渲染步骤，只有用户明确要求时才执行，并在动作前再次确认目标和范围。

## 参考文件 / References

- [references/template-routing.md](references/template-routing.md)：类型、模板、槽位、节奏和历史隐喻边界。
- [references/project-contract.md](references/project-contract.md)：固定视觉、文案、人物资产和项目文件映射。
- [references/validation.md](references/validation.md)：规格、命令、静帧/关键帧/末帧与 FFprobe 验收。
