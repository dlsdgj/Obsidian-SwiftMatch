const { Plugin, WorkspaceLeaf, MarkdownRenderer, Notice } = require('obsidian');
const { Decoration, EditorView } = require('@codemirror/view');
const { StateField, StateEffect } = require('@codemirror/state');

const setMatchHighlights = StateEffect.define();

const matchHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(setMatchHighlights)) {
        decorations = e.value;
      }
    }
    return decorations;
  },
  provide: field => EditorView.decorations.from(field)
});

const setJumpHighlight = StateEffect.define();
const jumpHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    for (const e of tr.effects) {
      if (e.is(setJumpHighlight)) {
        decorations = e.value;
      }
    }
    return decorations.map(tr.changes);
  },
  provide: field => EditorView.decorations.from(field)
});

class MatchHighlightPlugin {
  constructor(view) {
    this.view = view;
  }

  update() {}
}

const DEFAULT_SETTINGS = {
  top: 40,
  width: 2,
  maxWidth: 80,
  heightOffset: 65,
  opacity: 1.0,
  editorPadding: 10,
  sliderColor: '#F0B27F',
  highlightColor: '#ffc800',
  highlightCurrentColor: '#ff3232',
  contentOpacity: 1.0,
  collapseOnHover: false,
  collapseWidth: 8,
  matchBorderColor: '#ff6600',
  matchOpacity: 0.15,
  counterColor: '#aba6a6',
  counterBgColor: '#ff6600',
  counterSize: 9,
  counterTopOffset: -10,
  enableSelectionMatch: true,
  exhaustiveMode: true,
  matchListWidth: 280,
  matchListHeight: 400,
  floatingToggleX: 50,
  floatingToggleY: 100,
  floatingToggleSize: 20,
  floatingToggleVisible: true,
  floatingToggleOpacity: 0.6,
  hideStatusBar: false,
  rightOffset: 0,
  pinIconEnabled: true,
  pinIconMode: 'follow',
  pinIconSize: 12,
  pinIconOpacity: 0.7,
  pinIconFixedLeft: null,
  pinIconFixedTop: null,
  pinIconFollowOffsetX: 20,
  pinIconFollowOffsetY: -20,
  pinColorSchemes: [
    { borderColor: '#ff6600', counterBgColor: '#ff6600', counterColor: '#aba6a6', borderLinked: true, counterLinked: true },
    { borderColor: '#2196F3', counterBgColor: '#2196F3', counterColor: '#aba6a6', borderLinked: true, counterLinked: true },
    { borderColor: '#4CAF50', counterBgColor: '#4CAF50', counterColor: '#aba6a6', borderLinked: true, counterLinked: true },
    { borderColor: '#9C27B0', counterBgColor: '#9C27B0', counterColor: '#aba6a6', borderLinked: true, counterLinked: true },
    { borderColor: '#FF9800', counterBgColor: '#FF9800', counterColor: '#aba6a6', borderLinked: true, counterLinked: true },
    { borderColor: '#E91E63', counterBgColor: '#E91E63', counterColor: '#aba6a6', borderLinked: true, counterLinked: true }
  ],
  simplifiedColorScheme: true,
  clearCountOnClose: false,
  floatingToggleText: 'Swift',
  floatingToggleFontSize: 16,
  floatingTogglePaddingH: 10,
  floatingTogglePaddingV: 2,
  floatingToggleStyleClass: 'candy-mark',
  floatingToggleCustomStyle: '.candy-mark { background: linear-gradient(120deg, #ffebcc 0%, #ffd9a5 100%); color: #b45f2b; padding: 2px 6px; border-radius: 12px; font-weight: 500; font-size: 0.9em; display: inline-block; }',
  keywordButtonStyles: {},
  minimapBlacklist: '*.canvas',
  searchWordCountMin: 0,
  searchWordCountMax: 0,
  language: 'zh',
  counterStylePreset: 'glass',
  multiKeywordRequireAll: true,
  searchOnInput: false
};

const I18N = {
  zh: {
    settingsTitle: 'SwiftMatch 设置',
    tabBasic: '基础',
    tabCounter: '计数样式',
    tabPinned: '已固定',
    topDistance: '顶部距离 (px)',
    width: '宽度 (%)',
    maxWidth: '最大宽度 (px)',
    bottomOffset: '底部偏移 (px)',
    rightOffset: '右边偏移 (px)',
    sliderColor: '滑块颜色',
    opacity: '透明度',
    contentOpacity: '内容透明度',
    hoverExpand: '悬停展开',
    collapseWidth: '折叠宽度 (px)',
    floatingToggleText: '悬浮球显示文字',
    showFloating: '悬浮显示',
    toggleFloatingBtn: '显示/隐藏悬浮按钮',
    floatingToggleStyle: '悬浮按钮样式',
    minimap: 'minimap',
    minimapBlacklist: 'minimap 黑名单',
    minimapBlacklistDesc: '匹配路径的页面不显示 minimap（每行一个，支持 * 通配符）',
    fontSize: '文字大小 (px)',
    paddingH: '水平内边距 (px)',
    paddingV: '垂直内边距 (px)',
    hideStatusBar: '隐藏底部状态栏',
    searchLimit: '搜索限制',
    minWords: '最少字数 (0=不限)',
    maxWords: '最多字数 (0=不限)',
    pinIcon: '固定图标',
    enablePinIcon: '启用固定图标',
    iconMode: '图标模式',
    followMouse: '跟随鼠标',
    fixedPosition: '固定位置',
    followOffsetX: '水平偏移 (px)',
    followOffsetY: '垂直偏移 (px)',
    iconSize: '图标大小 (px)',
    iconOpacity: '图标透明度',
    iconText: '图标文字',
    colorSchemes: '配色方案 (按顺序使用)',
    simplifiedColor: '简化配色',
    addColor: '+ 添加配色',
    counterStyle: '计数样式',
    matchOpacity: '匹配透明度',
    counterOpacity: '计数透明度',
    counterBgOpacity: '计数背景透明度',
    counterFontSize: '计数字体大小',
    counterPaddingH: '计数水平内边距 (px)',
    counterPaddingV: '计数垂直内边距 (px)',
    counterTopOffset: '计数上偏移 (px)',
    counterStylePreset: '计数样式预设',
    counterPresetGlass: '毛玻璃',
    counterPresetOutlined: '描边气泡',
    multiKeywordRequireAll: '仅显示包含所有关键词的文档',
    searchOnInput: '输入即搜',
    clearCountOnClose: '关闭文档清除计数',
    pinnedMatches: '已固定匹配项',
    clearAllCounts: '清除所有计数',
    rebuildCache: '重建标题缓存',
    resetDefault: '重置默认',
    about: '关于/更新',
    building: '正在构建...',
    border: '边框',
    underline: '下划线',
    counterBg: '计数背景',
    counterTextColor: '计数文字',
    bubbleBorder: '气泡边框',
    syncColors: '同步下划线与背景色',
    background: '背景',
    text: '文字',
    noPinned: '暂无固定匹配项',
    unknownFile: '未知文件',
    clearDocPinned: '清除该文档所有固定项',
    clear: '清除',
    remove: '删除',
    searchPlaceholder: '搜索... (竖线分隔多关键词: 鸽子|导航|磁场)',
    unpin: '取消固定',
    clearPinned: (n) => `清除${n}个固定项`,
    pinMatch: '固定此匹配',
    recentSearch: '最近搜索',
    favoriteSearch: '收藏',
    addFavorite: '收藏',
    removeFavorite: '取消收藏',
    floatThisWord: '悬浮此词',
    removeFloat: '移除悬浮此词',
    exhaustiveMatch: (n, m) => `全库匹配: ${n} 个文档 (${m} 项结果)`,
    libraryMatch: (n, m) => `库中匹配: ${n} 个文档 (${m} 项结果)`,
    save: '保存',
    exportMarkdown: '导出匹配结果为 Markdown',
    copy: '复制',
    openDoc: '打开文档',
    exported: (f) => `已导出: ${f}`,
    exportFailed: (e) => `导出失败: ${e}`,
    sourceNotFound: (f) => `找不到源文档: ${f}`,
    editFloating: '编辑',
    hideFloating: '隐藏',
    closeKeyword: '关闭',
    settings: '设置',
    editTitle: '编辑悬浮按钮',
    toggleText: '显示文字',
    toggleFontSize: '字体大小',
    togglePaddingH: '水平内边距',
    togglePaddingV: '垂直内边距',
    toggleOpacity: '透明度',
    toggleSize: '按钮大小',
    styleClass: '样式类名',
    customStyle: '自定义样式',
    getMoreStyles: '(获取更多样式)',
    styleHint: '支持完整CSS格式，含伪元素。类名会自动作用域化。',
    preview: '预览',
    styleName: '样式名称',
    addStyle: '+ 添加样式',
    deleteStyle: '删除',
    setDefault: '默认',
    defaultStyle: '默认',
    noStyles: '暂无自定义样式，请使用 .className { } 格式定义',
    clickToSelect: '点击选择',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    expandBefore: '展开前文',
    expandAfter: '展开后文'
  },
  en: {
    settingsTitle: 'SwiftMatch Settings',
    tabBasic: 'Basic',
    tabCounter: 'Counter Style',
    tabPinned: 'Pinned',
    topDistance: 'Top Distance (px)',
    width: 'Width (%)',
    maxWidth: 'Max Width (px)',
    bottomOffset: 'Bottom Offset (px)',
    rightOffset: 'Right Offset (px)',
    sliderColor: 'Slider Color',
    opacity: 'Opacity',
    contentOpacity: 'Content Opacity',
    hoverExpand: 'Hover Expand',
    collapseWidth: 'Collapse Width (px)',
    floatingToggleText: 'Floating Toggle Text',
    showFloating: 'Show Floating',
    toggleFloatingBtn: 'Show/Hide Floating Button',
    floatingToggleStyle: 'Floating Button Style',
    minimap: 'minimap',
    minimapBlacklist: 'Minimap Blacklist',
    minimapBlacklistDesc: 'Pages matching these paths will not show minimap (one per line, * wildcard supported)',
    fontSize: 'Font Size (px)',
    paddingH: 'Horizontal Padding (px)',
    paddingV: 'Vertical Padding (px)',
    hideStatusBar: 'Hide Status Bar',
    searchLimit: 'Search Limits',
    minWords: 'Min Words (0=no limit; CJK counts by char)',
    maxWords: 'Max Words (0=no limit; CJK counts by char)',
    pinIcon: 'Pin Icon',
    enablePinIcon: 'Enable Pin Icon',
    iconMode: 'Icon Mode',
    followMouse: 'Follow Mouse',
    fixedPosition: 'Fixed Position',
    followOffsetX: 'Horizontal Offset (px)',
    followOffsetY: 'Vertical Offset (px)',
    iconSize: 'Icon Size (px)',
    iconOpacity: 'Icon Opacity',
    iconText: 'Icon Text',
    colorSchemes: 'Color Schemes (used in order)',
    simplifiedColor: 'Simplified Colors',
    addColor: '+ Add Color',
    counterStyle: 'Counter Style',
    matchOpacity: 'Match Opacity',
    counterOpacity: 'Counter Opacity',
    counterBgOpacity: 'Counter BG Opacity',
    counterFontSize: 'Counter Font Size',
    counterPaddingH: 'Counter H Padding (px)',
    counterPaddingV: 'Counter V Padding (px)',
    counterTopOffset: 'Counter Top Offset (px)',
    counterStylePreset: 'Counter Style Preset',
    counterPresetGlass: 'Glassmorphism',
    counterPresetOutlined: 'Outlined Bubble',
    multiKeywordRequireAll: 'Only show docs with all keywords',
    searchOnInput: 'Search on input',
    clearCountOnClose: 'Clear Count on Close',
    pinnedMatches: 'Pinned Matches',
    clearAllCounts: 'Clear All Counts',
    rebuildCache: 'Rebuild Heading Cache',
    resetDefault: 'Reset Defaults',
    about: 'About/Updates',
    building: 'Building...',
    border: 'Border',
    underline: 'Underline',
    counterBg: 'Counter BG',
    counterTextColor: 'Counter Text',
    bubbleBorder: 'Bubble Border',
    syncColors: 'Sync underline & counter BG',
    background: 'Background',
    text: 'Text',
    noPinned: 'No pinned matches',
    unknownFile: 'Unknown file',
    clearDocPinned: 'Clear all pinned items for this doc',
    clear: 'Clear',
    remove: 'Remove',
    searchPlaceholder: 'Search... (pipe-separated: bird|navigation|magnet)',
    unpin: 'Unpin',
    clearPinned: (n) => `Clear ${n} pinned items`,
    pinMatch: 'Pin this match',
    recentSearch: 'Recent Searches',
    favoriteSearch: 'Favorites',
    addFavorite: 'Favorite',
    removeFavorite: 'Unfavorite',
    floatThisWord: 'Float this word',
    removeFloat: 'Remove floating',
    exhaustiveMatch: (n, m) => `Exhaustive: ${n} docs (${m} results)`,
    libraryMatch: (n, m) => `Library: ${n} docs (${m} results)`,
    save: 'Save',
    exportMarkdown: 'Export results as Markdown',
    copy: 'Copy',
    openDoc: 'Open Document',
    exported: (f) => `Exported: ${f}`,
    exportFailed: (e) => `Export failed: ${e}`,
    sourceNotFound: (f) => `Source not found: ${f}`,
    editFloating: 'Edit',
    hideFloating: 'Hide',
    closeKeyword: 'Close',
    settings: 'Settings',
    editTitle: 'Edit Floating Toggle',
    toggleText: 'Display Text',
    toggleFontSize: 'Font Size',
    togglePaddingH: 'Horizontal Padding',
    togglePaddingV: 'Vertical Padding',
    toggleOpacity: 'Opacity',
    toggleSize: 'Button Size',
    styleClass: 'Style Class',
    customStyle: 'Custom Style',
    getMoreStyles: '(Get More Styles)',
    styleHint: 'Supports full CSS format including pseudo-elements. Class names are auto-scoped.',
    preview: 'Preview',
    styleName: 'Style Name',
    addStyle: '+ Add Style',
    deleteStyle: 'Delete',
    setDefault: 'Default',
    defaultStyle: 'Default',
    noStyles: 'No custom styles detected, use .className { } format',
    clickToSelect: 'Click to select',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    expandBefore: 'Expand before',
    expandAfter: 'Expand after'
  }
};

function t(key, ...args) {
  const lang = (typeof window !== 'undefined' && window._swiftMatchLang) || 'zh';
  const val = I18N[lang]?.[key] ?? I18N.zh[key];
  if (typeof val === 'function') return val(...args);
  return val;
}

class MinimapPlugin extends Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this.manifest = manifest;
    this.minimapContainer = null;
    this.minimapContent = null;
    this.scrollbar = null;
    this.isDraggingScrollbar = false;
    this.scrollbarDragStartY = 0;
    this.scrollbarDragStartScrollTop = 0;
    this.slider = null;
    this.isDragging = false;
    this.isJumping = false;
    this.dragStartY = 0;
    this.dragStartLine = 0;
    this.highlights = [];
    this.editorHighlights = [];
    this.decorationField = null;
    this.currentSelection = '';
    this.currentCursor = null;
    this.updateTimer = null;
    this.boundMouseMove = null;
    this.boundMouseUp = null;
    this.scrollHandler = null;
    this.editorScrollEl = null;
    this.opacity = 0.3;
    this.boundWheel = null;
    this.editorContentEl = null;
    this.originalPaddingRight = '';
    this.settings = Object.assign({}, DEFAULT_SETTINGS);
    this.settingsPanel = null;
    this.boundContextMenu = null;
    this.tooltip = null;
    this.matchList = null;
    this.previewPanel = null;
    this.isPreviewOpen = false;
    this.originalListPosition = 'right';
    this.isInteractingWithList = false;
    this.currentPreviewFile = null;
    this.currentPreviewHeading = null;
    this._previewOutsideClickHandler = null;
    this._listCloseHandler = null;
    this._pendingListClose = false;
    this.previewSourceLeaf = null;
    this._searchGeneration = 0;
    this._searchInProgress = false;

    this._isListVisible = false;
    this._listUserDismissed = false;
    this._keepListVisible = false;
    this._chipSwitching = false;
    this._listPinnedSearchText = null;
    this._pinnedWordFileMap = null;
    this._pinnedWordMatchCount = 0;
    this._pendingShowList = null;
    this._triggeredByIndicator = false;
    this._cachedMatchList = null;
    this._cachedMatchListKey = null;
    this.listPosition = { left: null, top: null };
    this.listFixedPosition = { left: null, top: null };
    this.previewListPosition = { left: null, top: null };
    this.floatingStyles = [];
    this.floatingDefaultStyleId = null;
    this.listOpacity = 1.0;
    this.previewOpacity = 1.0;
    this.previewSize = { width: 600, height: 600 };
    this.matchListSize = { width: null, height: null };
    this.isDraggingList = false;
    this.listDragStartX = 0;
    this.listDragStartY = 0;
    this.listDragStartLeft = 0;
    this.listDragStartTop = 0;
    this.boundListWheel = null;
    this.listDataPath = null;
    this.savedMatchLists = [];
    this.matchListIndicator = null;
    this.currentMatchListData = null;

    this.matchListIndicators = [];
    this._currentIndicatorSelection = null;
    this._currentIndicatorMatchCount = null;
    this.lastIndicatorCoords = null;
    this.floatingToggle = null;
    this._isApplyingReadingHighlights = false;
    this._readingViewObserver = null;
    this._readingHighlightRetryTimer = null;
    this._pinIcon = null;
    this._lastMouseX = 0;
    this._lastMouseY = 0;
    this._recentSearches = [];
    this._recentSearchCaches = {};
    this._expandedGroups = {};
    this._recentSearchCachesData = []; // deprecated, kept for migration
    this._favoriteSearches = [];
    this._listScrollPositions = {}; // { term: scrollTop }
    this._lastListSearchTerm = null; // search term used when list was last visible
    this._lastListFileMap = null; // fileMap when list was last visible
    this._lastListMatchCount = 0; // matchCount when list was last visible
    this._floatingKeywordButtons = []; // [{ wrapper, term, fileMap, matchCount, position }]
    this._floatingKeywordsData = []; // deprecated, kept for migration
    this._listTriggerElement = null; // element that triggered the list display (keyword btn or floating toggle)
  }

  onload() {
    this.loadSettings();
    this.loadListData();
    this.loadFloatingStyleData();
    this.opacity = this.settings.opacity;
    this.addCommands();
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.boundWheel = this.handleWheel.bind(this);
    this.boundContextMenu = this.showSettingsPanel.bind(this);
    this.boundListWheel = this.handleListWheel.bind(this);
    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
    
    // Watch for theme changes to refresh counter colors
    this._lastThemeDark = document.body.classList.contains('theme-dark');
    this._themeObserver = new MutationObserver(() => {
      const isDark = document.body.classList.contains('theme-dark');
      if (isDark !== this._lastThemeDark) {
        this._lastThemeDark = isDark;
        const preset = this.settings.counterStylePreset || 'glass';
        if (preset === 'glass') {
          this.clearHighlights();
          this.showPinnedDecorations();
          if (this.currentSelection) this.highlightMatches();
        }
      }
    });
    this._themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    this.registerEvents();
    
    setTimeout(async () => {
      this.setupMinimap();

      if (this.settings.floatingToggleVisible) {
        this.createFloatingToggle();
      }
      await this._restoreRecentSearchCaches();
      await this._restoreFloatingKeywordButtons();
    }, 300);
  }

  loadSettings() {
    const saved = localStorage.getItem('swift-match-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.settings = Object.assign({}, DEFAULT_SETTINGS, parsed);
        this.settings.exhaustiveMode = true;
        // Migrate legacy default (2/7) which blocked all CJK single-phrase searches.
        // Now countWords() handles CJK by character count, but the old 2/7 values
        // were a bug default — reset to 0/0 (no limit) so users start clean.
        if (this.settings.searchWordCountMin === 2 && this.settings.searchWordCountMax === 7) {
          this.settings.searchWordCountMin = 0;
          this.settings.searchWordCountMax = 0;
          this.saveSettings();
        }
        if (!this.settings.pinColorSchemes || !Array.isArray(this.settings.pinColorSchemes) || this.settings.pinColorSchemes.length === 0) {
          this.settings.pinColorSchemes = DEFAULT_SETTINGS.pinColorSchemes.map(s => ({...s}));
        }
      } catch (e) {
        this.settings = Object.assign({}, DEFAULT_SETTINGS);
      }
    }
    window._swiftMatchLang = this.settings.language || 'zh';
  }

  saveSettings() {
    localStorage.setItem('swift-match-settings', JSON.stringify(this.settings));
  }

  async loadListData() {
    const dataDir = this.app.vault.configDir || '.obsidian';
    this.listDataPath = `${dataDir}/plugins/swift-match/list-data.json`;
    this.cacheDir = `${dataDir}/plugins/swift-match/cache`;
    this.keywordDir = `${dataDir}/plugins/swift-match/keywords`;
    
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(this.listDataPath)) {
        const content = await adapter.read(this.listDataPath);
        const data = JSON.parse(content);
        this.listPosition = data.listPosition || { left: null, top: null };
        this.listFixedPosition = data.listFixedPosition || { left: null, top: null };
        this.previewListPosition = data.previewListPosition || { left: null, top: null };
        this.listOpacity = data.listOpacity ?? 1.0;
        this.previewOpacity = data.previewOpacity ?? 1.0;
        this.previewSize = data.previewSize || { width: 600, height: 600 };
        this.matchListSize = data.matchListSize || { width: null, height: null };
        this.savedMatchLists = data.savedMatchLists || [];
        this._matchListScrollTop = data.matchListScrollTop || 0;
        this._recentSearches = data.recentSearches || [];
        this._favoriteSearches = data.favoriteSearches || [];
        this._listScrollPositions = Object.fromEntries(
          Object.entries(data.listScrollPositions || {}).filter(([k]) =>
            this._favoriteSearches.includes(k) || this._recentSearches.includes(k)
          )
        );
      }
    } catch (e) {
      console.error('Failed to load list data:', e);
      this.listPosition = { left: null, top: null };
      this.listFixedPosition = { left: null, top: null };
      this.previewListPosition = { left: null, top: null };
      this.listOpacity = 1.0;
      this.previewOpacity = 1.0;
      this.previewSize = { width: 600, height: 600 };
      this.matchListSize = { width: null, height: null };
      this.savedMatchLists = [];
    }
  }

  _cacheKeyToFileName(term) {
    return term.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
  }

  async saveSearchCache(term, fileMap, matchCount) {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.cacheDir)) {
      await adapter.mkdir(this.cacheDir);
    }
    const fileName = this._cacheKeyToFileName(term);
    const filePath = `${this.cacheDir}/${fileName}.json`;
    const fileMapData = Array.from(fileMap.entries()).map(([file, headings]) => ({
      path: file.path,
      basename: file.basename,
      headings
    }));
    await adapter.write(filePath, JSON.stringify({ term, matchCount, fileMapData }, null, 2));
  }

  async loadSearchCache(term) {
    const adapter = this.app.vault.adapter;
    const fileName = this._cacheKeyToFileName(term);
    const filePath = `${this.cacheDir}/${fileName}.json`;
    if (!await adapter.exists(filePath)) return null;
    try {
      const content = await adapter.read(filePath);
      const data = JSON.parse(content);
      const fileMap = await this.deserializeFileMap(data.fileMapData || []);
      return { fileMap, matchCount: data.matchCount || 0 };
    } catch (e) {
      return null;
    }
  }

  async deleteSearchCache(term) {
    const adapter = this.app.vault.adapter;
    const fileName = this._cacheKeyToFileName(term);
    const filePath = `${this.cacheDir}/${fileName}.json`;
    if (await adapter.exists(filePath)) {
      try { await adapter.remove(filePath); } catch (e) {}
    }
  }

  async saveKeywordData(term, position, fileMap, matchCount) {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.keywordDir)) {
      await adapter.mkdir(this.keywordDir);
    }
    const fileName = this._cacheKeyToFileName(term);
    const filePath = `${this.keywordDir}/${fileName}.json`;
    const fileMapData = fileMap ? Array.from(fileMap.entries()).map(([file, headings]) => ({
      path: file.path,
      basename: file.basename,
      headings
    })) : [];
    await adapter.write(filePath, JSON.stringify({ term, position, matchCount, fileMapData }, null, 2));
  }

  async loadAllKeywordData() {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.keywordDir)) return [];
    const result = [];
    try {
      const listed = await adapter.list(this.keywordDir);
      const files = Array.isArray(listed) ? listed : (listed?.files || []);
      for (const f of files) {
        const filePath = f.startsWith(this.keywordDir) ? f : `${this.keywordDir}/${f}`;
        if (!filePath.endsWith('.json')) continue;
        try {
          const content = await adapter.read(filePath);
          result.push(JSON.parse(content));
        } catch (e) {}
      }
    } catch (e) {}
    return result;
  }

  async deleteKeywordData(term) {
    const adapter = this.app.vault.adapter;
    const fileName = this._cacheKeyToFileName(term);
    const filePath = `${this.keywordDir}/${fileName}.json`;
    if (await adapter.exists(filePath)) {
      await adapter.remove(filePath);
    }
  }

  async saveListData() {
    if (!this.listDataPath) return;
    
    try {
      const adapter = this.app.vault.adapter;
      const data = {
        listPosition: this.listPosition,
        listFixedPosition: this.listFixedPosition,
        previewListPosition: this.previewListPosition,
        listOpacity: this.listOpacity,
        previewOpacity: this.previewOpacity,
        previewSize: this.previewSize,
        matchListSize: this.matchListSize,
        savedMatchLists: this.savedMatchLists,
        matchListScrollTop: this._matchListScrollTop || 0,
        recentSearches: this._recentSearches || [],
        favoriteSearches: this._favoriteSearches || [],
        listScrollPositions: Object.fromEntries(
          Object.entries(this._listScrollPositions || {}).filter(([k]) =>
            this._favoriteSearches.includes(k) || this._recentSearches.includes(k)
          )
        )
      };
      await adapter.write(this.listDataPath, JSON.stringify(data, null, 2));

      for (const [term, cache] of Object.entries(this._recentSearchCaches)) {
        if (cache && cache.fileMap && cache.fileMap.size > 0) {
          await this.saveSearchCache(term, cache.fileMap, cache.matchCount || 0);
        }
      }
    } catch (e) {
      console.error('Failed to save list data:', e);
    }
  }

  async loadFloatingStyleData() {
    const dataDir = this.app.vault.configDir || '.obsidian';
    this.floatingStyleDataPath = `${dataDir}/plugins/swift-match/data.json`;
    try {
      const adapter = this.app.vault.adapter;
      if (await adapter.exists(this.floatingStyleDataPath)) {
        const content = await adapter.read(this.floatingStyleDataPath);
        const data = JSON.parse(content);
        this.floatingStyles = data.floatingStyles || [];
        this.floatingDefaultStyleId = data.floatingDefaultStyleId || null;
      } else {
        this.floatingStyles = [];
        this.floatingDefaultStyleId = null;
      }
      // Migrate old single customStyle to new multi-style format
      if (this.floatingStyles.length === 0 && this.settings.floatingToggleCustomStyle) {
        this.floatingStyles.push({
          id: Date.now().toString(),
          name: this.settings.floatingToggleText || 'Swift',
          styleClass: this.settings.floatingToggleStyleClass || '',
          customStyle: this.settings.floatingToggleCustomStyle || ''
        });
        this.floatingDefaultStyleId = this.floatingStyles[0].id;
        await this.saveFloatingStyleData();
      }
    } catch (e) {
      console.error('Failed to load floating style data:', e);
      this.floatingStyles = [];
      this.floatingDefaultStyleId = null;
    }
  }

  async saveFloatingStyleData() {
    if (!this.floatingStyleDataPath) return;
    try {
      const adapter = this.app.vault.adapter;
      const data = {
        floatingStyles: this.floatingStyles,
        floatingDefaultStyleId: this.floatingDefaultStyleId
      };
      await adapter.write(this.floatingStyleDataPath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to save floating style data:', e);
    }
  }

  getActiveFloatingStyle() {
    if (!this.floatingDefaultStyleId || !this.floatingStyles || this.floatingStyles.length === 0) {
      return null;
    }
    return this.floatingStyles.find(s => s.id === this.floatingDefaultStyleId) || null;
  }

  applySettings() {
    if (!this.minimapContainer) return;
    
    const s = this.settings;
    this.minimapContainer.style.top = `${s.top}px`;
    this.minimapContainer.style.right = `${s.rightOffset}px`;
    this.minimapContainer.style.width = `${s.width}%`;
    this.minimapContainer.style.maxWidth = `${s.maxWidth}px`;
    this.minimapContainer.style.height = `calc(100vh - ${s.top}px - ${s.heightOffset}px)`;
    this.minimapContainer.style.opacity = s.opacity;
    this.opacity = s.opacity;
    
    if (this.slider) {
      this.slider.style.backgroundColor = s.sliderColor;
    }
    
    if (this.minimapContent) {
      this.minimapContent.style.opacity = s.contentOpacity;
    }
    
    if (this.minimapContainer) {
      if (s.collapseOnHover) {
        this.minimapContainer.classList.add('collapsed');
        this.minimapContainer.style.setProperty('--collapse-width', `${s.collapseWidth}px`);
      } else {
        this.minimapContainer.classList.remove('collapsed');
      }
    }
    
    this.removeEditorPadding();
    this.applyEditorPadding();
    this.updateViewport();
    this.applyHideStatusBar();
  }

  applyCounterStyles() {
    const s = this.settings;
    const counterSize = s.counterSize;
    const counterPadding = '0px 2px';
    const counterTopOffset = `${s.counterTopOffset}px`;

    // 更新阅读模式
    const readingEl = document.querySelector('.markdown-reading-view');
    if (readingEl) {
      readingEl.style.setProperty('--minimap-counter-opacity', 1);
      readingEl.style.setProperty('--minimap-counter-size', `${counterSize}px`);
      readingEl.style.setProperty('--minimap-counter-padding', counterPadding);
      readingEl.style.setProperty('--minimap-counter-top-offset', counterTopOffset);
    }

    // 更新编辑器模式
    const editor = this.getEditor();
    if (editor && editor.cm && editor.cm.scrollDOM) {
      const scrollDOM = editor.cm.scrollDOM;
      scrollDOM.style.setProperty('--minimap-counter-opacity', 1);
      scrollDOM.style.setProperty('--minimap-counter-size', `${counterSize}px`);
      scrollDOM.style.setProperty('--minimap-counter-padding', counterPadding);
      scrollDOM.style.setProperty('--minimap-counter-top-offset', counterTopOffset);
      // 背景透明度也需要更新（颜色从配色方案获取）
      const currentPreset = s.counterStylePreset || 'glass';
      const counterColor = currentPreset === 'glass'
        ? (document.body.classList.contains('theme-dark') ? '#e0dcdc' : '#aba6a6')
        : s.counterColor;
      const counterBgColor = s.counterBgColor;
      scrollDOM.style.setProperty('--minimap-counter-color', counterColor);
      scrollDOM.style.setProperty('--minimap-counter-bgcolor', currentPreset === 'outlined' ? counterBgColor : this.hexToRgba(counterBgColor, 1));
      if (readingEl) {
        readingEl.style.setProperty('--minimap-counter-color', counterColor);
        readingEl.style.setProperty('--minimap-counter-bgcolor', currentPreset === 'outlined' ? counterBgColor : this.hexToRgba(counterBgColor, 1));
      }
    }
  }

  initCollapsibleSections() {
    if (!this.settingsPanel) return;
    const titles = this.settingsPanel.querySelectorAll('.minimap-settings-section-title');
    titles.forEach(title => {
      title.style.cursor = 'pointer';
      title.style.userSelect = 'none';
      // 添加折叠箭头
      if (!title.querySelector('.collapse-arrow')) {
        const arrow = document.createElement('span');
        arrow.className = 'collapse-arrow';
        arrow.textContent = ' ▾';
        arrow.style.cssText = 'font-size:10px;float:right;transition:transform 0.2s;';
        title.appendChild(arrow);
      }
      // 收集后续兄弟元素直到下一个 section title
      const siblings = [];
      let next = title.nextElementSibling;
      while (next && !next.classList.contains('minimap-settings-section-title') && !next.classList.contains('minimap-settings-footer')) {
        siblings.push(next);
        next = next.nextElementSibling;
      }
      // 包裹到容器中
      const wrapper = document.createElement('div');
      wrapper.className = 'minimap-section-content';
      siblings.forEach(el => wrapper.appendChild(el));
      title.parentNode.insertBefore(wrapper, title.nextSibling);
      // 点击折叠/展开
      title.addEventListener('click', () => {
        const isCollapsed = wrapper.style.display === 'none';
        wrapper.style.display = isCollapsed ? '' : 'none';
        const arrow = title.querySelector('.collapse-arrow');
        if (arrow) arrow.style.transform = isCollapsed ? '' : 'rotate(-90deg)';
      });
    });
  }

  applyCounterVisibility() {
    this.clearHighlights();
    if (this.currentSelection) {
      this.highlightMatches();
    } else {
      const isReading = this.isReadingMode();
      if (isReading) {
        this.showPinnedDecorations();
      } else {
        const editor = this.getEditor();
        if (editor && editor.cm) {
          this.addEditorDecorationsWithPinned(editor.cm, [], 0);
        }
      }
    }
  }

  showSettingsPanel(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (this.settingsPanel) {
      this.closeSettingsPanel();
      return;
    }
    
    this.settingsPanel = document.createElement('div');
    this.settingsPanel.className = 'minimap-settings-panel';
    this.settingsPanel.innerHTML = `
      <div class="minimap-settings-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <span id="minimap-lang-toggle" style="cursor:pointer;user-select:none;font-size:10px;font-weight:600;${this.settings.language === 'zh' ? 'color:#D85A30;' : 'color:#185FA5;'}letter-spacing:${this.settings.language === 'zh' ? '.1em' : '.08em'};">${this.settings.language === 'zh' ? 'CN' : 'EN'}</span>
          <span>${t('settingsTitle')} v${this.manifest.version || '1.0.0'}</span>
        </div>
        <button class="minimap-settings-close">&times;</button>
      </div>
      <div class="minimap-settings-tabs">
        <div class="minimap-settings-tab active" data-tab="basic">${t('tabBasic')}</div>
        <div class="minimap-settings-tab" data-tab="counter">${t('tabCounter')}</div>
        <div class="minimap-settings-tab" data-tab="pinned">${t('tabPinned')}</div>
      </div>
      <div class="minimap-settings-content">
        <div class="minimap-settings-tab-content active" data-tab="basic">
          <div class="minimap-settings-section-title">${t('minimap')}</div>
          <div class="minimap-settings-row" style="flex-direction:column;align-items:stretch;">
            <label>${t('minimapBlacklist')}<span style="font-weight:normal;font-size:11px;color:var(--text-muted);display:block;margin-top:2px;">${t('minimapBlacklistDesc')}</span></label>
            <textarea id="minimap-blacklist" rows="3" style="width:100%;margin-top:4px;font-size:12px;resize:vertical;background:var(--background-modifier-form-field);color:var(--text-normal);border:1px solid var(--background-modifier-border);border-radius:4px;padding:4px 6px;">${this.settings.minimapBlacklist || ''}</textarea>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('topDistance')}</label>
              <input type="number" id="minimap-top" value="${this.settings.top}" min="0" max="500" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('width')}</label>
              <input type="number" id="minimap-width" value="${this.settings.width}" min="1" max="20" step="0.5" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('maxWidth')}</label>
              <input type="number" id="minimap-maxwidth" value="${this.settings.maxWidth}" min="20" max="200" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('bottomOffset')}</label>
              <input type="number" id="minimap-heightoffset" value="${this.settings.heightOffset}" min="0" max="200" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('rightOffset')}</label>
              <input type="number" id="minimap-rightoffset" value="${this.settings.rightOffset}" min="-100" max="200" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('sliderColor')}</label>
              <input type="color" id="minimap-slidercolor" value="${this.settings.sliderColor}" style="width:36px;height:26px;padding:0;border:1px solid var(--background-modifier-border);border-radius:4px;cursor:pointer;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('opacity')}</label>
              <input type="range" id="minimap-opacity" value="${this.settings.opacity}" min="0.1" max="1" step="0.1" style="width:70px;">
              <span id="minimap-opacity-value" style="font-size:11px;min-width:24px;">${this.settings.opacity}</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('contentOpacity')}</label>
              <input type="range" id="minimap-contentopacity" value="${this.settings.contentOpacity}" min="0.1" max="1" step="0.1" style="width:70px;">
              <span id="minimap-contentopacity-value" style="font-size:11px;min-width:24px;">${this.settings.contentOpacity}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('hoverExpand')}</label>
              <input type="checkbox" id="minimap-collapseonhover" ${this.settings.collapseOnHover ? 'checked' : ''}>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('collapseWidth')}</label>
              <input type="number" id="minimap-collapsewidth" value="${this.settings.collapseWidth}" min="4" max="50" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
          </div>
          <div class="minimap-settings-section-title">${t('floatingToggleStyle')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('toggleFloatingBtn')}</label>
              <span id="minimap-showfloatingtoggle" style="cursor:pointer;display:inline-block;">${this.settings.floatingToggleText || 'Swift'}</span>
            </div>
          </div>
          <div class="minimap-settings-section-title">${t('searchLimit')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('minWords')}</label>
              <input type="number" id="minimap-searchwordcountmin" value="${this.settings.searchWordCountMin ?? 0}" min="0" max="100" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('maxWords')}</label>
              <input type="number" id="minimap-searchwordcountmax" value="${this.settings.searchWordCountMax ?? 0}" min="0" max="100" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
          </div>
          <div class="minimap-settings-row">
            <label>${t('multiKeywordRequireAll')}</label>
            <input type="checkbox" id="minimap-multikeywordrequireall" ${this.settings.multiKeywordRequireAll !== false ? 'checked' : ''}>
          </div>
          <div class="minimap-settings-row">
            <label>${t('searchOnInput')}</label>
            <input type="checkbox" id="minimap-searchoninput" ${this.settings.searchOnInput ? 'checked' : ''}>
          </div>
        </div>
        <div class="minimap-settings-tab-content" data-tab="counter">
          <div class="minimap-settings-section-title">${t('pinIcon')}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('enablePinIcon')}</label>
              <input type="checkbox" id="minimap-piniconenabled" ${this.settings.pinIconEnabled ? 'checked' : ''}>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('iconMode')}</label>
              <select id="minimap-piniconmode" style="padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
                <option value="follow" ${this.settings.pinIconMode === 'follow' ? 'selected' : ''}>${t('followMouse')}</option>
                <option value="fixed" ${this.settings.pinIconMode === 'fixed' ? 'selected' : ''}>${t('fixedPosition')}</option>
              </select>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('iconSize')}</label>
              <input type="number" id="minimap-piniconsize" value="${this.settings.pinIconSize}" min="12" max="40" style="width:55px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('iconOpacity')}</label>
              <input type="range" id="minimap-piniconopacity" value="${this.settings.pinIconOpacity}" min="0.1" max="1" step="0.1" style="width:70px;">
              <span id="minimap-piniconopacity-value" style="font-size:11px;min-width:24px;">${this.settings.pinIconOpacity}</span>
            </div>
          </div>
          <div id="minimap-follow-offset-section" style="display:${this.settings.pinIconMode === 'follow' ? 'block' : 'none'};">
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
              <div style="display:flex;align-items:center;gap:4px;">
                <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('followOffsetX')}</label>
                <input type="number" id="minimap-piniconfollowoffsetx" value="${this.settings.pinIconFollowOffsetX ?? 15}" min="-100" max="100" step="1" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
              </div>
              <div style="display:flex;align-items:center;gap:4px;">
                <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('followOffsetY')}</label>
                <input type="number" id="minimap-piniconfollowoffsety" value="${this.settings.pinIconFollowOffsetY ?? -10}" min="-100" max="100" step="1" style="width:60px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
              </div>
            </div>
            <div id="minimap-follow-offset-preview" style="position:relative;width:120px;height:80px;margin:6px auto;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-secondary);overflow:hidden;">
              <div id="minimap-follow-offset-cursor" style="position:absolute;width:6px;height:6px;background:var(--text-muted);border-radius:50%;left:50%;top:50%;transform:translate(-50%,-50%);"></div>
              <div id="minimap-follow-offset-icon" style="position:absolute;width:14px;height:14px;background:var(--interactive-accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:white;font-weight:bold;">m</div>
            </div>
          </div>
          <div class="minimap-settings-section-title" style="margin-top:12px;">${t('colorSchemes')}</div>
          <div id="minimap-color-schemes"></div>
          <div class="minimap-settings-section-title" style="margin-top:12px;">${t('counterStyle')}</div>
          <div id="minimap-counter-preset-chips" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;"></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('matchOpacity')}</label>
              <input type="range" id="minimap-matchopacity" value="${this.settings.matchOpacity ?? 0.6}" min="0.1" max="1" step="0.05" style="width:70px;">
              <span id="minimap-matchopacity-value" style="font-size:11px;min-width:28px;">${this.settings.matchOpacity ?? 0.6}</span>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;">
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('counterFontSize')}</label>
              <input type="number" id="minimap-countersize" value="${this.settings.counterSize}" min="6" max="16" style="width:55px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <label style="white-space:nowrap;font-size:12px;color:var(--text-normal);">${t('counterTopOffset')}</label>
              <input type="number" id="minimap-countertopoffset" value="${this.settings.counterTopOffset}" min="-30" max="10" style="width:55px;padding:4px 6px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;">
            </div>
          </div>
        </div>
        <div class="minimap-settings-tab-content" data-tab="pinned">
          <div class="minimap-settings-row">
            <label>${t('clearCountOnClose')}</label>
            <input type="checkbox" id="minimap-clearcountonclose" ${this.settings.clearCountOnClose ? 'checked' : ''}>
          </div>
          <div class="minimap-settings-section-title">${t('pinnedMatches')}</div>
          <button id="minimap-clearallcounts" style="width:100%;margin-bottom:6px;padding:4px 8px;cursor:pointer;">${t('clearAllCounts')}</button>
          <div id="minimap-pinned-list" style="max-height:400px;overflow-y:auto;"></div>
        </div>
        <div class="minimap-settings-footer">
          <button id="minimap-reset">${t('resetDefault')}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.settingsPanel);
    
    // Restore saved panel width
    const savedPanelWidth = localStorage.getItem('minimap-settings-panel-width');
    if (savedPanelWidth) {
      this.settingsPanel.style.width = savedPanelWidth;
    }
    
    // Save panel width on resize
    const resizeObserver = new ResizeObserver(() => {
      if (!this.settingsPanel) return;
      const width = this.settingsPanel.getBoundingClientRect().width;
      localStorage.setItem('minimap-settings-panel-width', `${width}px`);
    });
    resizeObserver.observe(this.settingsPanel);
    this._settingsPanelResizeObserver = resizeObserver;
    
    // Center the panel in the window
    const panelRect = this.settingsPanel.getBoundingClientRect();
    const centerX = (window.innerWidth - panelRect.width) / 2;
    const centerY = (window.innerHeight - panelRect.height) / 2;
    this.settingsPanel.style.left = `${Math.max(0, centerX)}px`;
    this.settingsPanel.style.top = `${Math.max(0, centerY)}px`;
    
    // Make panel draggable by header
    const header = this.settingsPanel.querySelector('.minimap-settings-header');
    let isDraggingPanel = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('minimap-settings-close')) return;
      if (e.target.id === 'minimap-lang-toggle') return;
      if (!this.settingsPanel) return;
      isDraggingPanel = true;
      dragOffsetX = e.clientX - this.settingsPanel.getBoundingClientRect().left;
      dragOffsetY = e.clientY - this.settingsPanel.getBoundingClientRect().top;
      header.style.cursor = 'grabbing';
      e.preventDefault();
    });
    
    const onPanelMouseMove = (e) => {
      if (!isDraggingPanel) return;
      if (!this.settingsPanel) return;
      const newLeft = e.clientX - dragOffsetX;
      const newTop = e.clientY - dragOffsetY;
      this.settingsPanel.style.left = `${newLeft}px`;
      this.settingsPanel.style.top = `${newTop}px`;
    };
    
    const onPanelMouseUp = () => {
      if (isDraggingPanel) {
        isDraggingPanel = false;
        header.style.cursor = 'grab';
      }
    };
    
    document.addEventListener('mousemove', onPanelMouseMove);
    document.addEventListener('mouseup', onPanelMouseUp);
    this._settingsPanelDragCleanup = () => {
      document.removeEventListener('mousemove', onPanelMouseMove);
      document.removeEventListener('mouseup', onPanelMouseUp);
    };
    
    const closeBtn = this.settingsPanel.querySelector('.minimap-settings-close');
    closeBtn.addEventListener('click', () => this.closeSettingsPanel());
    const langToggle = this.settingsPanel.querySelector('#minimap-lang-toggle');
    if (langToggle) {
      langToggle.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.settings.language = this.settings.language === 'zh' ? 'en' : 'zh';
        window._swiftMatchLang = this.settings.language;
        this.saveSettings();
        // Close and reopen settings panel to apply language change
        this.closeSettingsPanel();
        setTimeout(() => {
          const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
          this.showSettingsPanel(mockEvent);
        }, 100);
      });
    }
    
    this.settingsPanel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    this.settingsPanel.querySelectorAll('.minimap-settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (!this.settingsPanel) return;
        this.settingsPanel.querySelectorAll('.minimap-settings-tab').forEach(t => t.classList.remove('active'));
        this.settingsPanel.querySelectorAll('.minimap-settings-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        this.settingsPanel.querySelector(`.minimap-settings-tab-content[data-tab="${tabName}"]`).classList.add('active');
      });
    });
    
    this.settingsPanel.querySelectorAll('input[type="number"]').forEach(input => {
      input.addEventListener('wheel', (e) => {
        e.preventDefault();
        const step = parseFloat(input.step) || 1;
        const delta = e.deltaY > 0 ? -step : step;
        const newVal = parseFloat(input.value) + delta;
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        if (!isNaN(min) && newVal < min) {
          input.value = min;
        } else if (!isNaN(max) && newVal > max) {
          input.value = max;
        } else {
          input.value = newVal;
        }
        input.dispatchEvent(new Event('input'));
      }, { passive: false });
    });

    const inputs = {
      blacklist: this.settingsPanel.querySelector('#minimap-blacklist'),
      top: this.settingsPanel.querySelector('#minimap-top'),
      width: this.settingsPanel.querySelector('#minimap-width'),
      maxwidth: this.settingsPanel.querySelector('#minimap-maxwidth'),
      heightoffset: this.settingsPanel.querySelector('#minimap-heightoffset'),
      rightoffset: this.settingsPanel.querySelector('#minimap-rightoffset'),
      slidercolor: this.settingsPanel.querySelector('#minimap-slidercolor'),
      opacity: this.settingsPanel.querySelector('#minimap-opacity'),
      contentopacity: this.settingsPanel.querySelector('#minimap-contentopacity'),
      collapseonhover: this.settingsPanel.querySelector('#minimap-collapseonhover'),
      collapsewidth: this.settingsPanel.querySelector('#minimap-collapsewidth'),
      matchopacity: this.settingsPanel.querySelector('#minimap-matchopacity'),
      countersize: this.settingsPanel.querySelector('#minimap-countersize'),
      countertopoffset: this.settingsPanel.querySelector('#minimap-countertopoffset'),
      clearcountonclose: this.settingsPanel.querySelector('#minimap-clearcountonclose'),
      piniconenabled: this.settingsPanel.querySelector('#minimap-piniconenabled'),
      piniconmode: this.settingsPanel.querySelector('#minimap-piniconmode'),
      piniconsize: this.settingsPanel.querySelector('#minimap-piniconsize'),
      piniconopacity: this.settingsPanel.querySelector('#minimap-piniconopacity'),
      piniconfollowoffsetx: this.settingsPanel.querySelector('#minimap-piniconfollowoffsetx'),
      piniconfollowoffsety: this.settingsPanel.querySelector('#minimap-piniconfollowoffsety'),
      searchwordcountmin: this.settingsPanel.querySelector('#minimap-searchwordcountmin'),
      searchwordcountmax: this.settingsPanel.querySelector('#minimap-searchwordcountmax'),
      multikeywordrequireall: this.settingsPanel.querySelector('#minimap-multikeywordrequireall'),
      searchoninput: this.settingsPanel.querySelector('#minimap-searchoninput')
    };

    const matchOpacityValue = this.settingsPanel.querySelector('#minimap-matchopacity-value');
    
    const opacityValue = this.settingsPanel.querySelector('#minimap-opacity-value');
    const contentOpacityValue = this.settingsPanel.querySelector('#minimap-contentopacity-value');
    const pinIconOpacityValue = this.settingsPanel.querySelector('#minimap-piniconopacity-value');
    
    const updateSettings = () => {
      this.settings.minimapBlacklist = inputs.blacklist.value;
      this.settings.top = parseFloat(inputs.top.value) || DEFAULT_SETTINGS.top;
      this.settings.width = parseFloat(inputs.width.value) || DEFAULT_SETTINGS.width;
      this.settings.maxWidth = parseFloat(inputs.maxwidth.value) || DEFAULT_SETTINGS.maxWidth;
      this.settings.heightOffset = parseFloat(inputs.heightoffset.value) || DEFAULT_SETTINGS.heightOffset;
      this.settings.rightOffset = parseFloat(inputs.rightoffset.value) || DEFAULT_SETTINGS.rightOffset;
      this.settings.sliderColor = inputs.slidercolor.value;
      this.settings.opacity = parseFloat(inputs.opacity.value) || DEFAULT_SETTINGS.opacity;
      this.settings.contentOpacity = parseFloat(inputs.contentopacity.value) || DEFAULT_SETTINGS.contentOpacity;
      this.settings.collapseOnHover = inputs.collapseonhover.checked;
      this.settings.collapseWidth = parseFloat(inputs.collapsewidth.value) || DEFAULT_SETTINGS.collapseWidth;
      this.settings.matchOpacity = parseFloat(inputs.matchopacity.value) || DEFAULT_SETTINGS.matchOpacity;
      this.settings.counterSize = parseFloat(inputs.countersize.value) || DEFAULT_SETTINGS.counterSize;
      this.settings.counterTopOffset = isNaN(parseFloat(inputs.countertopoffset.value)) ? DEFAULT_SETTINGS.counterTopOffset : parseFloat(inputs.countertopoffset.value);

      this.settings.clearCountOnClose = inputs.clearcountonclose.checked;
      this.settings.searchWordCountMin = parseInt(inputs.searchwordcountmin.value) || 0;
      this.settings.searchWordCountMax = parseInt(inputs.searchwordcountmax.value) || 0;
      this.settings.pinIconEnabled = inputs.piniconenabled.checked;
      this.settings.pinIconMode = inputs.piniconmode.value;
      this.settings.pinIconSize = parseFloat(inputs.piniconsize.value) || DEFAULT_SETTINGS.pinIconSize;
      this.settings.pinIconOpacity = parseFloat(inputs.piniconopacity.value) || DEFAULT_SETTINGS.pinIconOpacity;
      this.settings.pinIconFollowOffsetX = parseInt(inputs.piniconfollowoffsetx.value) ?? DEFAULT_SETTINGS.pinIconFollowOffsetX;
      this.settings.pinIconFollowOffsetY = parseInt(inputs.piniconfollowoffsety.value) ?? DEFAULT_SETTINGS.pinIconFollowOffsetY;
      this.settings.multiKeywordRequireAll = inputs.multikeywordrequireall.checked;
      this.settings.searchOnInput = inputs.searchoninput.checked;
      opacityValue.textContent = this.settings.opacity.toFixed(1);
      contentOpacityValue.textContent = this.settings.contentOpacity.toFixed(1);
      matchOpacityValue.textContent = this.settings.matchOpacity.toFixed(2);
      pinIconOpacityValue.textContent = this.settings.pinIconOpacity.toFixed(1);
      this.saveSettings();
      this.applySettings();
      this.setupMinimap();
      this.applyCounterStyles();
      this.updateFloatingToggleStyle();
      renderColorSchemes();
      if (this.currentSelection) this.highlightMatches();
    };
    
    Object.values(inputs).forEach(input => {
      input.addEventListener('input', updateSettings);
    });

    const followOffsetSection = this.settingsPanel.querySelector('#minimap-follow-offset-section');
    const followOffsetIcon = this.settingsPanel.querySelector('#minimap-follow-offset-icon');
    const updateFollowOffsetVisibility = () => {
      followOffsetSection.style.display = inputs.piniconmode.value === 'follow' ? 'block' : 'none';
    };
    const updateFollowOffsetPreview = () => {
      const ox = parseInt(inputs.piniconfollowoffsetx.value) || 0;
      const oy = parseInt(inputs.piniconfollowoffsety.value) || 0;
      const previewW = 120, previewH = 80;
      const iconSize = 14;
      const cx = previewW / 2;
      const cy = previewH / 2;
      const scale = 0.5;
      const ix = cx + ox * scale - iconSize / 2;
      const iy = cy + oy * scale - iconSize / 2;
      followOffsetIcon.style.left = `${Math.max(0, Math.min(previewW - iconSize, ix))}px`;
      followOffsetIcon.style.top = `${Math.max(0, Math.min(previewH - iconSize, iy))}px`;
    };
    inputs.piniconmode.addEventListener('change', updateFollowOffsetVisibility);
    inputs.piniconfollowoffsetx.addEventListener('input', updateFollowOffsetPreview);
    inputs.piniconfollowoffsety.addEventListener('input', updateFollowOffsetPreview);
    updateFollowOffsetPreview();
    
    const resetBtn = this.settingsPanel.querySelector('#minimap-reset');
    resetBtn.addEventListener('click', () => {
      this.settings = Object.assign({}, DEFAULT_SETTINGS);
      inputs.top.value = this.settings.top;
      inputs.width.value = this.settings.width;
      inputs.maxwidth.value = this.settings.maxWidth;
      inputs.heightoffset.value = this.settings.heightOffset;
      inputs.rightoffset.value = this.settings.rightOffset;
      inputs.slidercolor.value = this.settings.sliderColor;
      inputs.opacity.value = this.settings.opacity;
      inputs.contentopacity.value = this.settings.contentOpacity;
      inputs.collapseonhover.checked = this.settings.collapseOnHover;
      inputs.collapsewidth.value = this.settings.collapseWidth;
      inputs.matchopacity.value = this.settings.matchOpacity ?? DEFAULT_SETTINGS.matchOpacity;
      inputs.countersize.value = this.settings.counterSize;
      inputs.countertopoffset.value = this.settings.counterTopOffset;
      inputs.clearcountonclose.checked = this.settings.clearCountOnClose;
      inputs.piniconenabled.checked = this.settings.pinIconEnabled;
      inputs.piniconmode.value = this.settings.pinIconMode;
      inputs.piniconsize.value = this.settings.pinIconSize;
      inputs.piniconopacity.value = this.settings.pinIconOpacity;
      inputs.piniconfollowoffsetx.value = this.settings.pinIconFollowOffsetX ?? DEFAULT_SETTINGS.pinIconFollowOffsetX;
      inputs.piniconfollowoffsety.value = this.settings.pinIconFollowOffsetY ?? DEFAULT_SETTINGS.pinIconFollowOffsetY;
      inputs.multikeywordrequireall.checked = this.settings.multiKeywordRequireAll !== false;
      inputs.searchoninput.checked = this.settings.searchOnInput;
      inputs.searchwordcountmin.value = this.settings.searchWordCountMin ?? 0;
      inputs.searchwordcountmax.value = this.settings.searchWordCountMax ?? 0;
      opacityValue.textContent = this.settings.opacity.toFixed(1);
      contentOpacityValue.textContent = this.settings.contentOpacity.toFixed(1);
      matchOpacityValue.textContent = this.settings.matchOpacity.toFixed(2);
      pinIconOpacityValue.textContent = this.settings.pinIconOpacity.toFixed(1);
      // 重置悬浮按钮样式为 candy-mark 默认样式
      this.floatingStyles = [{
        id: Date.now().toString(),
        name: this.settings.floatingToggleText || 'Swift',
        styleClass: this.settings.floatingToggleStyleClass,
        customStyle: this.settings.floatingToggleCustomStyle
      }];
      this.floatingDefaultStyleId = this.floatingStyles[0].id;
      this.saveFloatingStyleData();
      this.applyFloatingCustomStyle();
      // 重置后悬浮按钮默认显示
      this.settings.floatingToggleVisible = true;
      if (this.floatingToggleWrapper) {
        this.floatingToggleWrapper.remove();
        this.floatingToggleWrapper = null;
        this.floatingToggle = null;
        this.floatingToggleText = null;
        this.floatingSearchBox = null;
      }
      this.createFloatingToggle();
      this.saveSettings();
      this.applySettings();
      if (this._applySettingsBtnStyle) this._applySettingsBtnStyle();
      renderColorSchemes();
      renderPinnedList();
    });
    

    const floatingToggleBtn = this.settingsPanel.querySelector('#minimap-showfloatingtoggle');
    // Apply current floating toggle style to the settings preview span
    const applyBtnStyle = () => {
      const el = floatingToggleBtn;
      const activeStyle = this.getActiveFloatingStyle();
      const styleClass = activeStyle ? (activeStyle.styleClass || '') : (this.settings.floatingToggleStyleClass || '');
      const customStyle = activeStyle ? (activeStyle.customStyle || '') : (this.settings.floatingToggleCustomStyle || '');
      const hasCustomStyle = !!(styleClass || customStyle);
      const text = this.settings.floatingToggleText || 'Swift';
      const fontSize = this.settings.floatingToggleFontSize || 11;
      const opacity = this.settings.floatingToggleOpacity ?? 0.6;
      el.textContent = text;

      if (hasCustomStyle) {
        el.style.cssText = `cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:${fontSize}px;opacity:${opacity};white-space:nowrap;line-height:1;padding:0;`;
        el.className = '';
        if (styleClass) el.classList.add(`swift-match-floating-style-${styleClass}`);
        // Inject scoped CSS for preview
        let previewStyleEl = document.getElementById('swift-match-settings-preview-style');
        if (!previewStyleEl) {
          previewStyleEl = document.createElement('style');
          previewStyleEl.id = 'swift-match-settings-preview-style';
          document.head.appendChild(previewStyleEl);
        }
        if (customStyle) {
          let scoped = customStyle.replace(/\.([a-zA-Z_-][\w-]*)/g, '.swift-match-floating-style-$1');
          previewStyleEl.textContent = scoped;
          const firstClass = customStyle.match(/\.([a-zA-Z_-][\w-]*)/);
          if (firstClass && !styleClass) el.classList.add(`swift-match-floating-style-${firstClass[1]}`);
        }
      } else {
        el.className = '';
        el.style.cssText = `cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:${fontSize}px;opacity:${opacity};white-space:nowrap;line-height:1;padding:2px 10px;border-radius:9999px;background-color:rgba(240,100,120,0.08);box-shadow:inset 0 0 0 1px rgba(240,120,100,0.4),0 2px 10px rgba(0,0,0,0.05);font-weight:800;background:linear-gradient(135deg,#f2709c,#ff9472,#f5af19,#f2709c);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 0 6px rgba(240,100,120,0.7)) drop-shadow(0 0 12px rgba(245,150,50,0.5));animation:hp-twilight-move 3.5s linear infinite;`;
      }
    };
    applyBtnStyle();
    this._applySettingsBtnStyle = applyBtnStyle;
    floatingToggleBtn.addEventListener('click', () => {
      if (this.floatingToggleWrapper) {
        this.floatingToggleWrapper.remove();
        this.floatingToggleWrapper = null;
        this.floatingToggle = null;
        this.floatingToggleText = null;
        this.floatingSearchBox = null;
        this.settings.floatingToggleVisible = false;
        this.saveSettings();
      } else {
        this.createFloatingToggle();
      }
    });

    // Render color schemes
    const colorSchemesContainer = this.settingsPanel.querySelector('#minimap-color-schemes');
    let _colorSchemePopup = null;
    const closeColorSchemePopup = () => {
      if (_colorSchemePopup) { _colorSchemePopup.remove(); _colorSchemePopup = null; }
    };
    const renderColorSchemes = () => {
      colorSchemesContainer.innerHTML = '';
      closeColorSchemePopup();
      const schemes = this.settings.pinColorSchemes || [];
      const presetClass = this.getCounterPresetClass().trim();

      const chipsRow = document.createElement('div');
      chipsRow.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:4px 0;';

      schemes.forEach((scheme, index) => {
        const chip = document.createElement('div');
        chip.style.cssText = `
          display:inline-flex;align-items:flex-end;cursor:pointer;
          position:relative;user-select:none;
          transition:box-shadow 0.15s ease, transform 0.1s ease;
          margin-top:14px;
          background:rgba(255,255,255,0.06);
          border-radius:8px;
          padding:2px 6px 2px 4px;
          backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
        `;
        // Text part with rounded underline (same as actual highlight)
        const textSpan = document.createElement('span');
        const matchOpacity = this.settings.matchOpacity ?? 0.6;
        const c = this.hexToRgba(scheme.borderColor, matchOpacity);
        textSpan.style.cssText = `
          margin:0 -0.2em;padding:0 0.2em;
          -webkit-box-decoration-break:clone;box-decoration-break:clone;
          background:radial-gradient(farthest-side,${c} 98%,#0000) bottom left,linear-gradient(${c} 0 0) bottom,radial-gradient(farthest-side,${c} 98%,#0000) bottom right;
          background-size:8px 8px,calc(100% - 8px) 8px;
          background-repeat:no-repeat;
          color:var(--text-normal);font-size:12px;line-height:1.4;
        `;
        textSpan.textContent = 'Preview';
        chip.appendChild(textSpan);

        // Counter badge (positioned like actual counter - above text)
        const counter = document.createElement('span');
        const counterFontSize = this.settings.counterSize;
        const counterColor = scheme.counterColor;
        let counterStyle = `
          position:absolute;
          top:var(--minimap-counter-top-offset, -10px);
          left:0;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:${counterFontSize}px;line-height:1;
          padding:0px 2px;
          white-space:nowrap;
          pointer-events:none;
        `;
        if (presetClass === 'minimap-counter-glass') {
          const isDark = document.body.classList.contains('theme-dark');
          const glassCounterColor = isDark ? '#e0dcdc' : '#aba6a6';
          counterStyle += `background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.25);box-shadow:0 2px 8px rgba(0,0,0,0.12),inset 0 1px 0 rgba(255,255,255,0.2);text-shadow:0 1px 2px rgba(0,0,0,0.3);border-radius:4px;color:${glassCounterColor};`;
        } else if (presetClass === 'minimap-counter-outlined') {
          const outlinedBorder = scheme.borderLinked !== false ? scheme.borderColor : scheme.counterBgColor;
          const outlinedColor = scheme.counterLinked !== false ? outlinedBorder : scheme.counterColor;
          counterStyle += `background:transparent;border:1.5px solid ${outlinedBorder};border-radius:4px;color:${outlinedColor};text-shadow:none;`;
        }
        counter.style.cssText = counterStyle;
        counter.textContent = `${index + 1}/${schemes.length}`;
        chip.appendChild(counter);

        chip.addEventListener('mouseenter', () => { chip.style.boxShadow = '0 0 0 2px var(--interactive-accent)'; chip.style.transform = 'scale(1.04)'; });
        chip.addEventListener('mouseleave', () => { chip.style.boxShadow = 'none'; chip.style.transform = 'none'; });

        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          closeColorSchemePopup();

          const popup = document.createElement('div');
          popup.style.cssText = `
            position:absolute;z-index:10000;
            background:var(--background-secondary);
            border:1px solid var(--background-modifier-border);
            border-radius:8px;padding:10px 12px;
            box-shadow:0 4px 16px rgba(0,0,0,0.2);
            display:flex;flex-direction:column;gap:8px;
          `;
          const containerRect = colorSchemesContainer.getBoundingClientRect();
          const panelRect = this.settingsPanel.getBoundingClientRect();
          popup.style.top = `${containerRect.bottom - panelRect.top + 4}px`;
          popup.style.left = `${Math.max(0, containerRect.left - panelRect.left)}px`;

          const updateChipStyle = () => {
            const s = this.settings.pinColorSchemes[index];
            const newC = this.hexToRgba(s.borderColor, this.settings.matchOpacity ?? 0.6);
            textSpan.style.background = `radial-gradient(farthest-side,${newC} 98%,#0000) bottom left,linear-gradient(${newC} 0 0) bottom,radial-gradient(farthest-side,${newC} 98%,#0000) bottom right`;
            textSpan.style.backgroundSize = '8px 8px,calc(100% - 8px) 8px';
            textSpan.style.backgroundRepeat = 'no-repeat';
            // Update counter style based on preset
            const currentPreset = this.settings.counterStylePreset || 'glass';
            if (currentPreset === 'glass') {
              const isDark = document.body.classList.contains('theme-dark');
              counter.style.color = isDark ? '#e0dcdc' : '#aba6a6';
              counter.style.background = 'rgba(255,255,255,0.15)';
            } else {
              const newCounterBg = s.borderLinked !== false ? s.borderColor : s.counterBgColor;
              counter.style.borderColor = newCounterBg;
              counter.style.color = s.counterLinked !== false ? newCounterBg : s.counterColor;
            }
          };

          const refreshHighlights = () => {
            this.saveSettings();
            updateChipStyle();
            this.applyCounterStyles();
            if (this.currentSelection) this.highlightMatches();
          };

          const currentPreset = this.settings.counterStylePreset || 'glass';

          // Horizontal row
          const fieldsRow = document.createElement('div');
          fieldsRow.style.cssText = 'display:flex;align-items:center;gap:6px;';

          // 下划线 (always shown)
          const underlineGroup = document.createElement('div');
          underlineGroup.style.cssText = 'display:flex;align-items:center;gap:2px;';
          underlineGroup.innerHTML = `<label style="font-size:10px;min-width:28px;">${t('underline')}</label>`;
          const underlineInput = document.createElement('input');
          underlineInput.type = 'color';
          underlineInput.value = scheme.borderColor;
          underlineInput.style.cssText = 'width:32px;height:24px;padding:0;cursor:pointer;';
          underlineInput.addEventListener('input', (ev) => {
            this.settings.pinColorSchemes[index].borderColor = ev.target.value;
            refreshHighlights();
          });
          underlineGroup.appendChild(underlineInput);
          fieldsRow.appendChild(underlineGroup);

          if (currentPreset === 'glass') {
            // 毛玻璃: 下划线 only (计数颜色固定，深浅自动切换)
          } else if (currentPreset === 'outlined') {
            // 描边气泡: 下划线 | =/≠ | 气泡边框 | =/≠ | 计数文字
            // = / ≠ toggle between 下划线 and 气泡边框
            const borderLinked = scheme.borderLinked !== false;
            const borderToggle = document.createElement('span');
            borderToggle.textContent = borderLinked ? '=' : '≠';
            borderToggle.style.cssText = `
              font-size:13px;font-weight:bold;cursor:pointer;
              color:${borderLinked ? 'var(--interactive-accent)' : 'var(--text-muted)'};
              user-select:none;padding:0 2px;
              transition:color 0.15s ease;
            `;
            borderToggle.addEventListener('mouseenter', () => { borderToggle.style.color = 'var(--interactive-accent)'; });
            borderToggle.addEventListener('mouseleave', () => { borderToggle.style.color = this.settings.pinColorSchemes[index].borderLinked !== false ? 'var(--interactive-accent)' : 'var(--text-muted)'; });
            borderToggle.addEventListener('click', () => {
              const s = this.settings.pinColorSchemes[index];
              if (s.borderLinked !== false) {
                s.borderLinked = false;
                borderToggle.textContent = '≠';
                borderToggle.style.color = 'var(--text-muted)';
                borderInput.style.opacity = '1';
              } else {
                s.borderLinked = true;
                s.counterBgColor = s.borderColor;
                borderInput.value = s.borderColor;
                borderToggle.textContent = '=';
                borderToggle.style.color = 'var(--interactive-accent)';
                borderInput.style.opacity = '0.4';
                // Also sync counter if counterLinked
                if (s.counterLinked !== false) {
                  s.counterColor = s.counterBgColor;
                  colorInput.value = s.counterBgColor;
                }
                refreshHighlights();
              }
            });
            fieldsRow.appendChild(borderToggle);

            // 气泡边框
            const borderGroup = document.createElement('div');
            borderGroup.style.cssText = 'display:flex;align-items:center;gap:2px;';
            borderGroup.innerHTML = `<label style="font-size:10px;min-width:28px;">${t('bubbleBorder')}</label>`;
            const borderInput = document.createElement('input');
            borderInput.type = 'color';
            borderInput.value = borderLinked ? scheme.borderColor : scheme.counterBgColor;
            borderInput.style.cssText = 'width:32px;height:24px;padding:0;cursor:pointer;';
            if (borderLinked) borderInput.style.opacity = '0.4';
            borderInput.addEventListener('input', (ev) => {
              if (this.settings.pinColorSchemes[index].borderLinked !== false) return;
              this.settings.pinColorSchemes[index].counterBgColor = ev.target.value;
              if (this.settings.pinColorSchemes[index].counterLinked !== false) {
                this.settings.pinColorSchemes[index].counterColor = ev.target.value;
                colorInput.value = ev.target.value;
              }
              refreshHighlights();
            });
            borderGroup.appendChild(borderInput);
            fieldsRow.appendChild(borderGroup);

            // = / ≠ toggle between 气泡边框 and 计数文字
            const linked = scheme.counterLinked !== false;
            const toggleSpan = document.createElement('span');
            toggleSpan.textContent = linked ? '=' : '≠';
            toggleSpan.style.cssText = `
              font-size:13px;font-weight:bold;cursor:pointer;
              color:${linked ? 'var(--interactive-accent)' : 'var(--text-muted)'};
              user-select:none;padding:0 2px;
              transition:color 0.15s ease;
            `;
            toggleSpan.addEventListener('mouseenter', () => { toggleSpan.style.color = 'var(--interactive-accent)'; });
            toggleSpan.addEventListener('mouseleave', () => { toggleSpan.style.color = this.settings.pinColorSchemes[index].counterLinked !== false ? 'var(--interactive-accent)' : 'var(--text-muted)'; });
            toggleSpan.addEventListener('click', () => {
              const s = this.settings.pinColorSchemes[index];
              if (s.counterLinked !== false) {
                s.counterLinked = false;
                toggleSpan.textContent = '≠';
                toggleSpan.style.color = 'var(--text-muted)';
                colorInput.style.opacity = '1';
              } else {
                s.counterLinked = true;
                s.counterColor = s.counterBgColor;
                colorInput.value = s.counterBgColor;
                toggleSpan.textContent = '=';
                toggleSpan.style.color = 'var(--interactive-accent)';
                colorInput.style.opacity = '0.4';
                refreshHighlights();
              }
            });
            fieldsRow.appendChild(toggleSpan);

            // 计数文字
            const colorGroup = document.createElement('div');
            colorGroup.style.cssText = 'display:flex;align-items:center;gap:2px;';
            colorGroup.innerHTML = `<label style="font-size:10px;min-width:28px;">${t('counterTextColor')}</label>`;
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.value = linked ? (borderLinked ? scheme.borderColor : scheme.counterBgColor) : scheme.counterColor;
            colorInput.style.cssText = 'width:32px;height:24px;padding:0;cursor:pointer;';
            if (linked) colorInput.style.opacity = '0.4';
            colorInput.addEventListener('input', (ev) => {
              if (this.settings.pinColorSchemes[index].counterLinked !== false) return;
              this.settings.pinColorSchemes[index].counterColor = ev.target.value;
              refreshHighlights();
            });
            colorGroup.appendChild(colorInput);
            fieldsRow.appendChild(colorGroup);

            // Update underlineInput to sync border when borderLinked
            underlineInput.addEventListener('input', (ev) => {
              if (this.settings.pinColorSchemes[index].borderLinked !== false) {
                this.settings.pinColorSchemes[index].counterBgColor = ev.target.value;
                borderInput.value = ev.target.value;
                if (this.settings.pinColorSchemes[index].counterLinked !== false) {
                  this.settings.pinColorSchemes[index].counterColor = ev.target.value;
                  colorInput.value = ev.target.value;
                }
              }
            });
          }

          popup.appendChild(fieldsRow);

          // Delete button
          const delRow = document.createElement('div');
          delRow.style.cssText = 'display:flex;justify-content:flex-end;margin-top:2px;';
          const deleteBtn = document.createElement('button');
          deleteBtn.style.cssText = 'font-size:11px;padding:2px 10px;cursor:pointer;color:var(--text-muted);border:1px solid var(--background-modifier-border);border-radius:4px;background:transparent;';
          deleteBtn.textContent = t('remove');
          deleteBtn.addEventListener('click', () => {
            this.settings.pinColorSchemes.splice(index, 1);
            this.saveSettings();
            closeColorSchemePopup();
            renderColorSchemes();
            if (this.currentSelection) this.highlightMatches();
          });
          delRow.appendChild(deleteBtn);
          popup.appendChild(delRow);

          this.settingsPanel.appendChild(popup);
          _colorSchemePopup = popup;
        });

        chipsRow.appendChild(chip);
      });

      // "+" add chip
      const addChip = document.createElement('div');
      addChip.style.cssText = `
        display:inline-flex;align-items:center;justify-content:center;
        width:30px;height:26px;border-radius:14px;cursor:pointer;
        border:2px dashed var(--text-muted);
        color:var(--text-muted);font-size:16px;font-weight:bold;
        transition:all 0.15s ease;user-select:none;
        background:rgba(255,255,255,0.06);
        backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
      `;
      addChip.textContent = '+';
      addChip.addEventListener('mouseenter', () => {
        addChip.style.borderColor = 'var(--interactive-accent)';
        addChip.style.color = 'var(--interactive-accent)';
        addChip.style.background = 'rgba(255,255,255,0.1)';
      });
      addChip.addEventListener('mouseleave', () => {
        addChip.style.borderColor = 'var(--text-muted)';
        addChip.style.color = 'var(--text-muted)';
        addChip.style.background = 'rgba(255,255,255,0.06)';
      });
      addChip.addEventListener('click', () => {
        const colors = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.settings.pinColorSchemes.push({
          borderColor: randomColor,
          counterBgColor: randomColor,
          counterColor: '#aba6a6',
          borderLinked: true,
          counterLinked: true
        });
        this.saveSettings();
        renderColorSchemes();
        if (this.currentSelection) this.highlightMatches();
      });
      chipsRow.appendChild(addChip);

      colorSchemesContainer.appendChild(chipsRow);
    };

    // Close popup on click inside settings panel but outside popup
    this.settingsPanel.addEventListener('click', (e) => {
      if (_colorSchemePopup && !_colorSchemePopup.contains(e.target)) {
        closeColorSchemePopup();
      }
    });

    // Render counter style preset chips
    const counterPresetChips = this.settingsPanel.querySelector('#minimap-counter-preset-chips');
    const presetOptions = [
      { value: 'glass', label: t('counterPresetGlass') },
      { value: 'outlined', label: t('counterPresetOutlined') }
    ];
    presetOptions.forEach(opt => {
      const chip = document.createElement('div');
      const isActive = this.settings.counterStylePreset === opt.value;
      chip.style.cssText = `
        display:inline-flex;align-items:center;justify-content:center;
        padding:3px 10px;border-radius:14px;cursor:pointer;
        font-size:11px;user-select:none;
        border:1.5px solid ${isActive ? 'var(--interactive-accent)' : 'var(--background-modifier-border)'};
        background:${isActive ? 'var(--interactive-accent)' : 'transparent'};
        color:${isActive ? 'var(--text-on-accent)' : 'var(--text-muted)'};
        transition:all 0.15s ease;
      `;
      chip.textContent = opt.label;
      chip.addEventListener('click', () => {
        this.settings.counterStylePreset = opt.value;
        this.saveSettings();
        this.applyCounterStyles();
        renderColorSchemes();
        // Force refresh all decorations
        this.clearHighlights();
        this.showPinnedDecorations();
        if (this.currentSelection) this.highlightMatches();
        // Update chip styles
        counterPresetChips.querySelectorAll(':scope > div').forEach((c, i) => {
          const active = presetOptions[i].value === opt.value;
          c.style.borderColor = active ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
          c.style.background = active ? 'var(--interactive-accent)' : 'transparent';
          c.style.color = active ? 'var(--text-on-accent)' : 'var(--text-muted)';
        });
      });
      chip.addEventListener('mouseenter', () => {
        if (this.settings.counterStylePreset !== opt.value) {
          chip.style.borderColor = 'var(--text-muted)';
        }
      });
      chip.addEventListener('mouseleave', () => {
        if (this.settings.counterStylePreset !== opt.value) {
          chip.style.borderColor = 'var(--background-modifier-border)';
        }
      });
      counterPresetChips.appendChild(chip);
    });

    // Render pinned list
    const pinnedListContainer = this.settingsPanel.querySelector('#minimap-pinned-list');
    const renderPinnedList = () => {
      pinnedListContainer.innerHTML = '';
      const pinnedItems = this.savedMatchLists.filter(m => m.pinned);
      if (pinnedItems.length === 0) {
        pinnedListContainer.innerHTML = `<div style="color:var(--text-muted);font-size:12px;padding:8px;">${t('noPinned')}</div>`;
        return;
      }
      // Group by file name
      const fileGroups = new Map();
      pinnedItems.forEach(item => {
        const fileName = item.fileName || t('unknownFile');
        if (!fileGroups.has(fileName)) {
          fileGroups.set(fileName, []);
        }
        fileGroups.get(fileName).push(item);
      });
      fileGroups.forEach((items, fileName) => {
        const groupHeader = document.createElement('div');
        groupHeader.style.cssText = 'font-size:11px;color:var(--text-muted);padding:4px 0 2px;font-weight:600;display:flex;align-items:center;gap:6px;';
        const headerSpan = document.createElement('span');
        headerSpan.style.cssText = 'flex:1;';
        headerSpan.textContent = fileName;
        const clearBtn = document.createElement('button');
        clearBtn.style.cssText = 'font-size:10px;padding:0 4px;cursor:pointer;color:var(--text-muted);flex-shrink:0;';
        clearBtn.title = t('clearDocPinned');
        clearBtn.textContent = t('clear');
        clearBtn.addEventListener('click', () => {
          this.savedMatchLists = this.savedMatchLists.filter(item => !(item.fileName === fileName && item.pinned));
          this.saveListData();
          this.clearHighlights();
          this.showPinnedDecorations();
          if (this.currentSelection) {
            this.highlightMatches();
          }
          renderPinnedList();
        });
        groupHeader.appendChild(headerSpan);
        groupHeader.appendChild(clearBtn);
        pinnedListContainer.appendChild(groupHeader);
        items.forEach(item => {
          const colorScheme = this.getPinnedColorScheme(item);
          const row = document.createElement('div');
          row.className = 'minimap-settings-row';
          row.style.alignItems = 'center';
          row.style.gap = '6px';
          row.style.padding = '4px 0 4px 12px';
          const colorDot = document.createElement('span');
          colorDot.style.cssText = `width:12px;height:12px;border-radius:2px;background:${colorScheme.borderColor};flex-shrink:0;`;
          const label = document.createElement('span');
          label.style.cssText = 'flex:1;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
          label.title = item.selection;
          label.textContent = item.selection;
          const removeBtn = document.createElement('button');
          removeBtn.style.cssText = 'font-size:11px;padding:0 4px;cursor:pointer;color:var(--text-muted);';
          removeBtn.title = t('remove');
          removeBtn.textContent = '×';
          removeBtn.addEventListener('click', () => {
            this.removePinnedSelection(item.selection);
            renderPinnedList();
          });
          row.appendChild(colorDot);
          row.appendChild(label);
          row.appendChild(removeBtn);
          pinnedListContainer.appendChild(row);
        });
      });
    };

    // Bind clear all counts button
    const clearAllCountsBtn = this.settingsPanel.querySelector('#minimap-clearallcounts');
    if (clearAllCountsBtn) {
      clearAllCountsBtn.addEventListener('click', () => {
        this.savedMatchLists = this.savedMatchLists.filter(item => !item.pinned);
        this.saveListData();
        this.clearHighlights();
        if (this.currentSelection) {
          this.highlightMatches();
        }
        renderPinnedList();
      });
    }

    renderColorSchemes();
    renderPinnedList();

    // 初始化折叠功能
    this.initCollapsibleSections();
  }

  closeSettingsPanel() {
    if (this._settingsPanelResizeObserver) {
      this._settingsPanelResizeObserver.disconnect();
      this._settingsPanelResizeObserver = null;
    }
    if (this._settingsPanelDragCleanup) {
      this._settingsPanelDragCleanup();
      this._settingsPanelDragCleanup = null;
    }
    if (this.settingsPanel) {
      this.settingsPanel.remove();
      this.settingsPanel = null;
    }
    this._applySettingsBtnStyle = null;
    // Clean up settings preview style
    const previewStyleEl = document.getElementById('swift-match-settings-preview-style');
    if (previewStyleEl) previewStyleEl.remove();
  }

  createFloatingToggle() {
    if (this.floatingToggle) {
      if (this.floatingToggleWrapper) {
        this.floatingToggleWrapper.remove();
        this.floatingToggleWrapper = null;
      }
      this.floatingToggle = null;
      this.floatingToggleText = null;
      this.floatingSearchBox = null;
      this.settings.floatingToggleVisible = false;
      this.saveSettings();
      return;
    }

    const size = this.settings.floatingToggleSize || 20;
    const opacity = this.settings.floatingToggleOpacity || 0.6;
    const fontSize = this.settings.floatingToggleFontSize || Math.max(10, size * 0.55);
    const paddingH = this.settings.floatingTogglePaddingH ?? 10;
    const paddingV = this.settings.floatingTogglePaddingV ?? 2;
    
    // Create wrapper container for toggle + search box
    this.floatingToggleWrapper = document.createElement('div');
    this.floatingToggleWrapper.className = 'minimap-floating-toggle-wrapper';
    const isRightSide = !!this.settings.floatingToggleRight;
    this.floatingToggleWrapper.style.cssText = `
      position: fixed;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 0;
      user-select: none;
      ${isRightSide 
        ? `right: ${this.settings.floatingToggleRight}px; left: auto;` 
        : `left: ${this.settings.floatingToggleX || 50}px; right: auto;`}
      top: ${this.settings.floatingToggleY || 100}px;
    `;
    
    // Search box - absolutely positioned so it doesn't affect toggle position
    this.floatingSearchBox = document.createElement('input');
    this.floatingSearchBox.className = 'minimap-floating-search-box';
    this.floatingSearchBox.type = 'text';
    this.floatingSearchBox.placeholder = t('searchPlaceholder');
    this.floatingSearchBox.style.cssText = `
      width: 100%;
      height: 28px;
      border: 1px solid var(--background-modifier-border);
      border-radius: 4px;
      background: var(--background-secondary);
      color: var(--text-normal);
      font-size: 12px;
      padding: 0 8px;
      outline: none;
      box-sizing: border-box;
    `;
    this.floatingSearchBox.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    this.floatingSearchBox.addEventListener('input', () => {
      if (!this.settings.searchOnInput) return;
      if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
      this._searchDebounceTimer = setTimeout(() => {
        const query = this.floatingSearchBox.value.trim();
        if (query) {
          this.currentSelection = query;
          this._exhaustiveSearchDone = false;
          this._listUserDismissed = false;
          this._keepListVisible = true;
          this.showMatchList(query, 0);
          this._keepListVisible = false;
        }
      }, 300);
    });
    this.floatingSearchBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);
        const query = this.floatingSearchBox.value.trim();
        if (query) {
          this.currentSelection = query;
          this._exhaustiveSearchDone = false;
          this._listUserDismissed = false;
          this._keepListVisible = true;
          this.showMatchList(query, 0);
          this._keepListVisible = false;
        }
      } else if (e.key === 'Escape') {
        this.floatingSearchBox.value = '';
        this.floatingSearchBox.blur();
      }
    });
    
    // Toggle button - wrapper for background
    this.floatingToggle = document.createElement('div');
    this.floatingToggle.className = 'minimap-floating-toggle';
    this.floatingToggle.style.cssText = `
      position: relative;
      padding: ${paddingV}px ${paddingH}px;
      border-radius: 9999px;
      background-color: rgba(240, 100, 120, 0.08);
      box-shadow: inset 0 0 0 1px rgba(240, 120, 100, 0.4), 0 2px 10px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      flex-shrink: 0;
      opacity: ${opacity};
      transition: transform 0.15s ease, opacity 0.2s ease;
    `;
    
    // Inner text element with gradient
    this.floatingToggleText = document.createElement('span');
    this.floatingToggleText.className = 'swift';
    const toggleText = this.settings.floatingToggleText || 'Swift';
    this.floatingToggleText.style.cssText = `
      font-weight: 800;
      background: linear-gradient(135deg, #f2709c, #ff9472, #f5af19, #f2709c);
      background-size: 250% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 6px rgba(240, 100, 120, 0.7)) drop-shadow(0 0 12px rgba(245, 150, 50, 0.5));
      animation: hp-twilight-move 3.5s linear infinite;
      font-size: ${fontSize}px;
      white-space: nowrap;
      line-height: 1;
      padding: 0;
      pointer-events: none;
      ${!this.settings.enableSelectionMatch ? 'text-decoration: line-through; text-decoration-color: rgba(240, 100, 120, 0.7);' : ''}
    `;
    this.floatingToggleText.textContent = toggleText;
    this.floatingToggle.appendChild(this.floatingToggleText);

    // Inject keyframes if not already present
    if (!document.getElementById('swift-match-twilight-keyframes')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'swift-match-twilight-keyframes';
      styleEl.textContent = `@keyframes hp-twilight-move { 0% { background-position: 0% 50%; } 100% { background-position: 250% 50%; } }`;
      document.head.appendChild(styleEl);
    }

    this.settings.floatingToggleVisible = true;
    this.saveSettings();

    this.updateFloatingToggleStyle();

    this.floatingToggleWrapper.addEventListener('mouseenter', () => {
      this.floatingToggle.style.opacity = '1';
      this.floatingToggleWrapper.style.zIndex = '100000';

      this._floatingToggleHoverTimer = setTimeout(() => {
        this._listUserDismissed = false;
        this._listTriggerElement = this.floatingToggleWrapper || null;
        const hasCachedMatches = (this.settings.enableSelectionMatch && this._cachedMatchList && this._pendingSearchText) ||
          (this._listPinnedSearchText && this._pinnedWordFileMap);
        if (hasCachedMatches) {
          if (this._listPinnedSearchText && this._pinnedWordFileMap) {
            this._pendingShowList = { searchText: this._listPinnedSearchText, matchCount: this._pinnedWordMatchCount || 0 };
            this._isListVisible = true;
            this.renderMatchList(this._pinnedWordFileMap, this._pinnedWordMatchCount || 0, false);
            this._listShownFromHover = true;
            this.positionListNearFloatingToggle();
          } else {
            this.showMatchListFromFloatingToggle();
          }
        } else if (this._recentSearches.length > 0) {
          const recentTerm = this._recentSearches[0];
          const cached = this._recentSearchCaches[recentTerm];
          if (cached && cached.fileMap && cached.fileMap.size > 0) {
            this._pendingShowList = { searchText: recentTerm, matchCount: cached.matchCount };
            this._cachedMatchList = cached.fileMap;
            this._cachedMatchListKey = recentTerm;
            this._pendingMatchCount = cached.matchCount;
            this._pendingSearchText = recentTerm;
            this._isListVisible = true;
            this.renderMatchList(cached.fileMap, cached.matchCount, false);
            this._listShownFromHover = true;
            this.positionListNearFloatingToggle();
          } else {
            this.showRecentSearchList();
            this._listShownFromHover = true;
            this.positionListNearFloatingToggle();
          }
        } else {
          this.showRecentSearchList();
          this._listShownFromHover = true;
          this.positionListNearFloatingToggle();
        }
      }, 200);
    });

    this.floatingToggleWrapper.addEventListener('mouseleave', () => {
      const op = this.settings.floatingToggleOpacity || 0.6;
      this.floatingToggle.style.opacity = op.toString();
      this.floatingToggleWrapper.style.zIndex = '99999';

      if (this._floatingToggleHoverTimer) {
        clearTimeout(this._floatingToggleHoverTimer);
        this._floatingToggleHoverTimer = null;
      }
      if (this._isListVisible && this._listShownFromHover) {
        setTimeout(() => {
          const keywordBtnHovered = this._floatingKeywordButtons.some(b => b.wrapper.matches(':hover'));
          if (this.matchList && !this.matchList.matches(':hover') && !this.floatingToggleWrapper.matches(':hover') && !keywordBtnHovered) {
            this.hideMatchList();
            this._listShownFromHover = false;
          }
        }, 100);
      }
      if (this._isListVisible && !this.isPreviewOpen) {
        setTimeout(() => {
          const listHovered = this.matchList && this.matchList.matches(':hover');
          const toggleWrapperHovered = this.floatingToggleWrapper && this.floatingToggleWrapper.matches(':hover');
          const keywordBtnHovered = this._floatingKeywordButtons.some(b => b.wrapper.matches(':hover'));
          if (!listHovered && !toggleWrapperHovered && !keywordBtnHovered) {
            this.hideMatchList();
            this._listShownFromHover = false;
          }
        }, 300);
      }
    });

    this.floatingToggle.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      
      const rect = this.floatingToggleWrapper.getBoundingClientRect();
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = rect.left;
      const startTop = rect.top;
      const currentWidth = rect.width;
      
      this.floatingToggle.style.cursor = 'grabbing';
      this.floatingToggle.style.transform = 'scale(1.1)';
      
      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - currentWidth));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 30));
        
        this.floatingToggleWrapper.style.left = `${newLeft}px`;
        this.floatingToggleWrapper.style.right = 'auto';
        this.floatingToggleWrapper.style.top = `${newTop}px`;

        // Move match list with the toggle if it's visible and triggered by toggle
        if (this._isListVisible && this._listTriggerElement === this.floatingToggleWrapper) {
          this.positionListNearFloatingToggle();
        }
      };
      
      const handleMouseUp = (upEvent) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        this.floatingToggle.style.cursor = 'pointer';
        this.floatingToggle.style.transform = 'scale(1)';
        
        const deltaX = Math.abs(upEvent.clientX - startX);
        const deltaY = Math.abs(upEvent.clientY - startY);
        
        if (deltaX < 5 && deltaY < 5) {
          this.settings.enableSelectionMatch = !this.settings.enableSelectionMatch;
          this.saveSettings();
          this.updateFloatingToggleStyle();
          if (this.currentSelection) {
            if (this.settings.enableSelectionMatch) {
              this.highlightMatches();
            } else {
              this.hideMatchList();
              this.updateFloatingToggleBadge(0, 0);
            }
          }
        }
        
        const wrapperRect = this.floatingToggleWrapper.getBoundingClientRect();
        const toggleCenterX = wrapperRect.left + wrapperRect.width / 2;
        const isRightSide = toggleCenterX > window.innerWidth / 2;
        
        if (isRightSide) {
          const rightVal = window.innerWidth - wrapperRect.right;
          this.floatingToggleWrapper.style.right = `${rightVal}px`;
          this.floatingToggleWrapper.style.left = 'auto';
          this.settings.floatingToggleRight = rightVal;
          delete this.settings.floatingToggleX;
        } else {
          this.settings.floatingToggleX = parseInt(this.floatingToggleWrapper.style.left);
          delete this.settings.floatingToggleRight;
        }
        this.settings.floatingToggleY = parseInt(this.floatingToggleWrapper.style.top);
        this.saveSettings();
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    this.floatingToggle.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showFloatingContextMenu(e.clientX, e.clientY);
    });

    this.floatingToggle.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -1 : 1;
        let newSize = (this.settings.floatingToggleSize || 20) + delta;
        newSize = Math.max(10, Math.min(40, newSize));
        
        this.settings.floatingToggleSize = newSize;
        if (this.floatingToggleText) {
          this.floatingToggleText.style.fontSize = `${Math.max(10, newSize * 0.55)}px`;
          this.settings.floatingToggleFontSize = Math.max(10, newSize * 0.55);
        }
        this.saveSettings();
      } else if (e.altKey) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        let newOpacity = (this.settings.floatingToggleOpacity || 0.6) + delta;
        newOpacity = Math.max(0.1, Math.min(1, newOpacity));
        
        this.settings.floatingToggleOpacity = newOpacity;
        this.floatingToggle.style.opacity = newOpacity.toString();
        this.saveSettings();
      }
    }, { passive: false });

    this.floatingToggle.addEventListener('dblclick', (e) => {
      e.preventDefault();
      this.floatingToggle.remove();
      this.floatingToggle = null;
      this.floatingToggleText = null;
      this.settings.floatingToggleVisible = false;
      this.saveSettings();
    });

    this.floatingToggleWrapper.appendChild(this.floatingToggle);
    document.body.appendChild(this.floatingToggleWrapper);
  }

  updateFloatingToggleStyle() {
    if (!this.floatingToggle) return;
    const textEl = this.floatingToggleText;
    if (!textEl) return;
    const toggleText = this.settings.floatingToggleText || 'Swift';
    textEl.textContent = toggleText;

    // 优先从data.json获取当前激活样式
    const activeStyle = this.getActiveFloatingStyle();
    const currentStyleClass = activeStyle ? (activeStyle.styleClass || '') : (this.settings.floatingToggleStyleClass || '');
    const currentCustomStyle = activeStyle ? (activeStyle.customStyle || '') : (this.settings.floatingToggleCustomStyle || '');

    const hasCustomStyle = !!(currentStyleClass || currentCustomStyle);

    if (hasCustomStyle) {
      // When custom style is applied, remove inline styles so CSS classes take full control
      const fontSize = this.settings.floatingToggleFontSize || 11;
      const opacity = this.settings.floatingToggleOpacity ?? 0.6;

      // Reset toggle inline styles to minimal, let CSS classes control appearance
      this.floatingToggle.style.cssText = `
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        flex-shrink: 0;
        opacity: ${opacity};
        transition: transform 0.15s ease, opacity 0.2s ease;
      `;

      // Reset text inline styles, let CSS classes control appearance
      textEl.style.cssText = `
        font-size: ${fontSize}px;
        white-space: nowrap;
        line-height: 1;
        padding: 0;
        pointer-events: none;
        ${!this.settings.enableSelectionMatch ? 'text-decoration: line-through; text-decoration-color: rgba(240, 100, 120, 0.7);' : ''}
      `;
    } else {
      // Default styles when no custom style is applied
      const fontSize = this.settings.floatingToggleFontSize || 11;
      const paddingH = this.settings.floatingTogglePaddingH ?? 10;
      const paddingV = this.settings.floatingTogglePaddingV ?? 2;
      const opacity = this.settings.floatingToggleOpacity ?? 0.6;

      this.floatingToggle.style.cssText = `
        position: relative;
        padding: ${paddingV}px ${paddingH}px;
        border-radius: 9999px;
        background-color: rgba(240, 100, 120, 0.08);
        box-shadow: inset 0 0 0 1px rgba(240, 120, 100, 0.4), 0 2px 10px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        flex-shrink: 0;
        opacity: ${opacity};
        transition: transform 0.15s ease, opacity 0.2s ease;
      `;

      textEl.style.cssText = `
        font-weight: 800;
        background: linear-gradient(135deg, #f2709c, #ff9472, #f5af19, #f2709c);
        background-size: 250% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 6px rgba(240, 100, 120, 0.7)) drop-shadow(0 0 12px rgba(245, 150, 50, 0.5));
        animation: hp-twilight-move 3.5s linear infinite;
        font-size: ${fontSize}px;
        white-space: nowrap;
        line-height: 1;
        padding: 0;
        pointer-events: none;
        ${!this.settings.enableSelectionMatch ? 'text-decoration: line-through; text-decoration-color: rgba(240, 100, 120, 0.7);' : ''}
      `;
    }

    // Apply style class
    // Remove previous style classes
    this.floatingToggle.className = this.floatingToggle.className
      .split(' ')
      .filter(c => !c.startsWith('swift-match-floating-style-'))
      .join(' ')
      .trim();
    if (currentStyleClass) {
      this.floatingToggle.classList.add(`swift-match-floating-style-${currentStyleClass}`);
    }

    // Apply custom style
    this.applyFloatingCustomStyle();
    // Only apply firstClass from CSS when no explicit styleClass is selected
    if (!currentStyleClass && currentCustomStyle) {
      const firstClass = currentCustomStyle.match(/\.([a-zA-Z_-][\w-]*)/);
      if (firstClass) {
        this.floatingToggle.classList.add(`swift-match-floating-style-${firstClass[1]}`);
      }
    }
    
    // Update badge visibility based on enableSelectionMatch
    if (!this.settings.enableSelectionMatch) {
      this._listShownFromHover = false;
      const toggleText = this.settings.floatingToggleText || 'Swift';
      textEl.textContent = toggleText;
    } else if (this._cachedMatchList && this._cachedMatchList.size > 0) {
      this.updateFloatingToggleBadge(this._cachedMatchList.size, this._pendingMatchCount || 0);
    }
  }

  showFloatingContextMenu(x, y) {
    this.closeFloatingContextMenu();

    const menu = document.createElement('div');
    menu.className = 'swift-match-context-menu';
    menu.style.cssText = `
      position: fixed;
      z-index: 100001;
      background: var(--background-secondary);
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      padding: 4px 0;
      min-width: 140px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      font-size: 12px;
    `;

    const items = [
      { label: t('editFloating'), action: () => { this.closeFloatingContextMenu(); this.showFloatingEditPanel(); } },
      { label: t('settings'), action: () => { this.closeFloatingContextMenu(); const mockEvent = { clientX: x, clientY: y, preventDefault: () => {}, stopPropagation: () => {} }; this.showSettingsPanel(mockEvent); } },
      { type: 'separator' },
      { label: t('hideFloating'), action: () => { this.closeFloatingContextMenu(); if (this.floatingToggleWrapper) { this.floatingToggleWrapper.remove(); this.floatingToggleWrapper = null; } this.floatingToggle = null; this.floatingToggleText = null; this.floatingSearchBox = null; this.settings.floatingToggleVisible = false; this.saveSettings(); } }
    ];

    items.forEach(item => {
      if (item.type === 'separator') {
        const sep = document.createElement('div');
        sep.style.cssText = 'height:1px;background:var(--background-modifier-border);margin:4px 8px;';
        menu.appendChild(sep);
        return;
      }
      const el = document.createElement('div');
      el.textContent = item.label;
      el.style.cssText = `
        padding: 6px 16px;
        cursor: pointer;
        color: var(--text-normal);
        white-space: nowrap;
        border-radius: 3px;
        margin: 0 4px;
      `;
      el.addEventListener('mouseenter', () => { el.style.background = 'var(--background-modifier-hover)'; });
      el.addEventListener('mouseleave', () => { el.style.background = ''; });
      el.addEventListener('click', (e) => { e.stopPropagation(); item.action(); });
      menu.appendChild(el);
    });

    // Position menu
    const menuW = 160, menuH = items.length * 32;
    let left = x, top = y;
    if (left + menuW > window.innerWidth) left = window.innerWidth - menuW - 8;
    if (top + menuH > window.innerHeight) top = window.innerHeight - menuH - 8;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    document.body.appendChild(menu);
    this._floatingContextMenu = menu;

    setTimeout(() => {
      this._floatingContextMenuCloser = (e) => {
        if (!menu.contains(e.target)) this.closeFloatingContextMenu();
      };
      document.addEventListener('mousedown', this._floatingContextMenuCloser);
    }, 50);
  }

  closeFloatingContextMenu() {
    if (this._floatingContextMenuCloser) {
      document.removeEventListener('mousedown', this._floatingContextMenuCloser);
      this._floatingContextMenuCloser = null;
    }
    if (this._floatingContextMenu) {
      this._floatingContextMenu.remove();
      this._floatingContextMenu = null;
    }
  }

  showFloatingEditPanel() {
    this.closeFloatingEditPanel();

    const { Modal } = require('obsidian');
    const modal = new Modal(this.app);
    modal.titleEl.textContent = t('editTitle');
    modal.contentEl.addClass('swift-match-edit-modal');

    const currentLabel = this.settings.floatingToggleText || 'Swift';

    // 横向排列：显示文字、字体大小、水平内边距、垂直内边距、透明度
    const inlineRow = modal.contentEl.createDiv();
    inlineRow.style.cssText = 'display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;';

    const labelDiv = inlineRow.createDiv();
    labelDiv.style.cssText = 'flex:1;min-width:100px;';
    const labelName = labelDiv.createEl('label');
    labelName.textContent = t('toggleText');
    labelName.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const labelInput = labelDiv.createEl('input');
    labelInput.type = 'text';
    labelInput.placeholder = 'Swift';
    labelInput.value = currentLabel;
    labelInput.style.cssText = 'width:100%;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    const fontSizeDiv = inlineRow.createDiv();
    fontSizeDiv.style.cssText = 'min-width:70px;';
    const fontSizeLabel = fontSizeDiv.createEl('label');
    fontSizeLabel.textContent = t('toggleFontSize');
    fontSizeLabel.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const fontSizeInput = fontSizeDiv.createEl('input');
    fontSizeInput.type = 'number';
    fontSizeInput.min = 8; fontSizeInput.max = 24; fontSizeInput.step = 1;
    fontSizeInput.value = this.settings.floatingToggleFontSize || 11;
    fontSizeInput.style.cssText = 'width:70px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    const padHDiv = inlineRow.createDiv();
    padHDiv.style.cssText = 'min-width:70px;';
    const padHLabel = padHDiv.createEl('label');
    padHLabel.textContent = t('togglePaddingH');
    padHLabel.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const padHInput = padHDiv.createEl('input');
    padHInput.type = 'number'; padHInput.min = 0; padHInput.max = 40; padHInput.step = 1;
    padHInput.value = this.settings.floatingTogglePaddingH ?? 10;
    padHInput.style.cssText = 'width:70px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    const padVDiv = inlineRow.createDiv();
    padVDiv.style.cssText = 'min-width:70px;';
    const padVLabel = padVDiv.createEl('label');
    padVLabel.textContent = t('togglePaddingV');
    padVLabel.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const padVInput = padVDiv.createEl('input');
    padVInput.type = 'number'; padVInput.min = 0; padVInput.max = 20; padVInput.step = 1;
    padVInput.value = this.settings.floatingTogglePaddingV ?? 2;
    padVInput.style.cssText = 'width:70px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    const opacityDiv = inlineRow.createDiv();
    opacityDiv.style.cssText = 'min-width:70px;';
    const opacityLabel = opacityDiv.createEl('label');
    opacityLabel.textContent = t('toggleOpacity');
    opacityLabel.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const opacityInput = opacityDiv.createEl('input');
    opacityInput.type = 'number'; opacityInput.min = 0.1; opacityInput.max = 1; opacityInput.step = 0.05;
    opacityInput.value = this.settings.floatingToggleOpacity ?? 0.6;
    opacityInput.style.cssText = 'width:70px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    // 自定义样式区域：一个CSS文本框 + 点击选择预览
    const stylesHeader = modal.contentEl.createDiv();
    stylesHeader.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin-bottom:4px;';
    const stylesTitle = stylesHeader.createEl('label');
    stylesTitle.textContent = t('customStyle');
    stylesTitle.style.cssText = 'font-weight:bold;font-size:0.9em;';
    const stylesLink = stylesHeader.createEl('a');
    stylesLink.textContent = t('getMoreStyles');
    stylesLink.href = 'https://github.com/dlsdgj/obsidian-regex-css-highlighter/discussions/1';
    stylesLink.target = '_blank';
    stylesLink.style.cssText = 'font-size:0.75em;color:var(--text-accent);';

    const stylesHint = modal.contentEl.createEl('div');
    stylesHint.textContent = t('styleHint');
    stylesHint.style.cssText = 'font-size:0.75em;color:var(--text-muted);margin-bottom:4px;';

    // 注入预览用的style标签
    let previewStyleEl = document.getElementById('swift-match-preview-style');
    if (!previewStyleEl) {
      previewStyleEl = document.createElement('style');
      previewStyleEl.id = 'swift-match-preview-style';
      document.head.appendChild(previewStyleEl);
    }

    // CSS文本框
    const cssTextarea = modal.contentEl.createEl('textarea');
    cssTextarea.value = this.settings.floatingToggleCustomStyle || '';
    cssTextarea.placeholder = `.Swift {\n  background: transparent;\n  color: #534ab7;\n  border: 1px dashed #7f77dd;\n  border-radius: 3px;\n  padding: 1px 5px;\n}\n\n.Swift2 {\n  background: #e8f5e9;\n  color: #2e7d32;\n  border-radius: 12px;\n  padding: 2px 12px;\n}`;
    cssTextarea.rows = 10;
    cssTextarea.style.cssText = 'width:100%;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:12px;font-family:monospace;resize:vertical;line-height:1.5;margin-bottom:8px;';

    // 预览选择区域
    const previewAreaLabel = modal.contentEl.createEl('div');
    previewAreaLabel.textContent = t('preview') + ' - ' + t('clickToSelect') + '：';
    previewAreaLabel.style.cssText = 'font-weight:600;margin-bottom:6px;font-size:0.9em;';

    const previewArea = modal.contentEl.createDiv();
    previewArea.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;padding:12px;border-radius:6px;border:1px solid var(--background-modifier-border);background:var(--background-secondary);';

    // 当前选中的class
    let selectedClass = this.settings.floatingToggleStyleClass || '';

    // 解析CSS中的class名
    const parseCSSClasses = (cssText) => {
      const classes = [];
      const regex = /\.([a-zA-Z0-9_-]+)(?:::[\w-]+|:[\w-]+)*\s*\{/g;
      let match;
      const seen = new Set();
      while ((match = regex.exec(cssText)) !== null) {
        const cls = match[1];
        if (!seen.has(cls)) {
          seen.add(cls);
          classes.push(cls);
        }
      }
      return classes;
    };

    // 构建预览
    const buildPreviews = () => {
      previewArea.empty();
      const cssText = cssTextarea.value;
      // 作用域化CSS并注入预览
      let scoped = cssText.replace(/\.([a-zA-Z_-][\w-]*)/g, '.swift-match-floating-style-$1');
      previewStyleEl.textContent = scoped;

      const classes = parseCSSClasses(cssText);
      if (classes.length === 0) {
        const hint = previewArea.createEl('div');
        hint.textContent = t('noStyles');
        hint.style.cssText = 'color:var(--text-muted);font-size:12px;';
        return;
      }

      classes.forEach(cls => {
        const wrapper = previewArea.createDiv();
        wrapper.style.cssText = `
          display:flex;flex-direction:column;align-items:center;gap:4px;
          cursor:pointer;padding:6px;border-radius:6px;
          border:2px solid ${cls === selectedClass ? 'var(--interactive-accent)' : 'transparent'};
          transition:border-color 0.15s;
        `;
        wrapper.addEventListener('mouseenter', () => {
          if (cls !== selectedClass) wrapper.style.borderColor = 'var(--background-modifier-border)';
        });
        wrapper.addEventListener('mouseleave', () => {
          wrapper.style.borderColor = cls === selectedClass ? 'var(--interactive-accent)' : 'transparent';
        });

        const previewEl = wrapper.createEl('div');
        previewEl.className = `swift-match-floating-style-${cls}`;
        previewEl.textContent = labelInput.value.trim() || currentLabel;
        previewEl.style.cssText = 'position:static;cursor:pointer;z-index:auto;opacity:1;';
        wrapper.appendChild(previewEl);

        const nameEl = wrapper.createEl('div');
        nameEl.textContent = `.${cls}`;
        nameEl.style.cssText = 'font-size:10px;color:var(--text-muted);font-family:monospace;';

        // 默认标记
        if (cls === selectedClass) {
          const defaultBadge = wrapper.createEl('div');
          defaultBadge.textContent = t('defaultStyle');
          defaultBadge.style.cssText = 'font-size:9px;color:var(--interactive-accent);font-weight:600;';
        }

        wrapper.addEventListener('click', () => {
          selectedClass = cls;
          buildPreviews();
        });

        previewArea.appendChild(wrapper);
      });
    };

    buildPreviews();

    // 实时更新预览
    const updatePreview = () => { buildPreviews(); };
    labelInput.addEventListener('input', updatePreview);
    cssTextarea.addEventListener('input', updatePreview);

    // 按钮容器
    const buttonContainer = modal.contentEl.createEl('div');
    buttonContainer.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';
    const cancelBtn = buttonContainer.createEl('button');
    cancelBtn.textContent = t('cancel');
    cancelBtn.style.padding = '6px 16px';
    cancelBtn.addEventListener('click', () => modal.close());
    const confirmBtn = buttonContainer.createEl('button');
    confirmBtn.textContent = t('confirm');
    confirmBtn.style.cssText = 'padding:6px 16px;background-color:var(--interactive-accent);color:white;border:none;border-radius:4px;cursor:pointer;';
    confirmBtn.addEventListener('click', async () => {
      this.settings.floatingToggleText = labelInput.value.trim() || 'Swift';
      this.settings.floatingToggleFontSize = parseInt(fontSizeInput.value) || 11;
      this.settings.floatingTogglePaddingH = parseInt(padHInput.value) || 10;
      this.settings.floatingTogglePaddingV = parseInt(padVInput.value) || 2;
      this.settings.floatingToggleOpacity = parseFloat(opacityInput.value) || 0.6;
      this.settings.floatingToggleStyleClass = selectedClass;
      this.settings.floatingToggleCustomStyle = cssTextarea.value.trim();

      // 保存到data.json
      this.floatingStyles = [{
        id: this.floatingDefaultStyleId || Date.now().toString(),
        name: 'default',
        styleClass: selectedClass,
        customStyle: cssTextarea.value.trim()
      }];
      this.floatingDefaultStyleId = this.floatingStyles[0].id;

      await this.saveSettings();
      await this.saveFloatingStyleData();
      this.applyFloatingCustomStyle();
      this.updateFloatingToggleStyle();
      if (this._applySettingsBtnStyle) this._applySettingsBtnStyle();
      modal.close();
    });

    modal.open();
    this._floatingEditModal = modal;
  }

  applyFloatingCustomStyle() {
    const existingEl = document.getElementById('swift-match-custom-style');
    if (existingEl) existingEl.remove();
    // 优先从data.json获取当前激活样式
    const activeStyle = this.getActiveFloatingStyle();
    const customStyle = activeStyle ? (activeStyle.customStyle || '') : (this.settings.floatingToggleCustomStyle || '');
    if (!customStyle.trim()) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'swift-match-custom-style';
    let scoped = customStyle.replace(/\.([a-zA-Z_-][\w-]*)/g, '.swift-match-floating-style-$1');
    styleEl.textContent = scoped;
    document.head.appendChild(styleEl);
  }

  closeFloatingEditPanel() {
    if (this._floatingEditModal) {
      this._floatingEditModal.close();
      this._floatingEditModal = null;
    }
    // 清理所有预览样式
    document.querySelectorAll('[id^="swift-match-preview-style-"]').forEach(el => el.remove());
    const previewEl = document.getElementById('swift-match-preview-style');
    if (previewEl) previewEl.remove();
  }

  createFloatingKeywordButton(keyword, fileMap, matchCount) {
    // Remove existing button for the same keyword
    this.removeFloatingKeywordButton(keyword);

    // Cache search results
    if (fileMap && fileMap.size > 0) {
      this._recentSearchCaches[keyword] = { fileMap, matchCount };
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'swift-match-keyword-btn-wrapper';
    wrapper.style.cssText = `
      position: fixed;
      z-index: 99998;
      display: flex;
      align-items: center;
      user-select: none;
      left: 50px;
      top: ${100 + this._floatingKeywordButtons.length * 36}px;
    `;

    const btn = document.createElement('div');
    btn.className = 'swift-match-keyword-btn';
    btn.style.cssText = `
      position: relative;
      padding: 2px 10px;
      border-radius: 9999px;
      background-color: rgba(240, 100, 120, 0.08);
      box-shadow: inset 0 0 0 1px rgba(240, 120, 100, 0.4), 0 2px 10px rgba(0, 0, 0, 0.05);
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      opacity: 0.7;
      transition: transform 0.15s ease, opacity 0.2s ease;
    `;

    const textEl = document.createElement('span');
    const displayText = keyword.length > 12 ? keyword.substring(0, 12) + '…' : keyword;
    textEl.style.cssText = `
      font-weight: 800;
      background: linear-gradient(135deg, #f2709c, #ff9472, #f5af19, #f2709c);
      background-size: 250% 100%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 6px rgba(240, 100, 120, 0.7)) drop-shadow(0 0 12px rgba(245, 150, 50, 0.5));
      animation: hp-twilight-move 3.5s linear infinite;
      font-size: 11px;
      white-space: nowrap;
      line-height: 1;
      padding: 0;
      pointer-events: none;
    `;
    textEl.textContent = displayText;
    btn.appendChild(textEl);
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    const btnData = {
      wrapper,
      btn,
      textEl,
      term: keyword,
      fileMap,
      matchCount,
      position: { left: 50, top: 100 + this._floatingKeywordButtons.length * 36 }
    };
    this._floatingKeywordButtons.push(btnData);

    // Apply saved styles if any
    if (this.settings.keywordButtonStyles?.[keyword]) {
      this.applyKeywordButtonStyle(keyword);
    }

    // Persist floating keyword data
    this._updateFloatingKeywordsData();

    // Hover: show search window
    let hoverTimer = null;
    wrapper.addEventListener('mouseenter', () => {
      btn.style.opacity = '1';
      wrapper.style.zIndex = '100000';
      hoverTimer = setTimeout(() => {
        this._listUserDismissed = false;
        const cached = this._recentSearchCaches[keyword];
        if (cached && cached.fileMap && cached.fileMap.size > 0) {
          this._cachedMatchList = cached.fileMap;
          this._cachedMatchListKey = keyword;
          this._pendingMatchCount = cached.matchCount;
          this._pendingShowList = { searchText: keyword, matchCount: cached.matchCount };
          this._listTriggerElement = wrapper;
          this._isListVisible = true;
          this.renderMatchList(cached.fileMap, cached.matchCount, false);
          this._listShownFromHover = true;
          this.positionListNearElement(wrapper);
        } else {
          this._listTriggerElement = wrapper;
          this.currentSelection = keyword;
          this.highlightMatches();
        }
      }, 200);
    });

    wrapper.addEventListener('mouseleave', () => {
      btn.style.opacity = '0.7';
      wrapper.style.zIndex = '99998';
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      if (this._isListVisible && this._listShownFromHover) {
        setTimeout(() => {
          const listHovered = this.matchList && this.matchList.matches(':hover');
          const btnHovered = wrapper.matches(':hover');
          if (!listHovered && !btnHovered) {
            this.hideMatchList();
            this._listShownFromHover = false;
          }
        }, 100);
      }
    });

    // Drag support
    let isDragging = false;
    let hasDragged = false;
    let startX, startY, startLeft, startTop;

    const onDragMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - wrapper.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - 30));
      wrapper.style.left = `${newLeft}px`;
      wrapper.style.top = `${newTop}px`;
      btnData.position.left = newLeft;
      btnData.position.top = newTop;

      // Move match list with the keyword button if it's visible and triggered by this button
      if (this._isListVisible && this._listTriggerElement === wrapper) {
        this.positionListNearElement(wrapper);
      }
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      btn.style.cursor = 'grab';
      btn.style.transform = '';
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
    };

    btn.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      const rect = wrapper.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      btn.style.cursor = 'grabbing';
      btn.style.transform = 'scale(1.05)';
      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
    });

    // Right-click context menu
    wrapper.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showKeywordContextMenu(e.clientX, e.clientY, keyword);
    });
  }

  showKeywordContextMenu(x, y, keyword) {
    this.closeFloatingContextMenu();

    const menu = document.createElement('div');
    menu.className = 'swift-match-context-menu';
    menu.style.cssText = `
      position: fixed;
      z-index: 100001;
      background: var(--background-secondary);
      border: 1px solid var(--background-modifier-border);
      border-radius: 6px;
      padding: 4px 0;
      min-width: 120px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      font-size: 12px;
    `;

    const items = [
      { label: t('editFloating'), action: () => { this.closeFloatingContextMenu(); this.showKeywordEditPanel(keyword); } },
      { type: 'separator' },
      { label: t('closeKeyword'), action: () => { this.closeFloatingContextMenu(); this.removeFloatingKeywordButton(keyword); } }
    ];

    items.forEach(item => {
      if (item.type === 'separator') {
        const sep = document.createElement('div');
        sep.style.cssText = 'height:1px;background:var(--background-modifier-border);margin:4px 8px;';
        menu.appendChild(sep);
        return;
      }
      const el = document.createElement('div');
      el.textContent = item.label;
      el.style.cssText = `
        padding: 6px 16px;
        cursor: pointer;
        color: var(--text-normal);
        white-space: nowrap;
        border-radius: 3px;
        margin: 0 4px;
      `;
      el.addEventListener('mouseenter', () => { el.style.background = 'var(--background-modifier-hover)'; });
      el.addEventListener('mouseleave', () => { el.style.background = ''; });
      el.addEventListener('click', (e) => { e.stopPropagation(); item.action(); });
      menu.appendChild(el);
    });

    let left = x, top = y;
    if (left + 140 > window.innerWidth) left = window.innerWidth - 148;
    if (top + 80 > window.innerHeight) top = window.innerHeight - 88;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;

    document.body.appendChild(menu);
    this._floatingContextMenu = menu;

    setTimeout(() => {
      this._floatingContextMenuCloser = (e) => {
        if (!menu.contains(e.target)) this.closeFloatingContextMenu();
      };
      document.addEventListener('mousedown', this._floatingContextMenuCloser);
    }, 50);
  }

  showKeywordEditPanel(keyword) {
    const { Modal } = require('obsidian');
    const modal = new Modal(this.app);
    modal.titleEl.textContent = `${t('editFloating')} - ${keyword}`;
    modal.contentEl.addClass('swift-match-edit-modal');

    const btnData = this._floatingKeywordButtons.find(b => b.term === keyword);
    if (!btnData) { modal.close(); return; }

    const savedStyles = this.settings.keywordButtonStyles?.[keyword] || {};
    const currentStyleClass = savedStyles.styleClass || '';
    const currentCustomStyle = savedStyles.customStyle || '';
    const currentLabel = savedStyles.label || keyword;

    // 显示文字
    const labelDiv = modal.contentEl.createDiv();
    labelDiv.style.marginBottom = '12px';
    const labelName = labelDiv.createEl('label');
    labelName.textContent = t('toggleText');
    labelName.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const labelInput = labelDiv.createEl('input');
    labelInput.type = 'text';
    labelInput.placeholder = keyword;
    labelInput.value = currentLabel;
    labelInput.style.cssText = 'width:100%;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    // 样式类名
    const styleClassDiv = modal.contentEl.createDiv();
    styleClassDiv.style.marginBottom = '12px';
    const styleClassName = styleClassDiv.createEl('label');
    styleClassName.textContent = t('styleClass');
    styleClassName.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const styleClassInput = styleClassDiv.createEl('input');
    styleClassInput.type = 'text';
    styleClassInput.placeholder = 'CSS class name (e.g. my-style)';
    styleClassInput.value = currentStyleClass;
    styleClassInput.style.cssText = 'width:100%;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:14px;';

    // 自定义样式
    const customStyleDiv = modal.contentEl.createDiv();
    customStyleDiv.style.marginBottom = '16px';
    const customStyleName = customStyleDiv.createEl('label');
    customStyleName.textContent = t('customStyle');
    customStyleName.style.cssText = 'display:block;margin-bottom:4px;font-weight:bold;font-size:0.9em;';
    const customStyleHint = customStyleDiv.createEl('div');
    customStyleHint.textContent = t('styleHint');
    customStyleHint.style.cssText = 'font-size:0.75em;color:var(--text-muted);margin-bottom:4px;';
    const customStyleInput = customStyleDiv.createEl('textarea');
    customStyleInput.placeholder = `.keyword-btn {\n  background: transparent;\n  color: #534ab7;\n  border: 1px dashed #7f77dd;\n  border-radius: 3px;\n  padding: 1px 5px;\n}`;
    customStyleInput.value = currentCustomStyle;
    customStyleInput.style.cssText = 'width:100%;min-height:160px;padding:8px;border:1px solid var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-normal);font-size:13px;font-family:monospace;resize:vertical;';

    // 预览区域
    const previewDiv = modal.contentEl.createDiv();
    previewDiv.style.cssText = 'margin-bottom:16px;padding:12px;border:1px dashed var(--background-modifier-border);border-radius:6px;text-align:center;';
    const previewLabel = previewDiv.createEl('div');
    previewLabel.textContent = t('preview');
    previewLabel.style.cssText = 'font-size:0.8em;color:var(--text-muted);margin-bottom:8px;';
    const previewSpan = previewDiv.createEl('span');
    previewSpan.textContent = currentLabel;
    previewSpan.style.cssText = 'display:inline-block;padding:4px 8px;';

    const previewStyleId = `swift-match-keyword-preview-style-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}`;

    const applyPreviewStyle = (styleText) => {
      const existingEl = document.getElementById(previewStyleId);
      if (existingEl) existingEl.remove();
      if (!styleText.trim()) return;
      const styleEl = document.createElement('style');
      styleEl.id = previewStyleId;
      let scoped = styleText.replace(/\.([a-zA-Z_-][\w-]*)/g, '.swift-match-keyword-style-$1');
      styleEl.textContent = scoped;
      document.head.appendChild(styleEl);
    };

    const updatePreview = () => {
      const newLabel = labelInput.value.trim() || keyword;
      const newClass = styleClassInput.value.trim();
      const newCustomStyle = customStyleInput.value.trim();
      previewSpan.textContent = newLabel;
      previewSpan.className = '';
      previewSpan.style.cssText = 'display:inline-block;padding:4px 8px;';
      if (newClass) {
        previewSpan.classList.add(`swift-match-keyword-style-${newClass}`);
      }
      if (newCustomStyle) {
        applyPreviewStyle(newCustomStyle);
        const firstClass = newCustomStyle.match(/\.([a-zA-Z_-][\w-]*)/);
        if (firstClass) {
          previewSpan.classList.add(`swift-match-keyword-style-${firstClass[1]}`);
        }
      } else {
        const existingEl = document.getElementById(previewStyleId);
        if (existingEl) existingEl.remove();
      }
    };

    labelInput.addEventListener('input', updatePreview);
    styleClassInput.addEventListener('input', updatePreview);
    customStyleInput.addEventListener('input', updatePreview);
    updatePreview();

    // 按钮容器
    const buttonContainer = modal.contentEl.createEl('div');
    buttonContainer.style.cssText = 'display:flex;justify-content:flex-end;gap:8px;';
    const cancelBtn = buttonContainer.createEl('button');
    cancelBtn.textContent = t('cancel');
    cancelBtn.style.padding = '6px 16px';
    cancelBtn.addEventListener('click', () => modal.close());
    const confirmBtn = buttonContainer.createEl('button');
    confirmBtn.textContent = t('confirm');
    confirmBtn.style.cssText = 'padding:6px 16px;background-color:var(--interactive-accent);color:white;border:none;border-radius:4px;cursor:pointer;';
    confirmBtn.addEventListener('click', async () => {
      const newLabel = labelInput.value.trim() || keyword;
      const newStyleClass = styleClassInput.value.trim();
      const newCustomStyle = customStyleInput.value.trim();

      // Save to settings
      if (!this.settings.keywordButtonStyles) this.settings.keywordButtonStyles = {};
      this.settings.keywordButtonStyles[keyword] = {
        label: newLabel,
        styleClass: newStyleClass,
        customStyle: newCustomStyle
      };
      await this.saveSettings();

      // Apply to button
      this.applyKeywordButtonStyle(keyword);
      modal.close();
    });

    modal.open();

    // Clean up preview style on modal close
    const origClose = modal.close.bind(modal);
    modal.close = () => {
      const previewEl = document.getElementById(previewStyleId);
      if (previewEl) previewEl.remove();
      origClose();
    };
  }

  applyKeywordButtonStyle(keyword) {
    const btnData = this._floatingKeywordButtons.find(b => b.term === keyword);
    if (!btnData) return;

    const savedStyles = this.settings.keywordButtonStyles?.[keyword] || {};
    const hasCustomStyle = !!(savedStyles.styleClass || savedStyles.customStyle);

    // Update label
    const displayLabel = savedStyles.label || keyword;
    const displayText = displayLabel.length > 12 ? displayLabel.substring(0, 12) + '…' : displayLabel;
    btnData.textEl.textContent = displayText;

    if (hasCustomStyle) {
      // Remove inline styles that conflict with custom CSS
      btnData.btn.style.cssText = `
        position: relative;
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        opacity: 0.7;
        transition: transform 0.15s ease, opacity 0.2s ease;
      `;
      btnData.textEl.style.cssText = `
        font-size: 11px;
        white-space: nowrap;
        line-height: 1;
        padding: 0;
        pointer-events: none;
      `;

      // Apply style class
      btnData.btn.className = 'swift-match-keyword-btn';
      if (savedStyles.styleClass) {
        btnData.btn.classList.add(`swift-match-keyword-style-${savedStyles.styleClass}`);
      }

      // Apply custom CSS
      const styleId = `swift-match-keyword-custom-style-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const existingEl = document.getElementById(styleId);
      if (existingEl) existingEl.remove();
      if (savedStyles.customStyle) {
        const styleEl = document.createElement('style');
        styleEl.id = styleId;
        let scoped = savedStyles.customStyle.replace(/\.([a-zA-Z_-][\w-]*)/g, '.swift-match-keyword-style-$1');
        styleEl.textContent = scoped;
        document.head.appendChild(styleEl);
        const firstClass = savedStyles.customStyle.match(/\.([a-zA-Z_-][\w-]*)/);
        if (firstClass) {
          btnData.btn.classList.add(`swift-match-keyword-style-${firstClass[1]}`);
        }
      }
    } else {
      // Restore default styles
      btnData.btn.style.cssText = `
        position: relative;
        padding: 2px 10px;
        border-radius: 9999px;
        background-color: rgba(240, 100, 120, 0.08);
        box-shadow: inset 0 0 0 1px rgba(240, 120, 100, 0.4), 0 2px 10px rgba(0, 0, 0, 0.05);
        cursor: grab;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        opacity: 0.7;
        transition: transform 0.15s ease, opacity 0.2s ease;
      `;
      btnData.textEl.style.cssText = `
        font-weight: 800;
        background: linear-gradient(135deg, #f2709c, #ff9472, #f5af19, #f2709c);
        background-size: 250% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 6px rgba(240, 100, 120, 0.7)) drop-shadow(0 0 12px rgba(245, 150, 50, 0.5));
        animation: hp-twilight-move 3.5s linear infinite;
        font-size: 11px;
        white-space: nowrap;
        line-height: 1;
        padding: 0;
        pointer-events: none;
      `;
      btnData.btn.className = 'swift-match-keyword-btn';
    }
  }

  removeFloatingKeywordButton(keyword) {
    const idx = this._floatingKeywordButtons.findIndex(b => b.term === keyword);
    if (idx >= 0) {
      const btnData = this._floatingKeywordButtons[idx];
      if (btnData.wrapper && btnData.wrapper.parentNode) {
        btnData.wrapper.parentNode.removeChild(btnData.wrapper);
      }
      this._floatingKeywordButtons.splice(idx, 1);
      this.deleteKeywordData(keyword);
      this._updateFloatingKeywordsData();
    }
  }

  async _updateFloatingKeywordsData() {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.keywordDir)) {
      await adapter.mkdir(this.keywordDir);
    }
    let existingFiles = [];
    try {
      const listed = await adapter.list(this.keywordDir);
      existingFiles = Array.isArray(listed) ? listed : (listed?.files || []);
    } catch (e) {}
    const savedTerms = new Set();
    for (const btn of this._floatingKeywordButtons) {
      savedTerms.add(this._cacheKeyToFileName(btn.term));
      await this.saveKeywordData(
        btn.term,
        btn.position || { left: 50, top: 100 },
        btn.fileMap,
        btn.matchCount || 0
      );
    }
    for (const f of existingFiles) {
      const filePath = f.startsWith(this.keywordDir) ? f : `${this.keywordDir}/${f}`;
      if (!filePath.endsWith('.json')) continue;
      const baseName = filePath.split('/').pop().replace('.json', '');
      if (!savedTerms.has(baseName)) {
        await adapter.remove(filePath).catch(() => {});
      }
    }
  }

  async _restoreFloatingKeywordButtons() {
    const allData = await this.loadAllKeywordData();
    if (!allData || allData.length === 0) return;
    
    for (const data of allData) {
      try {
        let fileMap = null;
        if (data.fileMapData && data.fileMapData.length > 0) {
          fileMap = await this.deserializeFileMap(data.fileMapData);
        }
        
        if (fileMap && fileMap.size > 0) {
          this._recentSearchCaches[data.term] = { fileMap, matchCount: data.matchCount || 0 };
          this.createFloatingKeywordButton(data.term, fileMap, data.matchCount || 0);
        } else {
          this.createFloatingKeywordButton(data.term, new Map(), 0);
        }
        const btnData = this._floatingKeywordButtons.find(b => b.term === data.term);
        if (btnData && data.position) {
          btnData.position = data.position;
          btnData.wrapper.style.left = data.position.left + 'px';
          btnData.wrapper.style.top = data.position.top + 'px';
        }
      } catch (e) {
        console.error('Failed to restore floating keyword button:', data.term, e);
      }
    }
  }

  async _restoreRecentSearchCaches() {
    const adapter = this.app.vault.adapter;
    if (!await adapter.exists(this.cacheDir)) return;
    try {
      const listed = await adapter.list(this.cacheDir);
      const files = Array.isArray(listed) ? listed : (listed?.files || []);
      for (const f of files) {
        const filePath = f.startsWith(this.cacheDir) ? f : `${this.cacheDir}/${f}`;
        if (!filePath.endsWith('.json')) continue;
        try {
          const content = await adapter.read(filePath);
          const data = JSON.parse(content);
          if (data.fileMapData && data.fileMapData.length > 0) {
            const fileMap = await this.deserializeFileMap(data.fileMapData);
            if (fileMap && fileMap.size > 0) {
              this._recentSearchCaches[data.term] = { fileMap, matchCount: data.matchCount || 0 };
            }
          }
        } catch (e) {}
      }
    } catch (e) {}
  }

  positionListNearElement(el) {
    if (!this.matchList) return;

    const rect = el.getBoundingClientRect();
    const listWidth = this.matchListSize.width || this.settings.matchListWidth || 280;
    const listHeight = this.matchList.offsetHeight || (this.matchListSize.height || this.settings.matchListHeight || 400);

    let left = rect.left;
    let top = rect.bottom + 5;

    if (left + listWidth > window.innerWidth - 10) {
      left = window.innerWidth - listWidth - 10;
    }
    if (left < 10) left = 10;

    if (top + listHeight > window.innerHeight - 10) {
      const availableBelow = window.innerHeight - top - 10;
      const availableAbove = rect.top - 15;
      if (availableBelow >= 60) {
        this.matchList.style.maxHeight = `${availableBelow}px`;
      } else if (availableAbove >= 60) {
        top = rect.top - Math.min(listHeight, availableAbove) - 5;
        this.matchList.style.maxHeight = `${Math.min(listHeight, availableAbove)}px`;
      } else {
        this.matchList.style.maxHeight = `${Math.max(60, window.innerHeight - 20)}px`;
        top = 10;
      }
    } else {
      this.matchList.style.maxHeight = '';
    }

    this.matchList.style.left = `${left}px`;
    this.matchList.style.top = `${top}px`;
  }

  expandFloatingSearchBox() {
    if (!this.floatingSearchBox) return;
    const size = this.settings.floatingToggleSize || 20;
    // Dynamically determine direction based on current toggle position
    const wrapperRect = this.floatingToggleWrapper.getBoundingClientRect();
    const isRightSide = wrapperRect.left + wrapperRect.width / 2 > window.innerWidth / 2;
    if (isRightSide) {
      this.floatingSearchBox.style.left = '';
      this.floatingSearchBox.style.right = '100%';
      this.floatingSearchBox.style.marginLeft = '';
      this.floatingSearchBox.style.marginRight = '4px';
    } else {
      this.floatingSearchBox.style.right = '';
      this.floatingSearchBox.style.left = '100%';
      this.floatingSearchBox.style.marginRight = '';
      this.floatingSearchBox.style.marginLeft = '4px';
    }
    this.floatingSearchBox.style.width = '160px';
    this.floatingSearchBox.style.padding = `0 ${size / 2}px`;
    this.floatingSearchBox.style.opacity = '1';
  }

  collapseFloatingSearchBox() {
    if (!this.floatingSearchBox) return;
    // Don't collapse if search box is focused
    if (document.activeElement === this.floatingSearchBox) return;
    this.floatingSearchBox.style.width = '0';
    this.floatingSearchBox.style.padding = '0';
    this.floatingSearchBox.style.opacity = '0';
  }

  clampFloatingTogglePosition() {
    if (!this.floatingToggleWrapper) return;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const margin = 5;
    const rect = this.floatingToggleWrapper.getBoundingClientRect();
    let changed = false;
    const usesRight = this.floatingToggleWrapper.style.right && this.floatingToggleWrapper.style.right !== 'auto';
    
    if (usesRight) {
      let right = parseFloat(this.floatingToggleWrapper.style.right);
      if (!isNaN(right) && right + rect.width > windowW - margin) {
        right = Math.max(margin, windowW - rect.width - margin);
        this.floatingToggleWrapper.style.right = `${right}px`;
        this.settings.floatingToggleRight = right;
        delete this.settings.floatingToggleX;
        changed = true;
      }
    } else {
      let left = parseFloat(this.floatingToggleWrapper.style.left);
      if (!isNaN(left) && left + rect.width > windowW - margin) {
        left = Math.max(margin, windowW - rect.width - margin);
        this.floatingToggleWrapper.style.left = `${left}px`;
        this.settings.floatingToggleX = left;
        delete this.settings.floatingToggleRight;
        changed = true;
      }
    }
    
    let top = parseFloat(this.floatingToggleWrapper.style.top);
    if (!isNaN(top) && top + rect.height > windowH - margin) {
      top = Math.max(margin, windowH - rect.height - margin);
      this.floatingToggleWrapper.style.top = `${top}px`;
      this.settings.floatingToggleY = top;
      changed = true;
    }
    
    if (changed) this.saveSettings();
  }

  addCommands() {
    this.addCommand({
      id: 'toggle-minimap',
      name: 'Toggle Minimap',
      callback: () => {
        if (this.minimapContainer) {
          const isHidden = this.minimapContainer.style.display === 'none';
          this.minimapContainer.style.display = isHidden ? 'block' : 'none';
          if (isHidden) {
            this.applyEditorPadding();
          } else {
            this.removeEditorPadding();
          }
        }
      }
    });
  }

  _isMinimapBlacklisted() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return false;
    return this._isLeafBlacklisted(leaf);
  }

  _isLeafBlacklisted(leaf) {
    if (!leaf) return false;
    let filePath = leaf.view?.file?.path;
    let viewTitle = '';
    let viewType = leaf.view?.viewType || '';
    if (!filePath) {
      // Try getDisplayText() first (most reliable for plugin views)
      if (leaf.view && typeof leaf.view.getDisplayText === 'function') {
        viewTitle = leaf.view.getDisplayText()?.trim() || '';
      }
      // Fallback to DOM title
      if (!viewTitle) {
        const leafEl = leaf.containerEl || leaf.view?.containerEl;
        if (leafEl) {
          const navEl = leafEl.querySelector('.view-header-title');
          if (navEl) {
            viewTitle = navEl.textContent?.trim() || '';
          }
        }
      }
      // If title matches a vault file, use its path instead
      if (viewTitle) {
        const found = this.app.vault.getFiles().find(f => f.name === viewTitle || f.basename === viewTitle);
        if (found) filePath = found.path;
      }
    }
    if (!filePath && !viewTitle && !viewType) return false;
    const blacklist = (this.settings.minimapBlacklist || '').split('\n').map(s => s.trim()).filter(Boolean);
    for (const pattern of blacklist) {
      const regex = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
      if (filePath && regex.test(filePath)) return true;
      if (viewTitle && regex.test(viewTitle)) return true;
      if (viewType && regex.test(viewType)) return true;
    }
    return false;
  }

  _getViewInfoFromContainer(containerEl) {
    // Walk up the DOM to find the leaf that owns this container
    const leaves = [];
    this.app.workspace.iterateRootLeaves((leaf) => { leaves.push(leaf); });
    // Also check sidebar leaves
    if (this.app.workspace.leftSplit) {
      const leftLeaves = this.app.workspace.leftSplit.children?.flatMap(s => s.children || []) || [];
      leaves.push(...leftLeaves);
    }
    if (this.app.workspace.rightSplit) {
      const rightLeaves = this.app.workspace.rightSplit.children?.flatMap(s => s.children || []) || [];
      leaves.push(...rightLeaves);
    }
    for (const leaf of leaves) {
      if (leaf.view && leaf.view.containerEl && leaf.view.containerEl.contains(containerEl)) {
        return {
          filePath: leaf.view.file?.path || '',
          viewTitle: (typeof leaf.view.getDisplayText === 'function' ? leaf.view.getDisplayText()?.trim() : '') || '',
          viewType: leaf.view.viewType || ''
        };
      }
    }
    // Fallback: check DOM for view-header-title
    const navEl = containerEl.querySelector('.view-header-title');
    const viewTitle = navEl ? navEl.textContent?.trim() || '' : '';
    return { filePath: '', viewTitle, viewType: '' };
  }

  _isViewInfoBlacklisted(info) {
    const { filePath, viewTitle, viewType } = info;
    if (!filePath && !viewTitle && !viewType) return false;
    const blacklist = (this.settings.minimapBlacklist || '').split('\n').map(s => s.trim()).filter(Boolean);
    for (const pattern of blacklist) {
      const regex = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$', 'i');
      if (filePath && regex.test(filePath)) return true;
      if (viewTitle && regex.test(viewTitle)) return true;
      if (viewType && regex.test(viewType)) return true;
    }
    return false;
  }

  _cleanupBlacklistedLeaves() {
    // Remove minimap containers from all blacklisted leaves
    const leaves = [];
    this.app.workspace.iterateRootLeaves((leaf) => {
      leaves.push(leaf);
    });
    for (const leaf of leaves) {
      if (this._isLeafBlacklisted(leaf)) {
        const containerEl = leaf.view?.containerEl;
        if (containerEl) {
          const existing = containerEl.querySelector('.minimap-container');
          if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
          }
        }
      }
    }
  }

  setupMinimap() {
    const workspace = this.app.workspace;
    const activeLeaf = workspace.activeLeaf;
    if (!activeLeaf) return;

    // Clean up minimap on all blacklisted leaves (handles settings changes)
    this._cleanupBlacklistedLeaves();

    if (this._isMinimapBlacklisted()) {
      this.removeEditorPadding();
      if (this.minimapContainer && this.minimapContainer.parentNode) {
        this.minimapContainer.parentNode.removeChild(this.minimapContainer);
      }
      this.minimapContainer = null;
      this.minimapContent = null;
      this.slider = null;
      return;
    }

    const editorEl = activeLeaf.view.containerEl;
    if (!editorEl) return;

    // Also check if the containerEl belongs to a blacklisted view
    // (activeLeaf may not reflect the actual view for plugin pages like Thino)
    const containerViewInfo = this._getViewInfoFromContainer(editorEl);
    if (this._isViewInfoBlacklisted(containerViewInfo)) {
      this.removeEditorPadding();
      if (this.minimapContainer && this.minimapContainer.parentNode) {
        this.minimapContainer.parentNode.removeChild(this.minimapContainer);
      }
      this.minimapContainer = null;
      this.minimapContent = null;
      this.slider = null;
      return;
    }

    this.removeEditorPadding();

    if (this.minimapContainer && this.minimapContainer.parentNode) {
      this.minimapContainer.parentNode.removeChild(this.minimapContainer);
    }

    this.minimapContainer = document.createElement('div');
    this.minimapContainer.className = 'minimap-container';
    editorEl.appendChild(this.minimapContainer);
    
    this.minimapContainer.addEventListener('contextmenu', this.boundContextMenu);

    this.minimapContent = document.createElement('div');
    this.minimapContent.className = 'minimap-content';
    this.minimapContainer.appendChild(this.minimapContent);

    this.slider = document.createElement('div');
    this.slider.className = 'minimap-slider';
    this.minimapContainer.appendChild(this.slider);

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'minimap-tooltip';
    this.tooltip.style.display = 'none';
    document.body.appendChild(this.tooltip);

    this.matchList = document.createElement('div');
    this.matchList.className = 'minimap-match-list';
    this.matchList.style.display = 'none';
    document.body.appendChild(this.matchList);

    this.previewPanel = document.createElement('div');
    this.previewPanel.className = 'minimap-preview-panel';
    this.previewPanel.style.display = 'none';
    this.previewPanel.style.position = 'absolute';
    document.body.appendChild(this.previewPanel);

    this.applySettings();

    this.setupListDrag();
    this.setupListWheel();
    this.setupSliderEvents();
    this.updateMinimapContent();
    this.setupScrollListener();
    this.decorationField = null;

    if (!this.isReadingMode()) {
      this.registerEditorField();
      this.setupPinnedMatchHover();
    }

    this.minimapContainer.addEventListener('wheel', this.boundWheel, { passive: false });
    
    this.applyEditorPadding();
    
    setTimeout(() => {
      this.updateViewport();
    }, 200);
  }

  setupListDrag() {
    if (!this.matchList) return;
    
    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'minimap-match-list-resize-handle';
    this.matchList.appendChild(resizeHandle);
    
    this.isResizingMatchList = false;
    this.resizeStartX = 0;
    this.resizeStartY = 0;
    this.resizeStartWidth = 0;
    this.resizeStartHeight = 0;
    
    resizeHandle.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      
      this.isResizingMatchList = true;
      this.isInteractingWithList = true;
      this.resizeStartX = e.clientX;
      this.resizeStartY = e.clientY;
      this.resizeStartWidth = this.matchList.offsetWidth;
      this.resizeStartHeight = this.matchList.offsetHeight;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!this.isResizingMatchList || !this.matchList) return;
      
      const dx = e.clientX - this.resizeStartX;
      const dy = e.clientY - this.resizeStartY;
      const newWidth = Math.max(200, Math.min(this.resizeStartWidth + dx, window.innerWidth - 20));
      const newHeight = Math.max(150, Math.min(this.resizeStartHeight + dy, window.innerHeight - 20));
      
      this.matchList.style.width = `${newWidth}px`;
      this.matchList.style.maxWidth = `${newWidth}px`;
      this.matchList.style.height = `${newHeight}px`;
      
      // Update container max-height to fit within the list
      const header = this.matchList.querySelector('.minimap-match-list-header');
      const listContainer = this.matchList.querySelector('.minimap-match-list-container');
      if (listContainer) {
        const headerHeight = header ? header.offsetHeight : 36;
        const recentSection = this.matchList.querySelector('.minimap-match-list-recent');
        const recentHeight = recentSection ? recentSection.offsetHeight : 0;
        const searchRow = this.matchList.querySelector('.minimap-floating-search-box')?.parentElement;
        const searchRowHeight = searchRow ? searchRow.offsetHeight : 0;
        const availableHeight = newHeight - headerHeight - recentHeight - 40;
        listContainer.style.maxHeight = `${Math.max(50, availableHeight)}px`;
      }
      
      this.matchListSize.width = newWidth;
      this.matchListSize.height = newHeight;
    });
    
    document.addEventListener('mouseup', (e) => {
      if (this.isResizingMatchList) {
        this.isResizingMatchList = false;
        this.saveListData();
      }
    });
  }

  setupListWheel() {
    if (!this.matchList) return;
    
    this.matchList.addEventListener('wheel', this.boundListWheel, { passive: false });
    if (this.previewPanel) {
      this.previewPanel.addEventListener('wheel', this.boundListWheel, { passive: false });
    }
  }

  handleListWheel(e) {
    if (!e.ctrlKey) return;
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    
    if (this.isPreviewOpen && this.previewPanel) {
      this.previewOpacity = Math.max(0.1, Math.min(1.0, this.previewOpacity + delta));
      this.previewPanel.style.opacity = this.previewOpacity;
    } else {
      this.listOpacity = Math.max(0.1, Math.min(1.0, this.listOpacity + delta));
      this.matchList.style.opacity = this.listOpacity;
    }
    
    this.saveListData();
  }

  registerEditorField() {
    const editor = this.getEditor();
    if (!editor || !editor.cm) return;

    if (!this.decorationField) {
      this.decorationField = matchHighlightField;
      editor.cm.dispatch({
        effects: StateEffect.appendConfig.of([this.decorationField])
      });
    }
    if (!this.jumpDecoField) {
      this.jumpDecoField = jumpHighlightField;
      editor.cm.dispatch({
        effects: StateEffect.appendConfig.of([this.jumpDecoField])
      });
    }

    this.matchHighlightPlugin = MatchHighlightPlugin;
  }

  setupPinnedMatchHover() {
    const editor = this.getEditor();
    if (!editor || !editor.cm) return;

    const cm = editor.cm;
    const scrollDOM = cm.scrollDOM;
    if (!scrollDOM) return;

    if (this._pinnedMatchHoverHandler) {
      scrollDOM.removeEventListener('mouseover', this._pinnedMatchHoverHandler);
    }

    this._pinnedMatchHoverHandler = (e) => {
      const target = e.target;
      if (!target.classList || !target.classList.contains('minimap-editor-match')) return;
      if (!target.classList.contains('pinned')) return;
      if (this._isListVisible) return;

      const selection = target.dataset.selection;
      if (!selection) return;

      const savedItem = this.savedMatchLists.find(item => item.selection === selection && item.pinned);
      if (!savedItem) return;

      this._searchGeneration++;
      this._triggeredByIndicator = true;
      
      const targetRect = target.getBoundingClientRect();
      this.lastIndicatorCoords = {
        screenX: targetRect.right + 10,
        screenY: targetRect.top + targetRect.height / 2,
        targetRect: targetRect
      };
      this._currentIndicatorSelection = selection;
      this._currentIndicatorMatchCount = savedItem.matchCount;
      this.showMatchList(selection, savedItem.matchCount);
    };

    scrollDOM.addEventListener('mouseover', this._pinnedMatchHoverHandler);
  }

  applyEditorPadding() {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (!activeLeaf) return;
    
    const containerEl = activeLeaf.view.containerEl;
    if (!containerEl) return;
    
    if (this.isReadingMode()) {
      this.editorContentEl = containerEl.querySelector('.markdown-reading-view') ||
                             containerEl.querySelector('.markdown-preview-view');
    } else {
      this.editorContentEl = containerEl.querySelector('.cm-content') || 
                             containerEl.querySelector('.cm-editor') ||
                             containerEl.querySelector('.markdown-source-view');
    }
    
    if (this.editorContentEl) {
      this.originalPaddingRight = this.editorContentEl.style.paddingRight || '';
      const minimapWidth = this.minimapContainer ? this.minimapContainer.offsetWidth : 80;
      const padding = this.settings.editorPadding || 10;
      this.editorContentEl.style.paddingRight = `${minimapWidth + padding}px`;
    }
  }

  removeEditorPadding() {
    if (this.editorContentEl) {
      this.editorContentEl.style.paddingRight = this.originalPaddingRight;
    }
  }

  applyHideStatusBar() {
    const statusBar = document.querySelector('.status-bar');
    if (!statusBar) return;

    if (this.settings.hideStatusBar) {
      statusBar.classList.add('minimap-hide-statusbar');
    } else {
      statusBar.classList.remove('minimap-hide-statusbar');
    }
  }

  setupScrollListener() {
    if (this.scrollHandler) {
      document.removeEventListener('scroll', this.scrollHandler, true);
    }
    
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf) {
      if (this.isReadingMode()) {
        this.editorScrollEl = this.getReadingViewScrollEl() || activeLeaf.view.containerEl;
      } else {
        this.editorScrollEl = activeLeaf.view.containerEl.querySelector('.cm-scroller') || 
                             activeLeaf.view.containerEl.querySelector('.markdown-source-view') ||
                             activeLeaf.view.containerEl;
      }
    }
    
    this.scrollHandler = (e) => {
      if (this.isDragging) return;
      this.updateViewport();
      this.updatePinnedIndicatorsPosition();
    };
    
    document.addEventListener('scroll', this.scrollHandler, true);
    
    if (this.editorScrollEl) {
      this.editorScrollEl.addEventListener('scroll', this.scrollHandler);
    }
  }

  // Get current visible line range using CodeMirror API
  getVisibleLineRange() {
    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return null;
      const totalLines = this.getTotalLines();
      const scrollTop = scrollEl.scrollTop;
      const clientHeight = scrollEl.clientHeight;
      const scrollHeight = scrollEl.scrollHeight;
      const scrollRatio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
      const viewportRatio = scrollHeight > 0 ? clientHeight / scrollHeight : 1;
      const startLine = Math.floor(scrollRatio * totalLines);
      const visibleLines = Math.max(1, Math.floor(viewportRatio * totalLines));
      const endLine = Math.min(totalLines - 1, startLine + visibleLines - 1);
      return {
        startLine: startLine,
        endLine: endLine,
        visibleLines: visibleLines,
        totalLines: totalLines,
        scrollTop: scrollTop,
        scrollHeight: scrollHeight,
        clientHeight: clientHeight
      };
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return null;
    
    const cm = editor.cm;
    const scrollDOM = cm.scrollDOM;
    if (!scrollDOM) return null;
    
    const scrollTop = scrollDOM.scrollTop;
    const clientHeight = scrollDOM.clientHeight;
    
    // Get total line count
    const totalLines = cm.state.doc.lines;
    
    // Get the line at the top of the viewport
    const topLine = cm.lineBlockAtHeight(scrollTop);
    const startLine = topLine ? topLine.from : 0;
    
    // Get the line at the bottom of the viewport
    const bottomLine = cm.lineBlockAtHeight(scrollTop + clientHeight);
    const endLine = bottomLine ? bottomLine.from : cm.state.doc.length;
    
    // Convert positions to line numbers (0-indexed)
    const startLineNumber = cm.state.doc.lineAt(startLine).number - 1;
    const endLineNumber = cm.state.doc.lineAt(endLine).number - 1;
    
    // Calculate how many lines are visible
    const visibleLines = endLineNumber - startLineNumber + 1;
    
    return {
      startLine: startLineNumber,
      endLine: endLineNumber,
      visibleLines: visibleLines,
      totalLines: totalLines,
      scrollTop: scrollTop,
      scrollHeight: scrollDOM.scrollHeight,
      clientHeight: clientHeight
    };
  }

  hexToRgba(color, alpha) {
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\(([^,]+),\s*([^,]+),\s*([^,]+),\s*[^)]+\)/, `rgba($1, $2, $3, ${alpha})`);
    }
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  _highlightKeywordsInElement(el, keywords, colors) {
    if (!el || !keywords || keywords.length === 0) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    for (const textNode of textNodes) {
      const text = textNode.textContent;
      if (!text) continue;
      let hasAnyMatch = false;
      for (const kw of keywords) {
        if (text.toLowerCase().includes(kw.toLowerCase())) {
          hasAnyMatch = true;
          break;
        }
      }
      if (!hasAnyMatch) continue;

      const fragment = document.createDocumentFragment();
      let remaining = text;
      while (remaining.length > 0) {
        let earliestIdx = remaining.length;
        let earliestKwIdx = -1;
        for (let ki = 0; ki < keywords.length; ki++) {
          const idx = remaining.toLowerCase().indexOf(keywords[ki].toLowerCase());
          if (idx !== -1 && idx < earliestIdx) {
            earliestIdx = idx;
            earliestKwIdx = ki;
          }
        }
        if (earliestKwIdx === -1) {
          fragment.appendChild(document.createTextNode(remaining));
          break;
        }
        if (earliestIdx > 0) {
          fragment.appendChild(document.createTextNode(remaining.slice(0, earliestIdx)));
        }
        const kw = keywords[earliestKwIdx];
        const color = colors[earliestKwIdx];
        const mark = document.createElement('mark');
        mark.textContent = remaining.slice(earliestIdx, earliestIdx + kw.length);
        mark.style.cssText = `background:${color}33;color:${color};padding:0 2px;border-radius:3px;font-weight:600;`;
        fragment.appendChild(mark);
        remaining = remaining.slice(earliestIdx + kw.length);
      }
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  // Get total line count
  getTotalLines() {
    if (this.isReadingMode()) {
      const content = this.minimapContent.textContent || '';
      return content.split('\n').length;
    }
    const editor = this.getEditor();
    if (!editor) return 0;
    
    const content = editor.getValue();
    return content.split('\n').length;
  }

  // Get current scroll position as line number (0-indexed)
  getCurrentTopLine() {
    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return 0;
      const totalLines = this.getTotalLines();
      if (totalLines <= 0) return 0;
      const scrollRatio = scrollEl.scrollTop / Math.max(1, scrollEl.scrollHeight - scrollEl.clientHeight);
      return Math.floor(scrollRatio * totalLines);
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return 0;
    
    const cm = editor.cm;
    const scrollDOM = cm.scrollDOM;
    if (!scrollDOM) return 0;
    
    const scrollTop = scrollDOM.scrollTop;
    const topBlock = cm.lineBlockAtHeight(scrollTop);
    if (topBlock) {
      return cm.state.doc.lineAt(topBlock.from).number - 1;
    }
    return 0;
  }

  // Get how many lines are visible in the viewport
  getVisibleLineCount() {
    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return 1;
      const totalLines = this.getTotalLines();
      if (totalLines <= 0) return 1;
      const viewportRatio = scrollEl.clientHeight / Math.max(1, scrollEl.scrollHeight);
      return Math.max(1, Math.floor(viewportRatio * totalLines));
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return 1;
    
    const cm = editor.cm;
    const scrollDOM = cm.scrollDOM;
    if (!scrollDOM) return 1;
    
    const scrollTop = scrollDOM.scrollTop;
    const clientHeight = scrollDOM.clientHeight;
    
    const topBlock = cm.lineBlockAtHeight(scrollTop);
    const bottomBlock = cm.lineBlockAtHeight(scrollTop + clientHeight);
    
    if (topBlock && bottomBlock) {
      const startLine = cm.state.doc.lineAt(topBlock.from).number;
      const endLine = cm.state.doc.lineAt(bottomBlock.from).number;
      return Math.max(1, endLine - startLine + 1);
    }
    return 1;
  }

  setupSliderEvents() {
    if (!this.slider || !this.minimapContainer) return;

    this.slider.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isDragging = true;
      this.slider.classList.add('dragging');
      this.dragStartY = e.clientY;
      this.dragStartLine = this.getCurrentTopLine();
    });

    this.minimapContainer.addEventListener('mousedown', (e) => {
      if (e.target === this.slider) return;
      if (e.target.classList.contains('minimap-highlight')) return;
      if (e.button !== 0) return;
      this.jumpToPosition(e);
    });
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();

    if (!this.minimapContainer) return;
    const containerHeight = this.minimapContainer.clientHeight;
    const deltaY = e.clientY - this.dragStartY;

    const totalLines = this.getTotalLines();
    if (totalLines <= 0) return;

    const lineHeightInMinimap = 2;
    const naturalContentHeight = totalLines * lineHeightInMinimap;
    const contentHeight = Math.min(containerHeight, naturalContentHeight);

    const lineDelta = (deltaY / contentHeight) * totalLines;
    const newLine = this.dragStartLine + lineDelta;
    const clampedLine = Math.max(0, Math.min(newLine, totalLines - 1));

    this.scrollToLine(clampedLine);
  }

  scrollToLine(lineNumber) {
    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return;
      const file = this.app.workspace.activeLeaf?.view?.file;
      if (!file) return;
      this.app.vault.read(file).then(content => {
        const lines = content.split('\n');
        if (lineNumber < 0 || lineNumber >= lines.length) return;
        // Calculate approximate scroll position based on line ratio
        const ratio = lineNumber / Math.max(1, lines.length - 1);
        const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
        scrollEl.scrollTop = ratio * scrollHeight;
      }).catch(() => {});
      if (this.currentSelection) {
        setTimeout(() => this.highlightMatches(), 10);
      }
      return;
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return;
    
    const cm = editor.cm;
    const doc = cm.state.doc;
    
    if (lineNumber < 0 || lineNumber >= doc.lines) return;
    
    const line = doc.line(lineNumber + 1);
    
    // Scroll the DOM directly without changing cursor
    if (cm.scrollDOM) {
      const lineBlock = cm.lineBlockAt(line.from);
      if (lineBlock) {
        cm.scrollDOM.scrollTop = lineBlock.top;
      }
    }
    
    // Re-apply highlights after scroll
    if (this.currentSelection) {
      setTimeout(() => this.highlightMatches(), 10);
    }
  }

  handleMouseUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      if (this.slider) {
        this.slider.classList.remove('dragging');
      }
      if (this.currentSelection) {
        setTimeout(() => this.highlightMatches(), 10);
      }
    } else if (!this.isJumping && !this.isInteractingWithList) {
      // Don't trigger handleSelection if mouseup is inside the match list (text selection)
      const isInsideMatchList = this.matchList && this.matchList.contains(e.target);
      const isInsideKeywordBtn = e.target.closest('.swift-match-keyword-btn-wrapper');
      if (!isInsideMatchList && !isInsideKeywordBtn) {
        this.handleSelection();
      }
      this.isJumping = false;
    }
    this.isInteractingWithList = false;
  }

  handleWheel(e) {
    e.preventDefault();
    
    // Alt + wheel: adjust opacity
    if (e.altKey) {
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      this.opacity = Math.max(0.1, Math.min(1, this.opacity + delta));
      if (this.minimapContainer) {
        this.minimapContainer.style.opacity = this.opacity;
      }
    } else {
      // Normal wheel: scroll document page by page
      if (this.isReadingMode()) {
        const scrollEl = this.getReadingViewScrollEl();
        if (!scrollEl) return;
        const clientHeight = scrollEl.clientHeight;
        const scrollAmount = clientHeight * 0.9;
        const direction = e.deltaY > 0 ? 1 : -1;
        scrollEl.scrollTop += direction * scrollAmount;
      } else {
    const editor = this.getEditor();

    if (!editor || !editor.cm) return;
        
        const cm = editor.cm;
        if (!cm.scrollDOM) return;
        
        const clientHeight = cm.scrollDOM.clientHeight;
        const scrollAmount = clientHeight * 0.9; // Scroll 90% of page height
        
        const direction = e.deltaY > 0 ? 1 : -1;
        cm.scrollDOM.scrollTop += direction * scrollAmount;
      }
    }
  }

  jumpToPosition(e) {
    const totalLines = this.getTotalLines();
    if (totalLines <= 0) return;

    const containerHeight = this.minimapContainer.clientHeight;
    const containerRect = this.minimapContainer.getBoundingClientRect();
    const clickY = e.clientY - containerRect.top;

    const lineHeightInMinimap = 2;
    const naturalContentHeight = totalLines * lineHeightInMinimap;
    const contentHeight = Math.min(containerHeight, naturalContentHeight);

    const ratio = clickY / contentHeight;
    const targetLine = Math.floor(ratio * totalLines);
    const clampedLine = Math.max(0, Math.min(targetLine, totalLines - 1));

    this.isJumping = true;
    
    if (this.isReadingMode()) {
      this.scrollToLine(clampedLine);
    } else {
      const editor = this.getEditor();
      if (editor && editor.cm) {
        try {
          this.jumpToMatch({ line: clampedLine, pos: 0 });
        } catch (err) {
          this.scrollToLine(clampedLine);
        }
      } else {
        this.scrollToLine(clampedLine);
      }
    }
  }

  jumpToMatch(targetMatch) {
    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return;
      const file = this.app.workspace.activeLeaf?.view?.file;
      if (!file) return;
      this.app.vault.read(file).then(content => {
        const lines = content.split('\n');
        const lineNumber = targetMatch.line;
        if (lineNumber < 0 || lineNumber >= lines.length) return;
        const ratio = lineNumber / Math.max(1, lines.length - 1);
        const scrollHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
        scrollEl.scrollTop = ratio * scrollHeight;
      }).catch(() => {});
      this.isJumping = true;
      setTimeout(() => {
        this.isJumping = false;
      }, 150);
      return;
    }

    const editor = this.getEditor();
    if (!editor) return;

    const cm = editor.cm;
    if (!cm) return;

    this.isJumping = true;

    const line = cm.state.doc.line(targetMatch.line + 1);
    const foundPos = line.from + targetMatch.pos;

    const originalSelection = this.currentSelection;
    const originalCursor = this.currentCursor;

    cm.dispatch({
      selection: { anchor: foundPos },
      scrollIntoView: { range: { from: foundPos, to: foundPos } }
    });

    setTimeout(() => {
      if (!this.isJumping) return;
      this.currentSelection = originalSelection;
      this.currentCursor = originalCursor;
      if (this.currentSelection) {
        this.highlightMatches();
      }
      this.isJumping = false;
    }, 150);
  }

  getEditor() {
    return this.app.workspace.activeLeaf?.view?.editor || null;
  }

  showPinIcon() {
    if (!this.settings.pinIconEnabled) return;
    if (!this.currentSelection) return;
    if (this._pinIcon) return;

    // Check if current selection is already pinned
    const exactPinned = this.savedMatchLists.find(m => m.selection === this.currentSelection && m.pinned);
    // Check if current selection contains any pinned texts
    const containedPinned = this.savedMatchLists.filter(m => m.pinned && this.currentSelection.includes(m.selection));

    // Save current pin icon position before hiding (in case it was dragged)
    if (this._pinIcon && this.settings.pinIconMode === 'fixed') {
      this.settings.pinIconFixedLeft = parseFloat(this._pinIcon.style.left);
      this.settings.pinIconFixedTop = parseFloat(this._pinIcon.style.top);
    }

    this.hidePinIcon();

    const icon = document.createElement('div');
    icon.className = 'minimap-pin-icon';
    icon.style.position = 'fixed';
    icon.style.zIndex = '9999';
    icon.style.cursor = 'pointer';
    icon.style.width = `${this.settings.pinIconSize}px`;
    icon.style.height = `${this.settings.pinIconSize}px`;
    icon.style.borderRadius = '50%';
    icon.style.fontSize = `${Math.round(this.settings.pinIconSize * 0.55)}px`;
    icon.style.fontWeight = '700';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    icon.style.opacity = this.settings.pinIconOpacity;
    icon.style.transition = 'opacity 0.15s, transform 0.15s';
    icon.style.userSelect = 'none';
    icon.style.lineHeight = '1';
    icon.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';

    if (exactPinned) {
      // Current selection is pinned - show unpin button (gray circle, gray x)
      icon.textContent = 'x';
      icon.title = t('unpin');
      icon.style.backgroundColor = '#888';
      icon.style.color = '#fff';
    } else if (containedPinned.length > 0) {
      // Current selection contains pinned texts - show clear button (gray circle, gray x)
      icon.textContent = 'x';
      icon.title = t('clearPinned', containedPinned.length);
      icon.style.backgroundColor = '#888';
      icon.style.color = '#fff';
    } else {
      // Not pinned - show pin button (gray circle, gray p)
      icon.textContent = 'p';
      icon.title = t('pinMatch');
      icon.style.backgroundColor = '#888';
      icon.style.color = '#fff';
    }

    if (this.settings.pinIconMode === 'follow') {
      const ox = this.settings.pinIconFollowOffsetX ?? 15;
      const oy = this.settings.pinIconFollowOffsetY ?? -10;
      icon.style.left = `${this._lastMouseX + ox}px`;
      icon.style.top = `${this._lastMouseY + oy}px`;
    } else {
      // Fixed position: use saved position or default to right side of editor
      if (this.settings.pinIconFixedLeft != null && this.settings.pinIconFixedTop != null) {
        icon.style.left = `${this.settings.pinIconFixedLeft}px`;
        icon.style.top = `${this.settings.pinIconFixedTop}px`;
      } else {
        const leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          const rect = leaf.view.containerEl.getBoundingClientRect();
          icon.style.left = `${rect.right - 40}px`;
          icon.style.top = `${rect.top + 10}px`;
        } else {
          icon.style.left = `${window.innerWidth - 50}px`;
          icon.style.top = '100px';
        }
      }
    }

    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.2)';
      icon.style.opacity = '1';
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1)';
      icon.style.opacity = this.settings.pinIconOpacity;
    });

    // Click to pin
    let clickDisabled = false;

    icon.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.isInteractingWithList = true;
    });

    icon.addEventListener('click', (e) => {
      if (clickDisabled) {
        clickDisabled = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      if (exactPinned) {
        // Unpin the exact match
        this.removePinnedSelection(this.currentSelection);
      } else if (containedPinned.length > 0) {
        // Remove all contained pinned items
        for (const item of containedPinned) {
          const idx = this.savedMatchLists.findIndex(m => m.selection === item.selection && m.pinned);
          if (idx >= 0) {
            this.savedMatchLists.splice(idx, 1);
          }
        }
        this.saveListData();
        this.clearHighlights();
        this.showPinnedDecorations();
        if (this.currentSelection) {
          this.highlightMatches();
        }
      } else {
        // Pin current selection
        this.pinCurrentSelection();
      }
      this.hidePinIcon();
    });

    // Drag support for fixed mode
    if (this.settings.pinIconMode === 'fixed') {
      let isDraggingIcon = false;
      let hasDragged = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      icon.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDraggingIcon = true;
        hasDragged = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragOffsetX = e.clientX - icon.getBoundingClientRect().left;
        dragOffsetY = e.clientY - icon.getBoundingClientRect().top;
        icon.style.transition = 'none';

        const onDragMove = (e) => {
          if (!isDraggingIcon) return;
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            if (!hasDragged) {
              hasDragged = true;
              icon.style.cursor = 'grabbing';
            }
            const newLeft = e.clientX - dragOffsetX;
            const newTop = e.clientY - dragOffsetY;
            icon.style.left = `${newLeft}px`;
            icon.style.top = `${newTop}px`;
          }
        };

        const onDragEnd = (e) => {
          if (!isDraggingIcon) return;
          isDraggingIcon = false;
          icon.style.cursor = 'pointer';
          icon.style.transition = 'opacity 0.15s, transform 0.15s';
          if (hasDragged) {
            // Was a drag - save position and prevent click
            clickDisabled = true;
            this.settings.pinIconFixedLeft = parseFloat(icon.style.left);
            this.settings.pinIconFixedTop = parseFloat(icon.style.top);
            this.saveSettings();
          }
          document.removeEventListener('mousemove', onDragMove);
          document.removeEventListener('mouseup', onDragEnd);
        };

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
      });
    }

    document.body.appendChild(icon);
    this._pinIcon = icon;

    // Follow mouse mode: show icon at current mouse position, then stay fixed
    if (this.settings.pinIconMode === 'follow') {
      const ox = this.settings.pinIconFollowOffsetX ?? 15;
      const oy = this.settings.pinIconFollowOffsetY ?? -10;
      icon.style.left = `${this._lastMouseX + ox}px`;
      icon.style.top = `${this._lastMouseY + oy}px`;
    }
  }

  hidePinIcon() {
    if (this._pinIcon) {
      this._pinIcon.remove();
      this._pinIcon = null;
    }
  }

  pinCurrentSelection() {
    if (!this.currentSelection) return;

    const multiKeywords = this.parseMultiKeywords(this.currentSelection);
    if (multiKeywords) {
      const keywordColors = this.getMultiKeywordColors(multiKeywords.length);
      const currentFile = this.app.workspace.activeLeaf?.view?.file;
      const currentFilePath = currentFile ? currentFile.path : '';
      const currentFileName = currentFile ? currentFile.basename : '';

      for (let ki = 0; ki < multiKeywords.length; ki++) {
        const kw = multiKeywords[ki];
        const color = keywordColors[ki];
        const existingIndex = this.savedMatchLists.findIndex(m => m.selection === kw);
        if (existingIndex >= 0) {
          this.savedMatchLists[existingIndex].pinned = true;
          this.savedMatchLists[existingIndex].borderColor = color;
          this.savedMatchLists[existingIndex].counterBgColor = color;
          this.savedMatchLists[existingIndex].counterColor = '#aba6a6';
          this.savedMatchLists[existingIndex]._multiKeywordParent = this.currentSelection;
          if (!this.savedMatchLists[existingIndex].filePath) {
            this.savedMatchLists[existingIndex].filePath = currentFilePath;
            this.savedMatchLists[existingIndex].fileName = currentFileName;
          }
        } else {
          this.savedMatchLists.unshift({
            selection: kw,
            pinned: true,
            colorIndex: 0,
            borderColor: color,
            counterBgColor: color,
            counterColor: '#aba6a6',
            matchCount: 0,
            filePath: currentFilePath,
            fileName: currentFileName,
            _multiKeywordParent: this.currentSelection
          });
        }
      }

      this.saveListData();
      this.clearHighlights();
      this.showPinnedDecorations();
      return;
    }

    // Calculate next color index
    const pinnedItems = this.savedMatchLists.filter(m => m.pinned);
    const nextColorIndex = pinnedItems.length % this.settings.pinColorSchemes.length;
    const colorScheme = this.settings.pinColorSchemes[nextColorIndex];

    const currentFile = this.app.workspace.activeLeaf?.view?.file;
    const currentFilePath = currentFile ? currentFile.path : '';

    const existingIndex = this.savedMatchLists.findIndex(m => m.selection === this.currentSelection);
    if (existingIndex >= 0) {
      this.savedMatchLists[existingIndex].pinned = true;
      this.savedMatchLists[existingIndex].colorIndex = nextColorIndex;
      this.savedMatchLists[existingIndex].borderColor = colorScheme.borderColor;
      this.savedMatchLists[existingIndex].counterBgColor = colorScheme.counterBgColor;
      this.savedMatchLists[existingIndex].counterColor = colorScheme.counterColor;
      if (!this.savedMatchLists[existingIndex].filePath) {
        this.savedMatchLists[existingIndex].filePath = currentFilePath;
        this.savedMatchLists[existingIndex].fileName = currentFile ? currentFile.basename : '';
      }
    } else {
      this.savedMatchLists.unshift({
        selection: this.currentSelection,
        pinned: true,
        colorIndex: nextColorIndex,
        borderColor: colorScheme.borderColor,
        counterBgColor: colorScheme.counterBgColor,
        counterColor: colorScheme.counterColor,
        matchCount: 0,
        filePath: currentFilePath,
        fileName: currentFile ? currentFile.basename : ''
      });
    }

    this.saveListData();
    // Re-apply highlights with pinned colors
    this.clearHighlights();
    this.showPinnedDecorations();
    // Also re-highlight current selection on top
    if (this.currentSelection) {
      this.highlightMatches();
    }
  }

  unpinSelection(selection) {
    const item = this.savedMatchLists.find(m => m.selection === selection && m.pinned);
    if (item) {
      item.pinned = false;
      delete item.colorIndex;
      delete item.borderColor;
      delete item.counterBgColor;
      delete item.counterColor;
      if (item._multiKeywordParent) {
        const parent = item._multiKeywordParent;
        this.savedMatchLists.forEach(m => {
          if (m._multiKeywordParent === parent && m.pinned) {
            m.pinned = false;
            delete m.colorIndex;
            delete m.borderColor;
            delete m.counterBgColor;
            delete m.counterColor;
          }
        });
      }
      this.saveListData();
    }
    this.clearHighlights();
    this.showPinnedDecorations();
    if (this.currentSelection) {
      this.highlightMatches();
    }
  }

  removePinnedSelection(selection) {
    const item = this.savedMatchLists.find(m => m.selection === selection);
    if (item && item._multiKeywordParent) {
      const parent = item._multiKeywordParent;
      this.savedMatchLists = this.savedMatchLists.filter(m => m._multiKeywordParent !== parent);
      this.saveListData();
    } else {
      const index = this.savedMatchLists.findIndex(m => m.selection === selection);
      if (index >= 0) {
        this.savedMatchLists.splice(index, 1);
        this.saveListData();
      }
    }
    this.clearHighlights();
    this.showPinnedDecorations();
    if (this.currentSelection) {
      this.highlightMatches();
    }
  }

  isReadingMode() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return false;
    const viewState = leaf.getViewState();
    return viewState && viewState.state && viewState.state.mode === 'preview';
  }

  getReadingViewScrollEl() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return null;
    const containerEl = leaf.view.containerEl;
    if (!containerEl) return null;

    // Try to find the actual scrolling container by checking which element has scrollable content
    const candidates = [
      containerEl.querySelector('.markdown-reading-view'),
      containerEl.querySelector('.markdown-preview-view'),
      containerEl.querySelector('.workspace-leaf-content'),
      containerEl.querySelector('.view-content'),
    ];

    for (const el of candidates) {
      if (el && el.scrollHeight > el.clientHeight + 1) {
        return el;
      }
    }

    // Fallback: find any scrollable ancestor of the reading view
    const readingView = containerEl.querySelector('.markdown-reading-view') ||
                        containerEl.querySelector('.markdown-preview-view');
    if (readingView) {
      let parent = readingView.parentElement;
      while (parent && parent !== containerEl) {
        if (parent.scrollHeight > parent.clientHeight + 1) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }

    return readingView || containerEl;
  }

  getReadingViewContentEl() {
    const leaf = this.app.workspace.activeLeaf;
    if (!leaf) return null;
    const containerEl = leaf.view.containerEl;
    if (!containerEl) return null;
    return containerEl.querySelector('.markdown-reading-view') ||
           containerEl.querySelector('.markdown-preview-view');
  }

  async getFileContent() {
    const file = this.app.workspace.activeLeaf?.view?.file;
    if (!file) return '';
    try {
      return await this.app.vault.read(file);
    } catch (e) {
      return '';
    }
  }

  registerEvents() {
    // Track mouse position for pin icon follow mode
    document.addEventListener('mousemove', (e) => {
      this._lastMouseX = e.clientX;
      this._lastMouseY = e.clientY;
    });

    this.registerEvent(
      this.app.workspace.on('editor-change', () => {
        this.scheduleUpdate();
      })
    );

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', (leaf) => {
        if (this.isPreviewOpen && this.previewSourceLeaf && leaf !== this.previewSourceLeaf) {
          this.closePreview();
          return;
        }
        // Clear count when document changes if clearCountOnClose is enabled
        if (this.settings.clearCountOnClose) {
          this.savedMatchLists = [];
          this.saveListData();
        }
        this.hidePinIcon();
        this.clearHighlights();
        this.hideAllMatchListIndicators();
        this.setupMinimap();
        this.updateMinimapContent();
        this.handleSelection();
        // Setup SwiftMatch export navigation
        this._setupSwiftMatchExportNav();
      })
    );

    // Listen for mode changes (source <-> reading)
    this.registerEvent(
      this.app.workspace.on('layout-change', () => {
        if (this._isApplyingReadingHighlights) return;
        this.clearHighlights();
        this.hideAllMatchListIndicators();
        this.setupMinimap();
        this.updateMinimapContent();
        // Re-apply highlights after layout change if there's a current selection
        if (this.currentSelection) {
          setTimeout(() => this.handleSelection(), 150);
        }
      })
    );

    // Handle text selection in reading mode via mouseup
    this._readingModeMouseUpHandler = (e) => {
      if (this.isReadingMode()) {
        // Don't trigger if mouseup is inside the match list (text selection)
        const isInsideMatchList = this.matchList && this.matchList.contains(e.target);
        const isInsideKeywordBtn = e.target.closest('.swift-match-keyword-btn-wrapper');
        if (!isInsideMatchList && !isInsideKeywordBtn) {
          setTimeout(() => this.handleSelection(), 100);
        }
      }
    };
    document.addEventListener('mouseup', this._readingModeMouseUpHandler);

    // Handle keyup for keyboard-based selection in reading mode
    this._readingModeKeyUpHandler = (e) => {
      if (this.isReadingMode() && e.shiftKey) {
        setTimeout(() => this.handleSelection(), 100);
      }
    };
    document.addEventListener('keyup', this._readingModeKeyUpHandler);

    this.registerEvent(
      this.app.vault.on('modify', (file) => {
      })
    );

    this.registerEvent(
      this.app.vault.on('delete', (file) => {
      })
    );

    this.registerEvent(
      this.app.vault.on('rename', (file, oldPath) => {
      })
    );

    window.addEventListener('resize', () => {
      this.updateMinimapContent();
      this.clampFloatingTogglePosition();
    });

    this.registerInterval(
      window.setInterval(() => {
        this.updateViewport();
      }, 50)
    );
  }

  scheduleUpdate() {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => {
      this.updateMinimapContent();
      this.handleSelection();
    }, 150);
  }

  handleSelection() {
    if (this.isJumping) return;
    if (this.isPreviewOpen) return;

    if (this.isReadingMode()) {
      const sel = window.getSelection();
      const selectionText = sel ? sel.toString().trim() : '';
      if (selectionText.length > 0) {
        if (this._chipSwitching && selectionText === this.currentSelection) return;
        this._chipSwitching = false;
        clearTimeout(this._chipSwitchTimer);
        if (this.currentSelection !== selectionText) this._listUserDismissed = false;
        this.currentSelection = selectionText;
        this.currentCursor = null;
        this.highlightMatches();
        this.showPinIcon();
      } else if (this._isApplyingReadingHighlights) {
        return;
      } else {
        if (this._chipSwitching) return;
        this.currentSelection = '';
        this.hidePinIcon();
        this.clearHighlights();
        this.hideNonPinnedIndicators();
        this.showPinnedDecorations();
      }
    } else {
      const editor = this.getEditor();
      if (!editor) return;

      const selection = editor.getSelection();
      if (selection && selection.trim().length > 0) {
        if (this._chipSwitching && selection.trim() === this.currentSelection) return;
        this._chipSwitching = false;
        clearTimeout(this._chipSwitchTimer);
        if (this.currentSelection !== selection.trim()) this._listUserDismissed = false;
        this.currentSelection = selection.trim();
        this.currentCursor = editor.getCursor();
        this.highlightMatches();
        this.showPinIcon();
      } else {
        if (this._chipSwitching) return;
        this.currentSelection = '';
        this.hidePinIcon();
        this.clearHighlights();
        this.hideNonPinnedIndicators();
        this.showPinnedDecorations();
      }
    }
  }

  highlightMatches() {
    if (!this.minimapContainer || !this.currentSelection || this.isDragging) return;

    this.clearHighlights();
    this.hideAllMatchListIndicators();

    const selection = this.currentSelection;

    if (selection.length < 1) return;

    if (selection.length === 1 && !/[a-zA-Z0-9\u4e00-\u9fa5]/.test(selection)) return;

    this.showAllPinnedIndicators();

    const isReading = this.isReadingMode();

    let content;
    if (isReading) {
      content = this.minimapContent.textContent || '';
    } else {
      const editor = this.getEditor();
      if (!editor || !editor.cm) return;
      content = editor.getValue();
    }

    const containerHeight = this.minimapContainer.clientHeight;
    const lineCount = content.split('\n').length;
    const currentLine = (!isReading && this.currentCursor) ? this.currentCursor.line : -1;

    const lineHeightInMinimap = 2;
    const naturalContentHeight = lineCount * lineHeightInMinimap;
    const contentHeight = Math.min(containerHeight, naturalContentHeight);

    const lines = content.split('\n');
    const matchLines = [];

    const searchLower = selection.toLowerCase();
    for (let i = 0; i < lines.length; i++) {
      const lineLower = lines[i].toLowerCase();
      let pos = 0;
      while ((pos = lineLower.indexOf(searchLower, pos)) !== -1) {
        if (!matchLines.some(m => m.line === i && m.pos === pos)) {
          matchLines.push({ line: i, pos: pos, index: matchLines.length + 1 });
        }
        pos += 1;
      }
    }
    const totalMatches = matchLines.length;

    const fragment = document.createDocumentFragment();

    const currentCursor = (!isReading && this.currentCursor) ? this.currentCursor.ch : 0;

    const currentColorScheme = this.getCurrentSelectionColorScheme();

    for (let idx = 0; idx < matchLines.length; idx++) {
      const match = matchLines[idx];
      const i = match.line;

      const highlight = document.createElement('div');
      highlight.dataset.matchIndex = match.index;

      const highlightHeight = Math.max(4, contentHeight / Math.max(1, lineCount));
      const topPercentage = i / Math.max(1, lineCount - 1);
      const top = topPercentage * contentHeight;

      if (i === currentLine) {
        highlight.className = 'minimap-highlight minimap-highlight-current';
        highlight.style.backgroundColor = currentColorScheme.borderColor;
      } else {
        highlight.className = 'minimap-highlight';
        highlight.style.backgroundColor = currentColorScheme.borderColor;
      }

      highlight.style.left = '0';
      highlight.style.top = `${top}px`;
      highlight.style.width = '100%';
      highlight.style.height = `${highlightHeight}px`;
      highlight.dataset.matchTotal = totalMatches;
      highlight.dataset.line = i;
      highlight.dataset.pos = match.pos;

      const targetMatch = match;
      const tooltip = this.tooltip;

      highlight.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.jumpToMatch(targetMatch);
      });

      highlight.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
      });

      highlight.addEventListener('mouseenter', (e) => {
        if (!tooltip) return;
        tooltip.textContent = `${highlight.dataset.matchIndex}/${highlight.dataset.matchTotal}`;
        tooltip.style.display = 'block';
      });

      highlight.addEventListener('mousemove', (e) => {
        if (!tooltip) return;
        let left = e.clientX + 15;
        let top = e.clientY - 30;
        if (left + 80 > window.innerWidth) left = window.innerWidth - 90;
        if (top < 10) top = 10;
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      highlight.addEventListener('mouseleave', () => {
        if (!tooltip) return;
        tooltip.style.display = 'none';
      });

      fragment.appendChild(highlight);
      this.highlights.push(highlight);
    }

    this.minimapContainer.appendChild(fragment);

    if (isReading) {
      this.showPinnedDecorations();
      const isCurrentPinned = this.currentSelection && this.savedMatchLists.some(m => m.selection === this.currentSelection && m.pinned);
      if (!isCurrentPinned) {
        this.addReadingViewHighlights(selection, totalMatches, this.getCurrentSelectionColorScheme());
      }
    } else {
      const editor = this.getEditor();
      if (editor && editor.cm) {
        this.addEditorDecorationsWithPinned(editor.cm, matchLines, totalMatches);
      }
    }

    if (totalMatches > 0) {
      this.saveCurrentMatchList(selection, totalMatches);
    } else {
      this.hideAllMatchListIndicators();
    }

    this.showMatchList(selection, matchLines.length);
  }

  addReadingViewHighlights(searchText, totalMatches, colorScheme = null) {
    const readingEl = this.getReadingViewContentEl();
    if (!readingEl) return;

    const savedItem = this.savedMatchLists.find(m => m.selection === searchText);
    const hideCounter = savedItem && savedItem.countHidden;

    this._isApplyingReadingHighlights = true;

    // Disconnect previous observer
    if (this._readingViewObserver) {
      this._readingViewObserver.disconnect();
      this._readingViewObserver = null;
    }
    if (this._readingHighlightRetryTimer) {
      clearTimeout(this._readingHighlightRetryTimer);
      this._readingHighlightRetryTimer = null;
    }

    const borderColor = colorScheme ? colorScheme.borderColor : this.getCurrentSelectionColorScheme().borderColor;

    const counterColor = colorScheme ? colorScheme.counterColor : this.getCurrentSelectionColorScheme().counterColor;
    const counterBgColor = colorScheme ? colorScheme.counterBgColor : this.getCurrentSelectionColorScheme().counterBgColor;
    const counterSize = this.settings.counterSize;
    const counterPadding = '0px 2px';
    const counterTopOffset = `${this.settings.counterTopOffset}px`;

    readingEl.style.setProperty('--minimap-match-color', borderColor);

    readingEl.style.setProperty('--minimap-counter-opacity', 1);
    readingEl.style.setProperty('--minimap-counter-color', counterColor);
    const preset = this.settings.counterStylePreset || 'glass';
    readingEl.style.setProperty('--minimap-counter-bgcolor', preset === 'outlined' ? counterBgColor : this.hexToRgba(counterBgColor, 1));
    readingEl.style.setProperty('--minimap-counter-size', `${counterSize}px`);
    readingEl.style.setProperty('--minimap-counter-padding', counterPadding);
    readingEl.style.setProperty('--minimap-counter-top-offset', counterTopOffset);

    this._readingViewHighlightNodes = [];

    const walker = document.createTreeWalker(readingEl, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    const searchLower = searchText.toLowerCase();
    let matchIndex = 0;

    for (const textNode of textNodes) {
      const text = textNode.textContent;
      const textLower = text.toLowerCase();
      let pos = 0;
      let matchPos;

      const fragments = [];
      let lastEnd = 0;

      while ((matchPos = textLower.indexOf(searchLower, pos)) !== -1) {
        if (matchPos > lastEnd) {
          fragments.push(document.createTextNode(text.substring(lastEnd, matchPos)));
        }

        const mark = document.createElement('mark');
        mark.className = `minimap-reading-match${this.getCounterPresetClass()}${hideCounter ? ' minimap-hide-counter' : ''}`;
        mark.textContent = text.substring(matchPos, matchPos + searchText.length);
        const matchOpacity = this.settings.matchOpacity ?? 0.6;
        const c = this.hexToRgba(borderColor, matchOpacity);
        mark.style.cssText = `margin:0 -0.2em;padding:0 0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:radial-gradient(farthest-side,${c} 98%,#0000) bottom left,linear-gradient(${c} 0 0) bottom,radial-gradient(farthest-side,${c} 98%,#0000) bottom right;background-size:8px 8px,calc(100% - 8px) 8px;background-repeat:no-repeat;`;
        mark.dataset.matchIndex = ++matchIndex;
        mark.dataset.matchTotal = totalMatches;
        mark.dataset.match = `${matchIndex}/${totalMatches}`;
        fragments.push(mark);
        this._readingViewHighlightNodes.push(mark);

        lastEnd = matchPos + searchText.length;
        pos = lastEnd;
      }

      if (fragments.length > 0) {
        if (lastEnd < text.length) {
          fragments.push(document.createTextNode(text.substring(lastEnd)));
        }
        const parent = textNode.parentNode;
        if (parent) {
          const span = document.createElement('span');
          for (const f of fragments) {
            span.appendChild(f);
          }
          parent.replaceChild(span, textNode);
        }
      }
    }

    // Set up MutationObserver to re-apply highlights when DOM is re-rendered
    const self = this;
    this._readingViewObserver = new MutationObserver((mutations) => {
      // Check if our highlights were removed
      if (!self.currentSelection || self._isApplyingReadingHighlights) return;

      const existingMarks = readingEl.querySelectorAll('mark.minimap-reading-match');
      if (existingMarks.length === 0) {
        // Our highlights were removed, re-apply them
        self._isApplyingReadingHighlights = true;
        if (self._readingHighlightRetryTimer) clearTimeout(self._readingHighlightRetryTimer);
        self._readingHighlightRetryTimer = setTimeout(() => {
          if (self.currentSelection && self.isReadingMode()) {
            self.addReadingViewHighlights(self.currentSelection, self._lastTotalMatches || 0);
          }
        }, 100);
      }
    });

    this._readingViewObserver.observe(readingEl, {
      childList: true,
      subtree: true
    });

    this._lastTotalMatches = totalMatches;

    // Clear the flag after a short delay to allow DOM changes to settle
    setTimeout(() => {
      this._isApplyingReadingHighlights = false;
    }, 300);
  }

  clearReadingViewHighlights() {
    // Disconnect observer before clearing
    if (this._readingViewObserver) {
      this._readingViewObserver.disconnect();
      this._readingViewObserver = null;
    }
    if (this._readingHighlightRetryTimer) {
      clearTimeout(this._readingHighlightRetryTimer);
      this._readingHighlightRetryTimer = null;
    }

    const readingEl = this.getReadingViewContentEl();
    if (!readingEl) return;

    const marks = readingEl.querySelectorAll('mark.minimap-reading-match');
    for (const mark of marks) {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      }
    }

    // Clean up wrapper spans that we may have created
    const wrapperSpans = readingEl.querySelectorAll('span');
    for (const span of wrapperSpans) {
      if (span.className === '' && span.parentNode && !span.dataset.matchIndex) {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
      }
    }

    this._readingViewHighlightNodes = [];
  }

  hideAllMatchListIndicators() {
    for (const indicator of this.matchListIndicators) {
      if (indicator && indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    }
    this.matchListIndicators = [];
  }

  hideNonPinnedIndicators() {
    const toRemove = [];
    for (const indicator of this.matchListIndicators) {
      if (!indicator.classList.contains('pinned')) {
        if (indicator.parentNode) {
          indicator.parentNode.removeChild(indicator);
        }
        toRemove.push(indicator);
      } else {
        indicator.classList.remove('current');
      }
    }
    this.matchListIndicators = this.matchListIndicators.filter(ind => !toRemove.includes(ind));
  }

  showPinnedIndicators(selection) {
  }

  hidePinnedIndicators(selection) {
  }

  updatePinnedIndicatorsPosition() {
  }

  createMissingPinnedIndicators() {
  }

  async showAllPinnedIndicators() {
    this.createMissingPinnedIndicators();
  }

  async saveCurrentMatchList(selection, matchCount) {
    const file = this.app.workspace.activeLeaf?.view?.file;
    if (!file) return;

    const existingIndex = this.savedMatchLists.findIndex(m => m.selection === selection);
    
    if (existingIndex >= 0) {
      this.savedMatchLists[existingIndex].filePath = file.path;
      this.savedMatchLists[existingIndex].fileName = file.basename;
      this.savedMatchLists[existingIndex].matchCount = matchCount;

      if (!this.isReadingMode()) {
        const editor = this.getEditor();
        if (editor) {
          const cursor = editor.getCursor('from');
          if (cursor) {
            this.savedMatchLists[existingIndex].line = cursor.line;
            this.savedMatchLists[existingIndex].ch = cursor.ch;
          }
        }
      }

      this.saveListData();
    }
  }

  updateFloatingToggleBadge(docCount, matchCount) {
    if (!this.floatingToggle) return;
    const textEl = this.floatingToggleText;
    if (!textEl) return;
    const toggleText = this.settings.floatingToggleText || 'Swift';
    const isPinned = this.currentSelection && this.savedMatchLists.some(m => m.selection === this.currentSelection && m.pinned);
    if (!this.currentSelection) {
      textEl.textContent = toggleText;
    } else if (docCount > 0) {
      const docStr = docCount > 99 ? '99+' : docCount;
      const matchStr = matchCount > 0 ? (matchCount > 999 ? '999+' : matchCount) : '';
      textEl.textContent = matchStr ? `${docStr}|${matchStr}` : `${docStr}`;
      // Show pin indicator
      if (isPinned) {
        const pinColorScheme = this.savedMatchLists.find(m => m.selection === this.currentSelection && m.pinned);
        if (pinColorScheme && pinColorScheme.borderColor) {
          this.floatingToggle.style.boxShadow = `inset 0 0 0 2px ${pinColorScheme.borderColor}, 0 2px 10px rgba(0,0,0,0.05)`;
        }
      }
    } else {
      textEl.textContent = toggleText;
    }
    // Clear pin border if not pinned
    if (!isPinned && this.floatingToggle) {
      const activeStyle = this.getActiveFloatingStyle();
      const hasCustomStyle = activeStyle ? !!(activeStyle.styleClass || activeStyle.customStyle) : !!(this.settings.floatingToggleStyleClass || this.settings.floatingToggleCustomStyle);
      if (hasCustomStyle) {
        this.floatingToggle.style.boxShadow = '';
      } else {
        this.floatingToggle.style.boxShadow = 'inset 0 0 0 1px rgba(240, 120, 100, 0.4), 0 2px 10px rgba(0, 0, 0, 0.05)';
      }
    }
    // Re-apply strikethrough if disabled
    if (!this.settings.enableSelectionMatch) {
      textEl.style.textDecoration = 'line-through';
      textEl.style.textDecorationColor = 'rgba(240, 100, 120, 0.7)';
    }
  }

  async _performMatchListSearch(searchText, matchCount, cacheOnly = false) {
    const cacheKey = searchText;
    
    const savedData = this.savedMatchLists.find(m => m.selection === searchText);
    if (savedData && savedData.pinned && savedData.fileMapData) {
      const fileMap = await this.deserializeFileMap(savedData.fileMapData);
      if (fileMap && fileMap.size > 0) {
        this._cachedMatchList = fileMap;
        this._cachedMatchListKey = cacheKey;
        return;
      }
    }

    if (this._cachedMatchList && this._cachedMatchListKey === cacheKey) {
      return;
    }

    this._searchGeneration++;
    const gen = this._searchGeneration;
    this._searchInProgress = true;

    const allFiles = this.app.vault.getMarkdownFiles();
    const searchLower = searchText.toLowerCase();
    
    const fileMap = new Map();
    let totalAllDocMatches = 0;
    
    for (const file of allFiles) {
      if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
      if (file.name.toLowerCase().includes(searchLower)) {
        fileMap.set(file, [{ text: file.basename, level: 0, type: 'content' }]);
        totalAllDocMatches += file.name.toLowerCase().split(searchLower).length - 1;
      }
      if (fileMap.size >= 50) break;
    }

    const remainingFiles = allFiles.filter(f => !fileMap.has(f));
    
    for (const file of remainingFiles) {
        if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
        if (fileMap.size >= 50) break;
        
        try {
          const content = await this.app.vault.cachedRead(file);
          if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
          if (content && content.toLowerCase().includes(searchLower)) {
            const lines = content.split('\n');
            const snippets = [];
            for (let i = 0; i < lines.length && snippets.length < 30; i++) {
              const lineLower = lines[i].toLowerCase();
              const idx = lineLower.indexOf(searchLower);
              if (idx !== -1) {
                const trimmed = lines[i].trim();
                if (trimmed.length > 0) {
                  let snippet = trimmed;
                  let fullLine = trimmed;
                  let truncateStart = 0;
                  let truncateEnd = trimmed.length;
                  if (snippet.length > 120) {
                    const matchIdx = snippet.toLowerCase().indexOf(searchLower);
                    truncateStart = Math.max(0, matchIdx - 30);
                    truncateEnd = Math.min(snippet.length, matchIdx + searchLower.length + 70);
                    snippet = snippet.slice(truncateStart, truncateEnd);
                  }
                  snippets.push({ text: snippet, fullLine, truncateStart, truncateEnd });
                }
              }
            }
            if (snippets.length > 0) {
              fileMap.set(file, [{ text: file.basename, level: 0, type: 'content', snippets }]);
              totalAllDocMatches += content.toLowerCase().split(searchLower).length - 1;
            } else {
              fileMap.set(file, [{ text: file.basename, level: 0 }]);
            }
          }
        } catch (e) {
          continue;
        }
      }

    if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
    this._searchInProgress = false;
    this._cachedMatchList = fileMap;
    this._cachedMatchListKey = cacheKey;
    this._pendingMatchCount = totalAllDocMatches;
    if (cacheKey && fileMap && fileMap.size > 0) {
      this._recentSearchCaches[cacheKey] = { fileMap, matchCount: totalAllDocMatches };
    }
  }

  showMatchListFromFloatingToggle() {
    this._listUserDismissed = false;
    this._exhaustiveSearchDone = false;
    this._listTriggerElement = this.floatingToggleWrapper || null;
    const pendingTerm = this._pendingSearchText;
    let restoreTerm, restoreFileMap, restoreMatchCount;
    if (pendingTerm && pendingTerm !== this._lastListSearchTerm) {
      restoreTerm = pendingTerm;
      const memCached = this._recentSearchCaches[pendingTerm];
      if (memCached && memCached.fileMap && memCached.fileMap.size > 0) {
        restoreFileMap = memCached.fileMap;
        restoreMatchCount = memCached.matchCount || this._pendingMatchCount;
      } else if (this._cachedMatchListKey === pendingTerm && this._cachedMatchList) {
        restoreFileMap = this._cachedMatchList;
        restoreMatchCount = this._pendingMatchCount;
      } else {
        restoreFileMap = this._lastListFileMap || this._cachedMatchList;
        restoreMatchCount = this._lastListMatchCount || this._pendingMatchCount;
      }
    } else {
      restoreTerm = this._lastListSearchTerm || pendingTerm;
      restoreFileMap = this._lastListFileMap || this._cachedMatchList;
      restoreMatchCount = this._lastListMatchCount || this._pendingMatchCount;
    }

    if (!restoreFileMap || !restoreTerm) {
      // If search is in progress, show the list and wait for results
      if (this._searchInProgress && pendingTerm) {
        this._isListVisible = true;
        this._showMatchListLoading(pendingTerm);
        this.positionListNearFloatingToggle();
      }
      return;
    }
    this._pendingShowList = { searchText: restoreTerm, matchCount: restoreMatchCount };
    this._isListVisible = true;
    this.renderMatchList(restoreFileMap, restoreMatchCount, false);
    this._listShownFromHover = true;
    
    // Position the list near the floating toggle
    this.positionListNearFloatingToggle();
    
    // Add mouseleave handler to hide list when mouse leaves both list and toggle
    if (!this._matchListHoverLeaveHandler) {
      this._matchListHoverLeaveHandler = () => {
        setTimeout(() => {
          const listHovered = this.matchList && this.matchList.matches(':hover');
          const toggleHovered = this.floatingToggle && this.floatingToggle.matches(':hover');
          const toggleWrapperHovered = this.floatingToggleWrapper && this.floatingToggleWrapper.matches(':hover');
          const previewHovered = this.previewPanel && this.previewPanel.matches(':hover');
          const keywordBtnHovered = this._floatingKeywordButtons.some(b => b.wrapper.matches(':hover'));
          if (!listHovered && !toggleHovered && !toggleWrapperHovered && !previewHovered && !keywordBtnHovered) {
            this.hideMatchList();
            this._listShownFromHover = false;
          }
        }, 300);
      };
      this.matchList.addEventListener('mouseleave', this._matchListHoverLeaveHandler);
    }
  }

  _createSearchChip(term, options = {}) {
    const { isFavorite, isCurrentSearch, searchText } = options;
    const chip = document.createElement('span');
    chip.className = 'minimap-match-list-recent-chip';
    const baseBg = isCurrentSearch ? 'var(--interactive-accent)' : 'var(--background-secondary)';
    const baseColor = isCurrentSearch ? 'var(--text-on-accent)' : 'var(--text-muted)';
    const baseBorder = isCurrentSearch ? 'var(--interactive-accent)' : 'var(--background-modifier-border)';
    chip.style.cssText = `font-size:11px;padding:1px 6px;border-radius:8px;cursor:pointer;border:1px solid ${baseBorder};background:${baseBg};color:${baseColor};white-space:nowrap;transition:background 0.15s,color 0.15s;display:inline-flex;align-items:center;gap:3px;`;
    chip.textContent = term;

    const isFav = this._favoriteSearches.includes(term);

    const chipStar = document.createElement('span');
    chipStar.textContent = isFav ? '★' : '☆';
    chipStar.style.cssText = `font-size:10px;cursor:pointer;color:${isFav ? '#ff6600' : 'var(--text-faint)'};transition:color 0.15s;line-height:1;flex-shrink:0;`;
    chipStar.title = isFav ? t('removeFavorite') : t('addFavorite');
    chipStar.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isInteractingWithList = true;
    });
    chipStar.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const favIdx = this._favoriteSearches.indexOf(term);
      if (favIdx >= 0) {
        this._favoriteSearches.splice(favIdx, 1);
        chipStar.textContent = '☆';
        chipStar.style.color = 'var(--text-faint)';
        chipStar.title = t('addFavorite');
      } else {
        this._favoriteSearches.push(term);
        chipStar.textContent = '★';
        chipStar.style.color = '#ff6600';
        chipStar.title = t('removeFavorite');
      }
      this.saveListData();
      const favSection = this.matchList?.querySelector('.swift-match-favorites-section');
      if (favSection) {
        const parent = favSection.parentNode;
        parent.removeChild(favSection);
        const newFavSection = this._createFavoritesSection(searchText);
        const recentSec = this.matchList?.querySelector('.minimap-match-list-recent');
        if (recentSec) {
          parent.insertBefore(newFavSection, recentSec);
        } else {
          parent.appendChild(newFavSection);
        }
      }
    });
    chip.insertBefore(chipStar, chip.firstChild);

    const chipPin = document.createElement('span');
    const isAlreadyFloating = this._floatingKeywordButtons.some(b => b.term === term);
    chipPin.textContent = '📌';
    chipPin.style.cssText = `font-size:9px;cursor:pointer;opacity:${isAlreadyFloating ? '1' : '0.3'};transition:opacity 0.15s;line-height:1;flex-shrink:0;`;
    chipPin.title = isAlreadyFloating ? t('removeFloat') : t('floatThisWord');
    chipPin.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.isInteractingWithList = true;
    });
    chipPin.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isFloating = this._floatingKeywordButtons.some(b => b.term === term);
      if (isFloating) {
        this.removeFloatingKeywordButton(term);
        chipPin.style.opacity = '0.3';
        chipPin.title = t('floatThisWord');
      } else {
        const cached = this._recentSearchCaches[term];
        if (cached && cached.fileMap && cached.fileMap.size > 0) {
          this.createFloatingKeywordButton(term, cached.fileMap, cached.matchCount);
        } else {
          this.createFloatingKeywordButton(term, new Map(), 0);
        }
        chipPin.style.opacity = '1';
        chipPin.title = t('removeFloat');
      }
    });
    chip.appendChild(chipPin);

    chip.addEventListener('mousedown', (e) => {
      if (e.target === chipStar || e.target === chipPin) return;
      e.stopPropagation();
      this.isInteractingWithList = true;
      if (e.button === 1) {
        e.preventDefault();
        if (isFavorite) {
          const favIdx = this._favoriteSearches.indexOf(term);
          if (favIdx >= 0) this._favoriteSearches.splice(favIdx, 1);
          delete this._recentSearchCaches[term];
          this.deleteSearchCache(term);
          delete this._listScrollPositions[term];
        } else {
          const idx = this._recentSearches.indexOf(term);
          if (idx >= 0) this._recentSearches.splice(idx, 1);
          if (!this._favoriteSearches.includes(term)) {
            delete this._recentSearchCaches[term];
            this.deleteSearchCache(term);
            delete this._listScrollPositions[term];
          }
        }
        this.saveListData();
        chip.remove();
      }
    });
    chip.addEventListener('click', async (e) => {
      if (e.target === chipStar || e.target === chipPin) return;
      e.stopPropagation();
      this.isInteractingWithList = true;
      this._keepListVisible = true;
      this._chipSwitching = true;
      clearTimeout(this._chipSwitchTimer);
      this._chipSwitchTimer = setTimeout(() => { this._chipSwitching = false; }, 5000);
      this.currentSelection = term;
      this._listUserDismissed = false;
      this._exhaustiveSearchDone = false;
      this._pendingSearchText = term;
      if (this._searchInProgress) this._searchGeneration++;
      let cached = this._recentSearchCaches[term];
      if (!cached || !cached.fileMap || cached.fileMap.size === 0) {
        const diskCache = await this.loadSearchCache(term);
        if (diskCache && diskCache.fileMap && diskCache.fileMap.size > 0) {
          cached = diskCache;
          this._recentSearchCaches[term] = diskCache;
        }
      }
      if (cached && cached.fileMap && cached.fileMap.size > 0) {
        this._cachedMatchList = cached.fileMap;
        this._cachedMatchListKey = term;
        this._pendingMatchCount = cached.matchCount;
        this._pendingShowList = { searchText: term, matchCount: cached.matchCount };
        this.highlightMatches();
        if (this._isListVisible) {
          this.renderMatchList(cached.fileMap, cached.matchCount, false);
        }
        this.updateFloatingToggleBadge(cached.fileMap.size, cached.matchCount);
      } else {
        this._pendingShowList = { searchText: term, matchCount: 0 };
        this._cachedMatchList = null;
        this._cachedMatchListKey = null;
        this._pendingMatchCount = 0;
        if (this._isListVisible) {
          this.renderMatchList(new Map(), 0, false);
        }
        this.updateFloatingToggleBadge(0, 0);
        this.highlightMatches();
      }
      this._keepListVisible = false;
    });
    chip.addEventListener('mouseenter', () => {
      if (!isCurrentSearch) {
        chip.style.background = 'var(--background-modifier-hover)';
        chip.style.color = 'var(--text-normal)';
      }
    });
    chip.addEventListener('mouseleave', () => {
      if (!isCurrentSearch) {
        chip.style.background = 'var(--background-secondary)';
        chip.style.color = 'var(--text-muted)';
      }
    });
    return chip;
  }

  _createFavoritesSection(searchText) {
    const section = document.createElement('div');
    section.className = 'swift-match-favorites-section';
    section.style.cssText = 'padding:4px 8px;border-bottom:1px solid var(--background-modifier-border);max-height:80px;overflow-y:auto;display:flex;flex-wrap:wrap;align-items:center;gap:4px;';

    const label = document.createElement('span');
    label.style.cssText = 'font-size:10px;color:var(--text-faint);flex-shrink:0;';
    label.textContent = t('favoriteSearch');
    section.appendChild(label);

    for (const term of this._favoriteSearches) {
      const isCurrentSearch = term === searchText;
      const chip = this._createSearchChip(term, { isFavorite: true, isCurrentSearch, searchText });
      section.appendChild(chip);
    }

    if (this._favoriteSearches.length === 0) {
      section.style.display = 'none';
    }
    if (this._favSectionScrollTop) {
      requestAnimationFrame(() => { section.scrollTop = this._favSectionScrollTop; });
    }
    return section;
  }

  showRecentSearchList() {
    if (!this.matchList) return;
    
    this.matchList.innerHTML = '';
    
    const header = document.createElement('div');
    header.className = 'minimap-match-list-header';
    header.addEventListener('mousedown', (e) => {
      this.isInteractingWithList = true;
    });
    
    const headerText = document.createElement('span');
    headerText.className = 'minimap-match-list-header-text';
    headerText.textContent = t('recentSearch');
    header.appendChild(headerText);

    if (this.floatingSearchBox) {
      this.floatingSearchBox.placeholder = t('searchPlaceholder');
      this.floatingSearchBox.style.marginLeft = '8px';
      header.appendChild(this.floatingSearchBox);
    }
    this.matchList.appendChild(header);

    // Favorites section
    const favSection = this._createFavoritesSection('');
    this.matchList.appendChild(favSection);

    // Recent searches section
    const recentSection = document.createElement('div');
    recentSection.className = 'minimap-match-list-recent';
    recentSection.style.cssText = 'padding:6px 8px;overflow-y:auto;display:flex;flex-wrap:wrap;align-items:center;gap:4px;';

    const recentLabel = document.createElement('span');
    recentLabel.style.cssText = 'font-size:10px;color:var(--text-faint);flex-shrink:0;';
    recentLabel.textContent = t('recentSearch');
    recentSection.appendChild(recentLabel);

    const searchesToShow = this._recentSearches.slice(0, 20);
    for (const term of searchesToShow) {
      const chipWrapper = this._createSearchChip(term, { searchText: '' });
      recentSection.appendChild(chipWrapper);
    }
    this.matchList.appendChild(recentSection);

    // Add resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'minimap-match-list-resize-handle';
    this.matchList.appendChild(resizeHandle);

    this.matchList.style.display = 'block';
    this.matchList.style.opacity = this.listOpacity;
    this._isListVisible = true;
    this._listShownFromHover = true;
    this.positionListNearFloatingToggle();

    if (this.floatingSearchBox) {
      setTimeout(() => { this.floatingSearchBox.focus(); }, 50);
    }

    // Add mouseleave handler
    if (!this._matchListHoverLeaveHandler) {
      this._matchListHoverLeaveHandler = () => {
        setTimeout(() => {
          const listHovered = this.matchList && this.matchList.matches(':hover');
          const toggleHovered = this.floatingToggle && this.floatingToggle.matches(':hover');
          const toggleWrapperHovered = this.floatingToggleWrapper && this.floatingToggleWrapper.matches(':hover');
          const previewHovered = this.previewPanel && this.previewPanel.matches(':hover');
          const keywordBtnHovered = this._floatingKeywordButtons.some(b => b.wrapper.matches(':hover'));
          if (!listHovered && !toggleHovered && !toggleWrapperHovered && !previewHovered && !keywordBtnHovered) {
            this.hideMatchList();
            this._listShownFromHover = false;
          }
        }, 300);
      };
      this.matchList.addEventListener('mouseleave', this._matchListHoverLeaveHandler);
    }
  }

  /**
   * Count words/characters for search limit checking.
   * - Pure CJK text (no spaces): count by characters (each CJK char = 1 unit)
   * - Mixed or Latin text: count by whitespace-separated words
   * This makes searchWordCountMin/Max work correctly for both Chinese and English.
   */
  countWords(text) {
    if (!text) return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    // If text contains CJK characters and no spaces, count CJK chars + non-CJK tokens
    const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf]/.test(trimmed);
    const hasWhitespace = /\s/.test(trimmed);
    if (hasCJK && !hasWhitespace) {
      // Pure CJK (or CJK + punctuation without spaces): count characters
      return trimmed.length;
    }
    if (hasCJK) {
      // Mixed CJK + Latin with spaces: count CJK chars individually + Latin words
      let count = 0;
      // Count CJK characters
      const cjkMatches = trimmed.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
      if (cjkMatches) count += cjkMatches.length;
      // Count Latin words (non-CJK, non-space sequences)
      const latinMatches = trimmed.match(/[^\s\u4e00-\u9fff\u3400-\u4dbf]+/g);
      if (latinMatches) count += latinMatches.length;
      return count;
    }
    // Pure Latin: count whitespace-separated words
    return trimmed.split(/\s+/).length;
  }

  async showMatchList(searchText, matchCount) {
    if (!this.matchList) return;
    if (!this.settings.enableSelectionMatch) return;

    // Check word count limits before proceeding with background search
    const wordLen = this.countWords(searchText);
    const minWords = this.settings.searchWordCountMin ?? 0;
    const maxWords = this.settings.searchWordCountMax ?? 0;
    if (minWords > 0 && wordLen < minWords) return;
    if (maxWords > 0 && wordLen > maxWords) return;

    // Reset exhaustive search flag when search text changes
    if (this._pendingSearchText !== searchText) {
      this._exhaustiveSearchDone = false;
    }

    // Always cache data and update badge, never auto-show the list
    this._pendingMatchCount = matchCount;
    this._pendingSearchText = searchText;

    // Record to recent searches (skip reorder when switching via chip)
    if (searchText && searchText.length > 0) {
      const idx = this._recentSearches.indexOf(searchText);
      if (idx >= 0) {
        if (!this._chipSwitching) {
          this._recentSearches.splice(idx, 1);
          this._recentSearches.unshift(searchText);
        }
      } else {
        this._recentSearches.unshift(searchText);
      }
      if (this._recentSearches.length > 20) {
        const removed = this._recentSearches.pop();
        if (!this._favoriteSearches.includes(removed)) {
          delete this._recentSearchCaches[removed];
          this.deleteSearchCache(removed);
          delete this._listScrollPositions[removed];
        }
      }
    }

    // When list is pinned to a specific search text
    if (this._listPinnedSearchText && this._listPinnedSearchText !== searchText) {
      this._pendingShowList = { searchText, matchCount };
      const mk = this.parseMultiKeywords(searchText);
      if (mk) {
        this._multiKeywordData = null;
        this._showMatchListLoading(searchText);
        this.performMultiKeywordSearch(searchText, mk);
      } else if (this.settings.exhaustiveMode) {
        this.performExhaustiveSearch(searchText, matchCount, null);
      } else {
        this._performMatchListSearch(searchText, matchCount, true).then(() => {
          const docCount = this._cachedMatchList ? this._cachedMatchList.size : 0;
          this.updateFloatingToggleBadge(docCount, matchCount);
        });
      }
      return;
    }

    // Multi-keyword search (pipe-separated)
    const multiKeywords = this.parseMultiKeywords(searchText);
    if (multiKeywords) {
      this._pendingShowList = { searchText, matchCount };
      this._multiKeywordData = null;
      if (!this._exhaustiveSearchDone) {
        this._exhaustiveSearchDone = true;
        this._showMatchListLoading(searchText);
        this.performMultiKeywordSearch(searchText, multiKeywords);
      } else if (this._cachedMatchList && this._cachedMatchListKey === searchText) {
        this.updateFloatingToggleBadge(this._cachedMatchList.size, this._pendingMatchCount || matchCount);
        if (this._isListVisible) {
          this.renderMatchList(this._cachedMatchList, this._pendingMatchCount || matchCount, false);
        }
      }
      return;
    }

    // In exhaustive mode, skip heading cache and use full-text search directly
    if (this.settings.exhaustiveMode) {
      this._pendingShowList = { searchText, matchCount };
      if (!this._exhaustiveSearchDone) {
        this._exhaustiveSearchDone = true;
        this._showMatchListLoading(searchText);
        this.performExhaustiveSearch(searchText, matchCount, null);
      }
      return;
    }

    // Perform search in background, update badge with doc count
    const cacheKey = searchText;

    const savedData = this.savedMatchLists.find(m => m.selection === searchText);
    if (savedData && savedData.pinned && savedData.fileMapData) {
      const fileMap = await this.deserializeFileMap(savedData.fileMapData);
      if (fileMap && fileMap.size > 0) {
        this._pendingShowList = { searchText, matchCount };
        this._cachedMatchList = fileMap;
        this._cachedMatchListKey = cacheKey;
        this._recentSearchCaches[searchText] = { fileMap, matchCount };
        this.updateFloatingToggleBadge(fileMap.size, matchCount);
      if (this._searchInProgress) this._searchGeneration++;
        if (this._isListVisible) {
          this.renderMatchList(fileMap, matchCount, false);
        }
        return;
      }
    }

    if (this._cachedMatchList && this._cachedMatchListKey === cacheKey) {
      this._pendingShowList = { searchText, matchCount };
      this.updateFloatingToggleBadge(this._cachedMatchList.size, matchCount);
      if (this._searchInProgress) this._searchGeneration++;
      if (this._isListVisible) {
        this.renderMatchList(this._cachedMatchList, matchCount, false);
      }
      return;
    }

    const memCached = this._recentSearchCaches[searchText];
    if (memCached && memCached.fileMap && memCached.fileMap.size > 0) {
      this._cachedMatchList = memCached.fileMap;
      this._cachedMatchListKey = cacheKey;
      this._pendingShowList = { searchText, matchCount };
      this.updateFloatingToggleBadge(memCached.fileMap.size, memCached.matchCount || matchCount);
      if (this._searchInProgress) this._searchGeneration++;
      if (this._isListVisible) {
        this.renderMatchList(memCached.fileMap, memCached.matchCount || matchCount, false);
      }
      return;
    }

    const diskCache = await this.loadSearchCache(searchText);
    if (diskCache && diskCache.fileMap && diskCache.fileMap.size > 0) {
      this._cachedMatchList = diskCache.fileMap;
      this._cachedMatchListKey = cacheKey;
      this._recentSearchCaches[searchText] = diskCache;
      this._pendingShowList = { searchText, matchCount };
      this.updateFloatingToggleBadge(diskCache.fileMap.size, diskCache.matchCount || matchCount);
      if (this._searchInProgress) this._searchGeneration++;
      if (this._isListVisible) {
        this.renderMatchList(diskCache.fileMap, diskCache.matchCount || matchCount, false);
      }
      return;
    }

    this._searchGeneration++;
    const gen = this._searchGeneration;
    this._searchInProgress = true;
    this._pendingShowList = { searchText, matchCount };
    this._showMatchListLoading(searchText);

    const allFiles = this.app.vault.getMarkdownFiles();
    const searchLower = searchText.toLowerCase();
    
    const fileMap = new Map();
    let totalAllDocMatches = 0;
    
    for (const file of allFiles) {
      if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
      if (file.name.toLowerCase().includes(searchLower)) {
        fileMap.set(file, [{ text: file.basename, level: 0, type: 'content' }]);
        totalAllDocMatches += file.name.toLowerCase().split(searchLower).length - 1;
      }
      if (fileMap.size >= 50) break;
    }

    if (fileMap.size > 0 && this._searchGeneration === gen) {
      this.updateFloatingToggleBadge(fileMap.size, totalAllDocMatches);
      if (this._isListVisible) {
        this.renderMatchList(fileMap, matchCount, false);
      }
    }

    const remainingFiles = allFiles.filter(f => !fileMap.has(f));
    
    for (const file of remainingFiles) {
        if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
        try {
          const content = await this.app.vault.read(file);
          if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
          if (content && content.toLowerCase().includes(searchLower)) {
            const lines = content.split('\n');
            const snippets = [];
            for (let i = 0; i < lines.length && snippets.length < 30; i++) {
              const lineLower = lines[i].toLowerCase();
              const idx = lineLower.indexOf(searchLower);
              if (idx !== -1) {
                const trimmed = lines[i].trim();
                if (trimmed.length > 0) {
                  let snippet = trimmed;
                  let fullLine = trimmed;
                  let truncateStart = 0;
                  let truncateEnd = trimmed.length;
                  if (snippet.length > 120) {
                    const matchIdx = snippet.toLowerCase().indexOf(searchLower);
                    truncateStart = Math.max(0, matchIdx - 30);
                    truncateEnd = Math.min(snippet.length, matchIdx + searchLower.length + 70);
                    snippet = snippet.slice(truncateStart, truncateEnd);
                  }
                  snippets.push({ text: snippet, fullLine, truncateStart, truncateEnd });
                }
              }
            }
            if (snippets.length > 0 && this._searchGeneration === gen) {
              fileMap.set(file, [{ text: file.basename, level: 0, type: 'content', snippets }]);
              totalAllDocMatches += content.toLowerCase().split(searchLower).length - 1;
              this.updateFloatingToggleBadge(fileMap.size, totalAllDocMatches);
              if (this._isListVisible) {
                const isFirstMatch = fileMap.size === 1;
                this.renderMatchList(fileMap, matchCount, !isFirstMatch);
              }
            }
          }
        } catch (e) {
          continue;
        }
        
        if (fileMap.size >= 50) break;
      }

    if (this._searchGeneration === gen) {
      this._cachedMatchList = fileMap;
      this._cachedMatchListKey = cacheKey;
      this._recentSearchCaches[searchText] = { fileMap, matchCount: totalAllDocMatches };
      this._pendingMatchCount = totalAllDocMatches;
      
      await this.saveMatchListData(searchText, fileMap, totalAllDocMatches);
      if (this._isListVisible) {
        this.renderMatchList(fileMap, totalAllDocMatches, false);
      }
    }

    this._searchInProgress = false;
    this._pendingMatchCount = totalAllDocMatches;
    return fileMap;
  }

  async saveMatchListData(selection, fileMap, matchCount) {
    const fileMapData = await this.serializeFileMap(fileMap);
    
    const existingIndex = this.savedMatchLists.findIndex(m => m.selection === selection);
    
    const matchData = {
      selection: selection,
      matchCount: matchCount,
      fileMapData: fileMapData,
      timestamp: Date.now()
    };

    if (existingIndex >= 0) {
      this.savedMatchLists[existingIndex] = matchData;
    } else {
      this.savedMatchLists.unshift(matchData);
      if (this.savedMatchLists.length > 100) {
        this.savedMatchLists = this.savedMatchLists.slice(0, 100);
      }
    }

    this.saveListData();
  }

  async serializeFileMap(fileMap) {
    const data = [];
    for (const [file, headings] of fileMap) {
      data.push({
        path: file.path,
        basename: file.basename,
        headings: headings
      });
    }
    return data;
  }

  async deserializeFileMap(data) {
    const fileMap = new Map();
    const allFiles = this.app.vault.getMarkdownFiles();
    
    for (const item of data) {
      const file = allFiles.find(f => f.path === item.path);
      if (file) {
        fileMap.set(file, item.headings);
      }
    }
    
    return fileMap;
  }

  cancelSearch() {
    this._searchGeneration++;
  }

  async performExhaustiveSearch(searchText, matchCount, headerTextEl) {
    this._searchGeneration++;
    const gen = this._searchGeneration;
    this._searchInProgress = true;
    const fileMap = new Map();
    const searchLower = searchText.toLowerCase();
    let totalAllDocMatches = 0;

    const extractSnippets = (content, searchLower, maxSnippets = 30) => {
      const lines = content.split('\n');
      const snippets = [];
      for (let i = 0; i < lines.length && snippets.length < maxSnippets; i++) {
        const lineLower = lines[i].toLowerCase();
        const idx = lineLower.indexOf(searchLower);
        if (idx !== -1) {
          const trimmed = lines[i].trim();
          if (trimmed.length > 0) {
            let snippet = trimmed;
            let fullLine = trimmed;
            let truncateStart = 0;
            let truncateEnd = trimmed.length;
            if (snippet.length > 120) {
              const matchIdx = snippet.toLowerCase().indexOf(searchLower);
              truncateStart = Math.max(0, matchIdx - 30);
              truncateEnd = Math.min(snippet.length, matchIdx + searchLower.length + 70);
              snippet = snippet.slice(truncateStart, truncateEnd);
            }
            snippets.push({ text: snippet, fullLine, truncateStart, truncateEnd });
          }
        }
      }
      return snippets;
    };

    try {
      const searchPlugin = this.app.internalPlugins.plugins['search'];
      if (searchPlugin && searchPlugin.instance) {
        const rawResults = searchPlugin.instance.search(searchText);
        if (rawResults) {
          for (const result of rawResults) {
            const file = this.app.vault.getAbstractFileByPath(result.path);
            if (file && file.extension === 'md') {
              const items = [];
              if (result.matches) {
                for (const m of result.matches) {
                  const snippetText = m.match || searchText;
                  items.push({ text: snippetText, level: 0, type: 'content', snippet: snippetText });
                }
              }
              if (items.length === 0) {
                items.push({ text: file.basename, level: 0 });
              }
              totalAllDocMatches += result.matches ? result.matches.length : 1;
              fileMap.set(file, items);
            }
          }
        }
      }
    } catch (e) {
    }

    if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }

    if (fileMap.size === 0) {
      const allFiles = this.app.vault.getMarkdownFiles();
      for (const file of allFiles) {
        if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
        try {
          const nameMatch = file.name.toLowerCase().includes(searchLower);
          const content = await this.app.vault.cachedRead(file);
          if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
          const contentMatch = content && content.toLowerCase().includes(searchLower);
          if (nameMatch || contentMatch) {
            const snippets = contentMatch ? extractSnippets(content, searchLower) : [];
            const items = [{ text: file.basename, level: 0, type: 'content' }];
            if (snippets.length > 0) {
              items[0].snippets = snippets;
            }
            totalAllDocMatches += contentMatch ? (content.toLowerCase().split(searchLower).length - 1) : 1;
            fileMap.set(file, items);
          }
        } catch (e) {
          continue;
        }
        if (fileMap.size >= 200) break;
      }
    }

    if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }

    if (fileMap.size > 0) {
      for (const [file, items] of fileMap) {
        if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
        const hasContentSnippets = items.some(item => item.type === 'content' && (item.snippet || item.snippets));
        if (!hasContentSnippets) {
          try {
            const content = await this.app.vault.cachedRead(file);
            if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
            if (content) {
              const snippets = extractSnippets(content, searchLower);
              for (const item of items) {
                if (item.type === 'content' && !item.snippet && !item.snippets) {
                  item.snippets = snippets;
                  break;
                }
              }
            }
          } catch (e) {
          }
        }
      }
    }

    if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
    this._searchInProgress = false;
    this._cachedMatchList = fileMap;
    this._cachedMatchListKey = searchText;
    this._pendingShowList = { searchText, matchCount };
    this._pendingMatchCount = totalAllDocMatches;
    this._recentSearchCaches[searchText] = { fileMap, matchCount: totalAllDocMatches };
    this.updateFloatingToggleBadge(fileMap.size, totalAllDocMatches);

    // If list is already visible, refresh it
    if (this._isListVisible) {
      this.renderMatchList(fileMap, totalAllDocMatches, false);
    }
  }

  _showMatchListLoading(searchText) {
    if (!this.matchList) return;
    if (!this._isListVisible) {
      // Don't auto-show the list; just prepare data in the background
      return;
    } else {
      const container = this.matchList.querySelector('.minimap-match-list-container');
      if (container) {
        container.innerHTML = '';
        const loading = document.createElement('div');
        loading.style.cssText = 'padding:16px;text-align:center;color:var(--text-muted);font-size:12px;';
        loading.textContent = t('building');
        container.appendChild(loading);
      }
    }
  }

  renderMatchList(fileMap, matchCount, append = false) {
    const searchText = this._pendingShowList?.searchText || '';

    // Restore _multiKeywordData if it was cleared but searchText is multi-keyword
    if (!this._multiKeywordData && searchText) {
      const mk = this.parseMultiKeywords(searchText);
      if (mk) {
        const keywordColors = this.getMultiKeywordColors(mk.length);
        this._multiKeywordData = { keywords: mk, keywordColors };
      }
    }

    if (fileMap.size === 0) {
      if (!append && this._pendingShowList?.searchText) {
        this.matchList.innerHTML = '';
        const header = document.createElement('div');
        header.className = 'minimap-match-list-header';
        header.addEventListener('mousedown', (e) => {
          this.isInteractingWithList = true;
        });
        const headerText = document.createElement('span');
        headerText.className = 'minimap-match-list-header-text';
        headerText.textContent = `⏳ ${this._pendingShowList.searchText}`;
        header.appendChild(headerText);
        if (this.floatingSearchBox) {
          this.floatingSearchBox.placeholder = t('searchPlaceholder');
          this.floatingSearchBox.style.marginLeft = '8px';
          header.appendChild(this.floatingSearchBox);
        }
        this.matchList.appendChild(header);
        const favSec = this._createFavoritesSection(this._pendingShowList.searchText);
        if (favSec) this.matchList.appendChild(favSec);
        const recentSec = document.createElement('div');
        recentSec.className = 'minimap-match-list-recent';
        recentSec.style.cssText = 'padding:4px 8px;border-bottom:1px solid var(--background-modifier-border);max-height:80px;overflow-y:auto;display:flex;flex-wrap:wrap;align-items:center;gap:4px;';
        const recentLabel = document.createElement('span');
        recentLabel.style.cssText = 'font-size:10px;color:var(--text-faint);flex-shrink:0;';
        recentLabel.textContent = t('recentSearch');
        recentSec.appendChild(recentLabel);
        const searchesToShow = this._recentSearches.slice(0, 20);
        for (const rTerm of searchesToShow) {
          const chip = this._createSearchChip(rTerm, { isCurrentSearch: rTerm === this._pendingShowList.searchText, searchText: this._pendingShowList.searchText });
          recentSec.appendChild(chip);
        }
        this.matchList.appendChild(recentSec);
        const emptyContainer = document.createElement('div');
        emptyContainer.className = 'minimap-match-list-container';
        emptyContainer.style.cssText = 'padding:12px;text-align:center;color:var(--text-faint);font-size:12px;';
        emptyContainer.textContent = '...';
        this.matchList.appendChild(emptyContainer);
        if (this._isListVisible) {
          this.matchList.style.display = 'flex';
        }
      } else {
        this.matchList.style.display = 'none';
      }
      return;
    }

    if (!this._pendingShowList) {
      return;
    }

    if (!append) {
      // Preserve resize handle and scroll position when clearing
      const existingResizeHandle = this.matchList.querySelector('.minimap-match-list-resize-handle');
      const listContainer = this.matchList.querySelector('.minimap-match-list-container');
      // Only save current scrollTop if list is visible (display: none yields scrollTop=0)
      if (listContainer && this.matchList.style.display !== 'none') {
        this._savedListScrollTop = listContainer.scrollTop;
      }
      this.matchList.innerHTML = '';
      
      const header = document.createElement('div');
      header.className = 'minimap-match-list-header';
      header.addEventListener('mousedown', (e) => {
        this.isInteractingWithList = true;
      });
      
      const headerText = document.createElement('span');
      headerText.className = 'minimap-match-list-header-text';
      const totalMatchCount = this._pendingMatchCount || matchCount;
      headerText.textContent = this.settings.exhaustiveMode
        ? t('exhaustiveMatch', fileMap.size, totalMatchCount)
        : t('libraryMatch', fileMap.size, totalMatchCount);
      header.appendChild(headerText);
      
      // Mark/pin toggle removed per user request
      
      // Add save/export button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'minimap-match-list-save-btn';
      saveBtn.textContent = t('save');
      saveBtn.style.cssText = 'margin-left:8px;padding:2px 8px;font-size:11px;cursor:pointer;border:1px solid var(--background-modifier-border);border-radius:3px;background:var(--background-secondary);color:var(--text-muted);transition:color 0.15s,background 0.15s;flex-shrink:0;';
      saveBtn.title = t('exportMarkdown');
      saveBtn.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.isInteractingWithList = true;
      });
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exportMatchList(fileMap, searchText, matchCount);
      });
      saveBtn.addEventListener('mouseenter', () => {
        saveBtn.style.color = 'var(--text-normal)';
        saveBtn.style.background = 'var(--background-modifier-hover)';
      });
      saveBtn.addEventListener('mouseleave', () => {
        saveBtn.style.color = 'var(--text-muted)';
        saveBtn.style.background = 'var(--background-secondary)';
      });
      header.appendChild(saveBtn);

      if (this.floatingSearchBox) {
        this.floatingSearchBox.placeholder = t('searchPlaceholder');
        this.floatingSearchBox.style.marginLeft = '8px';
        header.appendChild(this.floatingSearchBox);
      }
      
      this.matchList.appendChild(header);

      // Favorites section
      const favSection = this._createFavoritesSection(searchText);
      this.matchList.appendChild(favSection);

      // Recent searches section in header
      const recentSection = document.createElement('div');
      recentSection.className = 'minimap-match-list-recent';
      recentSection.style.cssText = 'padding:4px 8px;border-bottom:1px solid var(--background-modifier-border);max-height:80px;overflow-y:auto;display:flex;flex-wrap:wrap;align-items:center;gap:4px;';

      const recentLabel = document.createElement('span');
      recentLabel.style.cssText = 'font-size:10px;color:var(--text-faint);flex-shrink:0;';
      recentLabel.textContent = t('recentSearch');
      recentSection.appendChild(recentLabel);

      const searchesToShow = this._recentSearches.slice(0, 20);
      for (const term of searchesToShow) {
        const isCurrentSearch = term === searchText;
        const chip = this._createSearchChip(term, { isCurrentSearch, searchText });
        recentSection.appendChild(chip);
      }
      this.matchList.appendChild(recentSection);

      const newContainer = document.createElement('div');
      newContainer.className = 'minimap-match-list-container';
      // Save scroll position on every scroll event for robust restoration
      newContainer.addEventListener('scroll', () => {
        const currentTerm = this._pendingShowList?.searchText || this._pendingSearchText;
        if (currentTerm) {
          this._listScrollPositions[currentTerm] = newContainer.scrollTop;
        }
        this._matchListScrollTop = newContainer.scrollTop;
      });
      this.matchList.appendChild(newContainer);
    }

    const listContainer = this.matchList.querySelector('.minimap-match-list-container');
    if (!listContainer) return;

    const existingPaths = new Set();
    listContainer.querySelectorAll('.swift-match-group').forEach(el => {
      existingPaths.add(el.dataset.filePath);
    });

    // 文件颜色方案（不同文件用不同色相）
    const fileHues = [210, 30, 150, 340, 270, 60, 180, 90];
    let globalFileIndex = existingPaths.size;

    fileMap.forEach((items, file) => {
      if (existingPaths.has(file.path)) return;

      const fileHue = fileHues[globalFileIndex % fileHues.length];
      const fileNameBg = `hsl(${fileHue},50%,90%)`;
      const fileNameColor = `hsl(${fileHue},50%,35%)`;
      const dotColor = `hsl(${fileHue},50%,50%)`;

      // 文件分组容器
      const groupEl = document.createElement('div');
      groupEl.className = 'swift-match-group';
      groupEl.dataset.filePath = file.path;
      groupEl.style.cssText = globalFileIndex > existingPaths.size
        ? 'margin-top:8px;padding-top:8px;border-top:1px solid var(--background-modifier-border);'
        : '';

      // 分组标题栏：文件名 + 匹配数量
      const headerEl = document.createElement('div');
      headerEl.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;cursor:pointer;';

      const fileNameEl = document.createElement('span');
      fileNameEl.textContent = file.path;
      fileNameEl.style.cssText = `font-size:12px;font-weight:600;color:${fileNameColor};background:${fileNameBg};padding:2px 8px;border-radius:10px;flex-shrink:0;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;`;

      let totalEntries = 0;
      items.forEach(item => {
        if (item.type === 'content' && (item.snippet || (item.snippets && item.snippets.length > 0))) {
          totalEntries += (item.snippets || (item.snippet ? [item.snippet] : [])).length;
        } else {
          totalEntries++;
        }
      });

      const countEl = document.createElement('span');
      countEl.textContent = `${totalEntries}`;
      countEl.style.cssText = `font-size:10px;color:var(--text-faint);background:var(--background-secondary);padding:1px 5px;border-radius:8px;flex-shrink:0;`;

      const expandIcon = document.createElement('span');
      const isExpanded = this._expandedGroups?.[file.path];
      expandIcon.textContent = isExpanded ? '▼' : '▶';
      expandIcon.style.cssText = 'font-size:8px;color:var(--text-faint);flex-shrink:0;transition:transform 0.15s;';

      headerEl.appendChild(expandIcon);
      headerEl.appendChild(fileNameEl);

      // Multi-keyword tags
      const mkData = this._multiKeywordData;
      if (mkData) {
        const matchedKeywords = new Set();
        items.forEach(item => {
          if (item.keyword) matchedKeywords.add(item.keywordIndex);
        });
        const tagContainer = document.createElement('span');
        tagContainer.style.cssText = 'display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0;';
        for (let ki = 0; ki < mkData.keywords.length; ki++) {
          const tag = document.createElement('span');
          const isMatched = matchedKeywords.has(ki);
          tag.textContent = mkData.keywords[ki];
          tag.style.cssText = `font-size:9px;padding:1px 5px;border-radius:6px;white-space:nowrap;${isMatched ? `background:${mkData.keywordColors[ki]}22;color:${mkData.keywordColors[ki]};border:1px solid ${mkData.keywordColors[ki]}44;` : 'background:var(--background-secondary);color:var(--text-faint);border:1px solid var(--background-modifier-border);'}`;
          tagContainer.appendChild(tag);
        }
        headerEl.appendChild(tagContainer);
      }

      headerEl.appendChild(countEl);

      headerEl.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.isInteractingWithList = true;
      });
      headerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this._expandedGroups) this._expandedGroups = {};
        this._expandedGroups[file.path] = !this._expandedGroups[file.path];
        expandIcon.textContent = this._expandedGroups[file.path] ? '▼' : '▶';
          const allItems = bodyEl.querySelectorAll('.swift-match-item:not(.swift-match-more-line):not(.swift-match-divider)');
        allItems.forEach((el, idx) => {
          if (idx >= 3) {
            el.style.display = this._expandedGroups[file.path] ? 'flex' : 'none';
          }
        });
        const allDividers = bodyEl.querySelectorAll('.swift-match-divider');
        allDividers.forEach((el, idx) => {
          if (idx >= 2) {
            el.style.display = this._expandedGroups[file.path] ? 'block' : 'none';
          }
        });
        const moreLine = bodyEl.querySelector('.swift-match-more-line');
        if (moreLine) moreLine.style.display = this._expandedGroups[file.path] ? 'none' : 'flex';
      });
      groupEl.appendChild(headerEl);

      // 分组内容区
      const bodyEl = document.createElement('div');
      bodyEl.className = 'swift-match-group-body';

      let globalEntryIdx = 0;
      items.forEach((item, i) => {
        // 将 content 类型的 snippets 拆分为独立条目
        let matchEntries = [];
        if (item.type === 'content' && (item.snippet || (item.snippets && item.snippets.length > 0))) {
          const contentSnippets = item.snippets || (item.snippet ? [item.snippet] : []);
          for (const snippetData of contentSnippets) {
            if (typeof snippetData === 'object' && snippetData.text !== undefined) {
              matchEntries.push({ text: snippetData.text, isMarkdown: true, type: 'content', snippetData });
            } else {
              matchEntries.push({ text: String(snippetData), isMarkdown: true, type: 'content', snippetData: null });
            }
          }
        } else if (item.type === 'tag') {
          matchEntries.push({ text: `#${item.text}`, isMarkdown: false, type: 'tag' });
        } else if (item.level > 0) {
          matchEntries.push({ text: item.text, isMarkdown: true, type: 'heading' });
        } else {
          matchEntries.push({ text: item.text || '', isMarkdown: true, type: 'other' });
        }

        matchEntries.forEach((entry, entryIdx) => {
          const entryIdxInGroup = globalEntryIdx++;

          if (entryIdxInGroup > 0) {
            const innerDivider = document.createElement('div');
            innerDivider.className = 'swift-match-item swift-match-divider';
            innerDivider.style.cssText = 'border-top:1px solid var(--background-modifier-border);margin:4px 0;';
            if (entryIdxInGroup >= 3 && !isExpanded) innerDivider.style.display = 'none';
            bodyEl.appendChild(innerDivider);
          }

          // 圆点 + 文本内容
          const itemWrapper = document.createElement('div');
          itemWrapper.className = 'swift-match-item';
          itemWrapper.style.cssText = 'display:flex;align-items:flex-start;gap:6px;';
          if (entryIdxInGroup >= 3 && !isExpanded) itemWrapper.style.display = 'none';

          const dot = document.createElement('span');
          const mkData = this._multiKeywordData;
          const dotBg = mkData && entry.keywordColor ? entry.keywordColor : dotColor;
          dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${dotBg};flex-shrink:0;margin-top:5px;`;
          itemWrapper.appendChild(dot);

          const itemBox = document.createElement('div');
          itemBox.style.cssText = 'flex:1;min-width:0;overflow:hidden;';

          const snippetInfo = entry.snippetData;
          const isTruncated = snippetInfo && typeof snippetInfo === 'object' && snippetInfo.fullLine && (snippetInfo.truncateStart > 0 || snippetInfo.truncateEnd < snippetInfo.fullLine.length);

          const expandBtnStyle = 'display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;border:1px solid var(--background-modifier-border);background:transparent;color:var(--text-muted);font-size:10px;cursor:pointer;vertical-align:middle;line-height:1;padding:0;margin:0 2px;flex-shrink:0;transition:background 0.15s,color 0.15s;';

          // 文本内容
          const textEl = document.createElement('div');
          textEl.className = 'swift-match-card-text';
          textEl.style.cssText = 'font-size:12px;overflow:hidden;cursor:text;user-select:text;';

          if (isTruncated) {
            let currentStart = snippetInfo.truncateStart;
            let currentEnd = snippetInfo.truncateEnd;
            const snippetKey = `${file.path}:${item.text}:${entryIdx}`;
            if (this._expandedSnippets?.[snippetKey]) {
              currentStart = 0;
              currentEnd = snippetInfo.fullLine.length;
            }

            const renderSnippet = () => {
              textEl.innerHTML = '';
              if (currentStart > 0) {
                const leftBtn = document.createElement('button');
                leftBtn.textContent = '+';
                leftBtn.style.cssText = expandBtnStyle;
                leftBtn.title = t('expandBefore');
                leftBtn.addEventListener('click', (ce) => {
                  ce.preventDefault();
                  ce.stopPropagation();
                  currentStart = 0;
                  if (!this._expandedSnippets) this._expandedSnippets = {};
                  this._expandedSnippets[snippetKey] = true;
                  renderSnippet();
                });
                textEl.appendChild(leftBtn);
              }
              const snippetSpan = document.createElement('span');
              const snippetText = snippetInfo.fullLine.slice(currentStart, currentEnd);
              MarkdownRenderer.renderMarkdown(
                snippetText,
                snippetSpan,
                file.path,
                this
              ).then(() => {
                const renderedContent = snippetSpan.querySelector('p');
                if (renderedContent) {
                  snippetSpan.innerHTML = renderedContent.innerHTML;
                }
                // Re-apply highlights after markdown rendering completes
                const highlightData = this._multiKeywordData;
                if (highlightData) {
                  this._highlightKeywordsInElement(textEl, highlightData.keywords, highlightData.keywordColors);
                } else if (searchText) {
                  const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                  const regex = new RegExp(`(${escaped})`, 'gi');
                  this._highlightInElement(textEl, regex);
                }
              });
              textEl.appendChild(snippetSpan);
              if (currentEnd < snippetInfo.fullLine.length) {
                const rightBtn = document.createElement('button');
                rightBtn.textContent = '+';
                rightBtn.style.cssText = expandBtnStyle;
                rightBtn.title = t('expandAfter');
                rightBtn.addEventListener('click', (ce) => {
                  ce.preventDefault();
                  ce.stopPropagation();
                  currentEnd = snippetInfo.fullLine.length;
                  if (!this._expandedSnippets) this._expandedSnippets = {};
                  this._expandedSnippets[snippetKey] = true;
                  renderSnippet();
                });
                textEl.appendChild(rightBtn);
              }
            };
            renderSnippet();
          } else if (entry.isMarkdown && entry.text) {
            MarkdownRenderer.renderMarkdown(
              entry.text,
              textEl,
              file.path,
              this
            ).then(() => {
              const renderedContent = textEl.querySelector('p');
              if (renderedContent) {
                textEl.innerHTML = renderedContent.innerHTML;
              }
            });
          } else {
            textEl.textContent = entry.text;
          }

          // Multi-keyword highlight in rendered text
          if (mkData) {
            const applyMkHighlight = () => {
              this._highlightKeywordsInElement(textEl, mkData.keywords, mkData.keywordColors);
            };
            if (entry.isMarkdown || isTruncated) {
              setTimeout(applyMkHighlight, 50);
            } else {
              applyMkHighlight();
            }
          }

          itemBox.appendChild(textEl);

        // 底部工具栏：复制 + 打开文档
          const toolBar = document.createElement('div');
          toolBar.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:4px;margin-top:2px;';

          // 复制按钮
          const copyBtn = document.createElement('button');
          copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          copyBtn.title = t('copy');
          copyBtn.style.cssText = 'padding:1px 4px;cursor:pointer;border:none;box-shadow:0 0 0 0.5px var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-muted);display:flex;align-items:center;justify-content:center;height:18px;line-height:0;';
          copyBtn.addEventListener('click', (ce) => {
            ce.preventDefault();
            ce.stopPropagation();
            const textToCopy = entry.text || '';
            navigator.clipboard.writeText(textToCopy).then(() => {
              copyBtn.style.color = 'var(--text-normal)';
              setTimeout(() => { copyBtn.style.color = 'var(--text-muted)'; }, 800);
            });
          });
          copyBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); this.isInteractingWithList = true; });
          toolBar.appendChild(copyBtn);

          // 打开文档按钮
          const openBtn = document.createElement('button');
          openBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="16.5" cy="16.5" r="2.5"/><path d="M18.5 18.5L21 21"/></svg>';
          openBtn.title = t('openDoc');
          openBtn.style.cssText = 'padding:1px 4px;cursor:pointer;border:none;box-shadow:0 0 0 0.5px var(--background-modifier-border);border-radius:4px;background:var(--background-primary);color:var(--text-muted);display:flex;align-items:center;justify-content:center;height:18px;line-height:0;';
          openBtn.addEventListener('click', async (ce) => {
            ce.preventDefault();
            ce.stopPropagation();
            const selectedText = textEl && window.getSelection() && textEl.contains(window.getSelection().anchorNode) ? window.getSelection().toString().trim() : '';
            this.closePreview();
            this.hideMatchList();
            const jumpSearchText = selectedText || searchText;

            if (item.level > 0 && item.text) {
              const leaf = await this.openFileInNewTabWithHeading(file, item.text, true);

              setTimeout(() => {

                this.app.workspace.setActiveLeaf(leaf, { focus: true });
                if (selectedText) this.jumpToSearchTextInEditor(selectedText);
              }, 1250);
            } else if (item.type === 'tag') {
              const leaf = await this.openFileInNewTab(file, true);

              setTimeout(() => {

                this.app.workspace.setActiveLeaf(leaf, { focus: true });
                this.jumpToTagInEditor(item.text);
                this._releaseRememberCursor(file);
              }, 1250);
            } else {
              const firstSentence = this.getFirstSentence(entry.text);
              const jumpText = selectedText || firstSentence || searchText;
              const leaf = await this.openFileInNewTab(file, true);

              setTimeout(() => {


                this.app.workspace.setActiveLeaf(leaf, { focus: true });
                if (jumpText) this.jumpToSearchTextInEditor(jumpText);
                this._releaseRememberCursor(file);
              }, 1250);
            }
          });
          openBtn.addEventListener('mousedown', (e) => { e.stopPropagation(); this.isInteractingWithList = true; });
          toolBar.appendChild(openBtn);

          itemBox.appendChild(toolBar);
          itemWrapper.appendChild(itemBox);
          bodyEl.appendChild(itemWrapper);
        }); // end matchEntries.forEach
      }); // end items.forEach

      if (totalEntries > 3) {
        const moreLine = document.createElement('div');
        moreLine.className = 'swift-match-item swift-match-more-line';
        moreLine.style.cssText = `display:flex;align-items:center;gap:6px;margin-top:4px;cursor:pointer;`;
        if (isExpanded) moreLine.style.display = 'none';
        const moreDot = document.createElement('span');
        moreDot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${dotColor};flex-shrink:0;opacity:0.5;`;
        moreLine.appendChild(moreDot);
        const moreText = document.createElement('span');
        moreText.style.cssText = 'font-size:11px;color:var(--text-faint);';
        moreText.textContent = `+${totalEntries - 3} ...`;
        moreLine.appendChild(moreText);
        moreLine.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!this._expandedGroups) this._expandedGroups = {};
          this._expandedGroups[file.path] = true;
          expandIcon.textContent = '▼';
          const allItems = bodyEl.querySelectorAll('.swift-match-item:not(.swift-match-more-line):not(.swift-match-divider)');
          allItems.forEach((el) => {
            el.style.display = 'flex';
          });
          const allDividers = bodyEl.querySelectorAll('.swift-match-divider');
          allDividers.forEach((el) => {
            el.style.display = 'block';
          });
          moreLine.style.display = 'none';
        });
        bodyEl.appendChild(moreLine);
      }

      groupEl.appendChild(bodyEl);
      listContainer.appendChild(groupEl);
      globalFileIndex++;
    });

    if (this._isListVisible) {
      this.matchList.style.display = 'block';
      this.matchList.style.opacity = this.listOpacity;
    }

    if (this.floatingSearchBox) {
      setTimeout(() => { this.floatingSearchBox.focus(); }, 50);
    }

    // Apply saved match list size
    const savedWidth = this.matchListSize.width || this.settings.matchListWidth;
    const maxSavedHeight = this.matchListSize.height || this.settings.matchListHeight;
    this.matchList.style.width = `${savedWidth}px`;
    this.matchList.style.maxWidth = `${savedWidth}px`;
    
    // Update container max-height to fit within the list
    const sizeHeader = this.matchList.querySelector('.minimap-match-list-header');
    const sizeListContainer = this.matchList.querySelector('.minimap-match-list-container');
    if (sizeListContainer) {
      const headerHeight = sizeHeader ? sizeHeader.offsetHeight : 36;
      const recentSection = this.matchList.querySelector('.minimap-match-list-recent');
      const recentHeight = recentSection ? recentSection.offsetHeight : 0;
      const searchRow = this.matchList.querySelector('.minimap-floating-search-box')?.parentElement;
      const searchRowHeight = searchRow ? searchRow.offsetHeight : 0;
      const containerMaxHeight = maxSavedHeight - headerHeight - recentHeight - 40;
      sizeListContainer.style.maxHeight = `${Math.max(50, containerMaxHeight)}px`;
      const termScrollPos = searchText ? (this._listScrollPositions[searchText] || 0) : 0;
      const scrollTopToRestore = this._savedListScrollTop || termScrollPos || this._matchListScrollTop;

      if (scrollTopToRestore) {
        this._restoreListScrollTop(sizeListContainer, scrollTopToRestore);
        this._savedListScrollTop = 0;
        this._matchListScrollTop = 0;
      }
      requestAnimationFrame(() => {
        const contentHeight = sizeListContainer.scrollHeight;
        const autoHeight = Math.min(contentHeight + headerHeight + recentHeight + 40, maxSavedHeight);
        this.matchList.style.height = `${autoHeight}px`;
      });
    }

    // Ensure resize handle exists
    if (!this.matchList.querySelector('.minimap-match-list-resize-handle')) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'minimap-match-list-resize-handle';
      this.matchList.appendChild(resizeHandle);

      resizeHandle.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        this.isResizingMatchList = true;
        this.isInteractingWithList = true;
        this.resizeStartX = e.clientX;
        this.resizeStartY = e.clientY;
        this.resizeStartWidth = this.matchList.offsetWidth;
        this.resizeStartHeight = this.matchList.offsetHeight;
      });
    }

    // Auto-trigger exhaustive search if mode is on and not already exhaustive
    if (this.settings.exhaustiveMode && searchText && !this._exhaustiveSearchDone) {
      this._exhaustiveSearchDone = true;
      const headerTextEl = this.matchList.querySelector('.minimap-match-list-header-text');
      setTimeout(() => {
        this.performExhaustiveSearch(searchText, matchCount, headerTextEl);
      }, 0);
    }

    if (!append && !this.isPreviewOpen) {
      // Position near trigger element (keyword btn) if available, otherwise near floating toggle
      if (this._listTriggerElement && this._listTriggerElement.parentNode) {
        this.positionListNearElement(this._listTriggerElement);
      } else {
        this.positionListNearFloatingToggle();
      }
      
      if (this._matchListPositionUpdater) {
        window.removeEventListener('resize', this._matchListPositionUpdater);
      }
      this._matchListPositionUpdater = () => {
        if (this.matchList && this.matchList.style.display !== 'none' && !this.isPreviewOpen) {
          if (this._listTriggerElement && this._listTriggerElement.parentNode) {
            this.positionListNearElement(this._listTriggerElement);
          } else {
            this.positionListNearFloatingToggle();
          }
        }
      };
      window.addEventListener('resize', this._matchListPositionUpdater);
    } else if (this.isPreviewOpen) {
      if (this.listFixedPosition.left !== null && this.listFixedPosition.top !== null) {
        this.matchList.style.left = `${this.listFixedPosition.left}px`;
        this.matchList.style.top = `${this.listFixedPosition.top}px`;
      }
    }

    if (searchText) {
      setTimeout(() => { this._highlightSearchTermInList(searchText); }, 100);
    }
  }

  _highlightSearchTermInList(searchText) {
    if (!this.matchList || !searchText) return;
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const textEls = this.matchList.querySelectorAll('.swift-match-card-text');
    textEls.forEach(el => {
      this._highlightInElement(el, regex);
    });
  }

  _restoreListScrollTop(container, targetScrollTop, retries = 5) {
    if (!container || !container.isConnected) return;

    const tryRestore = (attempt) => {
      if (attempt <= 0) return;
      requestAnimationFrame(() => {
        if (!container.isConnected) return;
        container.scrollTop = targetScrollTop;

        // Verify scrollTop was actually set (may fail if content not yet rendered)
        if (Math.abs(container.scrollTop - targetScrollTop) > 5 && attempt > 1) {
          setTimeout(() => tryRestore(attempt - 1), 100);
        }
      });
    };
    tryRestore(retries);
  }

  _highlightInElement(el, regex) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (regex.test(node.textContent)) {
        textNodes.push(node);
      }
      regex.lastIndex = 0;
    }
    for (const textNode of textNodes) {
      const text = textNode.textContent;
      const parts = text.split(regex);
      if (parts.length <= 1) continue;
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (regex.test(part)) {
          const mark = document.createElement('mark');
          mark.textContent = part;
          mark.style.cssText = 'background:#ff660044;color:inherit;border-radius:2px;padding:0 1px;';
          frag.appendChild(mark);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
        regex.lastIndex = 0;
      }
      textNode.parentNode.replaceChild(frag, textNode);
    }
  }

  _suppressRememberCursor(file) {
    const rcp = this.app.plugins.plugins['obsidian-remember-cursor-position'];
    if (rcp && rcp.loadingFile !== undefined) {
      rcp.loadingFile = true;
      if (file) rcp.lastLoadedFileName = file.path;
    }
  }

  _releaseRememberCursor(file) {
    const rcp = this.app.plugins.plugins['obsidian-remember-cursor-position'];
    if (rcp && rcp.loadingFile !== undefined) {
      if (file) {
        const st = rcp.db[file.path];
        if (st) rcp.lastEphemeralState = st;
      }
      rcp.loadingFile = false;
    }
  }

  async openFileInNewTabWithHeading(file, heading, setActive = true) {
    this._suppressRememberCursor(file);
    const currentLeaf = this.app.workspace.activeLeaf;
    const leaf = this.app.workspace.getLeaf('tab');
    await leaf.openFile(file, { setActive });
    
    setTimeout(() => {
      this.app.workspace.setActiveLeaf(leaf, { focus: true });
      this.jumpToHeadingInEditor(heading);
      this._releaseRememberCursor(file);
    }, 1250);
    
    if (!setActive && currentLeaf) {
      this.app.workspace.setActiveLeaf(currentLeaf, { focus: true });
    }
    return leaf;
  }

  async showPreviewWithHeading(file, heading) {
    if (!this.previewPanel) return;

    this.cancelSearch();

    const wasPreviewOpen = this.isPreviewOpen;
    
    this.isPreviewOpen = true;
    this.currentPreviewFile = file;
    this.currentPreviewHeading = heading;
    this.previewSourceLeaf = this.app.workspace.activeLeaf;
    
    if (!wasPreviewOpen) {
      if (this.previewListPosition.left !== null && this.previewListPosition.top !== null) {
        this.listFixedPosition.left = this.previewListPosition.left;
        this.listFixedPosition.top = this.previewListPosition.top;
        this.matchList.style.left = `${this.previewListPosition.left}px`;
        this.matchList.style.top = `${this.previewListPosition.top}px`;
      } else if (this.listFixedPosition.left !== null && this.listFixedPosition.top !== null) {
        this.matchList.style.left = `${this.listFixedPosition.left}px`;
        this.matchList.style.top = `${this.listFixedPosition.top}px`;
      }
    }
    
    if (this._matchListPositionUpdater) {
      window.removeEventListener('resize', this._matchListPositionUpdater);
      this._matchListPositionUpdater = null;
    }
    
    if (this._previewOutsideClickHandler) {
      document.removeEventListener('mousedown', this._previewOutsideClickHandler);
      this._previewOutsideClickHandler = null;
    }
    
    try {

      const content = await this.app.vault.read(file);

      this.previewPanel.innerHTML = '';
      
      const header = document.createElement('div');
      header.className = 'minimap-preview-header';
      header.innerHTML = `
        <span class="minimap-preview-title">${file.basename}</span>
      `;
      header.style.cursor = 'move';
      header.style.userSelect = 'none';
      
      let isDraggingPanel = false;
      let panelDragStartX, panelDragStartY, panelDragStartLeft, panelDragStartTop;
      
      const onPanelDragMouseDown = (e) => {
        if (e.target.closest('.minimap-preview-resize-handle')) return;
        isDraggingPanel = true;
        panelDragStartX = e.clientX;
        panelDragStartY = e.clientY;
        const panelRect = this.previewPanel.getBoundingClientRect();
        panelDragStartLeft = panelRect.left;
        panelDragStartTop = panelRect.top;
        document.addEventListener('mousemove', onPanelDragMouseMove);
        document.addEventListener('mouseup', onPanelDragMouseUp);
        e.preventDefault();
        e.stopPropagation();
      };
      
      const onPanelDragMouseMove = (e) => {
        if (!isDraggingPanel) return;
        const dx = e.clientX - panelDragStartX;
        const dy = e.clientY - panelDragStartY;
        let newLeft = panelDragStartLeft + dx;
        let newTop = panelDragStartTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50));
        this.previewPanel.style.left = `${newLeft}px`;
        this.previewPanel.style.top = `${newTop}px`;
      };
      
      const onPanelDragMouseUp = () => {
        isDraggingPanel = false;
        document.removeEventListener('mousemove', onPanelDragMouseMove);
        document.removeEventListener('mouseup', onPanelDragMouseUp);
      };
      
      header.addEventListener('mousedown', onPanelDragMouseDown);
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'minimap-preview-content markdown-preview-view';
      
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'minimap-preview-resize-handle';
      resizeHandle.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        width: 15px;
        height: 15px;
        cursor: nwse-resize;
        z-index: 10;
        background: linear-gradient(135deg, transparent 50%, var(--text-muted) 50%);
      `;
      
      let isResizing = false;
      let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;
      
      const onResizeMouseDown = (e) => {
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartWidth = this.previewPanel.offsetWidth;
        resizeStartHeight = this.previewPanel.offsetHeight;
        document.addEventListener('mousemove', onResizeMouseMove);
        document.addEventListener('mouseup', onResizeMouseUp);
        e.preventDefault();
        e.stopPropagation();
      };
      
      const onResizeMouseMove = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - resizeStartX;
        const dy = e.clientY - resizeStartY;
        const newWidth = Math.max(300, Math.min(resizeStartWidth + dx, window.innerWidth - 20));
        const newHeight = Math.max(200, Math.min(resizeStartHeight + dy, window.innerHeight - 20));
        this.previewPanel.style.width = `${newWidth}px`;
        this.previewPanel.style.height = `${newHeight}px`;
        this.previewSize.width = newWidth;
        this.previewSize.height = newHeight;
      };
      
      const onResizeMouseUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
        this.saveListData();
      };
      
      resizeHandle.addEventListener('mousedown', onResizeMouseDown);
      
      this.previewPanel.appendChild(header);
      this.previewPanel.appendChild(contentDiv);
      this.previewPanel.appendChild(resizeHandle);
      this.previewPanel.style.display = 'flex';

      try {
        await MarkdownRenderer.render(this.app, content, contentDiv, file.path, this);
        if (!contentDiv.innerHTML || contentDiv.innerHTML.trim() === '') {
          contentDiv.innerHTML = `<pre style="white-space: pre-wrap; margin: 0;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
        }
      } catch (renderError) {
        console.error('MarkdownRenderer.render failed:', renderError);
        contentDiv.innerHTML = `<pre style="white-space: pre-wrap; margin: 0;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      }

      this.positionPreviewPanel();
      this.highlightCurrentPreviewItem();

      this.setupPreviewOutsideClick();
      
      setTimeout(() => {

        this.scrollToHeadingInPreview(contentDiv, heading);

      }, 100);
      

    } catch (e) {
      console.error('Failed to read file:', e);
      this.closePreview();
    }
  }

  scrollToHeadingInPreview(contentDiv, heading) {
    if (!contentDiv) return;
    
    const headingText = heading.toLowerCase().trim();
    const elements = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    for (const el of elements) {
      const elText = el.textContent.toLowerCase().trim();
      const cleanElText = elText.replace(/<[^>]*>/g, '').trim();
      if (cleanElText === headingText || cleanElText.includes(headingText)) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        break;
      }
    }
  }

  jumpToHeadingInEditor(heading) {

    if (this.isReadingMode()) {
      const readingEl = this.getReadingViewContentEl();

      if (!readingEl) return;
      const headingText = heading.toLowerCase().trim();
      const elements = readingEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (const el of elements) {
        const elText = el.textContent.toLowerCase().trim();
        if (elText === headingText || elText.includes(headingText)) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
          break;
        }
      }
      return;
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return;
    
    const cm = editor.cm;
    const content = editor.getValue();
    const lines = content.split('\n');
    const headingLower = heading.toLowerCase().trim();
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const lineHeadingText = headingMatch[2].replace(/\s+#[\w\u4e00-\u9fa5]+\s*$/g, '').replace(/<[^>]*>/g, '').trim().toLowerCase();
        if (lineHeadingText === headingLower || lineHeadingText.includes(headingLower)) {
          const lineNum = i + 1;
          const lineObj = cm.state.doc.line(lineNum);
          
          cm.dispatch({
            selection: { anchor: lineObj.from },
            scrollIntoView: { range: { from: lineObj.from, to: lineObj.from } }
          });
          break;
        }
      }
    }
  }

  positionListNearFloatingToggle() {
    if (!this.matchList || !this.floatingToggle) return;
    
    const toggleRect = this.floatingToggle.getBoundingClientRect();
    const listWidth = this.matchListSize.width || this.settings.matchListWidth || 280;
    const listHeight = this.matchList.offsetHeight || (this.matchListSize.height || this.settings.matchListHeight || 400);
    
    let left = toggleRect.left;
    let top = toggleRect.bottom + 5;
    
    // If list would go off right edge, align to right
    if (left + listWidth > window.innerWidth - 10) {
      left = window.innerWidth - listWidth - 10;
    }
    // If list would go off left edge
    if (left < 10) left = 10;
    
    if (top + listHeight > window.innerHeight - 10) {
      const availableBelow = window.innerHeight - top - 10;
      const availableAbove = toggleRect.top - 15;
      if (availableBelow >= 60) {
        this.matchList.style.maxHeight = `${availableBelow}px`;
      } else if (availableAbove >= 60) {
        top = toggleRect.top - Math.min(listHeight, availableAbove) - 5;
        this.matchList.style.maxHeight = `${Math.min(listHeight, availableAbove)}px`;
      } else {
        this.matchList.style.maxHeight = `${Math.max(60, window.innerHeight - 20)}px`;
        top = 10;
      }
    } else {
      this.matchList.style.maxHeight = '';
    }
    
    this.matchList.style.left = `${left}px`;
    this.matchList.style.top = `${top}px`;
  }

  positionListNearIndicator() {
    if (!this.matchList || !this.lastIndicatorCoords) {
      this.positionListDefault();
      return;
    }
    
    const listWidth = this.matchListSize.width || this.settings.matchListWidth || 280;
    const listHeight = this.matchListSize.height || this.settings.matchListHeight || 400;
    
    const targetRect = this.lastIndicatorCoords.targetRect;
    const indicatorX = this.lastIndicatorCoords.screenX;
    const indicatorY = this.lastIndicatorCoords.screenY;
    
    const selectionRight = targetRect ? targetRect.right + 20 : indicatorX;
    const selectionLeft = targetRect ? targetRect.left - 20 : indicatorX;
    const selectionTop = targetRect ? targetRect.top : indicatorY;
    const selectionBottom = targetRect ? targetRect.bottom : indicatorY;
    const selectionCenter = (selectionTop + selectionBottom) / 2;
    
    const availableWidthRight = window.innerWidth - selectionRight - 10;
    const availableWidthLeft = selectionLeft - 10;
    
    let left, top;
    
    if (availableWidthRight >= listWidth) {
      left = selectionRight;
    } else if (availableWidthLeft >= listWidth) {
      left = selectionLeft - listWidth;
    } else if (availableWidthRight >= availableWidthLeft) {
      left = window.innerWidth - listWidth - 10;
    } else {
      left = 10;
    }

    let idealTop = selectionCenter - listHeight / 2;
    
    if (idealTop < 10) {
      idealTop = 10;
    } else if (idealTop + listHeight > window.innerHeight - 10) {
      idealTop = window.innerHeight - listHeight - 10;
    }
    
    top = idealTop;

    this.matchList.style.left = `${left}px`;
    this.matchList.style.top = `${top}px`;
  }

  updateListPositionNearSelection() {
    if (!this.matchList || this.matchList.style.display === 'none') return;
    if (this.isPreviewOpen) return;
    if (this.listFixedPosition.left !== null || this.listFixedPosition.top !== null) return;
    
    const listWidth = this.matchListSize.width || this.settings.matchListWidth || 280;
    const listHeight = this.matchListSize.height || this.settings.matchListHeight || 400;
    
    let selectionRight, selectionLeft, selectionTop, selectionBottom;
    
    if (this.isReadingMode()) {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        this.positionListDefault();
        return;
      }
      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || rect.width === 0) {
          this.positionListDefault();
          return;
        }
        selectionRight = rect.right + 20;
        selectionLeft = rect.left - 20;
        selectionTop = rect.top;
        selectionBottom = rect.bottom;
      } catch (e) {
        this.positionListDefault();
        return;
      }
    } else {
      const editor = this.getEditor();
      if (!editor || !editor.cm) {
        this.positionListDefault();
        return;
      }

      const cm = editor.cm;
      const selection = editor.getSelection();
      if (!selection) {
        this.positionListDefault();
        return;
      }

      try {
        const from = editor.getCursor('from');
        const to = editor.getCursor('to');
        
        const lineFrom = cm.state.doc.line(from.line + 1);
        const lineTo = cm.state.doc.line(to.line + 1);
        const posFrom = lineFrom.from + from.ch;
        const posTo = lineTo.from + to.ch;
        
        const coordsFrom = cm.coordsAtPos(posFrom);
        const coordsTo = cm.coordsAtPos(posTo);
        
        if (!coordsFrom || !coordsTo) {
          this.positionListDefault();
          return;
        }
        
        selectionRight = Math.max(coordsFrom.left, coordsTo.left) + 20;
        selectionLeft = Math.min(coordsFrom.left, coordsTo.left) - 20;
        selectionTop = Math.min(coordsFrom.top, coordsTo.top);
        selectionBottom = Math.max(coordsFrom.bottom, coordsTo.bottom);
      } catch (e) {
        this.positionListDefault();
        return;
      }
    }
    
    const availableWidthRight = window.innerWidth - selectionRight - 10;
    const availableWidthLeft = selectionLeft - 10;
    
    let left, top;
    
    if (availableWidthRight >= listWidth) {
      left = selectionRight;
    } else if (availableWidthLeft >= listWidth) {
      left = selectionLeft - listWidth;
    } else if (availableWidthRight >= availableWidthLeft) {
      left = window.innerWidth - listWidth - 10;
    } else {
      left = 10;
    }
    
    const selectionCenter = (selectionTop + selectionBottom) / 2;
    let idealTop = selectionCenter - listHeight / 2;
    
    if (idealTop < 10) {
      idealTop = 10;
    } else if (idealTop + listHeight > window.innerHeight - 10) {
      idealTop = window.innerHeight - listHeight - 10;
    }
    
    top = idealTop;

    this.matchList.style.left = `${left}px`;
    this.matchList.style.top = `${top}px`;
  }

  positionListDefault() {
    if (!this.matchList || !this.minimapContainer) return;
    
    const rect = this.minimapContainer.getBoundingClientRect();
    const listWidth = this.matchListSize.width || this.settings.matchListWidth || 280;
    const listHeight = this.matchListSize.height || this.settings.matchListHeight || 400;
    
    let left = rect.left - listWidth - 10;
    let top = rect.top;
    
    if (left < 10) {
      left = rect.right + 10;
    }
    
    if (top + listHeight > window.innerHeight - 10) {
      top = Math.max(10, window.innerHeight - listHeight - 10);
    }
    
    this.matchList.style.left = `${left}px`;
    this.matchList.style.top = `${top}px`;
  }

  async openFile(file) {
    const leaf = this.app.workspace.getLeaf();
    await leaf.openFile(file);
  }

  async openFileInNewTab(file, setActive = true) {
    this._suppressRememberCursor(file);
    const leaf = this.app.workspace.getLeaf('tab');
    await leaf.openFile(file, { setActive });
    return leaf;
  }

  // 从文本中提取第一句话（支持中英文句号、感叹号、问号、换行）
  getFirstSentence(text) {
    if (!text) return '';
    // Remove leading "..." if present (from snippet truncation)
    let cleanText = text.replace(/^\.\.\.\s*/, '');
    const match = cleanText.match(/[^。！？\.\?\!]*[。！？\.\?\!\n]/);
    if (match) {
      return match[0].trim();
    }
    // 如果没有找到句末标点，返回整段文本
    return cleanText.trim();
  }

  // 清空跳转高亮
  clearJumpHighlight(cm) {
    if (!cm) return;
    cm.dispatch({
      effects: setJumpHighlight.of(Decoration.none)
    });
  }

  // 编辑模式：直接向 matchHighlightField 添加棉花糖装饰
  highlightJumpText(cm, from, to) {
    if (!cm) return;
    this._ensureEditorFields(cm);
    const existing = cm.state.field(matchHighlightField, false) || Decoration.none;
    const marshmallowDeco = Decoration.mark({
      class: 'minimap-editor-match hl-marshmallow',
      attributes: {
        'style': `background:#fff !important;color:#cc2e7a !important;border:2px solid #ff6eb4 !important;border-radius:10px !important;padding:0.1em 0.6em !important;box-shadow:2px 2px 0 #ffaad9 !important;margin:0 -0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;`
      }
    });
    const newSet = existing.update({
      add: [{ from, to, value: marshmallowDeco }]
    });
    cm.dispatch({
      effects: setMatchHighlights.of(newSet)
    });
    this._jumpHighlightRange = { from, to };
    this._setupMarshmallowDismiss(cm);
  }

  _setupMarshmallowDismiss(cm) {
    if (this._marshmallowDismissHandler) {
      cm.dom.removeEventListener('mousedown', this._marshmallowDismissHandler);
    }
    this._marshmallowDismissHandler = () => {
      this._jumpHighlightRange = null;
      this._removeMarshmallowDeco(cm);
      cm.dom.removeEventListener('mousedown', this._marshmallowDismissHandler);
      this._marshmallowDismissHandler = null;
    };
    cm.dom.addEventListener('mousedown', this._marshmallowDismissHandler);
  }

  _removeMarshmallowDeco(cm) {
    if (!cm) return;
    const current = cm.state.field(matchHighlightField, false);
    if (current) {
      const filtered = current.update({
        filter: (f, t, v) => {
          const spec = v.spec;
          return !(spec && spec.class && spec.class.includes('hl-marshmallow'));
        }
      });
      cm.dispatch({
        effects: setMatchHighlights.of(filtered)
      });
    }
  }

  _ensureEditorFields(cm) {
    if (!cm) return;
    const matchField = cm.state.field(matchHighlightField, false);
    if (matchField === undefined) {
      cm.dispatch({
        effects: StateEffect.appendConfig.of([matchHighlightField])
      });
    }
    const jumpField = cm.state.field(jumpHighlightField, false);
    if (jumpField === undefined) {
      cm.dispatch({
        effects: StateEffect.appendConfig.of([jumpHighlightField])
      });
    }
  }

  // 阅读模式：用 span.hl-marshmallow 包裹跳转文本
  highlightJumpTextReading(container, textNode, offset, length) {
    const parent = textNode.parentNode;
    if (!parent || parent.closest('.hl-marshmallow')) return;

    const range = document.createRange();
    range.setStart(textNode, offset);
    range.setEnd(textNode, offset + length);

    const span = document.createElement('span');
    span.className = 'hl-marshmallow';
    span.style.cssText = 'background:#fff !important;color:#cc2e7a !important;border:2px solid #ff6eb4 !important;border-radius:10px !important;padding:0.1em 0.6em !important;box-shadow:2px 2px 0 #ffaad9 !important;';
    range.surroundContents(span);

    // 3秒后自动移除
    setTimeout(() => {
      const parentSpan = span.parentNode;
      if (parentSpan) {
        const text = span.textContent || '';
        const textNode2 = document.createTextNode(text);
        parentSpan.replaceChild(textNode2, span);
      }
    }, 3000);
  }

  jumpToSearchTextInEditor(searchText) {

    if (this.isReadingMode()) {
      const readingEl = this.getReadingViewContentEl();

      if (!readingEl) return;
      const searchLower = searchText.toLowerCase();
      const walker = document.createTreeWalker(readingEl, NodeFilter.SHOW_TEXT, null, false);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const idx = node.textContent.toLowerCase().indexOf(searchLower);
        if (idx !== -1) {
          const range = document.createRange();
          range.setStart(node, idx);
          range.setEnd(node, idx + searchText.length);
          range.scrollIntoView({ behavior: 'auto', block: 'center' });

          // 临时高亮 hl-marshmallow
          this.highlightJumpTextReading(readingEl, node, idx, searchText.length);

          break;
        }
      }
      return;
    }

    const editor = this.getEditor();

    if (!editor || !editor.cm) return;

    const cm = editor.cm;
    const content = editor.getValue();
    const searchLower = searchText.toLowerCase();

    const fullIdx = content.toLowerCase().indexOf(searchLower);

    if (fullIdx !== -1) {
      const from = fullIdx;
      const to = fullIdx + searchText.length;

      cm.dispatch({
        selection: { anchor: from },
        scrollIntoView: { range: { from, to } }
      });

      setTimeout(() => {
        const coords = cm.coordsAtPos(from);
        const scrollEl = cm.scrollDOM;
        if (coords && scrollEl) {
          const visibleHeight = scrollEl.clientHeight;
          const targetY = coords.top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop - visibleHeight * 0.35;
          scrollEl.scrollTop = targetY;
        }
      }, 50);

      this.highlightJumpText(cm, from, to);
      return;
    }

    const fallbackText = this.currentSelection;
    if (fallbackText && fallbackText !== searchText) {
      const fallbackIdx = content.toLowerCase().indexOf(fallbackText.toLowerCase());

      if (fallbackIdx !== -1) {
        const from = fallbackIdx;
        const to = fallbackIdx + fallbackText.length;
        cm.dispatch({
          selection: { anchor: from },
          scrollIntoView: { range: { from, to } }
        });

        setTimeout(() => {
          const coords = cm.coordsAtPos(from);
          const scrollEl = cm.scrollDOM;
          if (coords && scrollEl) {
            const visibleHeight = scrollEl.clientHeight;
            const targetY = coords.top - scrollEl.getBoundingClientRect().top + scrollEl.scrollTop - visibleHeight * 0.35;
            scrollEl.scrollTop = targetY;
          }
        }, 50);

        this.highlightJumpText(cm, from, to);
      }
    }
  }

  jumpToTagInEditor(tag) {
    if (this.isReadingMode()) {
      const readingEl = this.getReadingViewContentEl();
      if (!readingEl) return;
      const tagSelector = `a.tag[href*="${tag}"], .tag[href*="${tag}"]`;
      const tagEl = readingEl.querySelector(tagSelector);
      if (tagEl) {
        tagEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      } else {
        // Fallback: search text nodes for the tag
        const searchLower = `#${tag.toLowerCase()}`;
        const walker = document.createTreeWalker(readingEl, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const idx = node.textContent.toLowerCase().indexOf(searchLower);
          if (idx !== -1) {
            const range = document.createRange();
            range.setStart(node, idx);
            range.setEnd(node, idx + searchLower.length);
            range.scrollIntoView({ behavior: 'auto', block: 'center' });
            break;
          }
        }
      }
      return;
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return;

    const cm = editor.cm;
    const content = editor.getValue();
    const lines = content.split('\n');
    const tagPattern = new RegExp(`#${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[\\s,.;:!?'")\\]}>]|$)`, 'i');

    for (let i = 0; i < lines.length; i++) {
      const match = tagPattern.exec(lines[i]);
      if (match) {
        const lineNum = i + 1;
        const lineObj = cm.state.doc.line(lineNum);
        const from = lineObj.from + match.index;

        cm.dispatch({
          selection: { anchor: from },
          scrollIntoView: { range: { from, to: from } }
        });
        break;
      }
    }
  }

  async showPreview(file) {
    if (!this.previewPanel) return;

    this.cancelSearch();

    this.isPreviewOpen = true;
    this.currentPreviewFile = file;
    
    if (this.previewListPosition.left !== null && this.previewListPosition.top !== null) {
      this.listFixedPosition.left = this.previewListPosition.left;
      this.listFixedPosition.top = this.previewListPosition.top;
      this.matchList.style.left = `${this.previewListPosition.left}px`;
      this.matchList.style.top = `${this.previewListPosition.top}px`;
    }
    
    if (this._matchListPositionUpdater) {
      window.removeEventListener('resize', this._matchListPositionUpdater);
      this._matchListPositionUpdater = null;
    }
    
    try {

      const content = await this.app.vault.read(file);

      this.previewPanel.innerHTML = '';
      
      const header = document.createElement('div');
      header.className = 'minimap-preview-header';
      header.innerHTML = `
        <span class="minimap-preview-title">${file.basename}</span>
      `;
      header.style.cursor = 'move';
      header.style.userSelect = 'none';
      
      let isDraggingPanel = false;
      let panelDragStartX, panelDragStartY, panelDragStartLeft, panelDragStartTop;
      
      const onPanelDragMouseDown = (e) => {
        if (e.target.closest('.minimap-preview-resize-handle')) return;
        isDraggingPanel = true;
        panelDragStartX = e.clientX;
        panelDragStartY = e.clientY;
        const panelRect = this.previewPanel.getBoundingClientRect();
        panelDragStartLeft = panelRect.left;
        panelDragStartTop = panelRect.top;
        document.addEventListener('mousemove', onPanelDragMouseMove);
        document.addEventListener('mouseup', onPanelDragMouseUp);
        e.preventDefault();
        e.stopPropagation();
      };
      
      const onPanelDragMouseMove = (e) => {
        if (!isDraggingPanel) return;
        const dx = e.clientX - panelDragStartX;
        const dy = e.clientY - panelDragStartY;
        let newLeft = panelDragStartLeft + dx;
        let newTop = panelDragStartTop + dy;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 100));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50));
        this.previewPanel.style.left = `${newLeft}px`;
        this.previewPanel.style.top = `${newTop}px`;
      };
      
      const onPanelDragMouseUp = () => {
        isDraggingPanel = false;
        document.removeEventListener('mousemove', onPanelDragMouseMove);
        document.removeEventListener('mouseup', onPanelDragMouseUp);
      };
      
      header.addEventListener('mousedown', onPanelDragMouseDown);
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'minimap-preview-content markdown-preview-view';
      
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'minimap-preview-resize-handle';
      resizeHandle.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        width: 15px;
        height: 15px;
        cursor: nwse-resize;
        z-index: 10;
        background: linear-gradient(135deg, transparent 50%, var(--text-muted) 50%);
      `;
      
      let isResizing = false;
      let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;
      
      const onResizeMouseDown = (e) => {
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartWidth = this.previewPanel.offsetWidth;
        resizeStartHeight = this.previewPanel.offsetHeight;
        document.addEventListener('mousemove', onResizeMouseMove);
        document.addEventListener('mouseup', onResizeMouseUp);
        e.preventDefault();
        e.stopPropagation();
      };
      
      const onResizeMouseMove = (e) => {
        if (!isResizing) return;
        const dx = e.clientX - resizeStartX;
        const dy = e.clientY - resizeStartY;
        const newWidth = Math.max(300, Math.min(resizeStartWidth + dx, window.innerWidth - 20));
        const newHeight = Math.max(200, Math.min(resizeStartHeight + dy, window.innerHeight - 20));
        this.previewPanel.style.width = `${newWidth}px`;
        this.previewPanel.style.height = `${newHeight}px`;
        this.previewSize.width = newWidth;
        this.previewSize.height = newHeight;
      };
      
      const onResizeMouseUp = () => {
        isResizing = false;
        document.removeEventListener('mousemove', onResizeMouseMove);
        document.removeEventListener('mouseup', onResizeMouseUp);
        this.saveListData();
      };
      
      resizeHandle.addEventListener('mousedown', onResizeMouseDown);
      
      this.previewPanel.appendChild(header);
      this.previewPanel.appendChild(contentDiv);
      this.previewPanel.appendChild(resizeHandle);
      this.previewPanel.style.display = 'flex';

      try {
        await MarkdownRenderer.render(this.app, content, contentDiv, file.path, this);
        if (!contentDiv.innerHTML || contentDiv.innerHTML.trim() === '') {
          contentDiv.innerHTML = `<pre style="white-space: pre-wrap; margin: 0;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
        }
      } catch (renderError) {
        console.error('MarkdownRenderer.render failed:', renderError);
        contentDiv.innerHTML = `<pre style="white-space: pre-wrap; margin: 0;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      }

      this.positionPreviewPanel();
      this.highlightCurrentPreviewItem();

      this.setupPreviewOutsideClick();
      

    } catch (e) {
      console.error('Failed to read file:', e);
      this.closePreview();
    }
  }

  setupPreviewOutsideClick() {
    if (this._previewOutsideClickHandler) {
      document.removeEventListener('mousedown', this._previewOutsideClickHandler);
    }
    
    this._previewOutsideClickHandler = (e) => {
      if (!this.previewPanel || this.previewPanel.style.display === 'none') return;
      
      const isInPreview = this.previewPanel.contains(e.target);
      const isInList = this.matchList && this.matchList.contains(e.target);
      
      if (!isInPreview && !isInList) {
        this.closePreview();
        e.stopPropagation();
      }
    };
    
    setTimeout(() => {
      document.addEventListener('mousedown', this._previewOutsideClickHandler);
    }, 10);
  }

  highlightCurrentPreviewItem() {
    if (!this.matchList || !this.currentPreviewFile) return;
    
    const groupItems = this.matchList.querySelectorAll('.swift-match-group');
    groupItems.forEach(item => {
      if (item.dataset.filePath === this.currentPreviewFile.path) {
        item.classList.add('previewing');
      } else {
        item.classList.remove('previewing');
      }
    });
  }

  async exportMatchList(fileMap, searchText, matchCount) {
    if (!fileMap || fileMap.size === 0) return;
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`;
    const fileName = `SwiftMatch_${searchText}_${dateStr}.md`;
    
    const totalMatchCount = this._pendingMatchCount || matchCount;
    
    let md = `# SwiftMatch 搜索结果\n\n`;
    md += `- **搜索词**: \`${searchText}\`\n`;
    md += `- **匹配文档数**: ${fileMap.size}\n`;
    md += `- **总匹配数**: ${totalMatchCount} 项结果\n`;
    md += `- **导出时间**: ${now.toLocaleString()}\n\n`;
    md += `---\n\n`;
    
    fileMap.forEach((items, file) => {
      md += `## [[${file.basename}]]\n\n`;
      items.forEach(item => {
        if (item.type === 'tag') {
          md += `- #${item.text}\n`;
        } else if (item.type === 'heading') {
          md += `- **[[${file.basename}#${item.text}]]**\n`;
        } else if (item.type === 'content') {
          if (item.snippets && item.snippets.length > 0) {
            for (const s of item.snippets) {
              md += `  > ${s.replace(/\n/g, ' ')}\n`;
            }
          } else if (item.snippet) {
            md += `  > ${item.snippet.replace(/\n/g, ' ')}\n`;
          } else {
            md += `- ${item.text}\n`;
          }
        } else {
          md += `- ${item.text}\n`;
        }
      });
      md += `\n`;
    });
    
    try {
      const adapter = this.app.vault.adapter;
      await adapter.write(fileName, md);
      
      // Open the file in a new tab
      const file = this.app.vault.getAbstractFileByPath(fileName);
      if (file) {
        await this.app.workspace.getLeaf('tab').openFile(file);
      }
      new Notice(t('exported', fileName));
    } catch (e) {
      console.error('Failed to export match list:', e);
      new Notice(t('exportFailed', e.message));
    }
  }

  _setupSwiftMatchExportNav() {
    // Remove existing popup and listeners
    this._removeSwiftMatchExportNav();
    const file = this.app.workspace.activeLeaf?.view?.file;
    if (!file || !file.basename.startsWith('SwiftMatch_')) return;

    // Listen for text selection in this document
    this._swiftMatchMouseUpHandler = () => {
      setTimeout(() => this._handleSwiftMatchSelection(), 200);
    };
    this._swiftMatchMouseDownHandler = () => {
      this._hideSwiftMatchNavPopup();
    };
    document.addEventListener('mouseup', this._swiftMatchMouseUpHandler);
    document.addEventListener('mousedown', this._swiftMatchMouseDownHandler, true);
  }

  _removeSwiftMatchExportNav() {
    if (this._swiftMatchMouseUpHandler) {
      document.removeEventListener('mouseup', this._swiftMatchMouseUpHandler);
      this._swiftMatchMouseUpHandler = null;
    }
    if (this._swiftMatchMouseDownHandler) {
      document.removeEventListener('mousedown', this._swiftMatchMouseDownHandler, true);
      this._swiftMatchMouseDownHandler = null;
    }
    this._hideSwiftMatchNavPopup();
  }

  _handleSwiftMatchSelection() {
    const file = this.app.workspace.activeLeaf?.view?.file;
    if (!file || !file.basename.startsWith('SwiftMatch_')) {
      this._removeSwiftMatchExportNav();
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim().length === 0) {
      this._hideSwiftMatchNavPopup();
      return;
    }

    // Find the nearest heading/wiki-link above the selection
    const range = sel.getRangeAt(0);
    let node = range.startContainer;

    // Walk up to find the content block element
    let container = node instanceof Element ? node : node.parentElement;
    const contentEl = container?.closest('.markdown-reading-view, .markdown-preview-view, .markdown-source-view');
    if (!contentEl) return;

    // Find the closest heading or section with a wiki-link
    let sourceInfo = this._findSourceInfoForSelection(container, contentEl);

    if (!sourceInfo) {
      this._hideSwiftMatchNavPopup();
      return;
    }

    // Show the navigation popup
    const rect = range.getBoundingClientRect();
    this._showSwiftMatchNavPopup(rect, sourceInfo, sel.toString().trim());
  }

  _findSourceInfoForSelection(element, contentEl) {
    // Walk up from the selection element to find the nearest heading/section with a wiki-link
    let current = element;
    let foundHeading = null;
    let foundFile = null;

    while (current && current !== contentEl) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        // Check if this is a heading with a link
        if (current.tagName && current.tagName.match(/^H[1-6]$/)) {
          const link = current.querySelector('a.internal-link, .internal-link');
          if (link) {
            const href = link.getAttribute('data-href') || link.getAttribute('href') || link.textContent;
            if (href) {
              const parts = href.split('#');
              foundFile = parts[0];
              foundHeading = parts.length > 1 ? parts.slice(1).join('#') : null;
              return { fileName: foundFile, heading: foundHeading };
            }
          }
          // Also check for plain text wiki-link format in the heading
          const headingText = current.textContent;
          const wikiMatch = headingText.match(/\[\[([^\]]+)\]\]/);
          if (wikiMatch) {
            const parts = wikiMatch[1].split('#');
            foundFile = parts[0];
            foundHeading = parts.length > 1 ? parts.slice(1).join('#') : null;
            return { fileName: foundFile, heading: foundHeading };
          }
        }

        // Check if this element contains an internal link
        const links = current.querySelectorAll(':scope > a.internal-link, :scope > .internal-link');
        for (const link of links) {
          const href = link.getAttribute('data-href') || link.getAttribute('href') || link.textContent;
          if (href) {
            const parts = href.split('#');
            foundFile = parts[0];
            foundHeading = parts.length > 1 ? parts.slice(1).join('#') : null;
            return { fileName: foundFile, heading: foundHeading };
          }
        }
      }
      current = current.parentElement;
    }

    // Fallback: scan all headings in the document for the section containing the selection
    const allHeadings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const selRange = window.getSelection().getRangeAt(0);
    const selTop = selRange.getBoundingClientRect().top;

    let closestHeading = null;
    let closestTop = -Infinity;

    for (const h of allHeadings) {
      const hRect = h.getBoundingClientRect();
      if (hRect.top <= selTop && hRect.top > closestTop) {
        closestTop = hRect.top;
        closestHeading = h;
      }
    }

    if (closestHeading) {
      // Look for wiki-link in heading text (format: ## [[filename]] or ## [[filename#heading]])
      const headingText = closestHeading.textContent;
      const wikiMatch = headingText.match(/\[\[([^\]]+)\]\]/);
      if (wikiMatch) {
        const parts = wikiMatch[1].split('#');
        return { fileName: parts[0], heading: parts.length > 1 ? parts.slice(1).join('#') : null };
      }

      // Also check for rendered internal links
      const link = closestHeading.querySelector('a.internal-link, .internal-link');
      if (link) {
        const href = link.getAttribute('data-href') || link.getAttribute('href') || link.textContent;
        if (href) {
          const parts = href.split('#');
          return { fileName: parts[0], heading: parts.length > 1 ? parts.slice(1).join('#') : null };
        }
      }
    }

    return null;
  }

  _showSwiftMatchNavPopup(rect, sourceInfo, selectedText) {
    this._hideSwiftMatchNavPopup();

    const popup = document.createElement('div');
    popup.className = 'swift-match-nav-popup';
    popup.style.cssText = `
      position: fixed;
      z-index: 999999;
      background: var(--background-primary);
      border: 1px solid var(--interactive-accent);
      border-radius: 6px;
      padding: 4px 10px;
      cursor: pointer;
      font-size: 12px;
      color: var(--text-normal);
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      white-space: nowrap;
      transition: background 0.15s, transform 0.15s;
      top: ${rect.top - 32}px;
      left: ${rect.left + rect.width / 2 - 60}px;
    `;

    const displayText = sourceInfo.heading 
      ? `→ ${sourceInfo.fileName}#${sourceInfo.heading}` 
      : `→ ${sourceInfo.fileName}`;
    popup.textContent = displayText;

    popup.addEventListener('mouseenter', () => {
      popup.style.background = 'var(--background-modifier-hover)';
      popup.style.transform = 'scale(1.05)';
    });
    popup.addEventListener('mouseleave', () => {
      popup.style.background = 'var(--background-primary)';
      popup.style.transform = 'scale(1)';
    });
    popup.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    popup.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this._navigateToSwiftMatchSource(sourceInfo, selectedText);
      this._hideSwiftMatchNavPopup();
    });

    document.body.appendChild(popup);
    this._swiftMatchNavPopup = popup;

    // Auto-hide after 5 seconds
    this._swiftMatchNavTimer = setTimeout(() => {
      this._hideSwiftMatchNavPopup();
    }, 5000);
  }

  _hideSwiftMatchNavPopup() {
    if (this._swiftMatchNavTimer) {
      clearTimeout(this._swiftMatchNavTimer);
      this._swiftMatchNavTimer = null;
    }
    if (this._swiftMatchNavPopup) {
      this._swiftMatchNavPopup.remove();
      this._swiftMatchNavPopup = null;
    }
  }

  async _navigateToSwiftMatchSource(sourceInfo, selectedText) {
    // Find the file by name
    const allFiles = this.app.vault.getMarkdownFiles();
    let targetFile = null;
    for (const f of allFiles) {
      if (f.basename === sourceInfo.fileName) {
        targetFile = f;
        break;
      }
    }
    if (!targetFile) {
      new Notice(t('sourceNotFound', sourceInfo.fileName));
      return;
    }

    // Open in new tab
    const leaf = this.app.workspace.getLeaf('tab');
    await leaf.openFile(targetFile);

    // Wait for the file to load, then navigate to the heading or search for the selected text
    setTimeout(() => {
      if (sourceInfo.heading) {
        // Navigate to heading
        this._jumpToHeadingInActiveDoc(sourceInfo.heading);
      }
      // Also try to find and select the specific text
      if (selectedText) {
        this._findAndSelectTextInActiveDoc(selectedText);
      }
    }, 500);
  }

  _jumpToHeadingInActiveDoc(headingText) {
    // Try to find the heading in the current view
    const view = this.app.workspace.activeLeaf?.view;
    if (!view) return;

    // For reading mode
    const readingView = view.containerEl?.querySelector('.markdown-reading-view, .markdown-preview-view');
    if (readingView) {
      const headings = readingView.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (const h of headings) {
        const text = h.textContent.replace(/\[\[|\]\]/g, '').trim();
        if (text.includes(headingText) || headingText.includes(text)) {
          h.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight briefly
          h.style.backgroundColor = 'rgba(255, 200, 0, 0.3)';
          setTimeout(() => { h.style.backgroundColor = ''; }, 2000);
          return;
        }
      }
    }

    // For source mode, use editor search
    const editor = this.getEditor();
    if (editor) {
      const content = editor.getValue();
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const headingMatch = lines[i].match(/^#{1,6}\s+(.+?)(?:\s+#[\w\u4e00-\u9fa5\-\/]+)*\s*$/);
        if (headingMatch) {
          const hText = headingMatch[1].replace(/\s+#[\w\u4e00-\u9fa5\-\/]+\s*$/g, '').trim();
          if (hText.includes(headingText) || headingText.includes(hText)) {
            editor.setCursor({ line: i, ch: 0 });
            editor.scrollIntoView({ from: { line: i, ch: 0 }, to: { line: i, ch: 0 } }, true);
            return;
          }
        }
      }
    }
  }

  _findAndSelectTextInActiveDoc(text) {
    const editor = this.getEditor();
    if (!editor) return;

    const content = editor.getValue();
    const searchLower = text.toLowerCase();
    const contentLower = content.toLowerCase();
    const pos = contentLower.indexOf(searchLower);
    if (pos >= 0) {
      // Convert character offset to line/ch
      const beforeText = content.substring(0, pos);
      const line = beforeText.split('\n').length - 1;
      const ch = pos - beforeText.lastIndexOf('\n') - 1;
      const endLine = line + text.split('\n').length - 1;
      const lastNewline = text.lastIndexOf('\n');
      const endCh = lastNewline >= 0 ? text.length - lastNewline - 1 : ch + text.length;

      editor.setSelection({ line, ch: Math.max(0, ch) }, { line: endLine, ch: endCh });
      editor.scrollIntoView({ from: { line, ch: 0 }, to: { line: endLine, ch: 0 } }, true);
    }
  }

  closePreview() {
    if (this._previewOutsideClickHandler) {
      document.removeEventListener('mousedown', this._previewOutsideClickHandler);
      this._previewOutsideClickHandler = null;
    }
    
    if (this.previewPanel) {
      this.previewPanel.style.display = 'none';
      this.previewPanel.innerHTML = '';
    }
    this.isPreviewOpen = false;
    this.currentPreviewFile = null;
    this.currentPreviewHeading = null;
    this.restoreListPosition();
    
    this._pendingListClose = true;
    
    this._listCloseHandler = (e) => {
      if (this._pendingListClose && this.matchList && this.matchList.style.display !== 'none') {
        const clickedModal = e.target.closest('.modal-container, .modal-bg, .modal, [role="dialog"]');
        const clickedKeywordBtn = e.target.closest('.swift-match-keyword-btn-wrapper');
        if ((!this.matchList.contains(e.target) && !clickedKeywordBtn) || clickedModal) {
          this.hideMatchList();
          this._pendingListClose = false;
          document.removeEventListener('mousedown', this._listCloseHandler);
        }
      }
    };
    
    setTimeout(() => {
      document.addEventListener('mousedown', this._listCloseHandler);
    }, 10);
  }

  restoreListPosition() {
    if (this.matchList) {
      const savedWidth = this.matchListSize.width || this.settings.matchListWidth;
      const savedHeight = this.matchListSize.height || this.settings.matchListHeight;
      this.matchList.style.width = `${savedWidth}px`;
      this.matchList.style.maxWidth = `${savedWidth}px`;
      this.matchList.style.height = `${savedHeight}px`;
    }
  }

  positionPreviewPanel() {
    if (!this.previewPanel || !this.matchList) return;
    
    let panelWidth = Math.min(this.previewSize.width, window.innerWidth - 100);
    let panelHeight = Math.min(this.previewSize.height, window.innerHeight - 100);
    
    panelWidth = Math.max(300, panelWidth);
    panelHeight = Math.max(200, panelHeight);
    
    this.previewPanel.style.width = `${panelWidth}px`;
    this.previewPanel.style.height = `${panelHeight}px`;
    
    const listWidth = this.matchList.offsetWidth || 250;
    
    let listLeft, listTop, panelLeft, panelTop;
    
    if (this.listFixedPosition.left !== null && this.listFixedPosition.top !== null) {
      listLeft = this.listFixedPosition.left;
      listTop = this.listFixedPosition.top;
      
      listLeft = Math.max(0, Math.min(listLeft, window.innerWidth - listWidth));
      listTop = Math.max(0, Math.min(listTop, window.innerHeight - 100));
      
      panelLeft = listLeft + listWidth + 10;
      panelTop = listTop;
      
      if (panelLeft + panelWidth > window.innerWidth - 10) {
        panelLeft = Math.max(10, window.innerWidth - panelWidth - 10);
        listLeft = panelLeft - listWidth - 10;
        if (listLeft < 10) {
          listLeft = 10;
          panelWidth = Math.min(panelWidth, window.innerWidth - listWidth - 30);
          this.previewPanel.style.width = `${panelWidth}px`;
          panelLeft = listLeft + listWidth + 10;
        }
      }
    } else {
      panelLeft = window.innerWidth - panelWidth - 20;
      panelTop = 50;
      
      if (panelLeft < listWidth + 30) {
        panelLeft = listWidth + 30;
        panelWidth = Math.min(panelWidth, window.innerWidth - listWidth - 50);
        this.previewPanel.style.width = `${panelWidth}px`;
      }
      
      if (panelTop + panelHeight > window.innerHeight - 10) {
        panelTop = Math.max(10, window.innerHeight - panelHeight - 10);
      }
      
      listLeft = panelLeft - listWidth - 10;
      listTop = panelTop;
      
      if (listLeft < 10) {
        listLeft = 10;
        panelLeft = listLeft + listWidth + 10;
      }
    }
    
    this.matchList.style.left = `${listLeft}px`;
    this.matchList.style.top = `${listTop}px`;
    
    this.listFixedPosition.left = listLeft;
    this.listFixedPosition.top = listTop;
    this.previewListPosition.left = listLeft;
    this.previewListPosition.top = listTop;
    
    this.previewPanel.style.left = `${panelLeft}px`;
    this.previewPanel.style.top = `${panelTop}px`;
    
    this.previewPanel.style.opacity = this.previewOpacity;
  }

  hideMatchList() {
    if (this.matchList) {
      // Skip if already hidden — avoid overwriting saved scroll position with 0
      if (this.matchList.style.display === 'none') {

        return;
      }
      const listContainer = this.matchList.querySelector('.minimap-match-list-container');
      if (listContainer) {
        const currentTerm = this._pendingShowList?.searchText || this._pendingSearchText;
        if (currentTerm) {
          this._listScrollPositions[currentTerm] = listContainer.scrollTop;

        }
        this._matchListScrollTop = listContainer.scrollTop;
      }
      // Save the list state so it can be restored exactly when reopened
      const savedTerm = this._pendingShowList?.searchText || this._pendingSearchText;
      if (savedTerm) {
        this._lastListSearchTerm = savedTerm;
        this._lastListFileMap = this._cachedMatchList;
        this._lastListMatchCount = this._pendingMatchCount;

      }
      const favSection = this.matchList.querySelector('.swift-match-favorites-section');
      if (favSection) {
        this._favSectionScrollTop = favSection.scrollTop;
      }
      this.saveListData();
      this.matchList.style.display = 'none';
    }
    if (this._matchListPositionUpdater) {
      window.removeEventListener('resize', this._matchListPositionUpdater);
      this._matchListPositionUpdater = null;
    }
    if (this._listCloseHandler) {
      document.removeEventListener('mousedown', this._listCloseHandler);
      this._listCloseHandler = null;
    }
    this._pendingListClose = false;
    this._isListVisible = false;
    this._listUserDismissed = true;
    this._searchGeneration++;
    this._pendingShowList = null;
    this._listShownFromHover = false;
    this._listTriggerElement = null;
    // Don't clear _listPinnedSearchText - pin persists even when list is hidden
    this.listFixedPosition.left = null;
    this.listFixedPosition.top = null;
    if (this.floatingSearchBox) {
      this.floatingSearchBox.value = '';
    }
  }

  addEditorDecorations(cm, matchLines, totalMatches) {
    if (!cm || !cm.scrollDOM) return;

    const scheme = this.getCurrentSelectionColorScheme();
    const borderColor = scheme.borderColor;
    const matchOpacity = this.settings.matchOpacity ?? 0.6;
    const counterColor = scheme.counterColor;
    const counterBgColor = scheme.counterBgColor;
    const counterSize = this.settings.counterSize;
    const counterPadding = '0px 2px';
    const counterTopOffset = `${this.settings.counterTopOffset}px`;

    cm.scrollDOM.style.setProperty('--minimap-match-color', borderColor);

    cm.scrollDOM.style.setProperty('--minimap-counter-opacity', 1);
    cm.scrollDOM.style.setProperty('--minimap-counter-color', counterColor);
    cm.scrollDOM.style.setProperty('--minimap-counter-bgcolor', this.hexToRgba(counterBgColor, 1));
    cm.scrollDOM.style.setProperty('--minimap-counter-size', `${counterSize}px`);
    cm.scrollDOM.style.setProperty('--minimap-counter-padding', counterPadding);
    cm.scrollDOM.style.setProperty('--minimap-counter-top-offset', counterTopOffset);

    const decorations = [];
    for (let idx = 0; idx < matchLines.length; idx++) {
      const match = matchLines[idx];
      const line = cm.state.doc.line(match.line + 1);
      const from = line.from + match.pos;
      const to = from + this.currentSelection.length;
      const label = `${match.index}/${totalMatches}`;
      const currentItem = this.savedMatchLists.find(m => m.selection === this.currentSelection);
      const hideCounter = currentItem && currentItem.countHidden;

      decorations.push({
        from: from,
        to: to,
        value: Decoration.mark({
          class: `minimap-editor-match${this.getCounterPresetClass()}${hideCounter ? ' minimap-hide-counter' : ''}`,
          attributes: {
            'data-match': label,
            'style': `margin:0 -0.2em;padding:0 0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:radial-gradient(farthest-side,${this.hexToRgba(borderColor, matchOpacity)} 98%,#0000) bottom left,linear-gradient(${this.hexToRgba(borderColor, matchOpacity)} 0 0) bottom,radial-gradient(farthest-side,${this.hexToRgba(borderColor, matchOpacity)} 98%,#0000) bottom right;background-size:8px 8px,calc(100% - 8px) 8px;background-repeat:no-repeat;`
          }
        })
      });
    }

    const decorationSet = Decoration.set(decorations.sort((a, b) => a.from - b.from));
    cm.dispatch({
      effects: setMatchHighlights.of(decorationSet)
    });
  }

  addEditorDecorationsWithPinned(cm, matchLines, totalMatches) {
    if (!cm || !cm.scrollDOM) return;

    const matchOpacity = this.settings.matchOpacity ?? 0.6;
    const counterSize = this.settings.counterSize;
    const counterPadding = '0px 2px';
    const counterTopOffset = `${this.settings.counterTopOffset}px`;

    cm.scrollDOM.style.setProperty('--minimap-counter-opacity', 1);
    cm.scrollDOM.style.setProperty('--minimap-counter-size', `${counterSize}px`);
    cm.scrollDOM.style.setProperty('--minimap-counter-padding', counterPadding);
    cm.scrollDOM.style.setProperty('--minimap-counter-top-offset', counterTopOffset);

    this.registerEditorField();

    const content = cm.state.doc.toString();
    const lines = content.split('\n');
    const allDecorations = [];

    const currentFile = this.app.workspace.activeLeaf?.view?.file;
    const currentFilePath = currentFile ? currentFile.path : null;
    const currentPreset = this.settings.counterStylePreset || 'glass';

    // Add pinned decorations first
    const pinnedItems = this.savedMatchLists.filter(item => item.pinned && (!currentFilePath || !item.filePath || item.filePath === currentFilePath));
    for (const pinnedItem of pinnedItems) {
      const colorScheme = this.getPinnedColorScheme(pinnedItem);
      const pBorderColor = colorScheme.borderColor;
      let pCounterBgColor = colorScheme.counterBgColor;
      let pCounterColor = colorScheme.counterColor;
      // 描边气泡样式下，计数边框和文字也跟随匹配透明度
      if (currentPreset === 'outlined') {
        pCounterBgColor = this.hexToRgba(pCounterBgColor, matchOpacity);
        pCounterColor = this.hexToRgba(pCounterColor, matchOpacity);
      }
      const searchLower = pinnedItem.selection.toLowerCase();

      // First pass: count total matches
      let totalPinnedMatches = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();
        let pos = 0;
        while ((pos = lineLower.indexOf(searchLower, pos)) !== -1) {
          totalPinnedMatches++;
          pos += 1;
        }
      }

      // Second pass: create decorations
      let matchIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();
        let pos = 0;
        while ((pos = lineLower.indexOf(searchLower, pos)) !== -1) {
          matchIndex++;
          try {
            const line = cm.state.doc.line(i + 1);
            const from = line.from + pos;
            const to = from + pinnedItem.selection.length;
            allDecorations.push({
              from: from,
              to: to,
              value: Decoration.mark({
                class: `minimap-editor-match pinned${this.getCounterPresetClass()}${pinnedItem.countHidden ? ' minimap-hide-counter' : ''}`,
                attributes: {
                  'data-selection': pinnedItem.selection,
                  'data-match': `${matchIndex}/${totalPinnedMatches}`,
                  'style': `margin:0 -0.2em;padding:0 0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:radial-gradient(farthest-side,${this.hexToRgba(pBorderColor, matchOpacity)} 98%,#0000) bottom left,linear-gradient(${this.hexToRgba(pBorderColor, matchOpacity)} 0 0) bottom,radial-gradient(farthest-side,${this.hexToRgba(pBorderColor, matchOpacity)} 98%,#0000) bottom right;background-size:8px 8px,calc(100% - 8px) 8px;background-repeat:no-repeat;--minimap-counter-bgcolor: ${pCounterBgColor};--minimap-counter-color: ${pCounterColor};`
                }
              })
            });
          } catch (e) {}
          pos += 1;
        }
      }
    }

    // Add current selection decorations on top (using color scheme)
    // Skip if current selection is already pinned (pinned decoration already covers it)
    const isCurrentPinned = this.currentSelection && this.savedMatchLists.some(m => m.selection === this.currentSelection && m.pinned);

    if (!isCurrentPinned) {
      const currentColorScheme = this.getCurrentSelectionColorScheme();
      const currentBorderColor = currentColorScheme.borderColor;
      let currentCounterBgColor = currentColorScheme.counterBgColor;
      let currentCounterColor = currentColorScheme.counterColor;
      // 描边气泡样式下，计数边框和文字也跟随匹配透明度
      if (currentPreset === 'outlined') {
        currentCounterBgColor = this.hexToRgba(currentCounterBgColor, matchOpacity);
        currentCounterColor = this.hexToRgba(currentCounterColor, matchOpacity);
      }

      for (let idx = 0; idx < matchLines.length; idx++) {
        const match = matchLines[idx];
        try {
          const line = cm.state.doc.line(match.line + 1);
          const from = line.from + match.pos;
          const to = from + this.currentSelection.length;
          const label = `${match.index}/${totalMatches}`;

          const isJumpTarget = this._jumpHighlightRange && from === this._jumpHighlightRange.from && to === this._jumpHighlightRange.to;

          if (isJumpTarget) {
            allDecorations.push({
              from: from,
              to: to,
              value: Decoration.mark({
                class: 'minimap-editor-match hl-marshmallow',
                attributes: {
                  'data-match': label,
                  'style': `background:#fff !important;color:#cc2e7a !important;border:2px solid #ff6eb4 !important;border-radius:10px !important;padding:0.1em 0.6em !important;box-shadow:2px 2px 0 #ffaad9 !important;margin:0 -0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;--minimap-counter-bgcolor:#ff6eb4;--minimap-counter-color:#fff;`
                }
              })
            });
          } else {
            allDecorations.push({
              from: from,
              to: to,
              value: Decoration.mark({
                class: `minimap-editor-match${this.getCounterPresetClass()}`,
                attributes: {
                  'data-match': label,
                  'style': `margin:0 -0.2em;padding:0 0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:radial-gradient(farthest-side,${this.hexToRgba(currentBorderColor, matchOpacity)} 98%,#0000) bottom left,linear-gradient(${this.hexToRgba(currentBorderColor, matchOpacity)} 0 0) bottom,radial-gradient(farthest-side,${this.hexToRgba(currentBorderColor, matchOpacity)} 98%,#0000) bottom right;background-size:8px 8px,calc(100% - 8px) 8px;background-repeat:no-repeat;--minimap-counter-bgcolor: ${currentCounterBgColor};--minimap-counter-color: ${currentCounterColor};`
                }
              })
            });
          }
        } catch (e) {}
      }
    }

    if (this._jumpHighlightRange) {
      const jFrom = this._jumpHighlightRange.from;
      const jTo = this._jumpHighlightRange.to;
      allDecorations.push({
        from: jFrom,
        to: jTo,
        value: Decoration.mark({
          class: 'minimap-editor-match hl-marshmallow',
          attributes: {
            'style': `background:#fff !important;color:#cc2e7a !important;border:2px solid #ff6eb4 !important;border-radius:10px !important;padding:0.1em 0.6em !important;box-shadow:2px 2px 0 #ffaad9 !important;margin:0 -0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;`
          }
        })
      });
    }

    if (allDecorations.length > 0) {
      const decorationSet = Decoration.set(allDecorations.sort((a, b) => a.from - b.from));
      cm.dispatch({
        effects: setMatchHighlights.of(decorationSet)
      });
    }
  }

  clearHighlights() {
    this.highlights.forEach((h) => {
      if (h.parentNode) h.parentNode.removeChild(h);
    });
    this.highlights = [];
    this.editorHighlights = [];

    if (this.isReadingMode()) {
      this.clearReadingViewHighlights();
    } else {
      const editor = this.getEditor();
      if (editor && editor.cm) {
        editor.cm.dispatch({
          effects: setMatchHighlights.of(Decoration.none)
        });
      }
    }

    // Pin only locks the word, not the list visibility - list can still be hidden
    // But if _keepListVisible flag is set (e.g. from recent search chip click), don't hide
    if (!this._keepListVisible) {
      this.hideMatchList();
    }
    // Preserve _pendingMatchCount and _pendingSearchText so match list can be restored
    // when reopened. Only clear the badge display when there's truly no cached data.
    if (!this._cachedMatchList || this._cachedMatchList.size === 0) {
      this._pendingMatchCount = 0;
      this._pendingSearchText = null;
      this.updateFloatingToggleBadge(0, 0);
    }
  }

  showPinnedDecorations() {
    const currentFile = this.app.workspace.activeLeaf?.view?.file;
    const currentFilePath = currentFile ? currentFile.path : null;
    const pinnedItems = this.savedMatchLists.filter(item => item.pinned && (!currentFilePath || !item.filePath || item.filePath === currentFilePath));
    if (pinnedItems.length === 0) return;

    if (this.isReadingMode()) {
      for (const pinnedItem of pinnedItems) {
        const colorScheme = this.getPinnedColorScheme(pinnedItem);
        this.addReadingViewHighlights(pinnedItem.selection, pinnedItem.matchCount || 0, colorScheme);
      }
      return;
    }

    const editor = this.getEditor();
    if (!editor || !editor.cm) return;

    const cm = editor.cm;
    const content = editor.getValue();
    const lines = content.split('\n');

    this.registerEditorField();

    const matchOpacity = this.settings.matchOpacity ?? 0.6;

    const decorations = [];

    for (const pinnedItem of pinnedItems) {
      const colorScheme = this.getPinnedColorScheme(pinnedItem);
      const borderColor = colorScheme.borderColor;
      let counterBgColor = colorScheme.counterBgColor;
      let counterColor = colorScheme.counterColor;
      // 描边气泡样式下，计数边框和文字也跟随匹配透明度
      const preset = this.settings.counterStylePreset || 'glass';
      if (preset === 'outlined') {
        counterBgColor = this.hexToRgba(counterBgColor, matchOpacity);
        counterColor = this.hexToRgba(counterColor, matchOpacity);
      }

      const searchLower = pinnedItem.selection.toLowerCase();

      // First pass: count total matches
      let totalPinnedMatches = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();
        let pos = 0;
        while ((pos = lineLower.indexOf(searchLower, pos)) !== -1) {
          totalPinnedMatches++;
          pos += 1;
        }
      }

      // Second pass: create decorations
      let matchIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();
        let pos = 0;
        while ((pos = lineLower.indexOf(searchLower, pos)) !== -1) {
          matchIndex++;
          try {
            const line = cm.state.doc.line(i + 1);
            const from = line.from + pos;
            const to = from + pinnedItem.selection.length;

            decorations.push({
              from: from,
              to: to,
              value: Decoration.mark({
                class: `minimap-editor-match pinned${this.getCounterPresetClass()}${pinnedItem.countHidden ? ' minimap-hide-counter' : ''}`,
                attributes: {
                  'data-selection': pinnedItem.selection,
                  'data-match': `${matchIndex}/${totalPinnedMatches}`,
                  'style': `margin:0 -0.2em;padding:0 0.2em;-webkit-box-decoration-break:clone;box-decoration-break:clone;background:radial-gradient(farthest-side,${this.hexToRgba(borderColor, matchOpacity)} 98%,#0000) bottom left,linear-gradient(${this.hexToRgba(borderColor, matchOpacity)} 0 0) bottom,radial-gradient(farthest-side,${this.hexToRgba(borderColor, matchOpacity)} 98%,#0000) bottom right;background-size:8px 8px,calc(100% - 8px) 8px;background-repeat:no-repeat;--minimap-counter-bgcolor: ${counterBgColor};--minimap-counter-color: ${counterColor};`
                }
              })
            });
          } catch (e) {
            // Line may have been deleted
          }
          pos += 1;
        }
      }
    }

    if (decorations.length > 0) {
      const decorationSet = Decoration.set(decorations.sort((a, b) => a.from - b.from));
      cm.dispatch({
        effects: setMatchHighlights.of(decorationSet)
      });
    }
  }

  getCounterPresetClass() {
    const preset = this.settings.counterStylePreset || 'glass';
    return ` minimap-counter-${preset}`;
  }

  parseMultiKeywords(searchText) {
    if (!searchText || !searchText.includes('|')) return null;
    const keywords = searchText.split('|').map(k => k.trim()).filter(k => k.length > 0);
    return keywords.length >= 2 ? keywords : null;
  }

  getMultiKeywordColors(count) {
    const palettes = [
      '#ff6600', '#2196F3', '#4CAF50', '#9C27B0', '#FF9800',
      '#E91E63', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B'
    ];
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(palettes[i % palettes.length]);
    }
    return colors;
  }

  async performMultiKeywordSearch(searchText, keywords) {
    this._searchGeneration++;
    const gen = this._searchGeneration;
    this._searchInProgress = true;

    const keywordColors = this.getMultiKeywordColors(keywords.length);
    const fileResults = new Map();

    const extractSnippetsForKeyword = (content, kwLower, maxSnippets = 30) => {
      const lines = content.split('\n');
      const snippets = [];
      for (let i = 0; i < lines.length && snippets.length < maxSnippets; i++) {
        const lineLower = lines[i].toLowerCase();
        const idx = lineLower.indexOf(kwLower);
        if (idx !== -1) {
          const trimmed = lines[i].trim();
          if (trimmed.length > 0) {
            let snippet = trimmed;
            let fullLine = trimmed;
            let truncateStart = 0;
            let truncateEnd = trimmed.length;
            if (snippet.length > 120) {
              const matchIdx = snippet.toLowerCase().indexOf(kwLower);
              truncateStart = Math.max(0, matchIdx - 30);
              truncateEnd = Math.min(snippet.length, matchIdx + kwLower.length + 70);
              snippet = snippet.slice(truncateStart, truncateEnd);
            }
            snippets.push({ text: snippet, fullLine, truncateStart, truncateEnd });
          }
        }
      }
      return snippets;
    };

    try {
      for (let ki = 0; ki < keywords.length; ki++) {
        if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
        const kw = keywords[ki];
        const kwLower = kw.toLowerCase();
        const allFiles = this.app.vault.getMarkdownFiles();

        for (const file of allFiles) {
          if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
          try {
            const nameMatch = file.name.toLowerCase().includes(kwLower);
            const content = await this.app.vault.cachedRead(file);
            if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }
            const contentMatch = content && content.toLowerCase().includes(kwLower);

            if (nameMatch || contentMatch) {
              if (!fileResults.has(file.path)) {
                fileResults.set(file.path, { file, keywordHits: [], totalMatches: 0 });
              }
              const entry = fileResults.get(file.path);
              const matchCount = contentMatch
                ? (content.toLowerCase().split(kwLower).length - 1)
                : 1;
              const snippets = contentMatch ? extractSnippetsForKeyword(content, kwLower) : [];
              entry.keywordHits.push({
                keyword: kw,
                keywordIndex: ki,
                color: keywordColors[ki],
                matchCount,
                snippets
              });
              entry.totalMatches += matchCount;
            }
          } catch (e) {
            continue;
          }
        }
      }
    } catch (e) {
      console.error('Multi-keyword search error:', e);
    }

    if (this._searchGeneration !== gen) { this._searchInProgress = false; return; }

    const sortedEntries = [...fileResults.values()].filter(entry => {
      if (this.settings.multiKeywordRequireAll !== false) {
        return entry.keywordHits.length === keywords.length;
      }
      return true;
    }).sort((a, b) => {
      if (b.keywordHits.length !== a.keywordHits.length) {
        return b.keywordHits.length - a.keywordHits.length;
      }
      return b.totalMatches - a.totalMatches;
    });

    const fileMap = new Map();
    let totalAllDocMatches = 0;
    for (const entry of sortedEntries.slice(0, 200)) {
      const items = [];
      for (const hit of entry.keywordHits) {
        if (hit.snippets.length > 0) {
          items.push({
            text: hit.snippets[0].text,
            level: 0,
            type: 'content',
            snippets: hit.snippets,
            keyword: hit.keyword,
            keywordIndex: hit.keywordIndex,
            keywordColor: hit.color
          });
        } else {
          items.push({
            text: entry.file.basename,
            level: 0,
            type: 'content',
            keyword: hit.keyword,
            keywordIndex: hit.keywordIndex,
            keywordColor: hit.color
          });
        }
      }
      totalAllDocMatches += entry.totalMatches;
      fileMap.set(entry.file, items);
    }

    this._searchInProgress = false;
    this._cachedMatchList = fileMap;
    this._cachedMatchListKey = searchText;
    this._multiKeywordData = { keywords, keywordColors };
    this._pendingShowList = { searchText, matchCount: totalAllDocMatches };
    this._pendingMatchCount = totalAllDocMatches;
    this._recentSearchCaches[searchText] = { fileMap, matchCount: totalAllDocMatches };
    this.updateFloatingToggleBadge(fileMap.size, totalAllDocMatches);

    if (this._isListVisible || this._keepListVisible) {
      this.renderMatchList(fileMap, totalAllDocMatches, false);
    }
  }

  getPinnedColorScheme(pinnedItem) {
    const colorIndex = pinnedItem.colorIndex || 0;
    const schemes = this.settings.pinColorSchemes || DEFAULT_SETTINGS.pinColorSchemes;
    const scheme = { ...schemes[colorIndex % schemes.length] };
    const preset = this.settings.counterStylePreset || 'glass';
    if (preset === 'glass') {
      // 毛玻璃: 计数颜色固定，深浅自动切换
      const isDark = document.body.classList.contains('theme-dark');
      scheme.counterColor = isDark ? '#e0dcdc' : '#aba6a6';
    } else if (preset === 'outlined') {
      // 描边气泡: borderLinked 时 counterBgColor = borderColor
      if (scheme.borderLinked !== false) {
        scheme.counterBgColor = scheme.borderColor;
      }
      // counterLinked 时 counterColor = counterBgColor
      if (scheme.counterLinked !== false) {
        scheme.counterColor = scheme.counterBgColor;
      }
    }
    return scheme;
  }

  getCurrentSelectionColorScheme() {
    const pinnedItems = this.savedMatchLists.filter(m => m.pinned);
    const nextColorIndex = pinnedItems.length % this.settings.pinColorSchemes.length;
    const scheme = { ...this.settings.pinColorSchemes[nextColorIndex] };
    const preset = this.settings.counterStylePreset || 'glass';
    if (preset === 'glass') {
      const isDark = document.body.classList.contains('theme-dark');
      scheme.counterColor = isDark ? '#e0dcdc' : '#aba6a6';
    } else if (preset === 'outlined') {
      if (scheme.borderLinked !== false) {
        scheme.counterBgColor = scheme.borderColor;
      }
      if (scheme.counterLinked !== false) {
        scheme.counterColor = scheme.counterBgColor;
      }
    }
    return scheme;
  }

  updateMinimapContent() {
    if (!this.minimapContent) return;

    // Check if the minimap container's parent view is blacklisted
    if (this.minimapContainer && this.minimapContainer.parentNode) {
      const leafInfo = this._getViewInfoFromContainer(this.minimapContainer.parentNode);
      if (leafInfo && this._isViewInfoBlacklisted(leafInfo)) {
        this.minimapContainer.parentNode.removeChild(this.minimapContainer);
        this.minimapContainer = null;
        this.minimapContent = null;
        this.slider = null;
        return;
      }
    }

    if (this.isReadingMode()) {
      const file = this.app.workspace.activeLeaf?.view?.file;
      if (file) {
        this.app.vault.read(file).then(content => {
          this.minimapContent.textContent = content;
          setTimeout(() => {
            this.updateViewport();
          }, 50);
        }).catch(() => {
          // Retry after delay
          setTimeout(() => this.updateMinimapContent(), 200);
        });
      } else {
        setTimeout(() => this.updateMinimapContent(), 200);
      }
    } else {
      const editor = this.getEditor();
      if (!editor) {
        setTimeout(() => this.updateMinimapContent(), 200);
        return;
      }
      const content = editor.getValue();
      if (!content) {
        setTimeout(() => this.updateMinimapContent(), 200);
        return;
      }
      this.minimapContent.textContent = content;
      setTimeout(() => {
        this.updateViewport();
      }, 50);
    }
  }

  updateViewport() {
    if (!this.minimapContainer || !this.minimapContent) return;

    const containerHeight = this.minimapContainer.clientHeight;

    let lineCount = 0;

    if (this.isReadingMode()) {
      const content = this.minimapContent.textContent || '';
      lineCount = content.split('\n').length;
    } else {
      const editor = this.getEditor();
      if (!editor) return;
      const content = editor.getValue();
      lineCount = content.split('\n').length;
    }

    const lineHeightInMinimap = 2;
    const naturalContentHeight = lineCount * lineHeightInMinimap;
    const contentHeight = Math.min(containerHeight, naturalContentHeight);
    
    this.minimapContent.style.height = `${contentHeight}px`;
    this.minimapContent.style.fontSize = '2px';
    this.minimapContent.style.lineHeight = '1';

    if (!this.slider) return;

    let scrollTop, scrollHeight, clientHeight;

    if (this.isReadingMode()) {
      const scrollEl = this.getReadingViewScrollEl();
      if (!scrollEl) return;
      scrollTop = scrollEl.scrollTop;
      scrollHeight = scrollEl.scrollHeight;
      clientHeight = scrollEl.clientHeight;
    } else {
      const editor = this.getEditor();
      if (!editor || !editor.cm) return;
      const scrollDOM = editor.cm.scrollDOM;
      if (!scrollDOM) return;
      scrollTop = scrollDOM.scrollTop;
      scrollHeight = scrollDOM.scrollHeight;
      clientHeight = scrollDOM.clientHeight;
    }

    if (scrollHeight <= clientHeight) {
      this.slider.style.height = `${contentHeight}px`;
      this.slider.style.top = '0px';
      return;
    }

    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const viewportRatio = clientHeight / scrollHeight;
    const sliderHeight = Math.max(20, viewportRatio * contentHeight);
    const sliderTop = scrollRatio * (contentHeight - sliderHeight);

    this.slider.style.height = `${sliderHeight}px`;
    this.slider.style.top = `${sliderTop}px`;
  }

  onunload() {
    if (this._themeObserver) this._themeObserver.disconnect();
    this.closeSettingsPanel();
    this.closeFloatingContextMenu();
    this.closeFloatingEditPanel();
    // Clean up custom style elements
    const customStyleEl = document.getElementById('swift-match-custom-style');
    if (customStyleEl) customStyleEl.remove();
    const previewStyleEl = document.getElementById('swift-match-preview-style');
    if (previewStyleEl) previewStyleEl.remove();
    // Clean up keyword button custom styles
    document.querySelectorAll('[id^="swift-match-keyword-custom-style-"],[id^="swift-match-keyword-preview-style-"]').forEach(el => el.remove());
    this.hidePinIcon();
    this.removeEditorPadding();
    const statusBar = document.querySelector('.status-bar');
    if (statusBar) {
      statusBar.classList.remove('minimap-hide-statusbar');
    }
    if (this.boundMouseMove) {
      document.removeEventListener('mousemove', this.boundMouseMove);
    }
    if (this.boundMouseUp) {
      document.removeEventListener('mouseup', this.boundMouseUp);
    }
    if (this.boundWheel && this.minimapContainer) {
      this.minimapContainer.removeEventListener('wheel', this.boundWheel);
    }
    if (this.boundContextMenu && this.minimapContainer) {
      this.minimapContainer.removeEventListener('contextmenu', this.boundContextMenu);
    }
    if (this.boundListWheel && this.matchList) {
      this.matchList.removeEventListener('wheel', this.boundListWheel);
    }
    if (this.boundListWheel && this.previewPanel) {
      this.previewPanel.removeEventListener('wheel', this.boundListWheel);
    }
    if (this.scrollHandler) {
      document.removeEventListener('scroll', this.scrollHandler, true);
      if (this.editorScrollEl) {
        this.editorScrollEl.removeEventListener('scroll', this.scrollHandler);
      }
    }
    if (this.minimapContainer && this.minimapContainer.parentNode) {
      this.minimapContainer.parentNode.removeChild(this.minimapContainer);
    }
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
    if (this.matchList && this.matchList.parentNode) {
      this.matchList.parentNode.removeChild(this.matchList);
    }
    if (this.previewPanel && this.previewPanel.parentNode) {
      this.previewPanel.parentNode.removeChild(this.previewPanel);
    }
    if (this._previewOutsideClickHandler) {
      document.removeEventListener('mousedown', this._previewOutsideClickHandler);
    }
    if (this._listCloseHandler) {
      document.removeEventListener('mousedown', this._listCloseHandler);
    }
    if (this._matchListPositionUpdater) {
      window.removeEventListener('resize', this._matchListPositionUpdater);
    }
    if (this._readingModeMouseUpHandler) {
      document.removeEventListener('mouseup', this._readingModeMouseUpHandler);
    }
    if (this._readingModeKeyUpHandler) {
      document.removeEventListener('keyup', this._readingModeKeyUpHandler);
    }
    this._removeSwiftMatchExportNav();
    this.clearReadingViewHighlights();
    this.hideAllMatchListIndicators();
    // Clean up floating toggle wrapper
    if (this.floatingToggleWrapper && this.floatingToggleWrapper.parentNode) {
      this.floatingToggleWrapper.parentNode.removeChild(this.floatingToggleWrapper);
    }
    // Clean up floating keyword buttons
    for (const btnData of this._floatingKeywordButtons) {
      if (btnData.wrapper && btnData.wrapper.parentNode) {
        btnData.wrapper.parentNode.removeChild(btnData.wrapper);
      }
    }
    this._floatingKeywordButtons = [];
    if (this.matchListIndicator && this.matchListIndicator.parentNode) {
      this.matchListIndicator.parentNode.removeChild(this.matchListIndicator);
    }
  }
}

module.exports = MinimapPlugin;
