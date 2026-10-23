# VSOFT Web API – Sales Invoice

一个网页表单,用来把销售发票(Sales Invoice)提交到 VSOFT Web API(AutoCount)。

## 文件

- `sales-invoice.html`:发票表单页面。
- `server.js`:本机小服务器,提供页面,并把 `/api/*` 请求转发给 VSOFT 网关(避免浏览器 CORS 拦截)。只允许转发到 `vsoftapi.vsoft2u.my`。

## 运行

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

## 注意

- 服务器只监听 `127.0.0.1`,仅本机可访问。
- 本仓库不包含任何账号、密码或 AppId。
- 发票号码留空时由 AutoCount 自动编号;填写固定号码时不能重复。
