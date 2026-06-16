[中文](#SwiftMatch-zh) | English

---

#SwiftMatch-en
---
An Obsidian plugin for quick text search and highlight across your vault.

## Features

- **Swift Seek** — Select text, instantly highlight all matches on the current page with a live counter

  ![Swift Seek](assets/swift-seek.gif)

- **Pin Tally** — Pin keywords to track match counts across multiple terms at a glance

- **Vault Scan** — Background search across your entire vault the moment you select text; floating toggle shows matched document count / total matches

  ![Vault Scan](assets/vault-scan.gif)

- **Keyword Fleet** — Float multiple keyword groups independently on screen, each with its own counter

  ![Keyword Fleet](assets/keyword-fleet.gif)

## Installation

Search for "SwiftMatch" in Obsidian Settings → Community Plugins → Browse, then click Install and Enable.

## Changelog

<details>
<summary>Changelog</summary>

<details>
<summary>v1.3.7 (2026-06-16)</summary>

- **Settings Panel Restructure** — Moved "Show/Hide Floating Button" under "Floating Button Style" heading; renamed "Floating Toggle Style" to "Floating Button Style"; added "minimap" section title in Basic tab
- **Minimap Blacklist** — New blacklist setting under minimap section to hide minimap on specific pages (supports * wildcard); default rule `*.canvas` hides minimap on canvas pages; supports path matching for non-markdown views
- **Pin Icon Fix** — Pin icon now appears only once after text selection; no longer re-creates on repeated events

</details>

<details>
<summary>v1.3.6 (2026-06-16)</summary>

- **Cache Limit Increased** — Recent search cache limit raised from 10 to 20
- **Middle-Click Cache Cleanup** — Middle-clicking to delete a recent search now also removes its disk cache file
- **Empty State Match Window** — Hovering the floating toggle with no selection, cache, or recent searches now shows the match window with search box
- **Search Box in Header** — Moved search input into the header bar alongside match info to save vertical space
- **Close Clears Search Box** — Closing the match window now clears the search input
- **Search Term Highlight** — Matched keywords are highlighted with orange background in the match list results
- **Favorites Feature** — Star button on recent search chips to add/remove favorites; favorites section with persistent cache; middle-click to delete; scroll position saved
- **Compact Layout** — Favorites and recent searches labels now inline with chips on the same row
- **Expand All at Once** — Clicking the "+" expand button now reveals the full line instead of incrementing by 30 chars; expanded state is preserved across reopens
- **Selected Text Open Document** — When text is selected in the match list, clicking "Open Document" highlights the selected text instead of the auto-detected text

</details>

<details>
<summary>v1.3.5 (2026-06-16)</summary>

- **Open Document Jump Fix** — Full-text search instead of per-line search; suppress Remember Cursor Position plugin restore; scroll to vertical center
- **Marshmallow Highlight** — Jump text highlighted with custom marshmallow style after opening document; click anywhere in editor to dismiss
- **Snippet Expand Buttons** — Replaced "..." truncation markers with "+" buttons; click to incrementally expand context before/after
- **Title Click Opens Document** — Clicking match list title now opens document in new tab; removed preview panel trigger
- **Search Box in Match List** — Moved search input from floating toggle to match list header; auto-focus on open; instant search on input with debounce
- **Independent Cache Storage** — Search caches and floating keyword data moved from list-data.json to separate cache/ and keywords/ directories
- **Document Count Fix** — Exhaustive search now correctly updates document count and total matches in header after completion
- **Middle-Click Delete Search** — Middle-click on recent search chip removes it from history
- **CSS Lint Fixes** — Removed box-decoration-break and all !important declarations
- **Placeholder Language Switch** — Search box placeholder updates immediately on language change

</details>

<details>
<summary>v1.3.4 (2026-06-15)</summary>

- **Edit Panel Horizontal Layout** — Rearranged display text, font size, padding, and opacity fields into a flex row; added "Get more styles" link to GitHub Discussions
- **Follow Mouse Offset** — Added pinIconFollowOffsetX/Y settings with live preview box; only visible in follow-mouse mode
- **Rounded Cap Highlight** — Replaced underline with radial-gradient rounded cap decoration; removed border width setting; added match opacity slider
- **Floating Toggle Settings Rework** — Removed display text input; toggle button now shows/hides with capsule styling; no longer closes settings panel
- **Pin Border Residue Fix** — Cleared boxShadow on unpinned items with custom styles to prevent inset border residue
- **Pin Color Overlap Fix** — Skipped current selection decoration when already pinned to avoid double color overlay
- **Pin Highlight Missing Fix** — Set filePath on new pinned items; added fallback for legacy items without filePath

</details>

<details>
<summary>v1.3.3 (2026-06-15)</summary>

- **Floating Toggle Context Menu** — Right-click the floating toggle to show options: Edit, Hide, Settings
- **Floating Toggle Edit Panel** — Edit display text, font size, padding, opacity, CSS class name, and custom CSS with live preview; custom styles override default inline styles for full appearance control
- **Keyword Button Context Menu** — Right-click keyword buttons to show options: Edit, Close
- **Keyword Button Edit Panel** — Edit display text, CSS class name, and custom CSS with live preview; styles are persisted per keyword
- **Language Switch Fix** — Fixed null.style error when switching language in settings panel; language switch now reopens the panel instead of reloading the plugin
- **Language Button Style** — Changed from button to clickable text; removed border, padding, and background
- **Follow Mouse Mode Fix** — Fixed pin icon constantly following the cursor making it unclickable; now shows at cursor position once and stays fixed
- **Z-Index Fix** — Hovered floating button now raises z-index to cover other buttons, preventing accidental clicks
- **Title Cleanup** — Removed (helloworld) from settings panel title

</details>

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
一个 Obsidian 快速搜索高亮插件。

## 功能

- **即划即搜** — 选中文本，当前页面即时显示所有匹配并计数

  ![即划即搜](assets/swift-seek.gif)

- **固定计数** — 固定关键词，同时查看多个关键词的匹配次数

- **搜索全库** — 使用 Obsidian 搜索 API，选中文字即后台搜索，悬浮按钮显示匹配文档数/总匹配数量

  ![搜索全库](assets/vault-scan.gif)

- **多组关键词悬浮** — 搜索关键词可单独悬浮显示，支持同时悬浮多组关键词

  ![多组关键词悬浮](assets/keyword-fleet.gif)

## 安装

在 Obsidian 设置 → 社区插件 → 浏览中搜索"SwiftMatch"，点击安装并启用即可。

## 更新日志

<details>
<summary>更新日志</summary>

<details>
<summary>v1.3.7 (2026-06-16)</summary>

- **设置面板重组** — "显示/隐藏悬浮按钮"移至"悬浮按钮样式"标题下方；"悬浮球样式"改名为"悬浮按钮样式"；基础tab下新增"minimap"分组标题
- **minimap 黑名单** — minimap 分类下新增黑名单设置，支持通配符匹配路径屏蔽页面；默认规则 `*.canvas` 屏蔽画布页面；支持非 markdown 视图的路径匹配
- **固定按钮修复** — 选中文字后固定按钮只显示一次，不再因重复事件重复创建

</details>

<details>
<summary>v1.3.6 (2026-06-16)</summary>

- **缓存上限提升** — 最近搜索缓存上限从10提升到20
- **中键删除缓存文件** — 中键删除最近搜索词时一并删除磁盘缓存文件
- **空状态匹配窗口** — 无选中文字、无缓存、无最近搜索时，悬浮按钮hover也弹出匹配窗口
- **搜索框移入标题栏** — 搜索框移至匹配信息header中，压缩纵向空间
- **关闭清除搜索框** — 关闭匹配窗口时清空搜索框文字
- **搜索词高亮** — 匹配列表结果中高亮显示搜索关键词
- **收藏功能** — 最近搜索词前添加五角星按钮，点击收藏/取消；收藏区独立显示，缓存不清除；中键删除；滚动位置保存
- **紧凑布局** — 收藏和最近搜索标签与关键词同一行显示
- **一键展开全文** — 点击"+"按钮直接展开整行内容，展开状态跨次保留
- **选中文字打开文档** — 匹配窗口选中文字后点击"打开文档"，高亮选中文字而非自动检测文字

</details>

<details>
<summary>v1.3.5 (2026-06-16)</summary>

- **打开文档跳转修复** — 全文搜索替代逐行搜索；抑制 Remember Cursor Position 插件恢复光标；滚动到垂直居中
- **棉花糖高亮样式** — 打开文档后用自定义棉花糖样式高亮跳转文本；点击编辑器任意位置移除高亮
- **摘要扩展按钮** — 截断的"..."替换为"+"按钮，点击逐步扩展前后上下文
- **标题点击打开文档** — 点击匹配窗口标题直接新标签页打开文档；移除预览窗口触发
- **搜索框移至匹配窗口** — 搜索输入框从悬浮按钮移到匹配窗口顶部；自动聚焦；输入即时搜索（防抖）
- **缓存独立存储** — 搜索缓存和悬浮关键词数据从 list-data.json 移到 cache/ 和 keywords/ 子目录
- **文档数量修复** — 全库搜索完成后正确更新标题中的文档数和结果总数
- **中键删除搜索** — 最近搜索关键词中键点击删除
- **CSS 规范修复** — 移除 box-decoration-break 和所有 !important 声明
- **搜索框语言切换** — 搜索框占位符随语言即时更新

</details>

<details>
<summary>v1.3.4 (2026-06-15)</summary>

- **编辑面板横向排列** — 显示文字、字体大小、内边距、透明度改为横向布局；自定义样式标题后添加"获取更多样式"链接
- **跟随鼠标偏移设置** — 新增 pinIconFollowOffsetX/Y 偏移设置，含实时预览框；仅跟随鼠标模式显示
- **圆帽高亮样式** — 下划线改为圆帽底部装饰；移除下划线宽度设置；新增匹配透明度滑块
- **悬浮球设置面板改造** — 移除显示文字输入框；按钮改为胶囊样式切换显示/隐藏，不再关闭设置面板
- **固定边框残留修复** — 非固定且有自定义样式时清除 boxShadow，避免边框残留
- **固定颜色叠加修复** — 当前选中文本已固定时跳过装饰，避免双层颜色叠加
- **固定高亮不显示修复** — 为新固定项设置 filePath；兼容无 filePath 的旧数据

</details>

<details>
<summary>v1.3.3 (2026-06-15)</summary>

- **悬浮球右键菜单** — 右键点击悬浮球弹出选项：编辑、隐藏、设置
- **悬浮球编辑面板** — 可编辑显示文字、字体大小、内边距、透明度、CSS类名和自定义CSS，支持实时预览；自定义样式时移除默认内联样式，完全控制外观
- **搜索词按钮右键菜单** — 右键点击搜索词按钮弹出选项：编辑、关闭
- **搜索词按钮编辑面板** — 可编辑显示文字、CSS类名和自定义CSS，支持实时预览；样式按关键词持久化保存
- **语言切换修复** — 修复设置面板切换语言时的 null.style 错误；语言切换改为重新打开面板而非重载插件
- **语言按钮样式** — 从按钮改为可点击文本；移除边框、内边距和背景
- **跟随鼠标模式修复** — 修复固定图标一直跟随鼠标导致无法点击的问题；现在只在光标位置显示一次然后固定
- **Z-Index修复** — 悬浮按钮hover时提升z-index盖住其他按钮，避免误触
- **标题清理** — 移除设置面板标题中的(helloworld)

</details>

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
