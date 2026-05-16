<!--
Branch map：
  feat/design      — FrontStage 重設計（本 change 主分支）
                     從此次 main working tree 建立，涵蓋 Section 1–6 所有 tasks
                     merge 目標：main（前提：Section 7 pre-merge checklist 全部完成）

  main             — 生產版本
                     R2 圖片儲存（image-storage-r2）在此分支實作並部署
                     feat/design merge 回來後成為新的生產版本

  feat/admin-redesign（尚未建立）
                   — Admin BackStage 重設計，在 Admin 設計稿完成後從 feat/design 開出
                     建立方式：git checkout feat/design && git checkout -b feat/admin-redesign
                     merge 目標：先 merge 進 feat/design，再一起 merge 進 main
                     若 Admin 設計稿在 feat/design merge 前完成，可直接在 feat/design 上作業不另開分支
-->

## 1. 已實作（feat/design 分支 — 建立分支後確認）

<!-- 實作已在 main working tree 完成，建立 feat/design 分支並 push 後逐項打勾 -->

- [x] 1.1 CSS design tokens define the visual system 已建立：`frontend/src/styles/design-tokens.css` 定義 `--bg`、`--ink`、`--accent-y`，`[data-theme="dark"]` 覆寫就位
- [x] 1.2 Theme toggle switches color scheme 已實作：點擊 Rail theme toggle 更新 `data-theme`，`localStorage["theme"]` 持久化（theme toggle persists across page reloads）
- [x] 1.3 Lang toggle switches all UI text 已實作：點擊切換所有 FrontStage 文字，`localStorage["lang"]` 持久化（language toggle persists across page reloads）
- [x] 1.4 語言 / 主題 state 集中於 Redux ui-slice：`frontend/src/store/ui-slice.ts` 定義 `lang`/`theme`，透過 `setLang`/`setTheme` dispatch，同步 `document.documentElement` 屬性
- [x] 1.5 FrontStage BEM classes do not conflict with Admin Tailwind classes（BEM CSS design system over Tailwind for FrontStage）：`.hero`、`.work-card`、`.rail` 等 BEM class 不與 Tailwind utility 衝突
- [x] 1.6 Rail sidebar is always visible on desktop（Rail sidebar（280px 固定寬）+ main column 捲動）：≥ 900px 固定 280px，main content 獨立捲動
- [x] 1.7 Rail collapses to a top bar on mobile：< 900px 轉為 top bar
- [x] 1.8 Scroll-spy highlights the active section in Rail nav 已實作：IntersectionObserver 監聽各 section，Rail nav active 隨捲動更新
- [x] 1.9 Home page is a single-page scroll with 7 sections（home 為單頁捲動（7 sections））：Hero → About → Experience → Works → Skills → Services → Contact 全部在 `/` 渲染
- [x] 1.10 Hero section displays portrait with decorative frame and stamp 已實作：`avatar.webp` 3:4 bordered box，`stamp.webp` `mix-blend-mode: multiply`（light）/ `normal`（dark）
- [x] 1.11 Hero bottom nav cards link to sibling sections 已實作：三張快速導覽卡片 smooth-scroll 至 `#about`、`#works`、`#contact`
- [x] 1.12 Works section shows up to 6 works from the API 已實作：`imgUrl`/`imgLink` fallback 正確
- [x] 1.13 Works section modal shows full work details on card click 已實作：顯示 `content`、tags、`gitHubUrl`、`gitPageUrl`
- [x] 1.14 Skills section renders skill tags from the API 已實作
- [x] 1.15 Contact section displays static contact metadata 已實作：從 `portfolio.ts` 渲染
- [x] 1.16 Works page displays all works with pagination 已實作（`/works` 路由）
- [x] 1.17 Works page cards show cover image with fallback：無圖時顯示 type/kind 文字佔位
- [x] 1.18 Works page modal shows full work details on card click 已實作
- [x] 1.19 Login page uses two-column layout 已實作：desktop 雙欄，mobile < 900px 單欄
- [x] 1.20 Login form uses existing API auth logic：登入成功跳轉 Admin，失敗顯示雙語錯誤

<!--
部署安全原則：
  - feat/design 分支 push 後，Cloudflare Pages 會自動產生 Preview URL（非生產網址）
  - Preview URL 僅供 Bruno 與 AI 驗證使用，不影響線上正式版本
  - 線上生產版本（portfolio.jackhellowin.win）在 feat/design merge 進 main 並雙方驗證前，維持現有外觀不變
  - 任何 feat/design → main 的 merge 與後續部署，必須完成 Section 7 所有項目才可執行
-->

## 2. 待確認 — 分支建立（feat/design）

- [x] 2.1 從目前 main working tree 建立 `feat/design` 分支：`git checkout -b feat/design`
- [x] 2.2 將 FrontStage design 改動、Spectra 文件、設定檔 commit 至 `feat/design`（不含 `workers/`）
- [x] 2.3 Push `feat/design` 至 remote：`git push -u origin feat/design`

## 3. 待確認 — 功能驗證（feat/design 分支）

<!-- 在 feat/design 建立後本地 pnpm dev 逐項確認 -->

