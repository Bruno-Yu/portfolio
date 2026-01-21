-- Seed data migration
-- Generated from data-migration/db.json

-- Clear existing data
DELETE FROM works;
DELETE FROM skills;
DELETE FROM social_media;
DELETE FROM self_content;

-- Seed works
INSERT INTO works (title, description, img_url, img_link, content, tags, github_url, git_page_url) VALUES
('個人網站', '透過此個人網站展示作品集，順便鍛鍊新技術。', 'https://i.imgur.com/WMejxmI.png', 'https://i.imgur.com/WMejxmI.png', '以React為核心框架，利用Redux管理狀態，並搭配Flowbite構建網站的UI設計，API 則是用 JSON Server 對接資料，旨在展示作品集的同時熟練技術。', '["React","Redux","flowbite"]', 'https://github.com/Bruno-Yu/portfolio.git', 'https://bruno-yu.github.io/portfolio/'),
('個人履歷網站', '透過此個人履歷網站展示和彙整我的作品集，同時展現個人技能。', 'https://i.imgur.com/GPCWJOU.png', 'https://i.imgur.com/GPCWJOU.png', '以Astro.js作為網站的核心框架，利用其快速建立靜態網頁; 使用Flowbite來快速建構網站的版面和組件，以達到美觀與一致性;透過dark mode和i18n的實現，使網站能夠適應不同的用戶偏好和語言環境，提供更好的使用體驗。', '["Astro.js","Flowbite","Vue","i18n"]', 'https://github.com/Bruno-Yu/resume_renew.git', 'https://bruno-yu.github.io/resume_renew/'),
('NFT GEL', '販售 NFT 網站的仿做，嘗試刻劃的練習作品', 'https://i.imgur.com/OehaZfu.jpeg', 'https://i.imgur.com/OehaZfu.jpeg', '此專案模仿了 NFT 購物平台，使用ejs來進行模板渲染，並用gulp來自動化工作流，Bootstrap5則幫助網站達成響應式設計。', '["切版","ejs","gulp","Bootstrap5"]', 'https://github.com/Bruno-Yu/NFT_GEL.git', 'https://bruno-yu.github.io/NFT_GEL/'),
('GrandMaSam Dine', '山姆大嬸餐館，獨樹一格的菜餚與經營方式，一定讓體驗過的您難以忘懷', 'https://i.imgur.com/OJ9Edmt.jpeg', 'https://i.imgur.com/OJ9Edmt.jpeg', '獨立專案，前後台分離架構，單頁應用（SPA），實現 CRUD 操作，響應式設計，內容管理功能，串接 RESTful AP。', '["Vue3","Vue_cli","Bootstrap5"]', 'https://github.com/Bruno-Yu/GrandMaSam_Diner_renewed.git', 'https://bruno-yu.github.io/GrandMaSam_Diner_renewed/'),
('THE F2E 2022 黑客松官網重製', 'THE F2E 2022 黑客松', 'https://i.imgur.com/wYioffJ.jpeg', 'https://i.imgur.com/wYioffJ.jpeg', '參與THE F2E 2022 黑客松挑戰，使用ejs作為模板引擎，搭配gulp自動化流程，並使用Tailwind和GSAP實現動態網頁效果。', '["gulp","ejs","Tailwind","GSAP","AOS","Lottie"]', 'https://github.com/Bruno-Yu/TheF2E_2022_week1.git', 'https://bruno-yu.github.io/TheF2E_2022_week1/'),
('THE F2E 2022 Dotsign', 'THE F2E 2022 點點簽', 'https://i.imgur.com/jSuGlRX.png', 'https://i.imgur.com/jSuGlRX.png', '點點簽應用程式，使用Vue 3、Pinia進行狀態管理，並結合pdf.js與jspdf.js實現PDF文件簽名功能。', '["Vue 3","Vue CLI","Pinia","Tailwind","Tailwind Elements","pdf.js","fabric.js","jspdf.js"]', 'https://github.com/Bruno-Yu/TheF2E_2022_DotSign.git', 'https://bruno-yu.github.io/TheF2E_2022_DotSign/#/'),
('2022 F2E 黑客松 Scrum', '2022 F2E 黑客松挑戰，一週內根據設計稿建立出 Scrum 精神介紹網站', 'https://i.imgur.com/eKNzPrX.png', 'https://i.imgur.com/eKNzPrX.png', '以 Vue 3 架構，配合 Tailwind 設計並實現網站響應式佈局，Pinia 用於狀態管理。', '["Vue 3","Vue CLI","Pinia","Tailwind"]', 'https://github.com/Bruno-Yu/TheF2E_2022_scrum_quickguide.git', 'https://bruno-yu.github.io/TheF2E_2022_scrum_quickguide/#/'),
('2023 後台專案開發練習', '2023 初次接觸 typescript 並以此搭建後台管理頁面', 'https://i.imgur.com/nsFRE78.png', 'https://i.imgur.com/nsFRE78.png', '以 Vue 3 結合 Typescript 打造後台管理介面，並實現基礎的 CRUD 功能，使用 Pinia 進行狀態管理。', '["Vue 3","Typescript","Pinia"]', 'https://github.com/Bruno-Yu/TheF2E_2022_scrum_quickguide.git', 'https://bruno-yu.github.io/TheF2E_2022_scrum_quickguide/#/');

-- Seed skills
INSERT INTO skills (title, icon, details, "order") VALUES
('Vue', 'price-item-visual', '["Vue3/Vue2","Nuxt3/Nuxt2","Vite","Pinia/Vuex"]', 0),
('React', 'price-item-ui', '["React 18","Vite","Redux","React Query"]', 1),
('Web Layout', 'service-item-html&css', '["CSS/SCSS ","RWD","Tailwind CSS","Bootstrap 5","Element Plus","GSAP"]', 2),
('Others', 'service-item-front-end', '["Git","Figma","Basic unit test","Basic Linux","Basic SQL"]', 3);

-- Seed social media
INSERT INTO social_media (name, link, "order") VALUES
('Github', 'https://github.com/Bruno-Yu', 0),
('Email', 'mailto:jackhellowin@gmail.com', 1),
('Linkedin', 'https://www.linkedin.com/in/bruno-yu-357415253', 2);

-- Seed self content
INSERT INTO self_content (brief_intro, about, hash_tags) VALUES
('Hi! 我是 Bruno', '來自臺南市的前端開發工程師，擁有近兩年的前端開發與專案管理經驗。我的技術專長涵蓋 Vue3、React 等前端框架及其生態，並且熱衷於探索最新的技術與工具。我認為，技術應該是解決問題的工具，而非目標。因此，我不僅追求持續精進自己，也不斷思考如何以更聰明的方式解決複雜的問題。', '["WEB DEVELOPMENT","FRONTEND DEVELOPER"]');
