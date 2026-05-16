/* ============================================================
   Bruno Yu — Static bilingual content (EN / ZH)
   Source: portfolio-design/data/content.js
   Note: Content fetched from API (selfContent, works, skills)
   takes precedence; this file covers sections not in the API.
============================================================ */

export type Lang = 'en' | 'zh';

/** Helper: pick a bilingual value */
export function pick<T>(obj: { en: T; zh: T }, lang: Lang): T {
  return obj[lang];
}

/* ——— Meta ——— */
export const meta = {
  cnName: '余俊毅',
  enName: 'Chin-Yi Yu',
  nick: 'Bruno',
  role: { en: 'Frontend / Full-stack Engineer', zh: '前端/全端工程師' },
  location: { en: 'Tainan, Taiwan', zh: '台南，台灣' },
  email: 'jackhellowin@gmail.com',
  github: 'https://github.com/Bruno-Yu',
  linkedin: 'https://www.linkedin.com/in/bruno-yu-357415253',
  blog: 'https://bruno-yu.github.io/bruno_blog/',
  cake: 'https://www.cakeresume.com/jackhellowin',
};

/* ——— Home ——— */
export const home = {
  hello: { en: "Hi, I'm Bruno.", zh: '你好，我是布魯諾。' },
  headline: {
    en: 'I build web interfaces that are clear, fast, and easy to maintain.',
    zh: '我寫的前端介面，清楚、快、好維護。',
    accentEn: 'web interfaces',
    accentZh: '前端介面',
  },
  sub: {
    en: 'Front-end developer with three years of production experience in Vue and React. Currently shipping internal systems at Wistron ITS.',
    zh: '三年 Vue 與 React 實戰經驗，目前在緯創軟體開發內部系統。',
  },
  quick: {
    en: ['Vue 3 / Nuxt 3', 'React 18', 'TypeScript', 'Node / Flask / .NET'],
    zh: ['Vue 3 / Nuxt 3', 'React 18', 'TypeScript', 'Node / Flask / .NET'],
  },
};

/* ——— Hero ——— */
export const hero = {
  crumb: {
    label: { en: 'PORTFOLIO / 2026', zh: '作品集 / 2026' },
    avail: { en: 'OPEN TO CONVERSATIONS · 2026', zh: '歡迎聯繫 · 2026' },
  },
  /**
   * Three rotating headline variants.
   * Lines are newline-separated; `accent` word gets the highlight underline.
   * The Hero component renders the first line normally, applies italic to `em`
   * and accent-line underline to the accent word.
   */
  variants: [
    {
      en: ['Frontend engineer', 'building clear,', 'maintainable interfaces.'],
      zh: ['打造', '清楚、快', '好維護的介面。'],
      accentEn: 'maintainable',
      accentZh: '好維護',
      emWordEn: 'engineer',
      emWordZh: '清楚、快',
    },
    {
      en: ['3 years.', '12 products.', 'One philosophy.'],
      zh: ['三年。', '十二個產品。', '一個原則。'],
      accentEn: '',
      accentZh: '',
      emWordEn: 'philosophy',
      emWordZh: '一個',
    },
    {
      en: ['I rewrite legacy systems', 'into things people', 'actually use.'],
      zh: ['把舊系統', '重寫成', '真的有人用的東西。'],
      accentEn: 'legacy',
      accentZh: '舊系統',
      emWordEn: 'use',
      emWordZh: '東西',
    },
  ],
  metrics: [
    { v: '3+', k: { en: 'Years exp.', zh: '年經驗' } },
    { v: '12+', k: { en: 'Products', zh: '個產品' } },
    { v: 'Vue·React', k: { en: 'Frameworks', zh: '框架' } },
    { v: '940', k: { en: 'TOEIC L+R', zh: '多益聽讀' } },
  ],
  ctaNote: {
    en: 'I read code before forming opinions. I document the boring parts. I ship.',
    zh: '先讀 code 再下判斷。把無聊但重要的部分寫成文件。準時交付。',
  },
  summary: {
    en: 'Front-end developer with three years of production experience in Vue and React. Currently shipping internal systems at Wistron ITS.',
    zh: '三年 Vue 與 React 實戰經驗，目前在緯創軟體開發內部系統。',
  },
};

/* ——— About ——— */
export const about = {
  paragraphs: {
    en: [
      "I'm a front-end developer based in Tainan. I work mainly with Vue and React, and I'm comfortable reaching into the back end when a project needs it — Node, .NET, or Python / Flask.",
      "Before software I spent five years in B2B sales in Vietnam. That period trained me to communicate requirements in terms non-technical stakeholders can follow, and to ship on deadline. Both habits carry over.",
      "I read documentation. I write small, reusable components. I take on the under-documented corners and accumulated tech debt that others leave behind. If you'd like the long version, my CV has the details.",
    ],
    zh: [
      '我是住在台南的前端工程師，主力是 Vue 與 React，也能依專案需求接後端（Node、.NET、Python / Flask）。',
      '進軟體業之前，我在越南做了五年 B2B 業務。那段經歷讓我習慣用非技術人員聽得懂的語言溝通需求、在截止日前交付 — 這兩個習慣到現在還在用。',
      '我會讀文件、會把元件拆得乾淨、也願意處理文件不完整、技術債累積等別人擱置的工作。完整的工作經歷請參考履歷。',
    ],
  },
  facts: [
    {
      k: { en: 'Now', zh: '現職' },
      v: { en: 'Wistron ITS · Tainan', zh: '緯創軟體 · 台南' },
    },
    {
      k: { en: 'Stack', zh: '主要技術' },
      v: { en: 'Vue 3 · React 18 · TypeScript', zh: 'Vue 3 · React 18 · TypeScript' },
    },
    {
      k: { en: 'English', zh: '英文' },
      v: { en: 'TOEIC L+R 940', zh: '多益聽讀 940' },
    },
    {
      k: { en: 'Open to', zh: '歡迎聯繫' },
      v: { en: 'Future roles / collaborations', zh: '未來職缺 / 合作機會' },
    },
    {
      k: { en: 'Languages', zh: '語言' },
      v: { en: 'Mandarin · English · Vietnamese (basic)', zh: '中文 · 英文 · 越南語（基礎）' },
    },
  ],
};

