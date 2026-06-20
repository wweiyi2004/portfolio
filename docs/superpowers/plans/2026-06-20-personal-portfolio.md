# 个人作品集主站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Astro 搭建一个纯静态、双语、暗色可切换的开发者个人作品集主站，观感参考 shenxianovo.com，部署到 Cloudflare Pages。

**Architecture:** 单个 Astro 项目，TailwindCSS 做样式，TypeScript 写集中的站点数据文件。首页为单页锚点滚动（Hero / 状态 / 能力 / 项目），外加 About 页。主题与语言切换用轻量内联脚本（Astro island 思路），构建产物纯静态。

**Tech Stack:** Astro 4+, TailwindCSS, TypeScript, Node 18+。部署 Cloudflare Pages。

## Global Constraints

- 包管理器：npm。Node 版本 ≥ 18。
- 所有用户可见个人内容（名字、简介、状态、能力、项目、社交）必须来自单一数据文件 `src/data/site.ts`，组件不得硬编码这些文案。
- 双语：每条文案提供 `zh` 与 `en`，默认语言 `zh`。
- 本期不做：博客、后端、CMS、子域名拆分。
- 验证方式：每个任务以 `npm run build` 成功（无报错）为基本闭环；涉及 UI 的任务额外用 `npm run dev` 目视确认对应区块渲染正常。
- 配色风格：简洁现代开发者风，深色为主、可切浅色；强调色统一一个主色（默认靛蓝/indigo）。

---

### Task 1: Astro 项目脚手架 + Tailwind

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`, `src/styles/global.css`, `src/pages/index.astro`
- Create: `.gitignore`（已存在则补充）

**Interfaces:**
- Produces: 可运行的 Astro+Tailwind 项目；`npm run dev` 启动开发服务器；`npm run build` 输出到 `dist/`。

- [ ] **Step 1: 用官方模板初始化（最小空模板）**

在项目根目录运行（已有 `docs/` 和 `.git`，用当前目录初始化）：

```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
npm install
npx astro add tailwind --yes
```

若 `npm create` 因目录非空报错，改为在临时子目录生成后移动文件，或手动创建下方配置。

- [ ] **Step 2: 确认 Tailwind 接入**

`astro.config.mjs` 应包含 `@astrojs/tailwind` 集成。`src/styles/global.css` 写入：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }
```

- [ ] **Step 3: 首页引入全局样式占位**

`src/pages/index.astro`：

```astro
---
import "../styles/global.css";
---
<html lang="zh">
  <head><meta charset="utf-8" /><title>Portfolio</title></head>
  <body class="bg-neutral-950 text-neutral-100">
    <main class="p-10">Hello Astro</main>
  </body>
</html>
```

- [ ] **Step 4: 验证构建与开发服务器**

Run: `npm run build`
Expected: 构建成功，生成 `dist/index.html`，无报错。

Run: `npm run dev`（浏览器打开提示的 localhost 地址，确认显示 "Hello Astro"，背景为深色）

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: 初始化 Astro + Tailwind 项目"
```

---

### Task 2: 集中站点数据文件

**Files:**
- Create: `src/data/site.ts`
- Create: `src/lib/i18n.ts`

**Interfaces:**
- Produces:
  - `type Locale = "zh" | "en"`
  - `interface Localized { zh: string; en: string }`
  - `siteData` 对象，含：`name: string`、`avatar: string`、`tagline: Localized`、`intro: Localized`、`status: { label: Localized; value: Localized }[]`、`features: { icon: string; title: Localized; desc: Localized }[]`、`projects: { title: string; desc: Localized; tags: string[]; link: string }[]`、`socials: { label: string; href: string; icon: string }[]`、`nav: { home: Localized; about: Localized; projects: Localized; blog: Localized }`
  - `i18n.ts` 导出 `t(value: Localized, locale: Locale): string`（返回 `value[locale]`）。

- [ ] **Step 1: 写数据文件（占位内容）**

`src/data/site.ts`：

```ts
export type Locale = "zh" | "en";
export interface Localized { zh: string; en: string }

