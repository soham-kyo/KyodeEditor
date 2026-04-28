"use strict";
const state = {
  activeTab: "html",
  autoRun: true,
  theme: "light",
  consoleOpen: false,
  consoleLogs: [],
  debounceTimer: null,
  isResizing: false,
};
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const els = {
  htmlEditor: $("editor-html"),
  cssEditor: $("editor-css"),
  jsEditor: $("editor-js"),
  lnHtml: $("ln-html"),
  lnCss: $("ln-css"),
  lnJs: $("ln-js"),
  preview: $("preview"),
  consolePane: $("consolePane"),
  consoleOutput: $("consoleOutput"),
  consoleBadge: $("consoleBadge"),
  autoRunToggle: $("autoRunToggle"),
  btnRun: $("btnRun"),
  btnDownload: $("btnDownload"),
  btnTheme: $("btnTheme"),
  btnConsole: $("btnConsole"),
  btnRefresh: $("btnRefresh"),
  btnClearConsole: $("btnClearConsole"),
  iconSun: $("iconSun"),
  iconMoon: $("iconMoon"),
  divider: $("divider"),
  editorPane: $("editorPane"),
  previewPane: $("previewPane"),
  statusSaved: $("statusSaved"),
  statusLines: $("statusLines"),
  tabBtns: $$(".tab-btn"),
  editorPanels: $$(".editor-panel"),
};

const tabMap = {
  html: { editor: els.htmlEditor, ln: els.lnHtml },
  css: { editor: els.cssEditor, ln: els.lnCss },
  js: { editor: els.jsEditor, ln: els.lnJs },
};
const DEFAULT_CODE = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Project</title>
</head>
<body>
  <div class="card">
    <h1>👋 Welcome to KyodeEditor</h1>
    <p>Edit the <strong>HTML</strong>, <strong>CSS</strong>, and <strong>JS</strong> tabs to get started.</p>
    <button onclick="greet()">Say Hello</button>
  </div>
</body>
</html>`,

  css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
  font-family: system-ui, sans-serif;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 40px 48px;
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
  text-align: center;
  max-width: 460px;
  width: 90%;
}

h1 {
  font-size: 1.8rem;
  color: #1e1b4b;
  margin-bottom: 12px;
}

p {
  color: #6d6a85;
  line-height: 1.6;
  margin-bottom: 24px;
}

strong {
  color: #7c3aed;
}

button {
  padding: 10px 28px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
}

button:active {
  transform: translateY(0);
}`,

  js: `function greet() {
  const names = ['World', 'Developer', 'Creator', 'Coder'];
  const name = names[Math.floor(Math.random() * names.length)];
  
  const card = document.querySelector('.card');
  
  const msg = document.createElement('p');
  msg.textContent = \`Hello, \${name}! 🎉\`;
  msg.style.cssText = \`
    color: #7c3aed;
    font-weight: 600;
    margin-top: 14px;
    animation: pop 0.3s ease;
  \`;
  
  card.appendChild(msg);
  
  // Remove after 2s
  setTimeout(() => msg.remove(), 2000);
  
  console.log(\`Greeted: \${name}\`);
}

// Style for pop animation
const style = document.createElement('style');
style.textContent = \`
  @keyframes pop {
    from { transform: scale(0.8); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
\`;
document.head.appendChild(style);
`,
};

const STORAGE_KEY = "kyode_editor_v1";