/* ——— Experience ——— */
export interface ExpItem {
  period: string;
  company: { en: string; zh: string };
  role: { en: string; zh: string };
  location: string;
  stack: string[];
  bullets: { en: string[]; zh: string[] };
}

export const experience: ExpItem[] = [
  {
    period: '2022.08 → Now',
    company: { en: 'Wistron ITS', zh: '緯創軟體' },
    role: { en: 'Software Engineer', zh: '軟體工程師' },
    location: 'Tainan, TW',
    stack: ['Vue 3', 'Nuxt 3', 'TypeScript', '.NET', 'MSSQL'],
    bullets: {
      en: [
        'Led a 4-person front-end team, drove TypeScript adoption and code review culture.',
        'Built and maintained 3 large-scale internal systems (ERP adjacent, asset management, QA).',
        'Established a TypeScript reading group, reduced type-related bugs across the team by ~40%.',
        'Optimised a legacy Nuxt 2 SPA — cut initial load from 8s to under 2.5s.',
      ],
      zh: [
        '帶領 4 人前端小組，推動 TypeScript 導入與 code review 文化。',
        '開發並維護 3 套大型內部系統（類 ERP、資產管理、QA 系統）。',
        '建立 TypeScript 讀書會，協助團隊降低約 40% 型別相關 bug。',
        '優化 Nuxt 2 舊系統，初始載入從 8 秒降至 2.5 秒以內。',
      ],
    },
  },
  {
    period: '2017 → 2022',
    company: { en: 'B2B Sales (Vietnam)', zh: 'B2B 業務（越南）' },
    role: { en: 'Sales Representative', zh: '業務代表' },
    location: 'HCMC, VN',
    stack: ['Vietnamese', 'B2B', 'Supply Chain'],
    bullets: {
      en: [
        'Five years managing Vietnamese client accounts — honed cross-cultural communication skills.',
        'Transitioned to software in 2022; accelerated learning through self-study and bootcamp.',
      ],
      zh: [
        '五年越南客戶管理經驗，磨練跨文化溝通能力。',
        '2022 年轉職軟體工程師，透過自學與培訓課程快速進入業界。',
      ],
    },
  },
];

/* ——— Services ——— */
export interface ServiceItem {
  n: string;
  title: { en: string; zh: string };
  lede: { en: string; zh: string };
  bullets: { en: string[]; zh: string[] };
}

export const services: ServiceItem[] = [
  {
    n: '01',
    title: { en: 'Frontend Engineering', zh: '前端工程' },
    lede: {
      en: 'Production-grade Vue 3 and React applications. TypeScript by default, accessible by design.',
      zh: '生產等級的 Vue 3 與 React 應用。預設 TypeScript，設計上兼顧無障礙。',
    },
    bullets: {
      en: ['Vue 3 / Nuxt 3', 'React 18 / Vite', 'TypeScript', 'Pinia / Redux'],
      zh: ['Vue 3 / Nuxt 3', 'React 18 / Vite', 'TypeScript', 'Pinia / Redux'],
    },
  },
  {
    n: '02',
    title: { en: 'UI Implementation', zh: 'UI 實作' },
    lede: {
      en: 'Pixel-accurate implementation from Figma. SCSS, Tailwind, or design tokens — whatever the project calls for.',
      zh: '從 Figma 到 pixel-perfect 實作。SCSS、Tailwind 或 design tokens，依專案需求選擇。',
    },
    bullets: {
      en: ['Tailwind CSS', 'SCSS / BEM', 'Responsive & mobile-first', 'Figma handoff'],
      zh: ['Tailwind CSS', 'SCSS / BEM', 'RWD / 手機優先', 'Figma 接稿'],
    },
  },
  {
    n: '03',
    title: { en: 'Full-stack Support', zh: '全端支援' },
    lede: {
      en: 'Comfortable extending into the back end when needed. REST APIs, database schemas, deployment.',
      zh: '必要時能接後端工作。REST API、資料庫設計、部署。',
    },
    bullets: {
      en: ['Node.js / Flask', '.NET Web API', 'RESTful APIs', 'Cloudflare Workers / D1'],
      zh: ['Node.js / Flask', '.NET Web API', 'RESTful API', 'Cloudflare Workers / D1'],
    },
  },
];

/* ——— Contact ——— */
export const contact = {
  lede: {
    en: "Let's build something worth using.",
    zh: '歡迎談論職缺合作，也可以純粹聊技術。',
  },
  links: [
    {
      k: 'Email',
      v: meta.email,
      href: `mailto:${meta.email}`,
      arr: '↗',
    },
    {
      k: 'GitHub',
      v: 'github.com/Bruno-Yu',
      href: meta.github,
      arr: '↗',
    },
    {
      k: 'LinkedIn',
      v: 'linkedin.com/in/bruno-yu',
      href: meta.linkedin,
      arr: '↗',
    },
    {
      k: 'Blog',
      v: 'bruno-yu.github.io/bruno_blog',
      href: meta.blog,
      arr: '↗',
    },
    {
      k: 'CakeResume',
      v: 'cakeresume.com/jackhellowin',
      href: meta.cake,
      arr: '↗',
    },
  ],
};
