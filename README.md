[中文](#SwiftMatch-zh) | English

---

#SwiftMatch-en
---
An Obsidian plugin for quick text search and highlight across your vault. Select text → instantly find matches in all documents → navigate and highlight with counters.

## Features

### 🔍 Selection Match & Search

- **Selection Match** — Select text in the editor, matching results appear instantly across the vault
- **Floating Toggle** — A floating button shows match count, click to open the search result list
- **Recent Searches** — Recent search keywords are saved and displayed as floating keyword buttons
- **Search Box** — Built-in search box on the floating toggle for manual keyword input
- **Exhaustive Mode** — Full-text search using Obsidian's built-in search API with snippet extraction

### 📋 Match Result List

- **File Grouped Results** — Matches grouped by file, showing file path (with directory and extension)
- **Heading & Tag Matches** — Matches headings and tags in documents, not just content
- **File Name Matching** — Search keywords also match file names (including extension)
- **Open Document** — Click "Open Document" button to jump to the match location with text selected and highlighted
- **Copy Match Text** — Quick copy button for each match entry
- **Export as Markdown** — Export all match results as a Markdown file

### 🎨 Highlight & Counter

- **Custom Highlight Styles** — Border color, counter background, counter text color with multi-color scheme support
- **Simplified Color Scheme** — Auto-sync border and background colors from text color
- **Match Counter** — Each match shows a numbered counter (e.g. 1/5) with customizable position and size
- **Pin Matches** — Pin a keyword to persist its highlight across sessions; pinned items only show in their source document (local mode)
- **Pin Icon** — A pin icon appears near the cursor for quick pin/unpin actions

### 🌐 Internationalization

- **CN/EN Language Switch** — Click the language button in the top-left corner of settings panel to switch between Chinese and English
- **Full i18n Coverage** — All UI text including settings labels, tooltips, and notices are translated

### ⚙️ Settings

- **Minimap** — Configurable minimap with slider, opacity, and color settings
- **Floating Toggle** — Customizable text, font size, padding, and opacity
- **Search Limits** — Minimum and maximum word count for search triggers
- **Counter Style** — Underline width, counter opacity, font size, padding, and offset

## Installation

1. Download `main.js`, `styles.css`, and `manifest.json`
2. Create a `swift-match` folder in your Obsidian vault's `.obsidian/plugins/` directory
3. Place the downloaded files in that folder
4. Enable "SwiftMatch" in Obsidian Settings → Community Plugins

## Changelog

<details>
<summary>Changelog</summary>

<details>
<summary>v1.3.0 (2026-06-13)</summary>

- **i18n Support** — Added CN/EN language switch button in settings panel header; all UI text fully internationalized
- **Local Pinned Mode** — Pinned keyword counters now only display in their source document instead of globally
- **Open Document Highlight** — Clicking "Open Document" now selects and highlights the search text with custom style; added delay to avoid conflict with "Remember Cursor Position" plugin
- **File Name Matching** — Search now matches file names including extension (e.g. searching "论人的尊严" finds "论人的尊严.md")
- **Persistent Recent Searches** — Recent search results are saved to disk and restored after restart
- **Per-Keyword Scroll Position** — Each search keyword's result list scroll position is saved and restored independently
- **Search Window Improvements** — Right-side 10px padding; full file path display (with directory and extension); default cursor instead of grab cursor
- **UI Cleanup** — Removed delete button and keyword tag from match entries; removed "Rebuild Heading Cache" and "About" from settings footer
- **Drag Window Height Compression** — Dragging keyword buttons below window height now compresses the list instead of jumping to top
- **Hover Behavior Fix** — Hovering keyword floating buttons no longer changes the main toggle button state

</details>

<details>
<summary>v1.2.4</summary>

- Added "Selection Match List" toggle in settings to enable/disable the match list popup on text selection

</details>

<details>
<summary>v1.2.3</summary>

- Fixed preview panel not closing when middle-clicking a list entry to open a document in a new tab

</details>

</details>

---

中文 | [English](#SwiftMatch-en)

---

#SwiftMatch-zh
---
一个 Obsidian 快速搜索高亮插件。选中文本 → 立即查找库中所有匹配 → 导航并高亮显示计数。

## 功能

### 🔍 划词匹配与搜索

- **划词匹配** — 在编辑器中选中文本，立即显示库中所有匹配结果
- **悬浮球** — 悬浮按钮显示匹配计数，点击打开搜索结果列表
- **最近搜索** — 保存最近搜索的关键词，显示为悬浮关键词按钮
- **搜索框** — 悬浮球内置搜索框，支持手动输入关键词
- **全库搜索模式** — 使用 Obsidian 内置搜索 API 进行全文搜索，提取上下文片段

### 📋 匹配结果列表

- **按文件分组** — 匹配结果按文件分组，显示完整文件路径（含目录和后缀）
- **标题与标签匹配** — 匹配文档中的标题和标签，不仅仅是内容
- **文件名匹配** — 搜索关键词也会匹配文件名（含后缀）
- **打开文档** — 点击"打开文档"按钮跳转到匹配位置，选中文本并以自定义样式高亮
- **复制匹配文本** — 每条匹配结果的快速复制按钮
- **导出为 Markdown** — 将所有匹配结果导出为 Markdown 文件

### 🎨 高亮与计数

- **自定义高亮样式** — 边框颜色、计数背景、计数文字颜色，支持多配色方案
- **简化配色** — 自动从文字颜色同步边框和背景色
- **匹配计数器** — 每个匹配显示编号计数器（如 1/5），可自定义位置和大小
- **固定匹配** — 固定关键词以持久显示高亮；固定项仅在来源文档中显示（局部模式）
- **固定图标** — 光标附近显示固定图标，可快速固定/取消固定

### 🌐 国际化

- **中英文切换** — 点击设置面板左上角的语言按钮切换中英文界面
- **完整 i18n 覆盖** — 所有 UI 文本（包括设置标签、工具提示和通知）均已翻译

### ⚙️ 设置

- **小地图** — 可配置的小地图，包括滑块、透明度和颜色设置
- **悬浮球** — 自定义文字、字体大小、内边距和透明度
- **搜索限制** — 搜索触发的最少和最多字数限制
- **计数样式** — 下划线宽度、计数透明度、字体大小、内边距和偏移

## 安装

1. 下载 `main.js`、`styles.css` 和 `manifest.json`
2. 在 Obsidian 库的 `.obsidian/plugins/` 目录下创建 `swift-match` 文件夹
3. 将下载的文件放入该文件夹
4. 在 Obsidian 设置 → 社区插件中启用"SwiftMatch"

## 更新日志

<details>
<summary>更新日志</summary>

<details>
<summary>v1.3.0 (2026-06-13)</summary>

- **国际化支持** — 设置面板标题栏添加中英文切换按钮；所有 UI 文本完整国际化
- **固定计数局部模式** — 固定关键词计数仅在来源文档中显示，不再全局显示
- **打开文档高亮** — 点击"打开文档"后选中文本并以自定义样式高亮；增加延迟避免与"Remember Cursor Position"插件冲突
- **文件名匹配** — 搜索时匹配文件名（含后缀），如搜索"论人的尊严"可找到"论人的尊严.md"
- **持久化最近搜索** — 最近搜索结果保存到磁盘，重启后恢复
- **按关键词保存滚动位置** — 每个搜索关键词的结果列表滚动位置独立保存和恢复
- **搜索窗口改进** — 右侧 10px 边距；显示完整文件路径（含目录和后缀）；默认光标替代抓取光标
- **UI 清理** — 移除匹配条目的删除按钮和关键词标签；移除设置面板底部的"重建标题缓存"和"关于"
- **拖动窗口高度压缩** — 拖动关键词按钮低于窗口高度时压缩列表高度，而非跳到顶部
- **悬停行为修复** — 悬浮关键词按钮悬停时不再改变主按钮状态

</details>

<details>
<summary>v1.2.4</summary>

- 新增"划词匹配列表"设置开关，可以启用或禁用划词时弹出匹配列表的功能

</details>

<details>
<summary>v1.2.3</summary>

- 修复了中键点击列表条目在新标签页打开文档时，预览弹窗无法关闭的问题

</details>

</details>