export const siteData = {
  name: "Your Name",
  avatar: "/avatar.svg",
  tagline: { zh: "充满热情的开发者与创作者", en: "A passionate developer and creator" },
  intro: {
    zh: "专注于构建可扩展、易用且令人愉悦的数字体验。",
    en: "Building scalable, user-friendly, and delightful digital experiences.",
  },
  status: [
    { label: { zh: "状态", en: "Status" }, value: { zh: "开放合作中", en: "Open to opportunities" } },
    { label: { zh: "在学", en: "Studying" }, value: { zh: "某大学 · 某专业", en: "Your University · Your Major" } },
  ],
  features: [
    { icon: "code", title: { zh: "整洁代码", en: "Clean Code" }, desc: { zh: "可读、可维护、可测试。", en: "Readable, maintainable, testable." } },
    { icon: "user", title: { zh: "以用户为中心", en: "User-Centered" }, desc: { zh: "从用户需求出发设计。", en: "Design starts from user needs." } },
    { icon: "zap", title: { zh: "性能优化", en: "Performance" }, desc: { zh: "更快的加载与响应。", en: "Faster loads and responses." } },
    { icon: "book", title: { zh: "持续学习", en: "Always Learning" }, desc: { zh: "保持好奇，不断精进。", en: "Stay curious, keep improving." } },
  ],
  projects: [
    { title: "Project One", desc: { zh: "示例项目描述。", en: "Sample project description." }, tags: ["TypeScript", "Astro"], link: "#" },
    { title: "Project Two", desc: { zh: "示例项目描述。", en: "Sample project description." }, tags: ["React", "Node"], link: "#" },
    { title: "Project Three", desc: { zh: "示例项目描述。", en: "Sample project description." }, tags: ["Python"], link: "#" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/", icon: "github" },
    { label: "Email", href: "mailto:you@example.com", icon: "mail" },
  ],
  nav: {
    home: { zh: "首页", en: "Home" },
    about: { zh: "关于", en: "About" },
    projects: { zh: "项目", en: "Projects" },
    blog: { zh: "博客", en: "Blog" },
  },
};
```

- [ ] **Step 2: 写 i18n 帮助函数**

`src/lib/i18n.ts`：

```ts
import type { Locale, Localized } from "../data/site";
export function t(value: Localized, locale: Locale): string {
  return value[locale];
}
export const DEFAULT_LOCALE: Locale = "zh";
```

- [ ] **Step 3: 验证类型**

Run: `npx astro check || npx tsc --noEmit`
Expected: 无类型错误（若未装 `@astrojs/check`，用 `npx tsc --noEmit`，应无报错）。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 集中站点数据文件与 i18n 帮助函数"
```

---

### Task 3: 基础布局 + 主题/语言切换脚本

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `tailwind.config.mjs`（启用 `darkMode: "class"` 与主色）

**Interfaces:**
- Consumes: `siteData`（仅 `name`）。
- Produces: `Base.astro` 布局，接收 `props: { title?: string; locale?: Locale }`，提供 `<slot />`；内置 `<head>`、深浅色切换（`class="dark"` 切换在 `<html>`，localStorage 记忆）、语言切换（URL `?lang=en` 或按钮切换，localStorage 记忆，默认 zh）。导出供页面包裹。

- [ ] **Step 1: 配置 Tailwind 暗色与主色**

`tailwind.config.mjs`：

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#6366f1", fg: "#a5b4fc" } },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: 写 Base 布局**

`src/layouts/Base.astro`：

```astro
---
import "../styles/global.css";
const { title = "Portfolio" } = Astro.props;
---
<!doctype html>
<html lang="zh" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <script is:inline>
      // 主题：读取 localStorage，默认 dark
      const theme = localStorage.getItem("theme") || "dark";
      document.documentElement.classList.toggle("dark", theme === "dark");
      // 语言：读取 localStorage，默认 zh
      window.__locale = localStorage.getItem("lang") || "zh";
    </script>
  </head>
  <body class="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased transition-colors">
    <slot />
    <script is:inline>
      // 切换函数，供按钮调用
      window.toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      };
      window.setLang = (lang) => { localStorage.setItem("lang", lang); location.reload(); };
    </script>
  </body>
</html>
```

> 说明：语言切换采用「localStorage + 重新加载」，构建时同时渲染 zh/en 两套文本，由 `data-lang` 控制显隐（见 Task 4 起各组件用 `data-zh`/`data-en` 双 span，并在 inline 脚本里按 `__locale` 显隐）。

- [ ] **Step 3: 全局语言显隐脚本加入 global.css 配套**

在 `src/styles/global.css` 追加：

```css
[data-i18n] > [data-en] { display: none; }
html[data-locale="en"] [data-i18n] > [data-en] { display: inline; }
html[data-locale="en"] [data-i18n] > [data-zh] { display: none; }
```

并在 `Base.astro` 的首个 inline 脚本末尾加：

```js
document.documentElement.setAttribute("data-locale", window.__locale);
```

- [ ] **Step 4: 验证**

Run: `npm run build`
Expected: 构建成功。

Run: `npm run dev`，在控制台执行 `window.toggleTheme()` 确认深浅色切换；执行 `window.setLang('en')` 确认刷新后 `<html data-locale="en">`。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 基础布局与主题/语言切换"
```

---

### Task 4: 导航栏组件

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/I18nText.astro`

**Interfaces:**
- Consumes: `siteData.nav`, `siteData.name`。
- Produces: `Nav.astro`（无 props，自取 siteData）；`I18nText.astro`（props: `{ zh: string; en: string }`，渲染 `<span data-i18n><span data-zh>{zh}</span><span data-en>{en}</span></span>`）。

- [ ] **Step 1: 写 I18nText 组件**

`src/components/I18nText.astro`：

```astro
---
const { zh, en } = Astro.props;
---
<span data-i18n><span data-zh>{zh}</span><span data-en>{en}</span></span>
```

- [ ] **Step 2: 写 Nav 组件**

`src/components/Nav.astro`：

```astro
---
import { siteData } from "../data/site";
import I18nText from "./I18nText.astro";
const n = siteData.nav;
---
<header class="sticky top-0 z-50 backdrop-blur border-b border-neutral-200/40 dark:border-neutral-800/60">
  <nav class="mx-auto max-w-5xl flex items-center justify-between px-5 py-3">
    <a href="/" class="font-semibold tracking-tight">{siteData.name}</a>
    <div class="flex items-center gap-5 text-sm">
      <a href="#home" class="hover:text-brand"><I18nText zh={n.home.zh} en={n.home.en} /></a>
      <a href="/about" class="hover:text-brand"><I18nText zh={n.about.zh} en={n.about.en} /></a>
      <a href="#projects" class="hover:text-brand"><I18nText zh={n.projects.zh} en={n.projects.en} /></a>
      <span class="opacity-40 cursor-not-allowed"><I18nText zh={n.blog.zh} en={n.blog.en} /></span>
      <button onclick="window.toggleTheme()" aria-label="theme" class="rounded px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800">◐</button>
      <button onclick="window.setLang(document.documentElement.getAttribute('data-locale')==='en'?'zh':'en')" class="rounded px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-xs">中/EN</button>
    </div>
  </nav>
</header>
```

- [ ] **Step 3: 接入首页**

`src/pages/index.astro` 改为用 `Base` 包裹并放入 `Nav`：

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import { siteData } from "../data/site";
---
<Base title={siteData.name}>
  <Nav />
  <main id="home" class="mx-auto max-w-5xl px-5">占位</main>
</Base>
```

- [ ] **Step 4: 验证**

Run: `npm run build` → 成功。
Run: `npm run dev` → 顶部出现导航栏，点 ◐ 切换深浅色，点「中/EN」切换语言文案。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 导航栏与双语文本组件"
```

---

### Task 5: Hero 区块

**Files:**
- Create: `src/components/Hero.astro`
- Create: `public/avatar.svg`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteData.name`, `siteData.tagline`, `siteData.intro`, `siteData.avatar`。
- Produces: `Hero.astro`（无 props）。

- [ ] **Step 1: 放一个占位头像**

`public/avatar.svg`（简单圆形占位）：

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><circle cx="80" cy="80" r="78" fill="#6366f1"/><text x="80" y="98" font-size="64" text-anchor="middle" fill="#fff" font-family="sans-serif">★</text></svg>
```

- [ ] **Step 2: 写 Hero**

`src/components/Hero.astro`：

```astro
---
import { siteData } from "../data/site";
import I18nText from "./I18nText.astro";
---
<section class="py-20 flex flex-col items-center text-center gap-6">
  <img src={siteData.avatar} alt="avatar" class="w-28 h-28 rounded-full shadow-lg" />
  <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
    <I18nText zh={siteData.tagline.zh} en={siteData.tagline.en} />
  </h1>
  <p class="max-w-xl text-neutral-500 dark:text-neutral-400">
    <I18nText zh={siteData.intro.zh} en={siteData.intro.en} />
  </p>
  <div class="flex gap-3">
    <a href="#projects" class="rounded-full bg-brand px-5 py-2 text-white text-sm font-medium hover:opacity-90">
      <I18nText zh="查看项目" en="Explore Projects" />
    </a>
    <a href="#contact" class="rounded-full border border-neutral-300 dark:border-neutral-700 px-5 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <I18nText zh="联系我" en="Get in Touch" />
    </a>
  </div>
</section>
```

- [ ] **Step 3: 接入首页（替换占位）**

把 `index.astro` 的 `<main>` 内 `占位` 替换为 `<Hero />`（记得 import）。

- [ ] **Step 4: 验证**

Run: `npm run build` → 成功。
Run: `npm run dev` → Hero 居中显示头像、标题、简介、两个按钮；语言切换文案随之变化。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Hero 区块"
```

---

### Task 6: 状态卡片 + 能力卡片

**Files:**
- Create: `src/components/StatusCards.astro`
- Create: `src/components/FeatureCards.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteData.status`, `siteData.features`。
- Produces: 两个无 props 组件。

- [ ] **Step 1: 写 StatusCards**

`src/components/StatusCards.astro`：

```astro
---
import { siteData } from "../data/site";
import I18nText from "./I18nText.astro";
---
<section class="grid sm:grid-cols-2 gap-4 py-6">
  {siteData.status.map((s) => (
    <div class="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
      <div class="text-xs uppercase tracking-wide text-neutral-400"><I18nText zh={s.label.zh} en={s.label.en} /></div>
      <div class="mt-1 font-medium"><I18nText zh={s.value.zh} en={s.value.en} /></div>
    </div>
  ))}
</section>
```

- [ ] **Step 2: 写 FeatureCards**

`src/components/FeatureCards.astro`：

```astro
---
import { siteData } from "../data/site";
import I18nText from "./I18nText.astro";
---
<section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
  {siteData.features.map((f) => (
    <div class="rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-brand transition-colors">
      <div class="text-2xl">✦</div>
      <h3 class="mt-3 font-semibold"><I18nText zh={f.title.zh} en={f.title.en} /></h3>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400"><I18nText zh={f.desc.zh} en={f.desc.en} /></p>
    </div>
  ))}
</section>
```

- [ ] **Step 3: 接入首页**

在 `<Hero />` 后加入 `<StatusCards />` 与 `<FeatureCards />`（import 之）。

- [ ] **Step 4: 验证**

Run: `npm run build` → 成功。
Run: `npm run dev` → 状态卡片 2 列、能力卡片响应式 1/2/4 列；双语正常。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: 状态卡片与能力卡片"
```

---

### Task 7: 项目区块

**Files:**
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteData.projects`。
- Produces: `Projects.astro`（无 props），外层 `id="projects"`。

- [ ] **Step 1: 写 Projects**

`src/components/Projects.astro`：

```astro
---
import { siteData } from "../data/site";
import I18nText from "./I18nText.astro";
---
<section id="projects" class="py-12">
  <h2 class="text-2xl font-bold mb-6"><I18nText zh="项目" en="Projects" /></h2>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {siteData.projects.map((p) => (
      <a href={p.link} class="block rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-brand transition-colors">
        <h3 class="font-semibold">{p.title}</h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400"><I18nText zh={p.desc.zh} en={p.desc.en} /></p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span class="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">{tag}</span>
          ))}
        </div>
      </a>
    ))}
  </div>