function saveToStorage() {
  const data = {
    html: els.htmlEditor.value,
    css: els.cssEditor.value,
    js: els.jsEditor.value,
    theme: state.theme,
    activeTab: state.activeTab,
    consoleOpen: state.consoleOpen,
    autoRun: state.autoRun,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    flashSaved();
  } catch (e) {}
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function flashSaved() {
  els.statusSaved.classList.add("saving");
  clearTimeout(els.statusSaved._timer);
  els.statusSaved._timer = setTimeout(() => {
    els.statusSaved.classList.remove("saving");
  }, 1200);
}
function updateLineNumbers(editorEl, lnEl) {
  const lines = editorEl.value.split("\n").length;
  let html = "";
  for (let i = 1; i <= lines; i++) {
    html += i + "\n";
  }
  lnEl.textContent = html;
}

function syncScroll(editorEl, lnEl) {
  lnEl.scrollTop = editorEl.scrollTop;
}

function updateCursorStatus(editorEl) {
  const text = editorEl.value.substring(0, editorEl.selectionStart);
  const lines = text.split("\n");
  const ln = lines.length;
  const col = lines[lines.length - 1].length + 1;
  els.statusLines.textContent = `Ln ${ln}, Col ${col}`;
}

function handleTabKey(e) {
  if (e.key !== "Tab") return;
  e.preventDefault();

  const el = e.target;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const TAB = "  "; // 2 spaces

  if (e.shiftKey) {
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    const lineStart = before.lastIndexOf("\n") + 1;
    const selected = el.value.substring(lineStart, end);
    const unindented = selected.replace(/^  /gm, "");
    el.value = el.value.substring(0, lineStart) + unindented + after;
    el.selectionStart = lineStart;
    el.selectionEnd = lineStart + unindented.length;
  } else if (start !== end) {
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    const lineStart = before.lastIndexOf("\n") + 1;
    const selected = el.value.substring(lineStart, end);
    const indented = selected.replace(/^/gm, TAB);
    el.value = el.value.substring(0, lineStart) + indented + after;
    el.selectionStart = lineStart;
    el.selectionEnd = lineStart + indented.length;
  } else {
    el.value = el.value.substring(0, start) + TAB + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + TAB.length;
  }

  onEditorInput({ target: el });
}

const PAIRS = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};
const CLOSERS = new Set(Object.values(PAIRS));

function handleSmartType(e) {
  const el = e.target;
  const key = e.key;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const ch = el.value[start];

  if (CLOSERS.has(key) && key === ch && start === end) {
    e.preventDefault();
    el.selectionStart = el.selectionEnd = start + 1;
    return;
  }

  if (PAIRS[key] && start === end) {
    e.preventDefault();
    const close = PAIRS[key];
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    el.value = before + key + close + after;
    el.selectionStart = el.selectionEnd = start + 1;
    onEditorInput({ target: el });
    return;
  }

  if (key === "Enter" && start === end) {
    const charBefore = el.value[start - 1];
    const charAfter = el.value[start];
    if (charBefore && charAfter && PAIRS[charBefore] === charAfter) {
      e.preventDefault();
      const textBefore = el.value.substring(0, start);
      const currentLine = textBefore.split("\n").pop();
      const indent = currentLine.match(/^\s*/)[0];
      const inner = "\n" + indent + "  ";
      const outer = "\n" + indent;
      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      el.value = before + inner + outer + after;
      el.selectionStart = el.selectionEnd = start + inner.length;
      onEditorInput({ target: el });
      return;
    }
  }

  if (key === "Enter" && start === end) {
    e.preventDefault();
    const textBefore = el.value.substring(0, start);
    const currentLine = textBefore.split("\n").pop();
    const indent = currentLine.match(/^\s*/)[0];
    const ins = "\n" + indent;
    el.value = textBefore + ins + el.value.substring(end);
    el.selectionStart = el.selectionEnd = start + ins.length;
    onEditorInput({ target: el });
    return;
  }
}

function onEditorInput(e) {
  const el = e.target;
  const tab = el.dataset.tab || state.activeTab;
  updateLineNumbers(el, tabMap[tab].ln);
  updateCursorStatus(el);

  if (state.autoRun) {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(runCode, 600);
  }
}

function switchTab(tab) {
  state.activeTab = tab;

  els.tabBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  els.editorPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${tab}`);
  });

  const editorEl = tabMap[tab].editor;
  editorEl.focus();
  updateLineNumbers(editorEl, tabMap[tab].ln);
  updateCursorStatus(editorEl);
}

function runCode() {
  const html = els.htmlEditor.value;
  const css = els.cssEditor.value;
  const js = els.jsEditor.value;

  state.consoleLogs = [];

  const consoleInterceptor = `
<script>
(function() {
  var _log     = console.log;
  var _warn    = console.warn;
  var _error   = console.error;
  var _info    = console.info;

  function send(type, args) {
    var msg = Array.from(args).map(function(a) {
      try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
      catch(e) { return String(a); }
    }).join(' ');
    window.parent.postMessage({ type: 'violet_console', level: type, msg: msg }, '*');
  }

  console.log   = function() { _log.apply(console, arguments);   send('log',   arguments); };
  console.warn  = function() { _warn.apply(console, arguments);  send('warn',  arguments); };
  console.error = function() { _error.apply(console, arguments); send('error', arguments); };
  console.info  = function() { _info.apply(console, arguments);  send('info',  arguments); };

  window.addEventListener('error', function(e) {
    send('error', [e.message + (e.filename ? ' (' + e.filename + ':' + e.lineno + ')' : '')]);
  });
  window.addEventListener('unhandledrejection', function(e) {
    send('error', ['Unhandled Promise rejection: ' + (e.reason || 'unknown')]);
  });
})();
<\/script>`;

  let doc;
  if (
    html.trim().toLowerCase().includes("<!doctype") ||
    html.trim().toLowerCase().startsWith("<html")
  ) {
    doc = html;
    if (/<\/head>/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `<style>${css}</style>\n</head>`);
    } else {
      doc = consoleInterceptor + `<style>${css}</style>\n` + doc;
    }
    if (/<\/body>/i.test(doc)) {
      doc = doc.replace(/<\/body>/i, `<script>${js}<\/script>\n</body>`);
    } else {
      doc += `<script>${js}<\/script>`;
    }
    doc = doc.replace(/<head>/i, `<head>${consoleInterceptor}`);
  } else {
    doc = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
${consoleInterceptor}
<style>${css}</style>
</head>
<body>
${html}
<script>${js}<\/script>
</body>
</html>`;
  }

  els.preview.srcdoc = doc;
  saveToStorage();
}

