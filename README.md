# 个人作品集主站

Astro + Tailwind 纯静态个人主页，中英双语、支持深浅色切换。观感参考 [shenxianovo.com](https://shenxianovo.com/)。

## 本地开发

```bash
npm install
npm run dev      # 本地预览（默认 http://localhost:4321）
npm run build    # 构建到 dist/
npm run preview  # 预览构建产物
```

## 内容修改

所有个人内容集中在 `src/data/site.ts`，改这一个文件即可更新全站：名字、简介、状态、能力卡片、项目、社交链接，以及所有中英双语文案。头像替换 `public/avatar.svg`。

## 部署（Cloudflare Pages）

1. 把仓库推到 GitHub。
2. Cloudflare Dashboard → Pages → Connect to Git → 选本仓库。
3. 构建设置：
   - Framework preset：Astro
   - Build command：`npm run build`
   - Output directory：`dist`
4. 部署后得到 `*.pages.dev` 域名；自有域名在 Pages → Custom domains 绑定。
5. 未来博客分站：新建 Astro + [Fuwari](https://github.com/saicaca/fuwari) 项目，部署后在 DNS 添加 `blog` 子域名记录指向它，即可访问 `blog.<你的域名>`。

## 技术栈

- [Astro](https://astro.build) — 纯静态、默认零 JS
- [TailwindCSS](https://tailwindcss.com) — 样式
- TypeScript — 站点数据与类型