</section>
```

- [ ] **Step 2: 接入首页**

在 `<FeatureCards />` 后加入 `<Projects />`。

- [ ] **Step 3: 验证**

Run: `npm run build` → 成功。
Run: `npm run dev` → 项目卡片网格显示，标签 chip 正常，hover 边框变主色。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 项目区块"
```

---

### Task 8: 页脚（含联系/社交）

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `siteData.socials`, `siteData.name`。
- Produces: `Footer.astro`（无 props），外层含 `id="contact"`。

- [ ] **Step 1: 写 Footer**

`src/components/Footer.astro`：

```astro
---
import { siteData } from "../data/site";
const year = new Date().getFullYear();
---
<footer id="contact" class="mt-16 border-t border-neutral-200 dark:border-neutral-800 py-10">
  <div class="mx-auto max-w-5xl px-5 flex flex-col items-center gap-4">
    <div class="flex gap-4 text-sm">
      {siteData.socials.map((s) => (
        <a href={s.href} class="hover:text-brand" target="_blank" rel="noopener">{s.label}</a>
      ))}
    </div>
    <p class="text-xs text-neutral-400">© {year} {siteData.name}</p>
  </div>
</footer>
```

- [ ] **Step 2: 接入首页**

`<Projects />` 后、`Base` 的 slot 内末尾加入 `<Footer />`（注意 Footer 自带 max-w 容器，需放在 `<main>` 之外或 main 不限宽——简单起见放在 main 后、Base slot 内）。

