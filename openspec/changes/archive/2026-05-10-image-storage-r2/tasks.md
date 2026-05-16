<!--
部署安全原則：
  - 所有 wrangler deploy 及前端部署，必須在 Bruno 與 AI 共同驗證後才執行
  - feat/design 分支的改動不在本 change 的部署範圍內，wrangler deploy 只對 main 上的 R2 功能生效
  - 任何部署前確認：本地測試通過 → Bruno 確認 → AI 跑完驗收清單 → 才部署
-->

## 1. R2 Bucket Setup (one-time manual steps)

- [x] 1.1 R2 as storage backend (not Cloudinary or imgbb): run `npx wrangler r2 bucket create portfolio-images` from the `workers/` directory to create the `portfolio-images` bucket
- [x] 1.2 Enable Public Access on the R2 public bucket in Cloudflare Dashboard (R2 → portfolio-images → Settings → Public Access) and note the generated `pub-xxx.r2.dev` public URL — `pub-f2e6dc75f53b4938bd03873522d4524b.r2.dev`
- [x] 1.3 Add a Cloudflare DNS CNAME record `images.jackhellowin.win → pub-xxx.r2.dev` for the R2 public bucket + custom domain for serving — connected via `wrangler r2 bucket domain add`

## 2. Worker Configuration

- [x] 2.1 Add `[[r2_buckets]]` binding to `workers/wrangler.toml`: set `binding = "IMAGES_BUCKET"` and `bucket_name = "portfolio-images"` (upload route in Worker requires this binding)
- [x] 2.2 Extend the `Env` type in `workers/src/index.ts` to include `IMAGES_BUCKET: R2Bucket`

## 3. Worker Upload Route

- [x] 3.1 Create `workers/src/routes/upload.ts` — implement `POST /api/upload` that allows admin to upload an image to Cloudflare R2; apply `requireAdmin` middleware from `workers/src/middleware/auth.ts` to enforce JWT authentication
- [x] 3.2 In the upload handler, parse `c.req.raw.formData()` and extract the `file` field; return HTTP 400 `{ success: false, error: "No file provided" }` when the field is absent (requirement: admin can upload an image to Cloudflare R2 — missing file field is rejected)
- [x] 3.3 Validate that `file.type.startsWith('image/')` and reject non-image MIME types with HTTP 400 `{ success: false, error: "Invalid file type" }` (requirement: admin can upload an image to Cloudflare R2 — non-image MIME type is rejected)
- [x] 3.4 Validate that `file.size <= 5_242_880` (5 MiB) and reject oversized files with HTTP 413 `{ success: false, error: "File too large" }` (requirement: admin can upload an image to Cloudflare R2 — file exceeding 5 MB is rejected)
- [x] 3.5 Generate a storage key using the file key format: `works/<timestamp>-<random-slug>.<ext>` — concretely `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}` where `ext` is derived from the original filename
- [x] 3.6 Call `env.IMAGES_BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } })` to store the file in R2 and preserve content type in R2 object metadata; fulfills "R2 object metadata preserves content type"
- [x] 3.7 Return HTTP 200 `{ success: true, data: { url: "https://images.jackhellowin.win/<key>", key } }` so uploaded images are publicly accessible via CDN through the custom R2 domain
- [x] 3.8 Register the upload router in `workers/src/index.ts`: `app.route('/api/upload', uploadRouter)` — upload route in Worker (not direct browser-to-R2 presigned URL), keeping credentials server-side
- [x] 3.9 In `workers/src/routes/upload.ts`, add `DELETE /:key` handler — admin can delete an image from Cloudflare R2: extract `:key` from path params, apply `requireAdmin`, call `env.IMAGES_BUCKET.delete(key)`, return HTTP 200 `{ success: true }` (idempotent — succeed even if key does not exist)
- [x] 3.10 Reject delete requests without valid JWT with HTTP 401 (requirement: admin can delete an image from Cloudflare R2 — delete request without valid JWT is rejected)
- [x] 3.11 **[部署安全閘門]** 在執行 `wrangler deploy` 前，確認：(a) Workers TypeScript build 通過、(b) AI 確認 upload route 的 auth/type/size/delete 行為、(c) 部署後 Section 5 驗收清單全部通過 → 已部署 Worker version `eaeca1f3-338c-4e76-9f74-60d2091cf4ad`

