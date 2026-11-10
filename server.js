const fs = require('fs');
const { spawn } = require('child_process');
const AdmZip = require('adm-zip');

const XRAY_URL = "https://github.com/XTLS/Xray-core/releases/download/v1.8.4/Xray-linux-64.zip";
const ZIP_FILE = "xray.zip";

const configJson = {
    "log": { "loglevel": "warning" },
    "inbounds": [
        {
            "port": process.env.PORT ? parseInt(process.env.PORT) : 8000,
            "listen": "0.0.0.0",
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

async function setupAndRun() {
    try {
        console.log("Downloading Xray Core...");
        // نیازمند Node.js نسخه 18 به بالا که در Meera v20 است
        const response = await fetch(XRAY_URL);
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(ZIP_FILE, Buffer.from(arrayBuffer));

        console.log("Extracting files...");
        const zip = new AdmZip(ZIP_FILE);
        zip.extractAllTo("./", true);

        console.log("Setting execute permissions...");
        fs.chmodSync("xray", 0o755);

        console.log("Creating config.json...");
        fs.writeFileSync("config.json", JSON.stringify(configJson, null, 2));

        console.log("Starting VLESS Proxy on Node.js...");
        // اجرای Xray و انتقال لاگ‌های آن به ترمینال شما
        const xray = spawn("./xray", ["-config", "config.json"], { stdio: 'inherit' });

        xray.on('error', (err) => {
            console.error("Failed to start Xray process:", err);
        });

    } catch (err) {
        console.error("Error during setup:", err);
    }
}

setupAndRun();
