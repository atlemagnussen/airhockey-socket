import meta from "./meta.js";
import handleMsg from "./messageHandler.js";
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
webSocketServer.on("connection", (ws, req) => {
    console.log(`req.connection.remoteAddress=${req.connection.remoteAddress}`);
    let ip = req.connection.remoteAddress;
    if (!ip) {
        const forwardHeaders = req.headers["x-forwarded-for"];
        console.log(`forwardHeaders=${JSON.stringify(forwardHeaders)}`);
        ip = forwardHeaders.split(/\s*,\s*/)[0];
    }
    
    const message = `Connected client ip ${ip}`;
    ws.send(JSON.stringify({ data: message }));
    console.log(message);
    ws.on("message", (msg) => {
        // ws.send(msg);
        webSocketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) { //client !== ws if not send to self
                client.send(msg);
            }
        });
        handleMsg(msg);
        console.log(`received msg ${JSON.stringify(msg)}`);

    });
    ws.on("close", (code, reason) => {
        console.log(`client closed, code=${code}, reason=${reason}`);
    });
});
webSocketServer.on("error", (err) => {
    console.log(err);
});

httpServer.listen(PORT, function(){
    console.log(`listening on *:${PORT}`);
});