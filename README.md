# Dust Calendar

一款更符合中文使用习惯的 Obsidian 日历插件，支持公历、农历、节气、节假日、调休信息，以及与日历联动的周期性笔记。

![Dust Calendar 日历视图](./resource/overview.jpg)

## 项目说明

本仓库是 Dust Calendar 的个人维护版本，用于继续修复问题、适配 Obsidian，并维护一套可重复构建和发布的流程。

**感谢原作者纳米级尘埃（a-nano-dust）开发并开源 Dust Calendar。** 本项目基于原仓库 [a-nano-dust/dust-obsidian-calendar](https://github.com/a-nano-dust/dust-obsidian-calendar) 修改，保留原项目的 MIT 许可证和版权说明。没有原作者的工作，就不会有这个项目。

## 功能

- 月视图和年视图切换。
- 显示星期、农历、节气、节假日及调休信息。
- 快速返回今天，并在本地午夜自动更新日期高亮。
- 创建和打开每日、每周、每月、季度及年度笔记。
- 支持 Obsidian 核心模板插件和 Templater。
- 在日历中显示笔记字数和未完成待办。
- 支持跟随 Obsidian、跟随侧边栏或固定字体大小。
- 季度名称可显示为数字或“春夏秋冬”。

## 当前维护版改进

- 修复跨午夜后第一次点击“今”跳到昨天的问题。
- 跨午夜自动更新“今”按钮和日期高亮，无需重新打开日历。
- 修复 ISO 周跨年时当前周和选中周的判断。
- 使用官方 `eslint-plugin-obsidianmd` 完整推荐规则，保持 0 错误、0 警告。
- 清理废弃 API、不安全类型、未处理 Promise 和冗余依赖。
- 优化统计读取、日历刷新防抖、事件解绑及 React 组件生命周期。

## 使用

### 日历导航

- 将鼠标移到年份、季度或月份区域，使用两侧箭头切换时间范围。
- 点击“今”返回当前日期、周、月份或季度。
- 点击“月”或“年”切换视图。
- 双击日期、周序号、月份、季度或年份，可创建或打开对应的周期性笔记。

### 周期性笔记

在插件设置中启用相应笔记类型，并配置文件命名规则。命名规则使用 [Luxon 日期格式](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)。

如需自动填充模板：

1. 选择 Obsidian 核心模板插件或 [Templater](https://github.com/SilentVoid13/Templater)。
2. 在对应插件中配置模板目录。
3. 在 Dust Calendar 中为每种周期性笔记设置模板文件。

![周期性笔记设置](./resource/setting.jpg)

也可以通过 Obsidian 命令面板创建当前日期对应的周期性笔记。

![通过命令创建笔记](./resource/create_note_by_command.jpg)

### 笔记统计

Dust Calendar 会统计关联笔记的字数和未完成待办，并以圆点或圆孔标注在日历中。可在设置中调整每点对应的字数、点数上限和待办标注方式。

![笔记统计设置](./resource/setting_statistic.jpg)

## 反馈

使用问题或改进建议请提交到本仓库的 [GitHub Issues](https://github.com/accessiblefish/dust-obsidian-calendar/issues)。

## 许可证

本项目继续采用 [MIT License](./LICENSE)。原作者版权及许可证声明保留在 `LICENSE` 文件中。
