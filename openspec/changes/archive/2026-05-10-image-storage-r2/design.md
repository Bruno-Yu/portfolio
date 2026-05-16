## Context

Portfolio 的 works 作品圖片目前以外部 Imgur URL 儲存在 D1，有連結失效風險且無上傳流程。
現有架構：Cloudflare Workers (Hono) + D1 SQLite + Drizzle ORM，`img_url` / `img_link` 欄位存 URL 字串。
Admin 以 JWT 驗證（`requireAdmin` middleware 已存在於 `workers/src/middleware/auth.ts`）。

## Goals / Non-Goals

**Goals:**

- 管理員能在 Admin 介面直接上傳圖片，不需依賴第三方服務
- 管理員能刪除已上傳至 R2 的圖片物件
- 上傳的圖片透過 Cloudflare CDN 提供公開存取（低延遲，無 egress 費）
- 維持現有 D1 schema 不變（零 migration 成本）
- 整體方案在免費額度內（$0/月）

**Non-Goals:**

- 圖片列表管理 API（不做 list/enumerate，只做上傳與刪除）
- 圖片壓縮或格式轉換（WebP 轉換、thumbnail 生成）
- 訪客端（FrontStage）上傳功能
- R2 bucket ACL 細粒度控管（統一 public read）

## Decisions

### R2 as storage backend (not Cloudinary or imgbb)

選擇 Cloudflare R2，拒絕 Cloudinary（外部依賴）與 imgbb（無 SLA）。

理由：與現有 Workers + D1 同平台；egress 免費；free tier（10 GB / 1M 寫 / 10M 讀）對 portfolio 規模永遠充足；不引入第三方 SDK。

替代方案：
- Cloudinary 25 GB free tier 更大，但引入第三方依賴，需 API key 管理
- imgbb 無 SLA，不適合生產環境

### Upload route in Worker (not direct browser-to-R2 presigned URL)

圖片上傳流經 Worker（`POST /api/upload`），而非讓前端直接 PUT 至 R2 presigned URL。

理由：統一走既有的 JWT 驗證機制（`requireAdmin`）；Worker 可做 type/size 驗證；不需在前端暴露 R2 credentials。Worker Free plan 每日可用 100,000 requests，遠超 Admin 使用量。

### R2 public bucket + custom domain for serving

R2 bucket 啟用 Public Access，綁定自訂網域 `images.jackhellowin.win`（Cloudflare DNS CNAME）。

理由：最簡單的公開存取方式；Cloudflare CDN 自動快取；不需額外 Worker 來 proxy R2 讀取。

### File key format: `works/<timestamp>-<random-slug>.<ext>`

範例：`works/1735000000000-k9z8x7w6v5.jpg`

理由：`works/` prefix 讓 R2 物件可依功能分組；timestamp 便於排序；短 random slug 對 Admin 上傳量已足夠避免碰撞；保留原始 extension 讓 content type 易於辨識。
不使用原始檔名（避免特殊字元/路徑注入）。

### Preview-first Admin image editing

上傳後，回傳的 `https://images.jackhellowin.win/<key>` URL 同時作為 `imgUrl`（modal 展示）和 `imgLink`（卡片縮圖）的值。Admin 表單不再直接暴露 URL text input；使用者看到的是現有圖片預覽，點擊替換時預覽區切換為 drag/drop upload target，刪除時清空圖片值。

向下相容策略：舊 Imgur URL 仍可顯示為預覽並可被移除或替換；只有 R2 custom-domain URL 會顯示刪除 R2 物件的能力。

## Risks / Trade-offs

- [Risk] Worker Free plan 請求數限制（100K req/day）→ Admin 使用頻率極低，不構成風險
- [Risk] R2 Public bucket 無法細粒度控制存取（任何人可讀）→ portfolio 圖片本為公開內容，可接受
- [Risk] 上傳大圖（5MB 限制）時 Worker 記憶體壓力 → 在 upload route 明確拒絕超過 5MB 的請求，回傳 413
- [Risk] R2 `pub-xxx.r2.dev` public URL 可能因帳號設定或 public access 狀態回 401 → 生產資料與 Worker response 統一使用 `images.jackhellowin.win` custom domain

## Migration Plan

1. 建立 R2 bucket：`wrangler r2 bucket create portfolio-images`
2. 在 Cloudflare Dashboard 啟用 bucket Public Access，記下 public URL
3. 加 `[[r2_buckets]]` 到 `wrangler.toml` + Env type 更新
4. 實作並部署 upload route（`wrangler deploy`）
5. Admin 前端加圖片上傳 UI，部署前端
6. 在 Cloudflare DNS / R2 custom domains 綁定 `images.jackhellowin.win`
7. 將現有 8 張作品圖片轉存 R2，更新 D1 `works.img_url` / `works.img_link` 為 custom-domain URL

Rollback：移除 `[[r2_buckets]]` binding 並重新 deploy，前端恢復手動輸入 URL 即可。
