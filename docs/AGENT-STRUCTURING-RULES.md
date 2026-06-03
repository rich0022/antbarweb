# 1:1 Mirror 结构化规则

本文是给后续协作 agent 的硬约束，不是建议。

目标只有一个：

**把当前 mirror 的页面 1:1 结构化进 Astro，而不是继续把 mirror HTML 当成最终实现。**

---

## 一、什么叫允许，什么叫不允许

### 允许

1. 用 mirror 页面作为唯一视觉和内容基线
2. 把 header、footer、breadcrumb、hero、spec table、icon list、tab、CTA、article meta 等拆成 Astro 组件
3. 把导航、页脚、社媒、联系信息、产品卡片、文章卡片等提成 `src/data/*` 的结构化数据
4. 把页面正文拆成 section schema 或内容集合
5. 在迁移过渡期，局部保留少量 `set:html`，但只能用于：
   - 富文本正文块
   - 短 HTML 联系信息
   - 经过明确标注的过渡区域

### 不允许

1. 直接把 `mirror/**/*.html` 或 `public/**/*.html` 当页面最终实现
2. 直接把整段 header/footer HTML 粘进 Astro 页面
3. 为了省事新增一堆一页一个样式的 Astro 页面壳，但内部仍是整页 `set:html`
4. 没有抽象 section/type，就只改类名、包一层 div，伪装成“结构化”
5. 擅自改路由、改标题、改可见文案、改模块顺序
6. 在没有对照 mirror 的情况下“按理解重写”

---

## 二、推荐迁移粒度

结构化顺序必须从外到内，不要反过来。

默认优先级：

1. 首页
2. 站点壳层
3. 列表页
4. 详情页

原因很简单：详情页差异最大，不适合拿来当整站结构基线。

### 第 1 层：站点壳

先结构化：

- warning bar
- header
- mega menu
- footer
- mobile footer accordion
- copyright

这一层必须彻底摆脱整页 mirror HTML 复用。

### 第 2 层：列表页骨架

再结构化：

- blog index
- review index
- disposable index
- pod-sys index
- all-products

这一层至少要做到：

- 真实卡片列表
- 真实列表数据
- 真实分页/分组结构

### 第 3 层：详情页 section

最后结构化：

- hero
- gallery/media
- specification table
- feature block
- FAQ
- article body

一页里可以暂时混合：

- 结构化 section
- 未拆完的正文 HTML

但不能整个页面还是原始 mirror。

---

## 三、每个 agent 提交前必须回答的 7 个问题

如果有一个答不上来，就不算完成。

1. 这个页面/模块现在有哪些部分已经不依赖整页 mirror HTML？
2. 这个改动提炼出了哪些结构化数据？
3. 这些数据放在哪个 `src/data` 或 `src/content` 文件里？
4. 这个模块和 mirror 对齐的是哪一个页面或哪几个页面？
5. 这个改动是否改变了 URL、可见文案、顺序、图片来源？
6. 这个页面现在还剩哪些区域没有结构化？
7. 如果下一个 agent 接手，他应该改哪个文件而不是回去改 mirror HTML？

---

## 四、必须遵守的数据落点

### 全站共用数据

- `src/data/site-navigation.ts`
- `src/data/footer-contact.ts`
- `src/data/mega-menu-settings.ts`

### 页面内容

- `src/content/pages/*`
- `src/content/blog/*`
- `src/content/review/*`
- `src/content/products/*`

### 组件层

- `src/components/site/*`
- `src/components/sections/*`
- `src/layouts/*`

---

## 五、对 mirror 的正确使用方式

mirror 是基线，不是最终页面代码。

### 正确用法

1. 看结构
2. 抄顺序
3. 抽数据
4. 抽 section
5. 对照 class / data-id / 文案 / 图片

### 错误用法

1. 复制整段 HTML 到 Astro
2. 用 `set:html` 包住整个 header/footer
3. 页面 build 通过就算完成

---

## 六、完成定义

一个模块只有同时满足下面条件，才算“已结构化”：

1. 不依赖整段 mirror HTML
2. 数据有明确 schema 或类型
3. 组件可以在多个页面复用
4. 可见结构和 mirror 对齐
5. 资源路径仍与现有站点兼容
6. 下一个 agent 能从 data/component/content 层继续接手

---

## 七、页脚和导航的最低标准

导航和页脚必须做到：

1. 链接数据结构化
2. 移动端和桌面端分别有明确数据映射
3. logo、icon、社媒、联系信息单独落数据
4. 不再依赖整段原始 HTML

参考现有实现：

- [src/data/site-navigation.ts](/Users/smoant/github/antbarweb/src/data/site-navigation.ts)
- [src/data/footer-contact.ts](/Users/smoant/github/antbarweb/src/data/footer-contact.ts)
- [docs/SINGLE-AGENT-TASK-TEMPLATE.md](/Users/smoant/github/antbarweb/docs/SINGLE-AGENT-TASK-TEMPLATE.md)
- [src/components/site/SiteHeader.astro](/Users/smoant/github/antbarweb/src/components/site/SiteHeader.astro)
- [src/components/site/SiteFooter.astro](/Users/smoant/github/antbarweb/src/components/site/SiteFooter.astro)
