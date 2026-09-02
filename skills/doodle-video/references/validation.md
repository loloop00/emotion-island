# 验收参考 / Validation reference

## 渲染前 / Before rendering

- [ ] 已通过内容 Gate：人生哲理/鼓励/轻鸡汤/个人成长，且有普通人生活入口。
- [ ] 每个文字槽短而具体；不是长句、口播、抽象口号或工具/职场内容。
- [ ] 已完成 `文案 → 画面 → 结果` 映射，且对比关系在约 1 秒内可读。
- [ ] 已选择静态参考、金标准案例和模板；没有复用旧案例的原文案或核心寓意图形。
- [ ] 已选择 `source-lock` 或 `template-build`，没有在两种模式间偷偷重画核心构图。
- [ ] 人物素材路径真实存在；缺失姿态已标记，未用提示词假装补齐。
- [ ] `static-spec.json` 和 `motion-spec.json` 已写完，文字内容已锁定。

## HyperFrames / HyperFrames checks

优先执行工作目录 `package.json` 中的固定脚本。当前项目已验证过的脚本形态是：

```bash
npx --yes hyperframes@<pinned-version> check
npx --yes hyperframes@<pinned-version> render
```

如当前版本支持 JSON 报告和快照，优先使用：

```bash
npx --yes hyperframes@<pinned-version> check --json --snapshots
```

实际版本以项目已锁定的 `package.json` 为准，不要凭空升级或把网络安装失败误报成项目逻辑失败。保存 check 输出、snapshots 和 keyframes 的路径，供后续核对。

## 视频技术检查 / Media checks

对最终 MP4 使用 FFprobe；命令参数可按本机版本调整，至少要能读出视频流的宽、高、帧率、帧数和总时长：

```bash
ffprobe -v error \
  -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,nb_frames \
  -show_entries format=duration \
  -of default=noprint_wrappers=1 \
  outputs/<final-video>.mp4
```

默认应接近：

- width `1080`，height `1920`
- `30/1` fps
- duration `8–12` 秒（默认 `10` 秒）
- 帧数与时长 × 30 fps 一致；例如 10 秒应约 300 帧

如果 FFprobe 没有提供某个字段，换成等价的 `-show_entries` 查询并明确缺失项；不要从文件名推断规格。

## 视觉和文字检查 / Visual and text QA

逐项查看静帧、关键帧和最终帧：

- 中文逐字正确：不改字、不漏字、不加字、不乱码。
- 中文接近黑色手写标注字；无毛笔感、书法感、粗楷体、粗描边或规整系统印刷感。
- 遮住文字时，仍能看出人物遇到的问题、正在做的动作和结果变化。
- 遮住画面时，文字仍能大致猜到对象和动作，而不是只剩抽象态度。
- 两侧/上下是同一个生活问题的两种处理方式，差异不是单纯位置变化。
- 人物的脸型、头身比、线条和透明素材引用保持一致。
- 线条和单位元素按自然方向逐步出现；不先露出完成结果再假装累积。
- 无无关物件、背景纹理、阴影、装饰边框、镜头移动、缩放、快速切镜或复杂转场。
- 最后一帧不用解释也能用一句日常话复述；至少保留约 1 秒定格。

## 完成判定 / Completion rule

只有当 HyperFrames 结构检查、媒体技术检查、逐字检查和视觉末帧检查都通过，才把视频放入 `outputs/` 并更新台账。任何一项没有证据，都应报告为“未验证”，而不是“完成”。

渲染失败时先修复当前 job；不要因为失败自动换主题。网络、Node、HyperFrames 或 FFprobe 不可用时，记录具体阻点并停在对应门槛。
