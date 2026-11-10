const fs = require('fs');
const { spawn } = require('child_process');

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

console.log("Setting execute permissions for Xray...");
try {
    fs.chmodSync("xray", 0o755);
} catch (err) {
    console.error("Warning: could not set permissions, file might be missing or already executable.", err);
}

console.log("Creating config.json...");
fs.writeFileSync("config.json", JSON.stringify(configJson, null, 2));

console.log("Starting VLESS Proxy on Node.js...");
const xray = spawn("./xray", ["-config", "config.json"], { stdio: 'inherit' });

xray.on('error', (err) => {
    console.error("Failed to start Xray process:", err);
});
