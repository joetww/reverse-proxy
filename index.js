const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// 解析命令行參數，找到 --api-domain
const args = process.argv.slice(2); // 忽略前兩個預設參數 node 和檔案路徑
let targetServer;

// 遍歷命令行參數，尋找 --api-domain
args.forEach(arg => {
    if (arg.startsWith('--api-domain=')) {
        targetServer = arg.split('=')[1];
    }
});

// 如果沒有提供 --api-domain，則提示錯誤並退出
if (!targetServer) {
    console.error('Error: Missing required --api-domain parameter');
    process.exit(1);
}

const app = express();

// 設定反向代理，將請求轉發到目標伺服器
app.use('/proxy', createProxyMiddleware({
    target: targetServer,
    changeOrigin: true,  // 改變請求的來源 (解決CORS)
    pathRewrite: { '^/proxy': '' },  // 移除代理路徑
}));

// 啟動伺服器佔用 3030 埠
app.listen(3030, () => {
    console.log(`Proxy server is running on http://localhost:3030, forwarding to ${targetServer}`);
});

