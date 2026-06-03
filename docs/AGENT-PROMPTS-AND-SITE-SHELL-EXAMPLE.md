# Agent 提示词与导航/页脚范本

本文给两样东西：

1. 可直接发给其他 agent 的提示词
2. 一个可执行的导航/页脚结构化范本

---

## 一、推荐提示词

下面这段可以直接发给其他 agent。

```text
你现在在做 antbarweb 的 1:1 镜像结构化，不是在做新的设计站。

你的唯一基线是当前 mirror / public 中已经对齐线上的网站内容与结构。

硬约束：
1. 不允许直接复用整页 mirror HTML 作为最终 Astro 页面。
2. 不允许把 header、footer、mega-menu 整段 HTML 直接塞进 Astro。
3. 不允许为了省事新增大量只包一层 set:html 的 Astro 页面。
4. 必须优先把页面拆成可复用的组件、数据、content schema。
5. 不允许改 URL、可见文案、模块顺序、图片来源，除非 mirror 本身就是错的。
6. 每次只处理一个明确范围，并说明还有哪些区域仍未结构化。

你应该优先遵守：
- docs/AGENT-STRUCTURING-RULES.md
- docs/STATIC-TO-ASTRO-PLAN.md
- docs/ELEMENTOR-MIRROR-LOCAL.md

你的任务不是“让页面看起来差不多”，而是“让页面在 1:1 前提下逐步摆脱整页 mirror HTML 依赖”。

本次你只负责：<在这里填入当前页面族或模块范围>

交付要求：
1. 先列出你要结构化的模块和数据边界。
2. 优先抽 data / content / section component，不要先写一堆页面壳。
3. 最终说明：
   - 哪些部分已经结构化
   - 哪些部分仍是过渡态
   - 下一位 agent 应该接着改哪些文件
```

---

## 二、导航结构化范本

目标不是把导航“画出来”，而是把 mirror 导航拆成三层：

1. 基础资源
2. 导航链接数据
3. 组件映射

当前仓库里比较对的做法就在这里：

- [src/data/site-navigation.ts](/Users/smoant/github/antbarweb/src/data/site-navigation.ts)
- [src/components/site/SiteHeader.astro](/Users/smoant/github/antbarweb/src/components/site/SiteHeader.astro)

### 推荐数据形态

```ts
export type NavLink = {
  label: string;
  href: string;
};

export type MegaMenuItem = {
  label: string;
  href: string;
  menuItemId: string;
  tabIndex: number;
  dropdown: boolean;
  panel?: 'products' | 'links';
  links?: NavLink[];
};

export const PRIMARY_NAV: MegaMenuItem[] = [
  { label: 'Home', href: '/', menuItemId: '1391', tabIndex: 1, dropdown: false },
  {
    label: 'Products',
    href: '/all-products/',
    menuItemId: '1392',
    tabIndex: 2,
    dropdown: true,
    panel: 'products',
  },
  {
    label: 'About',
    href: '/about-us/',
    menuItemId: '1393',
    tabIndex: 3,
    dropdown: true,
    panel: 'links',
    links: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
      { label: 'Antbar Lab', href: '/antbar-lab/' },
      { label: 'Intelligent Manufacturing', href: '/intelligent-manufacturing/' },
    ],
  },
];
```

### 为什么这个形态对

1. 链接关系是结构化的，不是 HTML 字符串
2. mirror 里的 `menuItemId`、`tabIndex` 这些 Elementor 行为依赖被保留下来
3. `panel` 区分了产品型 dropdown 和普通 links dropdown
4. 后面别的 agent 可以只改数据，不用碰 header 组件骨架

---

## 三、页脚结构化范本

当前仓库里比较对的做法：

- [src/components/site/SiteFooter.astro](/Users/smoant/github/antbarweb/src/components/site/SiteFooter.astro)
- [src/data/site-navigation.ts](/Users/smoant/github/antbarweb/src/data/site-navigation.ts)
- [src/data/footer-contact.ts](/Users/smoant/github/antbarweb/src/data/footer-contact.ts)

### 推荐数据形态

```ts
export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export type FooterAccordionSection = {
  detailsId: string;
  accordionIndex: number;
  title: string;
  rows: { label: string; href: string }[];
};

export const FOOTER_DESKTOP_COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Disposable', href: '/disposable/' },
      { label: 'Closed Pod System', href: '/pod-sys/' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
    ],
  },
];

export const FOOTER_MOBILE_ACCORDION: FooterAccordionSection[] = [
  {
    detailsId: 'e-n-accordion-item-5030',
    accordionIndex: 1,
    title: 'About',
    rows: [
      { label: 'Brand Story', href: '/brand-story/' },
      { label: 'R&D Center', href: '/rd-center/' },
    ],
  },
];
```

### 联系信息的处理原则

联系信息常常是最容易偷懒的地方。

当前基线应该直接用真实字段，不要再保留页脚 HTML 字符串：

```ts
export const FOOTER_CONTACT = {
  email: 'info@example.com',
  phone: '+86-0769-8270 8852',
  address: 'Room 201 Building 1, No.13 Fuma Road, ChigangHumen Town,Dongguan City,Guangdong Province',
};
```

---

## 四、判断一个导航/页脚是否“假结构化”的办法

如果出现下面任意一条，就说明 agent 在偷懒：

1. `PRIMARY_NAV` 不存在，header 里全是硬编码 a 标签
2. 页脚栏目不是数组，而是整段 HTML 字符串
3. 移动端和桌面端页脚没有数据映射关系，只是两份复制 HTML
4. 组件内部出现超过一整块的 `set:html`
5. 改一个链接还要改 3 个文件以上

---

## 五、你现在就可以要求其他 agent 怎么做

最有效的分工方式是：

1. 一个 agent 只做 header / mega menu
2. 一个 agent 只做 footer / mobile accordion / social
3. 一个 agent 只做 blog/review 列表页数据与卡片
4. 一个 agent 只做产品详情 section schema

不要让一个 agent 同时负责：

- 页面结构化
- 样式重写
- 资产修复
- SEO

那样很容易退回到“复制 mirror 就完事”。

---

## 六、当前仓库可直接当样板的文件

如果你只想给别人一个“照这个方式写”的入口，直接发这几个文件：

- [src/data/site-navigation.ts](/Users/smoant/github/antbarweb/src/data/site-navigation.ts)
- [src/components/site/SiteHeader.astro](/Users/smoant/github/antbarweb/src/components/site/SiteHeader.astro)
- [src/components/site/SiteFooter.astro](/Users/smoant/github/antbarweb/src/components/site/SiteFooter.astro)
- [docs/AGENT-STRUCTURING-RULES.md](/Users/smoant/github/antbarweb/docs/AGENT-STRUCTURING-RULES.md)