- [x] 3.1 本地 `pnpm dev` 驗證：首頁 7 個 section 正常顯示，無 console error
- [x] 3.2 驗證 Rail sidebar 在 desktop 固定、mobile 收為 top bar
- [x] 3.3 驗證語言 / 主題切換，刷新後保持設定（無 FOUC）
- [x] 3.4 驗證 scroll-spy：捲動至各 section，Rail nav active 正確更新
- [x] 3.5 驗證 Works section 首頁 modal：點擊卡片有圖片、描述、連結
- [x] 3.6 驗證 Works 獨立頁面：分頁正常，modal 功能正常
- [x] 3.7 驗證 Login 頁面：雙欄版型，表單可正常登入

## 4. 待完成 — 履歷視角文案重構與人工確認（feat/design 分支）

<!--
此 section 的目標是讓 FrontStage 文案可作為作品集與履歷補充材料。
文案調整以中文為主，英文只在需要保持語意一致時同步微調。
所有刪減都必須兼顧原設計感與版面節奏，不可讓區塊突然變空、變擠或失去視覺重心。
-->

- [x] 4.1 依照 Portfolio copy is treated as resume-adjacent content 原則重寫 Hero 中文主文案：定位為「前端工程師，具全端協作能力」，保留作品集設計感，不寫成履歷條列。移除或替換「誠實的前端介面」、「可接案 · Q3 2026」等過度風格化或接案導向訊號。
- [x] 4.2 調整 Hero CTA、quick tags、底部三張 quick-nav 卡片文案：保留原本數量與版面結構，讓使用者能快速前往作品、關於、聯絡資訊。
- [x] 4.3 重寫 About 中文三段式內容：第一段說明目前職能、年資、主要技術與工作場景；第二段將越南 B2B 業務背景轉化為溝通、跨文化協作、需求釐清與交付意識；第三段描述工程習慣，例如讀文件、拆分元件、維護既有系統、補文件與協助團隊。移除「不掉鏈子」、「瑣事」等不適合履歷篩選情境的措辭。
- [x] 4.4 檢查 About facts：確認現職、主要技術、TOEIC、求職方向、語言能力與正式履歷一致；若正式履歷不同，以正式履歷為準。
- [x] 4.5 重寫 Services 中文文案：維持三張卡片與 bullet 結構，將「我能解決什麼」改為更職場導向但不僵硬的表述，例如核心能力或可支援工作；內容聚焦前端工程、UI 實作、全端協作。
- [x] 4.6 重寫 Works seed data 的 `description` 與 `content`：更新 `data-migration/db.json`，並同步 canonical seed SQL。避免「仿做」、「順便鍛鍊」、「練習作品」等弱化成果的說法；每個作品用短句交代目的、技術、實作重點與可檢視成果。
- [x] 4.7 修正作品資料中的技術名稱與 typo：統一 `TypeScript`、`Vue CLI`、`RESTful API` 等拼法；修正 `RESTful AP`。
- [x] 4.8 調整 Contact 中文文案：保留作品集的開放聯絡感，不寫成接案廣告，也不過度求職化；建議語氣為「若想了解作品細節、技術合作或職缺媒合，歡迎聯絡」。
- [x] 4.9 更新 `frontend/index.html` SEO / OG / title：改為正式作品集摘要，避免仍使用舊專案「以 React 為核心框架...熟練技術」的描述。
- [x] 4.10 更新 `frontend/README.md`：同步年資、職稱、技術定位與聯絡語氣，避免 README 寫「近兩年」但首頁寫「三年」。
- [ ] 4.11 視覺回歸檢查：桌機與手機檢查 Hero、About、Works cards、Works modal、Services、Contact 的中文文案是否維持原設計節奏；若文案刪短造成留白失衡，補上等價但不浮誇的內容；若文案過長造成溢出，優先精簡文案，再考慮 CSS 微調。
- [ ] 4.12 **[需人工確認]** Bruno 確認中文文案是否符合個人真實經歷、正式履歷、職涯定位與作品展示目的。

## 5. 待完成 — 畫面設計微調（feat/design 分支）

<!-- 視覺比對設計稿，列出差異並修正 -->

- [ ] 5.1 **[需人工確認]** 逐頁截圖與設計稿對比，列出待調整的視覺差異清單
- [ ] 5.2 修正 Hero section 任何與設計稿不符之處（字級、行高、portrait 比例、stamp 位置）
- [ ] 5.3 修正 Works card / modal 視覺問題（間距、邊框、字型）
- [ ] 5.4 修正各 section 在 mobile（< 900px）的版型問題
- [ ] 5.5 修正 dark mode 下任何顏色異常（stamp blend mode、highlight 背景、文字對比度）

## 6. 待完成 — Admin BackStage 重設計（feat/admin-redesign 或 feat/design）

<!--
分支策略：
  - merge 策略：若 Admin 設計稿在 feat/design merge 前完成 → 直接在 feat/design 上作業
  - 若較晚完成 → 從 feat/design 開新分支 feat/admin-redesign，merge 目標為 feat/design
-->

