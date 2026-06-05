# ANTBAR Web Agent Direction

本文是 `antbarweb` 项目后续 agent 执行任务的唯一主方向文档。

如果其它文档与本文冲突，以本文为准。

---

## 1. 当前真实状态

`antbarweb` 现在不是从零重构项目，也不是继续从 mirror 里抽产品页的阶段。

当前真实状态：

1. 产品详情页已经完成去 mirror 化。
2. 产品页需要的 CSS 和 JS 已经合并到项目中。
3. 产品详情页不是当前重构重点。
4. Blog 和 Review 的正文内容已经清洗成 Markdown。
5. 当前主要问题集中在：
   - 合规验证弹窗重复或不统一
   - Header / Footer / Navigation 不统一
   - 部分简单页面仍直接依赖 mirror CSS
   - Blog / Review 详情页需要统一模板
   - About / Brand Story / R&D / Lab 等品牌页需要 section 化
   - 产品页已有 CSS / JS 需要保护，不能被 purge 或重构破坏

后续 agent 不要再把产品页当成“还没去 mirror 化”的任务处理。

---

## 2. 总体目标

本项目目标是：

```text
保持现有视觉和 URL 稳定
统一全站壳层
统一合规验证弹窗
统一 Blog / Review 模板
清理简单页和列表页的 mirror CSS 依赖
逐步 section 化品牌页
保护已经完成的产品详情页 CSS / JS
保证 Cloudflare Astro 构建稳定
````

不是：

```text
重新设计网站
重写所有产品详情页
把所有产品页强行改成统一 ProductLayout
删除所有历史 CSS
强行追求完全没有 set:html
重新从 mirror 抽产品页
```

---

## 3. 最高优先级规则

### 3.1 不要动产品详情页主体结构

产品详情页已经去 mirror 化，后续只允许做稳定性维护。

允许做：

1. 修复资源路径。
2. 修复构建错误。
3. 修复 CSS / JS 引入顺序。
4. 修复响应式异常。
5. 修复视频、图片、字体路径。
6. 修复合规验证弹窗重复。
7. 修复 header / footer / navigation 接入问题。
8. 给 purge 增加保护规则。
9. 检查 canonical、sitemap、SEO 基础字段。

禁止做：

1. 不要重新从 mirror 抽产品页。
2. 不要强行统一产品页布局。
3. 不要重写产品页视觉结构。
4. 不要删除产品页专用 CSS。
5. 不要删除产品页专用 JS。
6. 不要让 purge 自动清理产品页 selector。
7. 不要为了“干净”破坏已有产品页效果。

---

## 4. 合规验证弹窗规则

合规验证弹窗必须全站统一。

常见问题：

1. 首页弹出一套。
2. 子页面弹出另一套。
3. 产品页还有历史弹窗逻辑。
4. Blog / Review 页面又初始化一套。
5. 弹窗状态 key 不统一。
6. 页面跳转后重复弹窗。
7. 移动端和桌面端行为不一致。

处理规则：

1. 全站只允许一个验证弹窗入口。
2. 所有页面使用同一个状态 key。
3. 首页、产品页、Blog、Review、列表页不得各自初始化一套。
4. 如果旧脚本里还有重复初始化，必须禁用重复实例。
5. 不允许绕过验证流程。
6. 不允许为了页面展示方便关闭验证逻辑。
7. 任何修改必须同时检查：

   * 首页
   * 一个产品详情页
   * Blog 列表页
   * Blog 详情页
   * 移动端菜单场景

建议文件位置：

```text
src/components/site/
src/layouts/
src/scripts/
src/data/
```

具体文件以当前项目实际结构为准。

---

## 5. Header / Footer / Navigation 规则

Header / Footer / Navigation 必须统一。

常见问题：

1. 首页一套导航。
2. 子页面一套导航。
3. 产品页吃旧导航。
4. 移动端菜单和桌面端数据不一致。
5. Footer contact 信息分散在多个页面。
6. Mega menu 在不同页面表现不一致。

处理规则：

1. 导航数据必须统一来自 `src/data/site-navigation.ts` 或同类 data 文件。
2. Footer 联系方式必须统一来自 `src/data/footer-contact.ts` 或同类 data 文件。
3. 页面里不要手写 header / footer HTML。
4. 产品详情页也应使用统一外壳。
5. Mega menu 的 CSS / JS 只能保留一套。
6. 移动端和桌面端必须共用同一份导航数据。
7. 修改导航后必须检查：

   * 首页
   * 产品详情页
   * Blog 列表页
   * Review 列表页
   * Contact 页面
   * 移动端菜单

---

## 6. 页面分级策略

### A 级：站点壳层，最高优先级

包括：

```text
Header
Footer
Navigation
Mega Menu
Mobile Menu
合规验证弹窗
Search Popup
基础 Layout
```

目标：

```text
全站统一
不重复初始化
不依赖每页单独复制
不因为某个页面旧代码导致壳层不一致
```

---

### B 级：简单页和列表页，优先处理

包括：

```text
/blog/
/review/
/all-products/
/disposable/
/pod-sys/
/contact/
/support/
/verification/
```

目标：

1. 页面结构进入 Astro。
2. 列表数据来自 `src/content` 或 `src/data`。
3. 卡片组件统一。
4. 不再整页依赖 mirror CSS。
5. 只保留必要公共 CSS。
6. 不要为了快速完成复制整页 HTML。

这些页面相对简单，应该优先清理。

---

### C 级：Blog / Review 详情页，模板化处理

当前状态：

```text
Blog / Review 内容已经清洗成 Markdown
```

目标：

1. 使用统一文章模板。
2. Markdown 作为正文来源。
3. 保留 title、description、date、author、cover、slug、canonical。
4. 支持基础文章样式。
5. 支持相关推荐或返回列表。
6. 不要重新回到 mirror HTML。
7. 不要逐篇写单独页面。

建议结构：

```text
src/content/blog/*.md
src/content/review/*.md
src/layouts/ArticleLayout.astro
src/pages/blog/[slug].astro
src/pages/review/[slug].astro
```

---

### D 级：品牌页，中等复杂度，逐步 section 化

包括：

```text
/
/about-us/
/brand-story/
/rd-center/
/antbar-lab/
/intelligent-manufacturing/
```

目标：

1. 每页拆成 3 到 8 个 section。
2. 先保持现有视觉和顺序。
3. 再抽公共组件。
4. 不要一次性重写所有品牌页。
5. 不要盲目删除原样式。
6. 不要把整页塞进一个 `ContentBody` 里。
7. 可以短期保留少量经过清理的 HTML section，但必须标记清楚。

建议组件：

```text
HeroSection
ImageTextSection
FeatureGrid
StatsSection
TimelineSection
FactorySection
CTASection
FAQSection
```

---

### E 级：产品详情页，只做保护和回归

当前状态：

```text
产品详情页已经去 mirror 化
产品页 CSS / JS 已合并到项目
```

目标：

1. 保持现有视觉不变。
2. 保持现有响应式不变。
3. 保持产品页 CSS / JS bundle 稳定。
4. 防止 purge 删除产品页样式。
5. 防止弹窗重复。
6. 防止导航不统一。
7. 防止资源路径失效。
8. 防止构建输出缺文件。

不做：

```text
不重新抽产品页
不重写产品页
不统一 ProductLayout
不删除产品页 CSS
不删除产品页 JS
不改变产品页视觉
```

---

## 7. CSS / JS 管理规则

### 7.1 CSS

允许：

1. 合并公共 CSS。
2. 为简单页减少 mirror CSS 依赖。
3. 为产品页保留专用 CSS。
4. 为 purge 增加 safelist。
5. 把明显重复、无引用、无效的 CSS 清理掉。

禁止：

1. 盲目删除产品页 CSS。
2. 盲目删除 Elementor 遗留 class。
3. 用全局 CSS 覆盖产品页特殊样式。
4. 只检查首页，不检查产品页。
5. purge 后不做页面回归。

每次 CSS 修改后至少检查：

```text
首页
一个产品详情页
Blog 列表页
Blog 详情页
Contact 或 Support
移动端导航
验证弹窗
```

### 7.2 JS

允许：

1. 合并公共 JS。
2. 去除重复初始化。
3. 统一验证弹窗逻辑。
4. 统一 search popup。
5. 保留产品页必要 JS。
6. 删除确认无引用的历史脚本。

禁止：

1. 删除产品页必要 JS。
2. 重复初始化弹窗。
3. 重复绑定移动端菜单。
4. 引入多套搜索弹窗。
5. 为一个页面写一套独立全局脚本。

---

## 8. 推荐执行顺序

### Phase 1：统一站点壳层

处理：

```text
Header
Footer
Navigation
Mega Menu
Mobile Menu
验证弹窗
Search Popup
BaseLayout
```

完成标准：

1. 全站 header / footer 一致。
2. 移动端和桌面端导航一致。
3. 验证弹窗只剩一套。
4. Search popup 只剩一套。
5. 首页和子页面不再使用不同壳层。

---

### Phase 2：处理简单页和列表页

处理：

```text
/blog/
/review/
/all-products/
/disposable/
/pod-sys/
/contact/
/support/
/verification/
```

完成标准：

1. 列表数据来自内容集合或 data。
2. 页面不再整页依赖 mirror body。
3. 简单页不再随意引用大量 mirror CSS。
4. 卡片组件统一。
5. 构建通过。

---

### Phase 3：处理 Blog / Review 详情页

处理：

```text
src/content/blog/*.md
src/content/review/*.md
文章详情模板
```

完成标准：

1. Markdown 正常渲染。
2. slug 不变。
3. SEO 字段不丢。
4. 封面图正常。
5. 内链正常。
6. 不再回退到 mirror HTML。

---

### Phase 4：处理品牌页

处理：

```text
/
/about-us/
/brand-story/
/rd-center/
/antbar-lab/
/intelligent-manufacturing/
```

完成标准：

1. 每页拆成 section。
2. 视觉顺序基本不变。
3. 样式稳定。
4. 不影响产品详情页。
5. 不影响验证弹窗。
6. 不影响导航。

---

### Phase 5：产品页回归和保护

处理：

```text
产品详情页 CSS
产品详情页 JS
资源路径
视频路径
图片路径
字体路径
purge safelist
构建输出
```

完成标准：

1. 产品详情页视觉不明显变化。
2. 移动端正常。
3. 弹窗不重复。
4. 导航统一。
5. CSS / JS 没有被误删。
6. 构建通过。

---

## 9. Agent 分工建议

### Agent A：站点壳层

负责：

```text
Header
Footer
Navigation
Mega Menu
Mobile Menu
验证弹窗
Search Popup
BaseLayout
```

禁止：

```text
不要改产品详情页主体
不要改文章正文
不要大范围清理 CSS
```

---

### Agent B：简单页和列表页

负责：

```text
Blog index
Review index
All Products
Disposable index
Pod System index
Contact
Support
Verification
```

禁止：

```text
不要复制整页 mirror HTML
不要为每个页面单独写一套样式
不要改产品详情页
```

---

### Agent C：文章模板

负责：

```text
Blog detail
Review detail
Markdown rendering
Article layout
Article SEO
Related posts
```

禁止：

```text
不要把 Markdown 再塞回 mirror HTML
不要逐篇创建重复模板
不要改产品页 CSS / JS
```

---

### Agent D：品牌页 section 化

负责：

```text
Home
About
Brand Story
R&D Center
ANTBAR Lab
Intelligent Manufacturing
```

禁止：

```text
不要一次性重写所有页面
不要盲删 CSS
不要影响导航和弹窗
```

---

### Agent E：产品页保护

负责：

```text
产品页 CSS / JS bundle
purge safelist
资源路径
构建输出
响应式回归
弹窗去重
```

禁止：

```text
不要重写产品详情页
不要重新从 mirror 抽产品页
不要改产品页视觉结构
不要删除产品页专用 CSS / JS
```

---

## 10. 每次任务完成后必须汇报

每个 agent 完成任务后必须说明：

1. 改了哪些页面族。
2. 改了哪些文件。
3. 是否影响 Header / Footer / Navigation。
4. 是否影响验证弹窗。
5. 是否影响产品详情页。
6. 是否新增或删除 CSS / JS。
7. 是否修改 purge 或 safelist。
8. 是否跑过 build。
9. 哪些页面仍有遗留问题。
10. 下一步建议处理哪个页面族。

---

## 11. 旧文档处理规则

如果看到以下旧文档：

```text
docs/DE-MIRROR-INVENTORY.md
docs/STATIC-TO-ASTRO-PLAN.md
docs/AGENT-STRUCTURING-RULES.md
docs/ASTRO-MIGRATION-ISSUES.md
docs/ELEMENTOR-MIRROR-LOCAL.md
```

这些文档只能作为历史参考，不能作为当前执行方向。

建议在旧文档顶部加：

```markdown
> Historical note: this document is archived. Current canonical direction is docs/AGENT-DIRECTION.md.
```

README 中只保留指向：

```text
docs/AGENT-DIRECTION.md
```

---

## 12. 最终判断标准

本项目阶段性成功标准：

1. 全站 Header / Footer / Navigation 统一。
2. 验证弹窗统一且不重复。
3. Blog / Review 列表页结构清晰。
4. Blog / Review 详情页使用 Markdown 模板。
5. Contact / Support / Verification 简单页清理完成。
6. 品牌页逐步 section 化。
7. 产品详情页保持稳定，不被破坏。
8. CSS / JS bundle 管理清楚。
9. purge 不误删关键样式。
10. Cloudflare Astro 构建稳定。

README 里可以改成：


## Agent Direction

For all future agent work, use this document as the canonical direction:

- [docs/AGENT-DIRECTION.md](docs/AGENT-DIRECTION.md)


