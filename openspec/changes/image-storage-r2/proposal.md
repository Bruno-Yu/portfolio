## Why

Works 項目的圖片目前以 Imgur 外部 URL 存入 D1，連結可能失效且無法自控。需要一個由自己掌控的免費圖片儲存方案，讓 Admin 能直接上傳圖片、URL 永久有效。

## What Changes

- **新增** Cloudflare R2 bucket（`portfolio-images`）作為圖片儲存後端
- **新增** Worker 路由 `POST /api/upload`：接收 multipart 圖片、存入 R2、回傳公開 URL
- **新增** Worker 路由 `DELETE /api/upload/:key`：Admin 刪除 R2 物件
- **新增** Admin 前端 works 表單的圖片上傳 UI（file input + 預覽 + 刪除按鈕）
- **更新** `wrangler.toml`：加入 `[[r2_buckets]]` binding
- D1 schema 不變，`img_url` / `img_link` 欄位繼續存 URL 字串

## Non-Goals

- 不修改 D1 schema（URL 欄位型態維持 text，無需 migration）
- 不實作圖片列表管理 API（只做上傳與刪除，不做列舉）
- 不做圖片壓縮或格式轉換（前端原始上傳，R2 原樣儲存）
- 不做前台（FrontStage）訪客直接上傳
- 不使用 Cloudflare Images（付費功能，不符合免費需求）

## Capabilities

### New Capabilities

- `image-upload`: Worker 接收管理員上傳的圖片並存入 Cloudflare R2，回傳可公開存取的 URL；管理員亦可透過 `DELETE /api/upload/:key` 刪除 R2 物件
- `admin-image-upload-ui`: Admin works 表單提供 file input + 刪除按鈕，觸發 `/api/upload`（上傳）與 `/api/upload/:key`（刪除），將回傳 URL 填入 imgUrl 欄位

### Modified Capabilities

(none)

## Impact

- Affected APIs: 新增 `POST /api/upload`、`DELETE /api/upload/:key`
- Affected code:
  - `workers/wrangler.toml` — 加 R2 binding
  - `workers/src/index.ts` — Env type 加 `IMAGES_BUCKET: R2Bucket`；掛 upload router
  - `workers/src/routes/upload.ts` — 新增
  - `frontend/src/views/BackStage/` — works create/edit 表單加圖片上傳
- External dependencies: Cloudflare R2（免費額度：10 GB 儲存、1M 寫/月、10M 讀/月、無 egress 費）
- Deploy: `wrangler deploy` 即可，不需要資料庫 migration
