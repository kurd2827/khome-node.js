const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
// پورتی که پنل به ما می‌دهد برای وب‌سرور خارجی
const EXTERNAL_PORT = process.env.PORT || 3000;
// پورت داخلی برای خود Xray
const XRAY_PORT = 10000;

const configJson = {
    "log": { "loglevel": "warning" },
    "inbounds": [
        {
            "port": XRAY_PORT,
            "listen": "127.0.0.1",
            "protocol": "vless",
            "settings": {
                "clients": [
                    {
                        "id": "d3b80890-3498-44fb-a589-73b37803e7c8",
                        "level": 0
                    }
                ],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "ws",
                "wsSettings": {
                    "path": "/mardinkurd"
                }
            }
        }
    ],
    "outbounds": [{ "protocol": "freedom" }]
};

// ساخت کانفیگ و دادن دسترسی اجرایی
fs.writeFileSync("config.json", JSON.stringify(configJson, null, 2));
try {
    fs.chmodSync("xray", 0o755);
} catch (err) {}

// اجرای هسته Xray در پس‌زمینه
const xray = spawn("./xray", ["-config", "config.json"], { stdio: 'inherit' });
xray.on('error', (err) => console.error("Xray startup error:", err));

// گول زدن سیستم Health Check پنل ابری
app.get('/', (req, res) => {
    res.status(200).send('Server is working perfectly!'); 
});

// هدایت ترافیک پروکسی شما به هسته داخلی
app.use('/mardinkurd', createProxyMiddleware({
    target: `http://127.0.0.1:${XRAY_PORT}`,
    changeOrigin: true,
    ws: true, // فعال کردن وب‌سوکت که برای VLESS الزامی است
    logLevel: 'silent'
}));

// استارت وب‌سرور
app.listen(EXTERNAL_PORT, '0.0.0.0', () => {
    console.log(`Web server listening on port ${EXTERNAL_PORT}`);
});
