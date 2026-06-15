# Changelog

## 🆕 v1.3.4 (2026-06-15)

- **Edit Panel Horizontal Layout** — Rearranged display text, font size, padding, and opacity fields into a flex row; added "Get more styles" link to GitHub Discussions
- **Follow Mouse Offset** — Added pinIconFollowOffsetX/Y settings with live preview box; only visible in follow-mouse mode
- **Rounded Cap Highlight** — Replaced underline with radial-gradient rounded cap decoration; removed border width setting; added match opacity slider
- **Floating Toggle Settings Rework** — Removed display text input; toggle button now shows/hides with capsule styling; no longer closes settings panel
- **Pin Border Residue Fix** — Cleared boxShadow on unpinned items with custom styles to prevent inset border residue
- **Pin Color Overlap Fix** — Skipped current selection decoration when already pinned to avoid double color overlay
- **Pin Highlight Missing Fix** — Set filePath on new pinned items; added fallback for legacy items without filePath

## v1.3.3 (2026-06-15)

- **Floating Toggle Context Menu** — Right-click the floating toggle to show options: Edit, Hide, Settings
- **Floating Toggle Edit Panel** — Edit display text, font size, padding, opacity, CSS class name, and custom CSS with live preview; custom styles override default inline styles for full appearance control
- **Keyword Button Context Menu** — Right-click keyword buttons to show options: Edit, Close
- **Keyword Button Edit Panel** — Edit display text, CSS class name, and custom CSS with live preview; styles are persisted per keyword
- **Language Switch Fix** — Fixed null.style error when switching language in settings panel; language switch now reopens the panel instead of reloading the plugin
- **Language Button Style** — Changed from button to clickable text; removed border, padding, and background
- **Follow Mouse Mode Fix** — Fixed pin icon constantly following the cursor making it unclickable; now shows at cursor position once and stays fixed
- **Z-Index Fix** — Hovered floating button now raises z-index to cover other buttons, preventing accidental clicks
- **Title Cleanup** — Removed (helloworld) from settings panel title

## v1.3.0 (2026-06-13)

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
- **Removed Heading Cache** — No longer builds or persists heading/tag cache on startup; search relies on Obsidian's built-in search API and content matching

## v1.2.4

- Added "Selection Match List" toggle in settings to enable/disable the match list popup on text selection

## v1.2.3

- Fixed preview panel not closing when middle-clicking a list entry to open a document in a new tab

## v1.2.2

- Previous versions