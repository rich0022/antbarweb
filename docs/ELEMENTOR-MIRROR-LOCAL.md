# WordPress + Elementor 镜像到本地（高保真阶段）

本文说明本仓库**当前阶段**如何把 `antbar.com`（WordPress + Elementor）在本地做到与线上一致。  
此阶段目标不是「纯 Astro 组件化」，而是：**可维护的 Astro 壳 + 镜像 HTML/静态资源**，便于先验收，再按 [STATIC-TO-ASTRO-PLAN.md](./STATIC-TO-ASTRO-PLAN.md) 逐步内容化。

---

## 架构一览

```text
mirror/              # 从线上抓取的整页 HTML（不直接当静态站根目录暴露）
  index.html
  disposable/index.html
  blog/…/index.html

public/              # 仅静态资源（不会被 Astro 路由「盖住」）
  wp-content/
  wp-includes/
  fonts/ images/ …

src/content/         # 从 mirror 抽出的 Markdown（正文仍是 mirror-html 块）
src/pages/           # Astro 路由：读 content + mirror 的 head/脚本
src/layouts/         # BaseLayout：注入样式、脚本、本地化链接
src/lib/
  mirror-assets.ts   # 解析 mirror HTML 的 CSS/JS
  mirror-urls.ts     # antbar.com → 根路径、过滤 RUM 等
  content-entry.ts   # Astro 6 entry.id ↔ 磁盘 md 路径
  route-aliases.ts   # 线上错别字 URL、跨栏目产品别名
```

**本地预览**：`npm run dev` → `http://localhost:4321/`  
Astro 负责拼页面；**不要**把 `mirror/**/index.html` 放回 `public/`，否则 dev 会直接出裸 HTML，丢失布局和脚本注入。

---

## 推荐工作流（新同事 / 换机器）

```bash
npm install

# 1) 若 mirror/ 不全：从线上补页面（见下文脚本）
npm run fetch:missing-blog
npm run fetch:missing-review

# 2) 补静态资源（Elementor 分包、post-*.css、图片、字体）
npm run sync:mirror-assets

# 3) 把 mirror HTML 里的绝对域名改成本地路径（补抓后建议再跑）
npm run normalize:mirror-html

# 3b) 导航/页脚与 mirror 对齐（改了首页 header 或 mega-menu 时）
npm run generate:site-shell

# 4) 可选：从 mirror 重新生成 src/content（大规模改版时用）
npm run extract:content

# 5) 本地看效果
npm run dev
npm run build    # 构建前自检
```

线上内容有更新时，优先：**补 mirror 页 → sync 资源 → normalize → dev 验收**；不必每次都 `extract:content`。

---

## 页面是怎么渲染的

1. **站点壳（导航 + 页脚）**：`SiteHeader.astro` / `SiteFooter.astro` 为 **Astro 组件树**（`src/components/site/`，链接数据在 `src/data/site-navigation.ts`），保留 Elementor 的 `data-id` / class 与 `post-49.css`、`post-68.css` 依赖；mega-menu 的 `data-settings` 由 `npm run generate:site-shell` 从 `mirror/index.html` 同步。
2. **正文**：`src/content/**/*.md` 或 mirror 回退 HTML，经 `stripSiteShellFromHtml` + `stripScriptsFromHtml` 去掉重复的 header/footer 与内联脚本，再由 `ContentBody.astro` 输出。
3. **样式 / 脚本**：`mergeMirrorHeadAssets(mirrorRoute)` 合并首页壳资源与当前页 `mirror/<route>/index.html` 的 head/body 脚本（按 `src` 去重），由 `BaseLayout.astro` 注入。
4. **正文里的 `<script>`**：构建前会 `stripScriptsFromHtml` 去掉，避免重复；依赖脚本的交互必须在 **mirror 页脚脚本** 或 **页脚末尾顺序** 里仍能加载（见下文「自定义 HTML 小部件」）。

`mirrorRoute` 由 `resolveMirrorRoute()` + `contentEntryFileName()` 决定，必须与 `mirror/` 下真实路径一致。

**注意**：移动菜单、年龄验证等 Elementor popup 仍留在正文 slot，不要放进 SiteHeader/Footer。

---

## 容易漏掉的点（排错清单）

### 1. `public/` 与 `mirror/` 混放（最常见）

| 现象 | 原因 |
|------|------|
| 页面「空白」或只有纯 HTML、无轮播/计数器 | `public/disposable/index.html` 等盖住了 Astro 路由 |
| 构建日志 `Skipping … because a file exists in public` | 同上 |

**规则**：整页 HTML 只在 `mirror/`；`public/` 只放 `wp-content`、`wp-includes`、字体、图片等。

---

### 2. `mirrorRoute` 多写了 `/index`

磁盘路径是 `mirror/disposable/index.html`，不是 `mirror/disposable/index/index.html`。

若 `resolveMirrorRoute` 得到 `disposable/index`，旧逻辑会读失败并 **回退到首页** 的 CSS/JS，表现为：