window.addEventListener("message", (e) => {
  if (!e.data || e.data.type !== "KyodeEditor_console") return;
  addConsoleEntry(e.data.level, e.data.msg);
});

function addConsoleEntry(level, msg) {
  const empty = els.consoleOutput.querySelector(".console-empty");
  if (empty) empty.remove();

  state.consoleLogs.push({ level, msg });
  updateConsoleBadge();

  const entry = document.createElement("div");
  entry.className = `console-entry ${level}`;
  entry.innerHTML = `<span class="console-type">${level}</span><span class="console-msg">${escapeHtml(msg)}</span>`;
  els.consoleOutput.appendChild(entry);
  els.consoleOutput.scrollTop = els.consoleOutput.scrollHeight;
}
function updateConsoleBadge() {
  const errors = state.consoleLogs.filter(
    (l) => l.level === "error" || l.level === "warn",
  ).length;
  if (errors > 0) {
    els.consoleBadge.hidden = false;
    els.consoleBadge.textContent = errors > 99 ? "99+" : errors;
  } else {
    els.consoleBadge.hidden = true;
  }
}

function clearConsole() {
  state.consoleLogs = [];
  els.consoleOutput.innerHTML =
    '<div class="console-empty">No output yet. Run your code to see logs here.</div>';
  updateConsoleBadge();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toggleConsole() {
  state.consoleOpen = !state.consoleOpen;
  els.consolePane.classList.toggle("open", state.consoleOpen);
  els.btnConsole.classList.toggle("active", state.consoleOpen);
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  els.iconSun.style.display = theme === "dark" ? "none" : "";
  els.iconMoon.style.display = theme === "light" ? "none" : "";
  try {
    localStorage.setItem("kyode_theme", theme);
  } catch (e) {}
}

function toggleTheme() {
  applyTheme(state.theme === "light" ? "dark" : "light");
}

function downloadCode() {
  const html = els.htmlEditor.value;
  const css = els.cssEditor.value;
  const js = els.jsEditor.value;

  let doc;
  if (
    html.trim().toLowerCase().includes("<!doctype") ||
    html.trim().toLowerCase().startsWith("<html")
  ) {
    doc = html;
    if (/<\/head>/i.test(doc)) {
      doc = doc.replace(/<\/head>/i, `<style>\n${css}\n</style>\n</head>`);
    } else {
      doc = `<style>\n${css}\n</style>\n` + doc;
    }
    if (/<\/body>/i.test(doc)) {
      doc = doc.replace(/<\/body>/i, `<script>\n${js}\n<\/script>\n</body>`);
    } else {
      doc += `\n<script>\n${js}\n<\/script>`;
    }
  } else {
    doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exported from KyodeEditor</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  <\/script>
</body>
</html>`;
  }

  const blob = new Blob([doc], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kyode-export.html";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10000);
}

function initResizer() {
  const divider = els.divider;
  const editorPane = els.editorPane;
  const workspace = document.querySelector(".workspace");
  const isMobile = () => window.innerWidth <= 760;

  let startX, startY, startW, startH, totalW, totalH;

  divider.addEventListener("mousedown", startDrag);
  divider.addEventListener("touchstart", startDragTouch, { passive: false });

  let overlay;
  function startDrag(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startW = editorPane.offsetWidth;
    startH = editorPane.offsetHeight;
    totalW = workspace.offsetWidth;
    totalH = workspace.offsetHeight;
    state.isResizing = true;
    divider.classList.add("dragging");
    document.body.classList.add(isMobile() ? "resizing-row" : "resizing");

    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.cursor = "col-resize";
    overlay.style.zIndex = "9999";
    overlay.style.background = "transparent";

    document.body.appendChild(overlay);

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function startDragTouch(e) {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startW = editorPane.offsetWidth;
    startH = editorPane.offsetHeight;
    totalW = workspace.offsetWidth;
    totalH = workspace.offsetHeight;
    state.isResizing = true;
    divider.classList.add("dragging");
    document.addEventListener("touchmove", onDragTouch, { passive: false });
    document.addEventListener("touchend", stopDragTouch);
  }

  function onDrag(e) {
    if (!state.isResizing) return;
    if (isMobile()) {
      const dy = e.clientY - startY;
      const newH = Math.max(120, Math.min(totalH - 120, startH + dy));
      editorPane.style.height = newH + "px";
    } else {
      const dx = e.clientX - startX;
      const newW = Math.max(200, Math.min(totalW - 200, startW + dx));
      const pct = ((newW / totalW) * 100).toFixed(2);
      editorPane.style.width = pct + "%";
    }
  }

  function onDragTouch(e) {
    if (!state.isResizing || e.touches.length !== 1) return;
    e.preventDefault();
    const t = e.touches[0];
    onDrag({ clientX: t.clientX, clientY: t.clientY });
  }

  function stopDrag() {
    state.isResizing = false;
    divider.classList.remove("dragging");
    document.body.classList.remove("resizing", "resizing-row");
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    saveToStorage();
  }

  function stopDragTouch() {
    stopDrag();
    document.removeEventListener("touchmove", onDragTouch);
    document.removeEventListener("touchend", stopDragTouch);
  }
}

document.addEventListener("keydown", (e) => {
  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl && e.key === "s") {
    e.preventDefault();
    saveToStorage();
    runCode();
    return;
  }

  if (ctrl && e.key === "Enter") {
    e.preventDefault();
    runCode();
    return;
  }

  if (ctrl && e.key === "`") {
    e.preventDefault();
    toggleConsole();
    return;
  }
});