最终 `index.astro` 结构：

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
import StatusCards from "../components/StatusCards.astro";
import FeatureCards from "../components/FeatureCards.astro";
import Projects from "../components/Projects.astro";
import Footer from "../components/Footer.astro";
import { siteData } from "../data/site";
---
<Base title={siteData.name}>
  <Nav />
  <main id="home" class="mx-auto max-w-5xl px-5">
    <Hero />
    <StatusCards />
    <FeatureCards />
    <Projects />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 3: 验证**

Run: `npm run build` → 成功。
Run: `npm run dev` → 页脚显示社交链接与版权，Hero 「联系我」按钮锚点跳到页脚。

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: 页脚与联系区"
```

---

### Task 9: About 页

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `siteData`（name, intro, socials）, `Base`, `Nav`, `Footer`。
- Produces: `/about` 路由页。

- [ ] **Step 1: 写 about 页**

`src/pages/about.astro`：

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import I18nText from "../components/I18nText.astro";
import { siteData } from "../data/site";
---
<Base title={`About · ${siteData.name}`}>
  <Nav />
  <main class="mx-auto max-w-3xl px-5 py-16">
    <h1 class="text-3xl font-bold mb-6"><I18nText zh="关于我" en="About Me" /></h1>
    <p class="text-neutral-600 dark:text-neutral-300 leading-relaxed">
      <I18nText
        zh="这里是更详细的个人介绍占位文本，之后替换为你的真实经历、技能与兴趣。"
        en="Placeholder for a longer personal introduction. Replace with your real background, skills, and interests."
      />
    </p>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: 验证**

Run: `npm run build` → 生成 `dist/about/index.html`。
Run: `npm run dev` → 访问 `/about` 正常，导航/页脚/双语一致。

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: About 页"
```

