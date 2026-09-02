# 情绪小岛 · Emotion Island

一个会随着每天聊天内容慢慢变化的小岛 MVP。它把每天的一句话或一段语音，转换成情绪、生活事件和岛上的可见痕迹。

Emotion Island is a small local-first island that changes with your everyday notes. It turns a sentence or voice transcript into a mood, life traces, and visible changes on the island.

## 语言支持 · Language support

- 页面会根据浏览器语言默认显示中文或 English，也可以点击右上角的 `中 / EN` 切换。
- The interface follows your browser language by default. Use the `中 / EN` control in the top-right corner to switch at any time.
- 当前界面、月度回望、开发模拟器和辅助文本均支持中英文。
- The current semantic vocabulary and recognition rules are Chinese-first. English UI copy is supported, but English natural-language recognition is not yet equivalent to the Chinese rule set.

## 当前版本 · Current version

- 单页静态网页，无需安装依赖。
  A dependency-free static web page.
- 支持文字输入；浏览器支持 Web Speech API 时可语音转文字。
  Text input, plus speech-to-text when the browser supports Web Speech API.
- 使用本地规则分析情绪、身体状态、语气转折和生活事件。
  Local rules analyze mood, body state, shifts in tone, and life events.
- 对否定、计划中、他人事件与复合表达做基础过滤。
  Basic filtering for negation, plans, events about other people, and mixed expressions.
- 小岛会根据工作、家人、运动、朋友、学习、饮食等事件出现不同元素；旅行与运动会留下帐篷，朋友相聚与饮食会留下野餐桌，旅行也可能带回明信片。
  The island grows different elements for work, family, movement, friends, learning, and food. Travel and movement can leave a tent, company and food can leave a picnic table, and travel can bring home a postcard.
- 同一天最多留下三段记录；当天生活会合并呈现，天气与情绪以最新一段为准，生活事件会保留当天的复合痕迹。
  Up to three entries can be kept per day. The day is shown as one combined scene: weather and mood follow the latest entry while life traces are preserved.
- 最近 90 天的记录可用于月度回望。
  The latest 90 days can be revisited through the monthly view.

## 本地运行 · Run locally

```bash
python3 -m http.server 4173
```

然后打开 <http://localhost:4173/>。
Open <http://localhost:4173/> in your browser.

直接双击 `index.html` 也可以预览，但语音识别通常需要在 `localhost` 环境下才更稳定。
You can also open `index.html` directly, although speech recognition is generally more reliable on `localhost`.

## 回归检查 · Regression checks

识别逻辑位于 `analyzer.js`，常见口语语料位于 `tests/emotion-corpus.json`。
Recognition logic lives in `analyzer.js`; everyday-language fixtures live in `tests/emotion-corpus.json`.

```bash
node tests/run-emotion-corpus.mjs
node tests/run-island-state.mjs
node tests/run-happy-life.mjs
node tests/run-life-palette.mjs
node tests/run-i18n.mjs
```

## 30 天状态模拟 · 30-day simulator

启动本地服务后打开 <http://localhost:4173/dev/simulator.html>。
With the local server running, open <http://localhost:4173/dev/simulator.html>.

这个页面只用于开发自检，不会出现在产品主页。可拖动时间轴或播放 30 天，查看生活如何逐步留下跑步环线、自行车架、明信片、帐篷、篝火旁的人和野餐桌。
This page is for development checks and is not linked from the product home. Drag the timeline or play all 30 days to watch running loops, a bicycle rack, postcards, tents, people by the fire, and a picnic table appear over time.

固定的生活月预览地址 · Fixed sample preview:

<http://localhost:4173/dev/simulator.html?scenario=life>

## 项目结构 · Project structure

- `index.html`、`styles.css`：产品入口与视觉层。
  Product entry point and visual layer.
- `i18n.js`：中英文界面切换与显示层翻译。
  Bilingual interface switching and display translations.
- `app.js`：交互、记录与页面状态。
  Interactions, entries, and page state.
- `analyzer.js`：文字分析与生活事件识别。
  Text analysis and life-event recognition.
- `island-state.js`、`life-palette.js`：小岛状态与月度回望数据。
  Island state and monthly life-palette data.
- `sound-engine.js`、`assets/sounds/`：交互音效与 Web Audio fallback。
  Interaction sounds and Web Audio fallback.
- `dev/`：开发用移动端页面与 30 天模拟器。
  Mobile shell and 30-day development simulator.
- `tests/`：无需依赖安装即可运行的回归脚本与语料。
  Dependency-free regression scripts and fixtures.

## 隐私与 MVP 边界 · Privacy and MVP boundaries

应用代码本身不提供后端、账号、社区、排行榜、心理咨询、课程或真实大模型接口。日常记录保存在当前浏览器的 `localStorage` 中；语音识别是否由浏览器交给其平台服务处理，取决于浏览器实现。
The app does not provide a backend, accounts, community, rankings, therapy, courses, or a live model API. Daily entries stay in the current browser's `localStorage`; whether voice recognition is processed by a browser platform service depends on the browser implementation.

本仓库包含产品源码、测试和开发模拟器，不包含本地导出 ZIP、视频剪辑工程、审计稿或其他工作区产物。
This repository contains the product source, tests, and development simulator. Local ZIP exports, video-editing projects, audit drafts, and other workspace artifacts are intentionally excluded.

## 字体与音效 · Fonts and sounds

页面运行时通过 `unpkg` 加载 Yozai Medium 与 LXGW WenKai Screen；交互音效文件位于 `assets/sounds/`。使用或再分发上游字体时，请同时遵守对应项目的许可证。
The page loads Yozai Medium and LXGW WenKai Screen from `unpkg` at runtime. Interaction sounds are stored in `assets/sounds/`. Follow the upstream font licenses when using or redistributing those fonts.

## License

代码以 [MIT License](./LICENSE) 发布。上游字体等外部依赖不由本许可证重新授权。
The code is released under the [MIT License](./LICENSE). External dependencies, including upstream fonts, are not relicensed by this repository.
