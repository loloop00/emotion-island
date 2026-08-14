# 情绪小岛 / 今天的小岛

一个会随着每天聊天内容慢慢变化的小岛 MVP。它把每天的一句话或一段语音，转换成情绪、生活事件和岛上的可见痕迹。

这是一个 local-first 的静态网页产品：不需要后端、账号或大模型 API，记录默认保存在当前浏览器的 `localStorage` 中。

## 当前版本

- 单页静态网页，无需安装依赖。
- 支持文字输入；浏览器支持 Web Speech API 时可语音转文字。
- 使用本地规则分析情绪、身体状态、语气转折和生活事件。
- 对否定、计划中、他人事件与复合表达做基础过滤。
- 小岛会根据工作、家人、运动、朋友、学习、饮食等事件出现不同元素；旅行与运动会留下帐篷，朋友相聚与饮食会留下野餐桌，旅行也可能带回明信片。
- 同一天最多留下三段记录；当天生活会合并呈现，天气与情绪以最新一段为准，生活事件会保留当天的复合痕迹。
- 最近 90 天的记录可用于月度回望。

## 本地运行

```bash
python3 -m http.server 4173
```

然后打开 <http://localhost:4173/>。

直接双击 `index.html` 也可以预览，但语音识别通常需要在 `localhost` 环境下才更稳定。

## 回归检查

识别逻辑位于 `analyzer.js`，常见口语语料位于 `tests/emotion-corpus.json`。

```bash
node tests/run-emotion-corpus.mjs
node tests/run-island-state.mjs
node tests/run-happy-life.mjs
node tests/run-life-palette.mjs
```

## 30 天状态模拟

启动本地服务后打开 <http://localhost:4173/dev/simulator.html>。

这个页面只用于开发自检，不会出现在产品主页。可拖动时间轴或播放 30 天，查看快乐生活如何逐步留下跑步环线、自行车架、明信片、帐篷、篝火旁的人和野餐桌。

固定的快乐生活月预览地址：

<http://localhost:4173/dev/simulator.html?scenario=life>

## 项目结构

- `index.html`、`styles.css`：产品入口与视觉层。
- `app.js`：交互、记录与页面状态。
- `analyzer.js`：文字分析与生活事件识别。
- `island-state.js`、`life-palette.js`：小岛状态与月度回望数据。
- `sound-engine.js`、`assets/sounds/`：交互音效与 Web Audio fallback。
- `dev/`：开发用移动端页面与 30 天模拟器。
- `tests/`：无需依赖安装即可运行的回归脚本与语料。

## 隐私与 MVP 边界

应用代码本身不提供后端、账号、社区、排行榜、心理咨询、课程或真实大模型接口。日常记录保存在当前浏览器的 `localStorage` 中；语音识别是否由浏览器交给其平台服务处理，取决于浏览器实现。

本仓库包含产品源码、测试和开发模拟器，不包含本地导出 ZIP、视频剪辑工程、审计稿或其他工作区产物。

## 字体与音效

页面运行时通过 `unpkg` 加载 Yozai Medium 与 LXGW WenKai Screen；交互音效文件位于 `assets/sounds/`。使用或再分发上游字体时，请同时遵守对应项目的许可证。

## License

代码以 [MIT License](./LICENSE) 发布。上游字体等外部依赖不由本许可证重新授权。
