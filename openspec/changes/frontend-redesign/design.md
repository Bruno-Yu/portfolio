## Context

Portfolio 前台改版。設計稿位於 `/Users/brunoyu/Desktop/學習/portfolio-design/`。
Admin（BackStage）設計稿尚未完成，本 change 的後台部分待設計稿完成後補充。

## Decisions

### BEM CSS design system over Tailwind for FrontStage

FrontStage 組件改用 BEM class + CSS 變數，Admin 組件繼續使用 Tailwind。兩套命名空間無衝突。

理由：設計稿使用 CSS 變數定義 design token（色系、字體），BEM class 語意明確且便於 dark mode 覆寫。

CSS 檔案結構：
- `design-tokens.css` — CSS 變數（顏色、字體、spacing）
- `design-shell.css` — shell grid layout、Rail sidebar、hero、works modal
- `design-pages.css` — 各 section 的 BEM class
- `design-admin.css` — login 頁 + 未來 Admin 改版備用

### Rail sidebar（280px 固定寬）+ main column 捲動

Shell 為 `display: grid; grid-template-columns: 280px 1fr`，Rail 固定不捲動，main column 自行捲動。
手機版（< 900px）Rail 移至頁首（top bar 模式）。

### 語言 / 主題 state 集中於 Redux ui-slice

`lang`（'en' | 'zh'）與 `theme`（'light' | 'dark'）存於 Redux，持久化到 localStorage。
切換時同步更新 `document.documentElement` 的 `data-theme` 與 `lang` 屬性。

### Home 為單頁捲動（7 sections）

路由 `/` 渲染 7 個 section 組件，無分頁、無 tab。各 section 以 IntersectionObserver 監聽，更新 Rail active 狀態。

### Portfolio copy is treated as resume-adjacent content

The FrontStage copy SHALL be written as portfolio-first, resume-adjacent content. The site is not replacing Bruno's formal resume, but HR staff and engineering managers may use it as screening material. Chinese copy is the primary review target.

Copy direction:
- Position Bruno as a front-end engineer with full-stack collaboration ability, not as a generic full-stack engineer.
- Keep Vue, React, TypeScript, internal systems, UI implementation, API collaboration, and maintainability as the main signals.
- Present the Vietnam B2B sales background as evidence of communication, cross-cultural collaboration, requirement clarification, and delivery awareness.
- Avoid phrases that feel overly poetic, casual, inflated, or freelance-first, including wording equivalent to "honest interfaces", "not dropping the ball", "small chores nobody wants", "build something truly useful", and "available for freelance".
- Do not invent unverifiable metrics. Existing credible facts such as 3 years of experience, Wistron ITS, TOEIC L+R 940, Vue / React, and internal system work may remain.

Layout preservation rules:
- Replace unsuitable copy with equivalent-purpose copy instead of deleting UI content.
- Preserve Hero CTA count, quick tags, bottom navigation cards, About paragraph count, Services card count, and Contact link structure.
- Keep Chinese text close to the current visual weight. Shorter copy may be used only when the surrounding layout still keeps its intended balance.
- Do not change CSS or component structure unless manual visual verification shows text overflow, broken wrapping, or collapsed spacing.
- Works card descriptions should stay concise; longer implementation detail belongs in modal content.

### BackStage 圖片欄位必須採用 R2 邏輯（merge 前提）

`feat/design` merge 回 `main` 的前提：BackStage works 表單的圖片欄位必須使用 `main` 上已實作的 R2 upload/delete API（`POST /api/upload`、`DELETE /api/upload/:key`），不可保留舊的 Imgur 手動 URL 輸入方式。這是 merge 的必要條件（hard requirement），非選項。

### Merge 策略

- `workers/`：衝突時保留兩邊（CORS fix from design + R2 binding from main）
- `frontend/src/views/BackStage/`：保留 main 版本的 R2 邏輯，再套上 Admin 新 UI
- `frontend/src/views/FrontStage/`：全取 feat/design 版本
- `frontend/src/styles/`：全取 feat/design 版本

## Risks / Trade-offs

- [Risk] Admin BackStage 設計稿未完成 → merge 必須等 Admin 設計完成並實作後才進行
- [Risk] Tailwind 與 BEM CSS 並存 → FrontStage 使用 BEM，BackStage 使用 Tailwind，需注意 import 順序（BEM 在 @tailwind 指令之後）
- [Risk] Scroll-spy 在 sticky layout 中的 IntersectionObserver threshold 需調校 → 需在各裝置實測
