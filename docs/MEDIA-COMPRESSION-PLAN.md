# ANTBAR 全站图片 / 视频压缩计划

> 审计日期：2026-06-11  
> 资源目录：`public/wp-content/uploads/`（阶段 A 后约 **202 MB**；阶段 B 后 AVIF **603** 张）

## 1. 现状审计

### 1.1 体量分布（`public/` 内）

| 类型 | 文件数 | 体积 | 说明 |
|------|--------|------|------|
| PNG | 341 | **84 MB** | 多数已有对应 `.webp`，构建时会从 `dist` 剔除原图 |
| JPG | 322 | **37 MB** | 同上 |
| WebP | 858 | **29 MB** | 已为主要部署格式 |
| AVIF | 95 | **4 MB** | 首页 Hero 等关键图已使用，覆盖仍偏少 |
| MP4 | 9 | **249 MB** | 含 **2 个 `.orig.mp4` 母带（218 MB）**，不应进仓库/部署 |
| GIF | 1 | **6.4 MB** | `2024/04/地球-GIF.gif`，应转 WebP/MP4 |

### 1.2 最大单文件（优先处理）

| 文件 | 大小 | 用途 / 建议 |
|------|------|-------------|
| `2024/07/C486-ok-2k.orig.mp4` | 184 MB | **母带，移出 `public/` 或 `.gitignore`** |
| `2024/07/AGP12000-479-.orig.mp4` | 34 MB | **同上** |
| `2024/04/地球-GIF.gif` | 6.4 MB | 转 WebP 动画或短视频 |
| `2024/03/446-07.png` | 6.0 MB | 已有 webp 则确认代码引用；可再生成 AVIF |
| 各产品页背景 MP4 | 3.7–5.8 MB | 见 §3 视频策略 |

### 1.3 站内视频引用（需压缩 / 懒加载）

| 路径 | 引用位置 |
|------|----------|
| `2023/12/SA8000-2023x264-x264-1.mp4` | 首页 `PRODUCT_VIDEO`（已懒加载） |
| `2024/03/449_1-2540_x264_x264.mp4` | SA8000 产品页背景 |
| `2024/05/C485.mp4` | KT800 / AT800 等 |
| `2024/07/C486-ok-2k.mp4` | AT800 背景 |
| `2024/07/AGP12000-479-.mp4` | AGP12000 |
| `2024/06/479-3屏-2.mp4`、`479-详情-4屏.mp4` | AGP12000 详情 |

### 1.4 已有工具链

| 脚本 | 作用 |
|------|------|
| `npm run optimize:images` | PNG/JPEG → WebP（`cwebp -q 80`），**跳过已有 webp** |
| `scripts/post-build-cleanup.mjs` | 构建后删除 dist 中「已有 webp 的 png/jpg」及 `.orig.mp4` |
| `scripts/update-mirror-webp-refs.mjs` | 镜像 HTML 批量改 webp 引用 |

**缺口**：无 AVIF 批量脚本、无视频转码脚本、`src/data/*` 中仍有部分 `.png` 直链。

---

## 2. 目标

| 指标 | 当前（估） | 目标 |
|------|------------|------|
| `public/wp-content/uploads` 仓库体积 | ~416 MB | **< 120 MB**（母带迁出后约 -218 MB） |
| 生产 `dist/client` 静态资源 | 含大量冗余 png | 仅 WebP/AVIF + 压缩 MP4 |
| 首页 LCP 相关载荷 | Hero AVIF 已优化 | 视频不进首屏关键路径 |
| 单条背景视频 | 4–6 MB | **≤ 1.5 MB**（720p H.264）或提供 WebM |

---

## 3. 分阶段执行计划

### 阶段 A — 立即清理（0.5 天，无画质风险）

**目的**：减掉不参与部署的冗余，立刻缩小仓库与构建拷贝量。

1. **移出母带视频**
   - 将 `*.orig.mp4` 移到 `assets-source/`（或本地网盘），**不要放在 `public/`**
   - `.gitignore` 增加：`public/**/*.orig.mp4`、`assets-source/`
   - 预计节省：**~218 MB 仓库体积**

