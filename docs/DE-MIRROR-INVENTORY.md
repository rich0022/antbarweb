# Antbar 去 Mirror 化总清单

本文回答 3 件事：

1. 现在这个仓库到底还有哪些地方在吃 mirror HTML
2. 如果目标是“完全去 mirror 化”，还剩多少工作
3. 下一轮 agent 应该怎么分工，才不会继续长回 `ContentBody + set:html`

---

## 一、完成标准

这里的“完全去 mirror 化”定义得很严格：

1. 页面主体不再依赖整段 `ContentBody html={...}`
2. header / footer / mega menu / archive list / product detail section 都由 Astro 组件和数据驱动
3. `set:html` 只允许保留在很小的富文本片段里，不允许承担整页结构
4. 页面结构、路由、可见文案、资源地址仍然 1:1 对齐线上

如果只做到“能打开、看起来像”，那不叫完成。

---

## 二、当前项目盘点

### 1. 路由与内容文件

- `src/pages/`：`10` 个路由入口文件
- `src/content/pages/`：`10` 个基础页面内容文件
- `src/content/products/`：`11` 个产品内容文件
- `src/content/blog/`：`21` 个 blog 内容文件
- `src/content/review/`：`5` 个 review 内容文件

### 2. 当前已经结构化的部分

#### A. 站点壳层

已结构化：

- header
- mega menu
- footer
- footer contact
- footer social

基线文件：

- [src/components/site/SiteHeader.astro](/Users/smoant/github/antbarweb/src/components/site/SiteHeader.astro)
- [src/components/site/SiteFooter.astro](/Users/smoant/github/antbarweb/src/components/site/SiteFooter.astro)
- [src/data/site-navigation.ts](/Users/smoant/github/antbarweb/src/data/site-navigation.ts)
- [src/data/footer-contact.ts](/Users/smoant/github/antbarweb/src/data/footer-contact.ts)

状态判断：

- 完成度：`80% - 90%`
- 剩余主要是交互细节、样式咬合、少量 popup/search 行为

#### B. 列表页卡片区

已结构化：

- `/blog/`
- `/review/`
- `/all-products/`
- `/disposable/`
- `/pod-sys/`

基线文件：

- [src/lib/archive-widget.ts](/Users/smoant/github/antbarweb/src/lib/archive-widget.ts)
- [src/components/archive/PostsWidget.astro](/Users/smoant/github/antbarweb/src/components/archive/PostsWidget.astro)

状态判断：

- 完成度：`70% - 80%`
- 当前已经摆脱整段列表卡片 HTML
- 周围页面正文仍有 mirror 残留

#### C. 产品详情

这里需要明确一个约束：

- 产品详情页之间布局差异很大
- 不能先假设它们共享一个稳定 hero 或共享一个稳定正文骨架
- 正确顺序是先逐页结构化，再回看哪些 section 真正重复

状态判断：

- 完成度：`0% - 10%`
- 目前仍应视为“逐页结构化待开始”

---

## 三、还有哪些地方仍在依赖 mirror

### 1. 基础页面

这些页面主体仍然主要靠 mirror body：

- `/`
- `/about-us/`
- `/brand-story/`
- `/rd-center/`
- `/antbar-lab/`
- `/intelligent-manufacturing/`
- `/contact/`
- `/support/`
- `/verification/`

对应内容文件：

- [src/content/pages/home.md](/Users/smoant/github/antbarweb/src/content/pages/home.md)
- [src/content/pages/about-us.md](/Users/smoant/github/antbarweb/src/content/pages/about-us.md)
- [src/content/pages/brand-story.md](/Users/smoant/github/antbarweb/src/content/pages/brand-story.md)
- [src/content/pages/rd-center.md](/Users/smoant/github/antbarweb/src/content/pages/rd-center.md)
- [src/content/pages/antbar-lab.md](/Users/smoant/github/antbarweb/src/content/pages/antbar-lab.md)
- [src/content/pages/intelligent-manufacturing.md](/Users/smoant/github/antbarweb/src/content/pages/intelligent-manufacturing.md)
- [src/content/pages/contact.md](/Users/smoant/github/antbarweb/src/content/pages/contact.md)
- [src/content/pages/support.md](/Users/smoant/github/antbarweb/src/content/pages/support.md)
- [src/content/pages/verification.md](/Users/smoant/github/antbarweb/src/content/pages/verification.md)

### 2. 产品详情页

以下详情页主体仍然大量依赖 mirror，而且必须按单页处理，不应先用统一布局假设去套：

- `AGP12000`
- `KT800`
- `AT800`
- `AG600`
- `ROCKET`
- `SA8000`
- `AHP10000`
- `ATB600`
- `DAH6000 / antbar-3000-6000`

对应内容文件：

- [src/content/products/disposable/agp12000-nicotine-disposable-vape.md](/Users/smoant/github/antbarweb/src/content/products/disposable/agp12000-nicotine-disposable-vape.md)
- [src/content/products/disposable/antbar-kt800.md](/Users/smoant/github/antbarweb/src/content/products/disposable/antbar-kt800.md)
- [src/content/products/disposable/at800-puffs-disposable-vape.md](/Users/smoant/github/antbarweb/src/content/products/disposable/at800-puffs-disposable-vape.md)
- [src/content/products/disposable/disposable/antbar-ag600.md](/Users/smoant/github/antbarweb/src/content/products/disposable/disposable/antbar-ag600.md)
- [src/content/products/disposable/antbar-rocket.md](/Users/smoant/github/antbarweb/src/content/products/disposable/antbar-rocket.md)
- [src/content/products/disposable/antbar-sa8000.md](/Users/smoant/github/antbarweb/src/content/products/disposable/antbar-sa8000.md)
- [src/content/products/disposable/v10000-puffs-disposable-vape.md](/Users/smoant/github/antbarweb/src/content/products/disposable/v10000-puffs-disposable-vape.md)
- [src/content/products/disposable/antbar-atb600.md](/Users/smoant/github/antbarweb/src/content/products/disposable/antbar-atb600.md)
- [src/content/products/disposable/antbar-3000-6000.md](/Users/smoant/github/antbarweb/src/content/products/disposable/antbar-3000-6000.md)

