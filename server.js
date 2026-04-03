const express = require("express");
const cluster = require("cluster");
const os = require("os");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const profileRoutes = require("./routes/profile");
const BackgroundService = require("./services/backgroundService");
const { PORT, NODE_ENV } = require("./config/constants");

const app = express(); // ✅ FIX: app define here

// 🔐 Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ⚙️ Background Service
BackgroundService.initialize();

// ⭐ ROOT API INFO PAGE
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Profile API Documentation</title>
<style>
    body {
        font-family: Arial, sans-serif;
        background: #f5f5f5;
        text-align: center;
        padding-top: 60px;
        color: #333;
    }
    .card {
        background: white;
        width: 60%;
        margin: auto;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    h1 {
        color: #2e8b57;
        font-size: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    h1 img {
        width: 35px;
    }
    .example-box {
        background: #eee;
        padding: 10px 16px;
        border-radius: 6px;
        display: inline-block;
        font-family: monospace;
    }
    .example {
        font-family: monospace;
        color: #000;
        margin-top: 10px;
    }
</style>
</head>
<body>
    <div class="card">
        <h1>
            <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png">
            Chracter Image Outfit API
        </h1>

        <p style="font-size:18px; margin-top:15px;">
            To generate a Outfit image card, use:
        </p>

        <div class="example-box">
            /api/v1/profile?uid=<b>[UID]</b>&bg=<b>[0|1]</b>
        </div>

        <p class="example">
            Example:  
            <b>/api/v1/profile?uid=123456&bg=1</b>
        </p>
    </div>
</body>
</html>
    `);
});

// 📌 API ROUTES
app.use("/api/v1", profileRoutes);

// ❗ ERROR HANDLER
app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(500).json({
        status: false,
        error: {
            code: 500,
            message: "Internal Server Error",
            description: NODE_ENV === "development" ? err.message : "Something went wrong",
            icon: "⚠️",
            timestamp: new Date().toISOString()
        }
    });
});

// ❓ 404 PAGE
app.use("*", (req, res) => {
    res.status(404).json({
        status: false,
        error: {
            code: 404,
            message: "Endpoint Not Found",
            description: `The URL ${req.originalUrl} does not exist.`,
            suggestion: "Check the API documentation.",
            icon: "❌",
            timestamp: new Date().toISOString()
        }
    });
});

// 🧵 CLUSTER MODE
if (cluster.isMaster && NODE_ENV === "production") {
    const numCPUs = Math.min(os.cpus().length, 4);
    console.log(`🚀 Starting ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) cluster.fork();

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
    });

} else {
    app.listen(PORT, () => {
        console.log(`⚡ Server running on port ${PORT}`);
        console.log(`🎯 Example: http://localhost:${PORT}/api/v1/profile?uid=123&bg=1`);
    });
}

module.exports = app;

// Shortcut: /api/profile?uid=xxx  (same as /api/v1/profile?uid=xxx&bg=1)
app.use("/api", require("./routes/profile"));