- [x] 6.1 取得 Admin BackStage 設計稿並依 `desktop/學習/backstage-portfoilio-design` 對齊實作
- [x] 6.2 **[需人工確認]** 決定分支策略：直接在目前整合線上完成 Admin redesign，並以 `backstage-dashboard-v2` Spectra change 歸檔
- [x] 6.3 實作 Admin 新版 layout 與導覽（AdminShell、always-dark sidebar、topbar、full-height sidebar）
- [x] 6.4 實作 works 列表頁新 UI
- [x] 6.5 實作 works create/edit 表單新 UI — BackStage 圖片欄位必須採用 R2 邏輯（merge 前提）：已採用 R2 preview-first 邏輯（`POST /api/upload` 上傳和 `DELETE /api/upload/:key` 刪除），不暴露 Imgur 手動 URL 輸入
- [x] 6.6 驗證 BackStage 圖片上傳 / 刪除在新 Admin UI 下正常運作
- [x] 6.7 未另開 `feat/admin-redesign` 分支；相關 Admin change 已由 `backstage-dashboard-v2` archive 收斂

## 7. Pre-Merge Checklist（feat/design → main）

<!--
Merge 前提：
  1. main 上 image-storage-r2 所有驗收項目（5.1–5.9）確認完成，spectra archive 已執行
  2. Sections 1–6 所有 tasks 完成（含人工確認）
  3. feat/admin-redesign（若有）已 merge 回 feat/design
  4. R2 Workers 已部署（wrangler deploy）且生產環境驗證通過
-->

### 7.0 image-storage-r2 部署與驗收（前提：完成後才進入 7.1）

<!-- main 已完成：bucket 建立、r2.dev 啟用、images.jackhellowin.win 自訂網域連接、Workers/Admin UI 實作 -->
<!-- 本地驗證已完成（AI 執行）：upload 401/400/413/200、delete 401/200/idempotent -->

- [x] 7.0.1 **[部署安全閘門]** 執行 `cd workers && npx wrangler deploy`（在 main 分支上）；deployed Worker version `eaeca1f3-338c-4e76-9f74-60d2091cf4ad`
- [x] 7.0.2 確認 `images.jackhellowin.win` 自訂網域可公開讀取 R2 物件
- [x] 7.0.3 驗收：`POST https://portfolio.jackhellowin.win/api/upload` 以有效 JWT + 測試圖片 → HTTP 200，回傳 R2 URL
- [x] 7.0.4 驗收：在瀏覽器 / curl 開啟回傳 URL，確認圖片載入 HTTP 200
- [x] 7.0.5 驗收：未附 JWT → 401、非圖片 → 400、> 5MB → 413
- [x] 7.0.6 驗收：`DELETE https://portfolio.jackhellowin.win/api/upload/<key>` 有效 JWT → 200；測試物件已刪除
- [x] 7.0.7 驗收：無 JWT 刪除 → 401；刪除不存在 key → 200（idempotent）
- [x] 7.0.8 **[部署安全閘門]** 前端部署前確認：Admin UI upload/delete 在本地與部署環境驗證通過，Bruno 已確認 preview-first 行為
- [x] 7.0.9 驗收：Admin UI 上傳圖片 → 預覽與刪除/替換控制出現；legacy URL 不觸發 R2 delete
- [x] 7.0.10 驗收：儲存含 R2 URL 的作品 → 前台作品卡片與 modal 圖片正確顯示；現有 8 張作品圖已遷移並回 HTTP 200
- [x] 7.0.11 執行 `spectra archive image-storage-r2`（在 main 分支）

### 7.1–7.10 feat/design → main 合併

- [ ] 7.1 確認 Sections 1–6 所有 tasks（含人工確認項目）完成
- [x] 7.2 確認 7.0 全部完成（R2 已在生產環境驗證可用、spectra archive 已執行）
- [ ] 7.3 **[部署安全閘門]** merge 前最終確認：(a) feat/design 的 Cloudflare Pages Preview URL 已由 Bruno 親眼驗證設計正確、(b) R2 upload/delete 在 Preview 環境也確認正常、(c) AI 確認 Sections 1–6 全部完成 → 才執行 merge
- [ ] 7.3a 執行 merge：`git checkout main && git merge feat/design --no-ff`（衝突已預先透過 main→feat/design merge 消除）
- [ ] 7.4 確認 `workers/wrangler.toml` 正確（R2 binding 保留，無衝突）
- [ ] 7.5 確認 `workers/src/index.ts` 正確（R2 Env + upload router 保留，無衝突）
- [x] 7.6 確認 `frontend/src/views/BackStage/` 使用 R2 preview-first 邏輯（已由 Admin redesign 整合）
- [ ] 7.7 本地全面驗證：FrontStage 新設計正確、R2 upload/delete 在 Admin 正常、Works 圖片顯示 R2 URL
- [ ] 7.8 Merge commit：`feat: merge FrontStage redesign; R2 image logic from main retained`
- [ ] 7.9 **[部署安全閘門]** 部署前再次確認：merge 後 main 本地 `pnpm dev` + Workers dev 全功能驗證通過、Bruno 確認無回歸 → 才部署至生產環境
- [ ] 7.10 執行 `spectra archive frontend-redesign`
