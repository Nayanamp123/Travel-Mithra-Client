const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = process.env.PORT || 5500;
const ROOT = __dirname;
const URL = `http://localhost:${PORT}/`;
const shouldOpenBrowser = process.argv.includes("--open");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("Frontend running:");
  console.log(URL);

  if (shouldOpenBrowser) {
    exec(`start "" "${URL}"`);
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    if (shouldOpenBrowser) {
      console.log(`Opening existing frontend at ${URL}`);
      exec(`start "" "${URL}"`);
      return;
    }

    console.error(`Port ${PORT} is already in use. Stop the running frontend server or set another PORT.`);
    process.exit(1);
  }

  throw error;
});