- `/disposable/`、`/pod-sys/` **布局错乱、缺样式**
- 缺少 `post-1075.css`、`post-1077.css` 等页面专用 Elementor CSS

**已修复**：`mirrorHtmlPath()` 会自动去掉末尾 `/index`。  
新增栏目时检查：`getMirrorHeadAssets('disposable')` 是否读到正确 html。

---

### 3. 导航仍跳到 `https://antbar.com`

补抓的页面常带绝对域名。需保证三层防护：

1. `npm run normalize:mirror-html`（处理 `mirror/` 内 HTML）
2. 运行时 `normalizeMirrorHtml()`（content + 脚本配置）
3. `BaseLayout` 内点击拦截（兜底）

补抓脚本 `fetch-missing-*.mjs` 保存时已做 normalize。

---

### 4. Elementor **懒加载 JS 分包** 404

计数器、嵌套轮播、视频、表单、弹窗等依赖：

```text
/wp-content/plugins/elementor/assets/js/counter.*.bundle.min.js
/wp-content/plugins/elementor-pro/assets/js/nested-carousel.*.bundle.min.js
/wp-content/plugins/elementor-pro/assets/js/popup.*.bundle.min.js
…
```

镜像整站 HTML **不会**自动带上这些 hash 文件名；缺了就会：

- `/rd-center/` 数字停在 0
- 首页最后一屏轮播无法键盘切换
- blog 表单/弹窗异常

**处理**：`npm run sync:mirror-assets`（`scripts/sync-mirror-assets.mjs` 内置常见 bundle，并扫描 mirror + content 里的 URL）。

---

### 5. Elementor **post-{id}.css** 404

每页 `<link href="/wp-content/uploads/elementor/css/post-1075.css">` 等是页面布局关键。

- 不要像早期那样把**全站所有** `post-*.css` 合并进每一页（会 404 且拖慢加载）。
- 当前策略：**当前页 mirror 的 stylesheet** + **首页共享 header/footer 样式** + `filterExistingAssetPaths`（只保留磁盘存在的文件）。

缺文件时对该 `post-XXXX.css` 单独 curl 或加入 `sync:mirror-assets` 的 `REQUIRED_ASSETS`。

---

### 6. 自定义 HTML 小部件里的 jQuery（如 intelligent-manufacturing 01/02/03）

`/intelligent-manufacturing/` 的 `.ha-tabs` / `#haConts` 逻辑在 **Elementor HTML 小部件** 的内联 `<script>` 里，依赖：

- `post-43.css`（`.ha-tab` 样式）
- jQuery（head）
- 脚本在 **Elementor frontend 之后** 执行

若脚本留在正文里会被 strip 掉；需通过 mirror 页脚脚本注入，且 `orderFooterScripts()` 把 `#haConts` 相关脚本排在最后。

---

### 7. 线上 URL 与本地文件路径不一致

| 类型 | 示例 | 处理 |
|------|------|------|
| 嵌套目录 | 镜像在 `mirror/disposable/disposable/antbar-ag600/`，链接为 `/disposable/antbar-ag600/` | `collectDisposableMirrorRoutes()` + `disposableUrlSlugFromEntryId()` |
| 跨栏目 | 产品在 content 里是 `disposable/antbar-3000-6000`，链接为 `/pod-sys/antbar-3000-6000/` | `route-aliases.ts` + `pod-sys/[...slug].astro` |
| Review 错别字 slug | `…reviewpop-vape` | `REVIEW_URL_ALIASES` |
| 根路径误链 | `/antbar-3000-6000/` | `astro.config.mjs` → `redirects` |
| Blog 分页 | `/blog/2/` | `collectBlogMirrorSlugs` **不要**过滤纯数字 slug |

新增内链 404 时：先查 `mirror/` 是否有目录，再决定 **fetch** 还是 **alias**。

---

### 8. 只镜像了部分文章 / 评测

列表页（blog/review index）上的卡片链接可能指向**未抓取**的 slug。

```bash
npm run fetch:missing-blog    # 从 mirror/blog/index.html 解析链接补抓
npm run fetch:missing-review  # 内置 KT800、SA8000 pop-vape 等必需 slug
```

抓取后执行 `normalize:mirror-html`，并确认 `blog/[...slug].astro` / `review/[slug].astro` 的 mirror 回退路由能扫到新目录。

---

### 9. Astro 6 Content Layer 的 `entry.id`

frontmatter 里 `slug: "blog/xxx"` 时，`entry.id` 可能是 **`blog/xxx`** 而不是文件名。

- 读 md 必须用 `contentEntryFileName(entry.id, collection)`。
- 索引页：`entry.id === 'disposable'` 且 `slug === 'disposable'` 都要识别（对应 `disposable/index.md`）。

详见 `src/lib/content-entry.ts`。

---

### 10. 无害 404（可忽略）

