# 联系表单与 Cloudflare 配置说明

本项目的联系表单、Turnstile 防刷、D1 落库、邮件发送配置方式与 [vantase](https://github.com/rich0022/vantase) 一致：**所有可编辑项集中在 `wrangler.jsonc`**，敏感信息放在 Cloudflare 控制台 Secrets。

日常改收件人、Turnstile 公钥、D1 表名等，只需编辑 **`wrangler.jsonc` 一个文件**，然后重新构建部署。

---

## 配置文件位置

| 文件 | 作用 |
|------|------|
| `wrangler.jsonc` | **主配置**：站点 URL、邮件收件人、Turnstile 公钥、API 路径、D1 表名 |
| `wrangler.astro.jsonc` | 仅 Astro 构建用，一般不用改 |
| `migrations/` | D1 表结构迁移（改表名时需新增 migration） |

---

## `wrangler.jsonc` 中的 `vars`（可提交到 Git）

在 `vars` 块中填写：

```jsonc
"vars": {
  "SITE_URL": "https://antbar.com",
  "CONTACT_TO": "sales@antbar.com",
  "CONTACT_FROM": "ANTBAR Contact Form <noreply@antbar.com>",
  "CONTACT_LEADS_TABLE": "antbar_contact",
  "PUBLIC_TURNSTILE_SITE_KEY": "0x4AAAAAA...",
  "PUBLIC_CONTACT_ENDPOINT": "/api/contact/"
}
```

| 变量 | 说明 |
|------|------|
| `SITE_URL` | 站点主域名，文档与后续扩展用 |
| `CONTACT_TO` | 收到询盘通知的邮箱 |
| `CONTACT_FROM` | 发件人，格式：`显示名 <邮箱地址>` |
| `CONTACT_LEADS_TABLE` | D1 中本站的线索表名，antbar 为 **`antbar_contact`** |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile **站点密钥（公钥）**，会打进前端静态页 |
| `PUBLIC_CONTACT_ENDPOINT` | 表单 POST 地址，默认 `/api/contact/` |

构建时 `astro.config.mjs` 会从 `wrangler.jsonc` 读取 `PUBLIC_*` 并注入页面；Worker 运行时读取其余 `vars`。

---

## Cloudflare 控制台 Secrets（不要写入 Git）

在 **Workers → antbarweb → Settings → Variables and Secrets** 中添加：

| Secret | 说明 |
|--------|------|
| `TURNSTILE_SECRET_KEY` | Turnstile **密钥**，与 `PUBLIC_TURNSTILE_SITE_KEY` 成对 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID，用于 Email Sending API |
| `CLOUDFLARE_EMAIL_TOKEN` | 具备 Email Sending 权限的 API Token |

> 命名与 vantase 一致：Turnstile 密钥使用 `TURNSTILE_SECRET_KEY`（不是 `TURNSTILE_SECRET`）。

`wrangler.jsonc` 已设置 `"keep_vars": true`，部署时使用 `npx wrangler deploy --keep-vars`，控制台里未写进文件的变量/Secrets 不会被清掉。

---

## Turnstile 防刷

1. 打开 [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. 创建 Widget，主机名加入：
   - `antbar.com`
   - `test.antbar.com`（测试域）
   - `antbarweb.*.workers.dev`（可选，预览用）
3. 将 **Site Key** 填入 `wrangler.jsonc` → `PUBLIC_TURNSTILE_SITE_KEY`
4. 将 **Secret Key** 填入 Worker Secret → `TURNSTILE_SECRET_KEY`

表单还包含 **honeypot** 字段 `website`（对用户隐藏）；机器人填写则静默成功，不写入数据库。

在 `*.workers.dev` 预览域名上会自动跳过 Turnstile 校验（与 vantase 相同）。

---

## D1 数据库

| 项目 | 值 |
|------|-----|
| 数据库名 | `antbar_leads` |
| 数据库 ID | 见 `wrangler.jsonc` → `d1_databases[].database_id`（与当前 Cloudflare 账号绑定） |
| Binding | `DB` |
| 本站表名 | `antbar_contact`（由 `CONTACT_LEADS_TABLE` 指定） |

> **换账号 / 重新 `wrangler login` 后**：旧 `database_id` 会报 `7404 could not be found`。在当前账号执行 `npx wrangler d1 create antbar_leads`，把返回的 ID 写入 `wrangler.jsonc`，再执行 `npx wrangler d1 migrations apply antbar_leads --remote`。

### 查询线索

```bash
npx wrangler d1 execute antbar_leads --remote --command \
  "SELECT id, email, message, created_at FROM antbar_contact ORDER BY id DESC LIMIT 10"
```

### 应用新迁移

```bash
npx wrangler d1 migrations apply antbar_leads --remote
```

### 新增其他网站

每个网站单独一张表，例如 `fogceblog_contact`：

1. 在 `migrations/` 新增 SQL 建表
2. 在该站点的 `wrangler.jsonc` 中设置 `CONTACT_LEADS_TABLE`
3. 执行 `migrations apply`

多个站点可共用同一个 D1 数据库 `antbar_leads`，表名区分即可。

---

## Cloudflare Builds 部署

**Workers → antbarweb → Settings → Builds**

| 配置项 | 值 |
|--------|-----|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --keep-vars` |
| Node version | `22` |

---

## 修改配置后的检查清单

1. 改 `wrangler.jsonc` 中的 `vars`
2. 若改了 Turnstile，同步更新 Dashboard Secret `TURNSTILE_SECRET_KEY`
3. 若改了表名，确认 migration 已执行且 `CONTACT_LEADS_TABLE` 与表名一致
4. Push 到 `main` 触发 Cloudflare Builds，或本地 `npm run build && npx wrangler deploy --keep-vars`
5. 打开 `/contact/` 提交测试；在 D1 中确认 `antbar_contact` 有新记录

---

## 常见问题

### 页面显示「Method not allowed」

`/contact/` 必须是静态页；表单应 POST 到 `/api/contact/`。不要对 `/contact/` 使用 `run_worker_first`。

### Turnstile 报 hostname-mismatch

在 Turnstile Widget 的主机名列表中加入当前访问域名（如 `test.antbar.com`）。

### 提交成功但收不到邮件

检查 Worker Secrets：`CLOUDFLARE_ACCOUNT_ID`、`CLOUDFLARE_EMAIL_TOKEN`，以及 Email Sending 是否已为 `noreply@antbar.com` 配置好。

### 变量部署后消失

确认 `keep_vars: true` 且 deploy 命令带 `--keep-vars`；敏感项优先放 **Secrets** 而非普通 Variables。