---

### Task 10: 站点元信息、favicon、SEO

**Files:**
- Modify: `src/layouts/Base.astro`
- Create: `public/favicon.svg`
- Modify: `astro.config.mjs`（设置 `site`）

**Interfaces:**
- Consumes: `Base` 的 props 增加可选 `description`。
- Produces: 每页带 description meta、og:title、favicon。

- [ ] **Step 1: 加 favicon**

`public/favicon.svg`：复用 avatar 风格的小图标：

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#6366f1"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="#fff" font-family="sans-serif">★</text></svg>
```

- [ ] **Step 2: Base 增加 SEO meta**

在 `Base.astro` 的 `<head>` 加（`description` 从 props 取，默认用 siteData.intro.zh）：

```astro
---
import { siteData } from "../data/site";
const { title = "Portfolio", description = siteData.intro.zh } = Astro.props;
---
```

`<head>` 内加：

```astro
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- [ ] **Step 3: 设置 site URL**

`astro.config.mjs` 加 `site: "https://example.pages.dev"`（部署后替换为真实域名）。

- [ ] **Step 4: 验证**

Run: `npm run build` → 成功，`dist/index.html` 含 `<meta name="description">` 与 favicon link。

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: SEO meta 与 favicon"
```

---

### Task 11: Cloudflare Pages 部署配置与文档

**Files:**
- Create: `README.md`
- Create: `wrangler.toml`（可选，Pages 直连 Git 时非必需）

**Interfaces:**
- Produces: 部署说明；构建命令 `npm run build`，输出目录 `dist`。

- [ ] **Step 1: 写 README**

`README.md`：

```markdown
# 个人作品集主站

Astro + Tailwind 纯静态个人主页。

## 本地开发
\`\`\`bash
npm install
npm run dev      # 本地预览
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
\`\`\`

## 内容修改
所有个人内容集中在 \`src/data/site.ts\`，改这一个文件即可更新全站（名字、简介、状态、能力、项目、社交链接、双语文案）。

## 部署（Cloudflare Pages）
1. 把仓库推到 GitHub。
2. Cloudflare Dashboard → Pages → Connect to Git → 选本仓库。
3. 构建设置：Framework preset = Astro；Build command = \`npm run build\`；Output directory = \`dist\`。
4. 部署后得到 \`*.pages.dev\` 域名；自有域名在 Pages → Custom domains 绑定，并按需添加 \`blog\` 子域名给未来博客分站。
\`\`\`
```

- [ ] **Step 2: 验证构建产物可静态托管**

Run: `npm run build && npm run preview`
Expected: preview 服务器启动，本地访问首页与 `/about` 均正常，深浅色与双语切换可用。

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: 部署说明与 README"
```

---

## 后续阶段（不在本计划内）

- 博客分站：新建 Astro + Fuwari 项目，部署到 `blog.<域名>` 子域名。
- 真实内容替换 `src/data/site.ts` 占位值与头像。