els.autoRunToggle.addEventListener("change", () => {
  state.autoRun = els.autoRunToggle.checked;
});

els.btnRun.addEventListener("click", runCode);
els.btnDownload.addEventListener("click", downloadCode);
els.btnTheme.addEventListener("click", toggleTheme);
els.btnConsole.addEventListener("click", toggleConsole);
els.btnRefresh.addEventListener("click", runCode);
els.btnClearConsole.addEventListener("click", clearConsole);

els.tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

Object.entries(tabMap).forEach(([tab, { editor, ln }]) => {
  editor.dataset.tab = tab;

  editor.addEventListener("input", onEditorInput);
  editor.addEventListener("keydown", handleTabKey);
  editor.addEventListener("keydown", handleSmartType);
  editor.addEventListener("scroll", () => syncScroll(editor, ln));
  editor.addEventListener("click", () => updateCursorStatus(editor));
  editor.addEventListener("keyup", () => updateCursorStatus(editor));
});

function init() {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("kyode_theme") || "light";
  } catch (e) {}
  applyTheme(savedTheme);

  const saved = loadFromStorage();

  if (saved) {
    els.htmlEditor.value = saved.html ?? DEFAULT_CODE.html;
    els.cssEditor.value = saved.css ?? DEFAULT_CODE.css;
    els.jsEditor.value = saved.js ?? DEFAULT_CODE.js;
    state.autoRun = saved.autoRun !== undefined ? saved.autoRun : true;
    els.autoRunToggle.checked = state.autoRun;

    if (saved.consoleOpen) toggleConsole();
    if (saved.activeTab && tabMap[saved.activeTab]) {
      switchTab(saved.activeTab);
    } else {
      switchTab("html");
    }
  } else {
    els.htmlEditor.value = DEFAULT_CODE.html;
    els.cssEditor.value = DEFAULT_CODE.css;
    els.jsEditor.value = DEFAULT_CODE.js;
    switchTab("html");
  }

  Object.entries(tabMap).forEach(([tab, { editor, ln }]) => {
    updateLineNumbers(editor, ln);
  });

  initResizer();

  setTimeout(runCode, 200);
}

init();
