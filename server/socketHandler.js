import WebSocket from "ws";

class SocketHandler {
    constructor(wsServer) {
        this.wsServer = wsServer;
        wsServer.on("connection", (ws, req) => {
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
                wsServer.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) { //client !== ws if not send to self
                        client.send(msg);
                    }
                });
                this.incoming(msg);
            });
            ws.on("close", (code, reason) => {
                console.log(`client closed, code=${code}, reason=${reason}`);
            });
        });
        wsServer.on("error", (err) => {
            console.log(err);
        });
    }
    incoming(msg) {
        const msgObj = JSON.parse(msg);
        console.log(msgObj.type);
    }
}

export default SocketHandler;