- `POST /.cloud/rum/otel-rum-collector`：Cloudflare RUM，已在 `shouldSkipMirrorScript` 过滤脚本；POST 仍可能出现在 dev 日志。
- `cdn-cgi/`、部分 `.cloud/` 模块：本地无对应服务。

---

## 脚本说明

| 命令 | 作用 |
|------|------|
| `npm run fetch:missing-blog` | 从 `https://antbar.com` 补抓 blog 列表里缺失的文章到 `mirror/blog/<slug>/` |
| `npm run fetch:missing-review` | 补抓 review 缺失页（含列表中的特殊 slug） |
| `npm run sync:mirror-assets` | 按 mirror + content 扫描，下载缺失的 `wp-content` / `wp-includes` 资源 |
| `npm run normalize:mirror-html` | 将 `mirror/` 内 `https://antbar.com` 改为根路径（脚本文件名为 historical，实际目录是 `mirror/`） |
| `npm run extract:content` | 批量把 `mirror/**/index.html` 抽成 `src/content/**/*.md` |
| `npm run dev` | 本地开发（Astro 路由 + 资源注入） |
| `npm run build` | 静态构建自检 |
| `npm run build:cf` | 构建并处理超大视频（见 [CLOUDFLARE-R2-DEPLOY.md](./CLOUDFLARE-R2-DEPLOY.md)） |

初始全站抓取若使用 `scripts/scrape.mjs`，新页面建议统一写入 **`mirror/`**，不要写回 `public/` 根下的 `index.html` 树。

---

## 本地验收清单

在宣布「与线上一致」前，建议逐项打开：

- [ ] 首页：最后一屏多图轮播，键盘左右键可切换
- [ ] `/intelligent-manufacturing/`：左侧 01 / 02 / 03 随滚动高亮
- [ ] `/rd-center/`：底部计数器滚到目标数字（非一直 0）
- [ ] `/disposable/`、`/pod-sys/`：版式与线上一致（非「无样式」）
- [ ] 任意产品页、blog、review：内链留在 `localhost`，无跳转到 antbar.com
- [ ] `/blog/2/` 分页可开
- [ ] `/pod-sys/antbar-3000-6000/`、(`/disposable/antbar-ag600/`) 可开
- [ ] 浏览器 Network：无大量红色 `post-*.css`、`*bundle.min.js`（允许少量 RUM）

终端里偶发 `POST /.cloud/rum` 可忽略。

---

## 与「纯 Astro 化」的边界

当前阶段**刻意保留**：

- 正文大块 HTML（`mirror-html-content`）
- Elementor 前端运行时（jQuery + webpack 分包）
- WordPress 媒体路径 `/wp-content/uploads/…`

下一阶段（见 [STATIC-TO-ASTRO-PLAN.md](./STATIC-TO-ASTRO-PLAN.md)）才逐步：

- 拆 Section 组件
- 用 MDX/结构化 frontmatter 替代 HTML 块
- 削减 Elementor 运行时依赖

在迁移完成前，**不要**删除 `mirror/` 或 `sync:mirror-assets` 流程；它们是线上对齐的「源真相」之一。

---

## 关键源码索引

| 文件 | 职责 |
|------|------|
| `src/lib/mirror-assets.ts` | 读 mirror HTML、合并样式/脚本、收集各栏目 mirror 路径 |
| `src/lib/mirror-urls.ts` | URL 本地化、跳过 RUM/Cloudflare 脚本 |
| `src/lib/content-body.ts` | 读 md 正文并 strip script |
| `src/lib/content-entry.ts` | Astro 6 `entry.id` → 文件路径 |
| `src/lib/route-aliases.ts` | Review/跨栏目 URL 别名 |
| `src/layouts/BaseLayout.astro` | 注入 CSS/JS、本地链接兜底 |
| `src/pages/blog/[...slug].astro` | blog 内容 + mirror 双路径 |
| `src/pages/review/[slug].astro` | review 内容 + mirror + 别名 |
| `src/pages/disposable/[...slug].astro` | 产品 mirror 路径映射 |
| `src/pages/pod-sys/[...slug].astro` | pod-sys + disposable 别名 |

---

## 常见问题速查

**Q: 样式少了，但 HTML 都在？**  
A: 先看 Network 是否 404 `post-XXXX.css` 或 Elementor `*.bundle.min.js`；再确认 `mirrorRoute` 是否误指向首页（§2）。

**Q: 交互没了，静态内容还在？**  
A: 查该页 mirror 里是否有内联 `<script>`（HTML 小部件）；是否已在页脚脚本列表；是否依赖缺失的 bundle。

**Q: 构建成功但 dev 和线上不一样？**  
A: 查 `public/` 是否又出现与路由同名的 `index.html`（§1）。

**Q: 要不要用 WordPress REST API？**  
A: 本阶段**不必**。REST 适合拉文章字段做结构化迁移；Elementor 布局、分包 JS、post CSS 仍要靠 **HTML 镜像 + 静态资源同步**。API 可在 Astro 化时再接。

---

*文档版本：与仓库「高保真镜像已完成、待 Astro 组件化」状态一致。*
