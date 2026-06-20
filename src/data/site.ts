export type Locale = "zh" | "en";
export interface Localized {
  zh: string;
  en: string;
}

export const siteData = {
  name: "Your Name",
  avatar: "/avatar.svg",
  tagline: {
    zh: "充满热情的开发者与创作者",
    en: "A passionate developer and creator",
  },
  intro: {
    zh: "专注于构建可扩展、易用且令人愉悦的数字体验。",
    en: "Building scalable, user-friendly, and delightful digital experiences.",
  },
  status: [
    {
      label: { zh: "状态", en: "Status" },
      value: { zh: "开放合作中", en: "Open to opportunities" },
    },
    {
      label: { zh: "在学", en: "Studying" },
      value: { zh: "某大学 · 某专业", en: "Your University · Your Major" },
    },
  ],
  features: [
    {
      icon: "code",
      title: { zh: "整洁代码", en: "Clean Code" },
      desc: { zh: "可读、可维护、可测试。", en: "Readable, maintainable, testable." },
    },
    {
      icon: "user",
      title: { zh: "以用户为中心", en: "User-Centered" },
      desc: { zh: "从用户需求出发设计。", en: "Design starts from user needs." },
    },
    {
      icon: "zap",
      title: { zh: "性能优化", en: "Performance" },
      desc: { zh: "更快的加载与响应。", en: "Faster loads and responses." },
    },
    {
      icon: "book",
      title: { zh: "持续学习", en: "Always Learning" },
      desc: { zh: "保持好奇，不断精进。", en: "Stay curious, keep improving." },
    },
  ],
  projects: [
    {
      title: "Project One",
      desc: { zh: "示例项目描述。", en: "Sample project description." },
      tags: ["TypeScript", "Astro"],
      link: "#",
    },
    {
      title: "Project Two",
      desc: { zh: "示例项目描述。", en: "Sample project description." },
      tags: ["React", "Node"],
      link: "#",
    },
    {
      title: "Project Three",
      desc: { zh: "示例项目描述。", en: "Sample project description." },
      tags: ["Python"],
      link: "#",
    },
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
