import meta from "./meta.js";
import Handler from "./socketHandler.js";
import path from "path";
import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();
const httpServer = http.createServer(app);

const wwwpath = path.join(meta.dirname, "public");
const wwwindex = path.join(wwwpath, "index.html");
const PORT = process.env.PORT || 5000;

app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(wwwindex);
});

// web socket
const webSocketServer = new WebSocket.Server({ server: httpServer });
const handler = new Handler(webSocketServer);


httpServer.listen(PORT, function(){
    console.log(`listening on *:${PORT}`);
});