### 3. Blog 详情页

以下 `20` 个 blog 详情页主体还没有真正 section 化：

- `src/content/blog/*.md`

当前问题不是路由，而是正文仍主要依赖镜像内容。

### 4. Review 详情页

以下 `4` 个 review 详情页主体还没有真正 section 化：

- [src/content/review/2024-best-nicotine-containing-disposable-vapes-antbar-at800.md](/Users/smoant/github/antbarweb/src/content/review/2024-best-nicotine-containing-disposable-vapes-antbar-at800.md)
- [src/content/review/antbar-rocket-disposable-vape-review.md](/Users/smoant/github/antbarweb/src/content/review/antbar-rocket-disposable-vape-review.md)
- [src/content/review/antbar-sa8000-disposable-vape-review.md](/Users/smoant/github/antbarweb/src/content/review/antbar-sa8000-disposable-vape-review.md)
- [src/content/review/disposable-nicotine-vapes-antbar-ag600-reviews.md](/Users/smoant/github/antbarweb/src/content/review/disposable-nicotine-vapes-antbar-ag600-reviews.md)

### 5. Popup / 行为层

仍未真正 Astro 化：

- age verification popup
- search popup
- 产品视频 popup
- 某些 Elementor 前端交互脚本依赖

这些部分如果不处理，页面虽然能显示，但仍然不是完整摆脱 mirror 行为层。

---

## 四、最合理的拆分方式

### Phase 1：把“整页镜像”压缩成“section 镜像”

目标：

- 每个页面先不求完全纯数据
- 先把整页 `ContentBody` 缩成 3 到 8 个 section 组件

建议分工：

1. `home/about/brand/manufacturing` 页面组
2. `contact/support/verification` 页面组
3. `blog detail` 页面组
4. `review detail` 页面组
5. `product detail` 逐页页面组

### Phase 2：只对已经验证重复的区块做组件化

优先做这些公共 section：

1. article hero
2. article rich text
3. FAQ accordion
4. CTA block
5. spec block
6. flavor grid
7. package content

注意：

- `product hero` 不能预设为全产品共享
- 必须在至少 `2` 到 `3` 个产品页真实比对后，才能决定是否抽公共组件

### Phase 3：清理行为层和遗留 popup

最后处理：

1. search popup
2. age gate
3. video modal
4. 少量仍依赖 Elementor JS 的展开/切换行为

---

## 五、剩余工作量评估

### 1. 如果只做“主要页面不再整页 mirror”

范围：

- 基础页面 section 化
- 产品详情主体 section 化
- blog/review 详情页主内容 section 化

工作量判断：

- `中到大`
- 约 `12 - 20` 个清晰 agent 任务

### 2. 如果做“仓库层面基本完成去 mirror 化”

范围：

- 上述全部
- popup / 行为层重建
- 剩余小型富文本块清理
- schema/SEO/结构回归

工作量判断：

- `大`
- 约 `20 - 32` 个 agent 任务

### 3. 如果做“严格意义完全去 mirror 化”

范围：

- 页面主体不再依赖整段镜像
- 交互行为不再依赖 Elementor 页面脚本
- 所有页面改成稳定 Astro 数据与组件结构
- 只保留局部富文本 HTML

工作量判断：

- `很大`
- 约 `28 - 45` 个 agent 任务

这是现实估计，不是保守吓人。因为现在最大的成本不在“写 Astro 文件”，而在：

1. 识别重复结构
2. 维持 1:1 视觉与顺序
3. 防止 agent 偷懒回退成 mirror 回放

---

## 六、建议的优先级

如果目标是尽快逼近完全去 mirror 化，优先级应该是：

1. 产品详情逐页 section 化
2. 基础页面 section 化
3. blog/review 详情正文
4. popup / 行为层
5. SEO / 性能 / 资源治理

原因很简单：

- 产品详情页和基础页面占了最大的镜像体积
- 它们也是最容易被其他 agent 继续偷懒整页回放的地方

---

## 七、下一轮 agent 任务模板

单个 agent 最好只接这种粒度：

1. `AGP12000` 单页结构化
2. `KT800` 单页结构化
3. `SA8000` 单页结构化
4. `AG600 + ROCKET` 这种已确认接近的双页小组
5. `home + about-us + brand-story` 的 section 化
6. `contact + support + verification` 的 section 化
7. `blog detail hero + rich text baseline`
8. `review detail hero + verdict baseline`

不要把任务写成：

- “把产品页都改完”
- “把整个站全 Astro 化”

这种写法几乎必然把 agent 推回 mirror 偷懒路径。

---

## 八、当前判断

按现在仓库状态看：

- shell：已经过了最乱的阶段
- list pages：已经有可复用基线
- detail pages：仍然是最大风险区

如果继续按“基础页面找共性、产品详情先逐页”推进，项目是能收住的。

如果继续在产品详情上先造抽象，再反过来套页面，这个仓库会继续出现结构不对但看似组件化的假进展。
