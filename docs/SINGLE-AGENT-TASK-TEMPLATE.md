# 单 Agent 任务模板

把下面这段直接发给单个 agent。

```text
你正在做 antbarweb 的 1:1 结构化迁移，不是在做新设计，也不是在做 mirror 回放。

本次你只负责：<填清楚页面或模块范围>

硬约束：
1. 不允许直接复用整页 mirror HTML 作为最终 Astro 页面。
2. 不允许把 header / footer / mega menu 整段塞进 Astro。
3. 不允许新增一堆只包一层 set:html 的页面壳。
4. 不允许改 URL、可见文案、模块顺序、图片来源。
5. 优先抽 data / content / section component，不要先堆页面文件。

你必须先看：
- docs/AGENT-STRUCTURING-RULES.md
- docs/STATIC-TO-ASTRO-PLAN.md
- docs/ELEMENTOR-MIRROR-LOCAL.md

交付要求：
1. 说明你这次结构化了哪些模块。
2. 说明你新增或修改了哪些 data / content / component 文件。
3. 说明哪些区域已经脱离 mirror，哪些区域还是过渡态。
4. 说明下一位 agent 应该继续改哪些文件。

完成标准：
- 页面外观和 mirror 对齐
- 不是整页 mirror HTML 回放
- 数据有明确落点
- build 可通过
```

最短执行原则：

1. 一次只做一个页面族或一个壳层模块
2. 能抽数据就不要硬编码
3. 能并回站点壳层的 one-off 组件，就不要继续碎拆