## 4. Admin Frontend — Image Upload + Delete UI

- [x] 4.1 Locate the works create form component in `frontend/src/views/BackStage/` and add a preview-first admin image editing UI whose replace state exposes a drag/drop `<input type="file" accept="image/*">` upload target; fulfills "Admin works form provides preview-first image upload"
- [x] 4.2 Implement an `onChange` handler on the file input: read the selected file, display a loading indicator, and send `POST /api/upload` as `multipart/form-data` with `Authorization: Bearer <token>` (token from auth store); set imgUrl and imgLink both set to the same R2 URL returned on success
- [x] 4.3 On successful upload response, set both `imgUrl` and `imgLink` to the returned custom-domain R2 URL and render an `<img>` preview in the image editor; fulfills "Successful upload populates imgUrl and shows a preview"
- [x] 4.4 On upload error (non-2xx or network failure), display a human-readable error message ("File too large (max 5 MB)", "Invalid file type", or "Upload failed, please retry") near the file input and leave `imgUrl` unchanged — satisfies requirement: upload error is surfaced to the admin
- [x] 4.5 Replace the manual `imgUrl` / `imgLink` text fields with a preview-first editor. Existing legacy URLs remain previewable and can be removed or replaced, but new edits go through the R2 upload flow so saved URLs are controlled R2 URLs; fulfills "Manual image URL fields are hidden from the works form"
- [x] 4.6 Add a delete button adjacent to the image preview — visible only when `imgUrl` is an R2-hosted URL (origin matches `images.jackhellowin.win` or `pub-xxx.r2.dev`); admin can delete an uploaded image from the works form: on click, extract the key from the URL, call `DELETE /api/upload/<key>` with JWT, on HTTP 200 clear `imgUrl` and hide the preview
- [x] 4.7 On delete API error, display an error message near the image preview and do NOT clear `imgUrl` (requirement: delete API error is surfaced to the admin)
- [x] 4.8 Hide the delete button when `imgUrl` holds a legacy non-R2 URL (requirement: delete button is hidden for non-R2 URLs)
- [x] 4.9 Apply identical file input + upload + delete logic to the works edit form component in `frontend/src/views/BackStage/`
- [x] 4.10 **[部署安全閘門]** 前端部署前確認：(a) Admin 上傳 / 刪除功能在本地完整測試通過、(b) Bruno 確認 preview-first Admin UI 行為符合預期、(c) 作品舊圖已遷移為 R2 custom-domain URL → 已部署 Pages preview 並導入 production routing

## 5. Verification

- [x] 5.1 Call `POST https://portfolio.jackhellowin.win/api/upload` with a valid admin JWT and a test image; confirmed HTTP 200 and an R2 URL in the response
- [x] 5.2 Open the returned URL and confirm the image loads via `https://images.jackhellowin.win/...` with HTTP 200
- [x] 5.3 Verify upload rejection cases: unauthenticated request → 401; non-image file → 400; file > 5 MB → 413
- [x] 5.4 Call `DELETE https://portfolio.jackhellowin.win/api/upload/<key>` with a valid JWT; confirmed HTTP 200 and deleted the test object
- [x] 5.5 Call `DELETE /api/upload/<nonexistent-key>` with a valid JWT; confirmed HTTP 200 (idempotent)
- [x] 5.6 Call `DELETE /api/upload/<key>` without JWT; confirmed HTTP 401
- [x] 5.7 In the Admin UI, upload an image → confirm preview and replace/delete controls appear; delete clears the preview and internal image values
- [x] 5.8 Existing legacy image URLs remain previewable but the edit flow does not expose manual URL fields; legacy non-R2 URLs do not trigger an R2 delete call
- [x] 5.9 Migrated all existing work images from Imgur/local legacy URLs to R2 custom-domain URLs and confirmed the 8 public image URLs return HTTP 200