2. **确认构建剔除逻辑**
   - `post-build-cleanup.mjs` 已在 dist 删除 `.orig.mp4`；源文件仍应从 `public` 移除以免 `wrangler`/同步拷贝浪费

3. **GIF 替换**
   - `地球-GIF.gif` → `地球.webp`（animated webp）或短 MP4 + `poster`
   - 更新引用后删除 GIF

**验收**：`du -sh public/wp-content/uploads` < 200 MB；`git push` 后 Cloudflare 构建日志无 `.orig.mp4`。

---

### 阶段 B — 图片统一与二次压缩（2–3 天）

#### B1. 补齐 WebP 覆盖

```bash
# 需本机安装：brew install webp
npm run optimize:images
```

- 对 **尚无 webp** 的 png/jpg 全部生成（当前脚本已支持）
- 对体积 > 500 KB 的 webp **强制重生成**（需扩展脚本加 `--force` 或删旧 webp 再跑）

#### B2. 关键路径转 AVIF（Hero / 产品主图）

新增脚本建议：`scripts/optimize-images-avif.mjs`

- 工具：`avifenc`（`brew install libavif`）或 `sharp`（Node 统一管道）
- 规则：
  - 宽度 > 1200px 的 banner / 产品主图 → AVIF q=50–55
  - 保留 webp 作 fallback（`<picture>` 或 Astro `srcset`）
- 优先目录：
  - `2024/11/*banner*`（首页轮播，**已部分 avif**）
  - `src/data/product-catalog.ts` 产品缩略图
  - `src/data/homepage.ts` 区块图

#### B3. 代码引用审计

1. 全局搜索 `src/`、`content/` 中 `.png`、`.jpg`、`.jpeg`
2. 凡 `public` 下已有 `.webp` / `.avif` 的，改为现代格式
3. `srcset` 统一模式：

```html
<picture>
  <source type="image/avif" srcset="…avif" />
  <source type="image/webp" srcset="…webp" />
  <img src="…webp" alt="" loading="lazy" />
</picture>
```

#### B4. 部署侧剔除（已有，保持）

- 构建后删除 dist 中带 webp 的 png/jpg（`post-build-cleanup.mjs`）
- **可选增强**：有 avif 时 dist 也删对应 webp（需评估浏览器 fallback）

**验收**：Lighthouse「避免过大网络载荷」中图片项下降；`dist/client/wp-content` 无 png/jpg（除无替代文件）。

---

### 阶段 C — 视频压缩（2–4 天）

#### C1. 转码标准（建议）

| 场景 | 分辨率 | 编码 | 目标码率 | 目标体积 |
|------|--------|------|----------|----------|
| 首页 / 产品背景循环 | 1280×720 | H.264 `crf 28` | — | ≤ 1.5 MB |
| 产品弹窗短视频 | 1280×720 | H.264 `crf 26` | — | ≤ 2 MB |
| 可选增强 | 同上 | VP9 WebM | 更低码率 | 再减 30–40% |

示例命令（需 `ffmpeg`）：

```bash
ffmpeg -i input.mp4 -an -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart \
  output.mp4
```

`-an`：背景视频通常无声；`-movflags +faststart`：利于流式播放。

#### C2. 按优先级转码队列

| 优先级 | 文件 | 原因 |
|--------|------|------|
| P0 | `SA8000-2023x264-x264-1.mp4` (5.8 MB) | 首页（虽已懒加载，仍占带宽） |
| P0 | `C486-ok-2k.mp4` (5.7 MB) | AT800 背景 |
| P1 | `449_1-2540_x264_x264.mp4` | SA8000 页 |
| P1 | `C485.mp4`、`AGP12000-479-.mp4` | 多产品页复用 |
| P2 | `479-3屏-2.mp4`、`479-详情-4屏.mp4` | 详情内嵌 |

#### C3. 播放策略（与压缩配合）

- ✅ 首页：已实现 `preload="none"` + `IntersectionObserver`
- 产品页背景视频：同样改为 **进入视口才加载**（`ProductShell` / 背景 video 组件）
- 提供 **`poster` 静态图**（webp/avif 一帧），避免空白

