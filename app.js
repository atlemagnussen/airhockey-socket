
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const wwwpath = path.join(__dirname, "www");
const wwwindex = path.join(wwwpath, "index.html");

app.use(express.static("www"));
app.get("/", (req, res) => {
    res.sendFile(wwwindex);
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", function(){
        console.log("user disconnected");
    });
    socket.on("msg", (msg) => {
        io.emit("broadcast", { msg });
        console.log(`msg received: ${msg}`);
    });
});

const PORT = process.env.PORT || 8080;
http.listen(PORT, function(){
    console.log(`listening on *:${PORT}`);
});