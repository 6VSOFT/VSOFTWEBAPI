# VSOFT Web API – Sales Invoice

一个网页表单,用来把销售发票(Sales Invoice)提交到 VSOFT Web API(AutoCount)。

在线版:<https://vsoftwebapi.netlify.app>

## 文件

- `sales-invoice.html`:发票表单页面。页面右上角的 **Sales Invoice V2** 按钮会跳转到 `SalesInvoiceV2.html`。
- `SalesInvoiceV2.html`:V2 页面,内容与 `sales-invoice.html` 相同,按钮改为返回原页面。
- `server.js`:本机小服务器,提供页面,并把 `/api/*` 请求转发给 VSOFT 网关(避免浏览器 CORS 拦截)。
- `netlify/functions/proxy.mts`:在线版使用的同样的转发代理(Netlify 函数)。
- `netlify.toml`:Netlify 设置,发布 `public` 文件夹。
- `public/index.html`、`public/SalesInvoiceV2.html`:上面两个页面的副本,供 Netlify 发布。改页面时两处要一起更新。

两个代理都只允许转发到 `vsoftapi.vsoft2u.my`。

## 本机运行

需要 [Node.js](https://nodejs.org) 18 或更新版本。

```bash
node server.js
```

然后在浏览器打开:

```
http://127.0.0.1:8765/sales-invoice.html
```

## 使用

1. 展开页面上的"连接设置",环境选 **Demo Server (API :9696)**。
2. 填写 **AppId**、**账号(UserID)** 和 **密码**。
   - AppId 由 VSOFT 提供,是 36 个字符的 GUID,放在登录请求的 `AppId` 请求头里。
   - AppId 和账号会保存在你的浏览器里,密码不会保存。
3. 填写发票内容(默认客户代码、货品可修改),点 **发送到 AutoCount**。

发送流程:先 `POST /api/Server/Login` 取得 Token,再 `POST /api/Invoice` 提交发票。成功后页面会显示发票号码。

## 部署到 Netlify

站点发布 `public/` 文件夹,`/api/*` 由 `netlify/functions/proxy.mts` 处理,无需额外环境变量。可用 Netlify 的 Git 连接部署,或在项目目录运行 `netlify deploy --prod`。

## 注意

- `server.js` 只监听 `127.0.0.1`,仅本机可访问。
- 在线版网址是公开的,但发送发票需要有效的 AppId、账号和密码。
- 本仓库不包含任何账号、密码或 AppId。
- 发票号码留空时由 AutoCount 自动编号;填写固定号码时不能重复。
