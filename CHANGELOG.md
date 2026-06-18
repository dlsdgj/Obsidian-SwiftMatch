# Changelog

## 🆕 v1.4.1 (2026-06-18)

- **Counter Style Presets** — Added 6 counter badge style presets (Glassmorphism, Gradient Capsule, Outlined, Ribbon, Dot Indicator) selectable in settings
- **Counter line-height Fix** — Added `line-height:1` to counter `::after` pseudo-elements, fixing vertical padding that couldn't be reduced below a minimum
- **Settings Section Shading** — Collapsible section titles now have background shading for better visual separation
- **Multi-Keyword Search** — Pipe-separated keywords (e.g. `鸽子|导航|磁场`) search across vault; results sorted by keyword match count; each keyword highlighted in a different color
- **Require All Keywords** — New option (default on) to only show documents containing all search keywords
- **Search Loading Indicator** — All search modes now show a "Building..." indicator while searching
- **Search on Input Toggle** — New option (default off) to require Enter key to trigger search instead of typing
- **Background Search on Selection** — Selecting text no longer auto-shows the match window; search runs in background and badge updates; click floating toggle to view results
- **Minimap Blacklist for Plugin Pages** — Blacklist now matches view titles (e.g. "Thino") and view types for plugin pages without file paths; case-insensitive matching

## v1.4.0 (2026-06-17)

- **Selection Match Window Fix** — Fixed bug where hovering the floating toggle after selecting new text would show the previous keyword instead of the current selection; now correctly prioritizes the active search term over the last-displayed term
- **Pinned List State Sync** — `_pendingShowList` now updates even when the list is pinned or in exhaustive mode, preventing stale display after keyword switch

## v1.3.9 (2026-06-17)

- **Keyword Switching Fix** — Fixed race condition where switching keywords via recent search chips would jump back to the previous keyword; added generation-based search cancellation to fully discard stale async results
- **Immediate Switch for Uncached Keywords** — Clicking a keyword without cache now immediately shows a searching state and starts incremental result rendering
- **Disk Cache Loading on Restart** — Chip clicks and showMatchList now load cached results from disk when memory cache is empty after restart
- **Cancel Search on Switch** — Switching keywords or hitting cache now immediately cancels any in-progress background search
- **No Reorder on Chip Click** — Clicking a recent search keyword no longer moves it to the top of the list; new keywords are still added normally
- **Scroll Position Cleanup** — Deleting a search keyword now also removes its saved scroll position; persistence and loading filter out stale entries
- **Remove Console Logs** — Removed all console.log/time/timeEnd calls; kept console.error for error reporting
- **Expandable Match Entries** — Each document now shows match count in header; default shows 3 entries with expand/collapse toggle; snippet limit raised from 3 to 30

## v1.3.8 (2026-06-17)

- **Multi-Style Support** — Floating edit panel now supports multiple custom CSS styles with auto-parsed class previews; click to select default style
- **Style Persistence** — Custom styles saved to data.json, preserving user styles across plugin updates
- **Style Stacking Fix** — Fixed bug where applying a new style would stack with the previous one
- **Compact Settings Layout** — "Basic", "Counter Style", and "Pin Icon" sections reorganized to horizontal compact layout
- **Live Style Preview** — Floating button in settings panel now displays actual current style as clickable text

## v1.3.7 (2026-06-16)

- **Settings Panel Restructure** — Moved "Show/Hide Floating Button" under "Floating Button Style" heading; renamed "Floating Toggle Style" to "Floating Button Style"; added "minimap" section title in Basic tab
- **Minimap Blacklist** — New blacklist setting under minimap section to hide minimap on specific pages (supports * wildcard); default rule `*.canvas` hides minimap on canvas pages; supports path matching for non-markdown views
- **Pin Icon Fix** — Pin icon now appears only once after text selection; no longer re-creates on repeated events

## v1.3.6 (2026-06-16)

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

## v1.3.5 (2026-06-16)

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

## v1.3.4 (2026-06-15)

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