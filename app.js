
const path = require("path");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const WebSocket = require("ws");
const wwwpath = path.join(__dirname, "www");
const wwwindex = path.join(wwwpath, "index.html");
const PORT = process.env.PORT || 8080;

app.use(express.static("www"));
app.get("/", (req, res) => {
    res.sendFile(wwwindex);
});

// web socket
this.webSocketServer = new WebSocket.Server({ server: httpServer });
this.webSocketServer.on("connection", (ws) => {
    console.log("a user connected");
    ws.on("message", (msg) => {
        console.log(`webSocketServer.clients.size=${this.webSocketServer.clients.size}`);
        this.webSocketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) { //client !== ws if not send to self
                client.send(msg);
            }
        });
        console.log(`received msg ${JSON.stringify(msg)}`);
    });
});


httpServer.listen(PORT, function(){
    console.log(`listening on *:${PORT}`);
});