<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=200&section=header&text=KyodeEditor&fontSize=72&fontAlign=50&fontAlignY=38&desc=The%20browser%20code%20editor%20that%20slaps%20differently&descAlign=50&descAlignY=62&fontColor=ffffff&animation=fadeIn" width="100%"/>

<br/>

<img src="https://img.shields.io/badge/Built%20With-Pure%20Vanilla%20JS-f59e0b?style=for-the-badge&logo=javascript&logoColor=black"/>
&nbsp;
<img src="https://img.shields.io/badge/No%20Frameworks-Zero%20Dependencies-7c3aed?style=for-the-badge&logo=lightning&logoColor=white"/>
&nbsp;
<img src="https://img.shields.io/badge/Open%20In%20Browser-Just%20Works-10b981?style=for-the-badge&logo=googlechrome&logoColor=white"/>

<br/><br/>

<img src="https://img.shields.io/github/license/soham-kyo/KyodeEditor?style=flat-square&color=a78bfa"/>
&nbsp;
<img src="https://img.shields.io/github/stars/soham-kyo/KyodeEditor?style=flat-square&color=f59e0b"/>
&nbsp;
<img src="https://img.shields.io/github/forks/soham-kyo/KyodeEditor?style=flat-square&color=60a5fa"/>
&nbsp;
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square"/>
&nbsp;
<img src="https://img.shields.io/badge/Made%20with-obsession-ff4da6?style=flat-square"/>

<br/><br/>

### ⚡ [**OPEN THE LIVE EDITOR →**](https://soham-kyo.github.io/KyodeEditor) ⚡

<br/>

---

</div>

```
██╗  ██╗██╗   ██╗ ██████╗ ██████╗ ███████╗
██║ ██╔╝╚██╗ ██╔╝██╔═══██╗██╔══██╗██╔════╝
█████╔╝  ╚████╔╝ ██║   ██║██║  ██║█████╗
██╔═██╗   ╚██╔╝  ██║   ██║██║  ██║██╔══╝
██║  ██╗   ██║   ╚██████╔╝██████╔╝███████╗
╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝
         E D I T O R  —  no cap, no framework, no mercy.
```

<div align="center">

> _"I opened index.html and it just... worked. I don't understand."_  
> — Every person who cloned this repo

</div>

---

## 🧠 What even IS this?

**KyodeEditor** is a fully browser-based code playground that runs off a **single folder** with zero build steps, zero npm install, zero webpack config hell, zero tears.

You write HTML. You write CSS. You write JS.  
It runs. **Instantly.** In the same tab. Like magic but it's just `iframe.srcdoc`.

No Electron. No React. No 400MB `node_modules`.  
Just three files and a dream.

---

## ✨ Features (that actually work)

| Feature                   | What it does                                            |
| ------------------------- | ------------------------------------------------------- |
| 🗂️ **Three-tab editor**   | Separate panels for HTML, CSS, JavaScript               |
| ⚡ **Live Preview**       | Real-time iframe preview as you type                    |
| 🔁 **Auto-run toggle**    | Debounced auto-execution, or manual run                 |
| 💾 **localStorage save**  | Your code survives browser refresh                      |
| 📦 **Export**             | Downloads a single self-contained `.html` file          |
| ↔️ **Resizable layout**   | Drag the divider. Works on touch too                    |
| 🌙 **Dark / Light theme** | Persisted. Looks good in both                           |
| 🖥️ **Console panel**      | Catches `console.log`, `warn`, `error` from your iframe |
| 🔢 **Line numbers**       | Synced scroll, always accurate                          |
| ⌨️ **Smart typing**       | Auto-pairs `()`, `[]`, `{}`, quotes. Tab indents        |
| 🎹 **Keyboard shortcuts** | `Ctrl+S` save, `Ctrl+Enter` run, `Ctrl+\`` console      |

---

## 🚀 Getting Started

### Option 1 — Just open it (seriously)

```bash
git clone https://github.com/soham-kyo/KyodeEditor.git
cd KyodeEditor
# open index.html in any browser. that's it. you're done.
```

No terminal. No server. No setup. Open `index.html`.

### Option 2 — Use the live version

[https://soham-kyo.github.io/kyode-editor](https://soham-kyo.github.io/KyodeEditor)

### Option 3 — Serve locally (optional, for file:// edge cases)

```bash
# Python
python3 -m http.server 3000

# Node.js
npx serve .

# then visit http://localhost:3000
```

---

## 🗂️ Project Structure

```
KyodeEditor/
├── index.html        ← markup & structure
├── style.css         ← all styling, themes, responsive
├── script.js         ← all logic, zero dependencies
├── favicon.svg       ← the lil purple icon in your tab
├── .gitignore        ← sensible ignores
├── LICENSE           ← MIT, take it
└── README.md         ← you are here
```

No `package.json`. No `node_modules`. No build output folder.  
The entire editor IS the source code.

---

## ⌨️ Keyboard Shortcuts

| Shortcut       | Action                            |
| -------------- | --------------------------------- |
| `Ctrl + Enter` | Run code manually                 |
| `Ctrl + S`     | Save + run                        |
| `Ctrl + \``    | Toggle console panel              |
| `Tab`          | Indent 2 spaces                   |
| `Shift + Tab`  | Un-indent                         |
| `Enter`        | Auto-indent matching current line |

---

## 🏗️ How It Works (the nerd bit)

```
┌─────────────────────────────────────────┐
│              Your Browser               │
│                                         │
│  ┌──────────┐     ┌──────────────────┐  │
│  │ Textarea │     │  <iframe>        │  │
│  │ HTML     │────▶│  srcdoc="..."    │  │
│  │ CSS      │     │                  │  │
│  │ JS       │     │  your code runs  │  │
│  └──────────┘     │  here, live      │  │
│                   └──────────────────┘  │
│                          │              │
│              postMessage(console)       │
│                          ▼              │
│               ┌───────────────────┐    │
│               │  Console Panel    │    │
│               └───────────────────┘    │
└─────────────────────────────────────────┘
```

- Editor is a styled `<textarea>` with synced line numbers
- Preview is an `<iframe>` with `srcdoc` set to combined HTML+CSS+JS
- Console works via `window.postMessage` from inside the iframe
- All state persists to `localStorage`
- Theme stored separately so it survives code clears

---

## 🤝 Contributing

PRs are welcome. The bar is: **it should work, and it should look good.**

```bash
git clone https://github.com/soham-kyo/KyodeEditor.git
cd KyodeEditor
# open index.html, make your changes, open a PR
```

Please don't add frameworks. The whole point is it's vanilla.  
If you can do it in plain JS, do it in plain JS.

---

## 🗺️ Roadmap

- [ ] Syntax highlighting (without a library — challenge accepted)
- [ ] Multiple file tabs (save/load named files)
- [ ] URL sharing (encode state in URL hash)
- [ ] Emmet abbreviation expansion
- [ ] More themes
- [ ] Mobile keyboard toolbar

---

## 📄 License

MIT — do whatever you want.  
Credit appreciated, not required.

```
Copyright (c) 2026 Soham Patil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software without restriction.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer&animation=fadeIn" width="100%"/>

**Built with obsession. Deployed with one click. Runs everywhere.**

<br/>

_If this made your day even 1% better, drop a ⭐ — it costs nothing and means everything._

<br/>

`made by Soham Patil` &nbsp;•&nbsp; `MIT License` &nbsp;•&nbsp; `no cap`

</div>