#### C4. 可选：双格式

```html
<video preload="none" poster="…webp">
  <source src="…webm" type="video/webm" />
  <source src="…mp4" type="video/mp4" />
</video>
```

Safari 用 MP4，Chrome/Firefox 优先 WebM。

**验收**：PageSpeed 网络载荷中视频单项 < 2 MB；产品页 TTI 不受未可见视频影响。

---

### 阶段 D — 自动化与 CI（1 天）

1. **新增 npm scripts**

```json
"optimize:images": "node scripts/optimize-images.mjs",
"optimize:images:avif": "node scripts/optimize-images-avif.mjs",
"optimize:videos": "node scripts/optimize-videos.mjs",
"audit:media": "node scripts/audit-media.mjs"
```

2. **`audit-media.mjs` 输出**
   - 大于 1 MB 的文件列表
   - 无 webp 的 png/jpg
   - `public` 中的 `.orig.*`、`.gif`
   - `src/data` 仍指向 png/jpg 的条目

3. **CI / 构建前检查（可选）**
   - PR 中若新增 `public/**/*.mp4` > 3 MB → 警告
   - 禁止提交 `*.orig.mp4`

4. **Cloudflare**
   - 对 `/wp-content/uploads/**` 开启 **Brotli/Gzip**（默认已有）
   - 缓存规则：`Cache-Control: public, max-age=31536000, immutable`（带 hash 或稳定路径）

---

## 4. 推荐执行顺序（总览）

```
A 清理母带 + GIF          → 立刻 -220 MB 仓库
B1 补齐 WebP              → 构建剔除 PNG/JPG
B3 改 src 引用为 webp     → 避免运行时 404
B2 关键图 AVIF            → LCP / 产品列表
C  视频 ffmpeg 转码       → PageSpeed 载荷
C3 产品页视频懒加载       → 交互性能
D  audit 脚本 + CI        → 防止回退
```

---

## 5. 预期收益（估算）

| 动作 | 部署体积节省 | 首屏影响 |
|------|--------------|----------|
| 移除 `.orig.mp4` 源文件 | ~218 MB（仓库） | 无 |
| dist 剔除 png/jpg | ~80–100 MB | 略快 |
| 7 条 MP4 转码至 ≤1.5 MB | ~25–35 MB | 显著 |
| GIF → WebP/MP4 | ~5 MB | 中等 |
| Hero 全面 AVIF | ~1–2 MB | LCP 小幅提升 |

**合计**：生产静态资源可从当前水平再降 **约 30–40%**（不含已删除母带）。

---

## 6. 依赖安装（开发机）

```bash
brew install webp libavif ffmpeg
# 或 Node 方案：
npm i -D sharp
```

---

## 7. 风险与注意

1. **转码后目视验收**：产品页背景、Hero 需在 Retina 屏抽查。
2. **路径替换**：改 `src/data/*.ts` 后需全站点击回归产品页与首页。
3. **不要删 `public` 原图直到**：webp/avif 引用全部改完且 staging 验证通过；原图可归档到 `assets-source/`。
4. **中文字文件名 MP4**：ffmpeg 转码时注意引号与 UTF-8 路径。

---

## 8. 下一步（建议立刻开工）

- [x] 阶段 A：删除/迁出 `public` 下 2 个 `.orig.mp4`，提交 `.gitignore`
- [x] 阶段 A：`地球-GIF.gif` → `地球.mp4` + poster，`npm run audit:media`
- [x] 阶段 B：`optimize:images:force` + `optimize:images:avif` + `optimize:refs`（74 文件 / 416+ 引用）
- [x] 阶段 B：`post-build-cleanup.mjs` 修复 `dist/client/wp-content` 路径
- [x] `scripts/audit-media.mjs` + `npm run optimize:media`
- [x] 阶段 C：MP4 压缩 + WebM 背景轨、`BackgroundVideo` 懒加载、`prune:media` 清理无引用资源（uploads **207→34 MB**）
