# 简笔画视频制作 / Doodle Video Production

一个面向 Codex 的可安装 skill，把简洁黑线涂鸦风短视频固定成可重复的生产与验收流程。

An installable Codex skill that turns a simple black-line doodle video style into a repeatable production and QA workflow.

## 描述 / Description

中文：从主题或需求生成极短画面文案，匹配选择/时间变化/障碍/对比行动类型，选择固定构图模板，先写静帧与动画规格，再用 HyperFrames 渲染 9:16 视频，并完成中文逐字、画面寓意、人物一致性、末帧和 FFprobe 检查。

English: Turn an idea into concise visual copy, route it to a choice, timeline, obstacle, or comparison-action pattern, select a fixed composition template, write still and motion specs, render a 9:16 video with HyperFrames, and verify text, visual meaning, character consistency, final hold, and media metadata.

## 适用范围 / Scope

适用于人生哲理、鼓励、轻鸡汤和个人成长类简笔画短视频。它不负责通用视频剪辑、工具教程、热点评论，也不会替用户授权上传素材或发布外部系统。

For reflective, encouraging, light inspirational doodle shorts. It is not a general video editor, tool-tutorial writer, news-commentary workflow, or authorization to upload assets or publish externally.

## 内容 / Contents

- `SKILL.md`：入口规则与标准流程。
- `references/template-routing.md`：类型、模板、槽位和已用隐喻边界。
- `references/project-contract.md`：本项目的视觉、文案、人物素材和文件映射。
- `references/validation.md`：HyperFrames、FFprobe、文字和末帧验收。

## 项目依赖 / Project dependency

在原项目中使用时，skill 会读取 `library/`、`jobs/`、`work/` 和 `outputs/` 的现有规则与素材。公开包只包含文字规范和元数据，不包含工作区视频、静帧、字体、临时渲染物或未确认姿态素材。

When used in the source project, the skill reads the existing rules and assets under `library/`, `jobs/`, `work/`, and `outputs/`. This public package contains instructions and metadata only; it does not include workspace videos, stills, fonts, temporary renders, or unverified poses.
