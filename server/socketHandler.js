import WebSocket from "ws";
import Game from "./game.js";

const games = {};

class SocketHandler {
    constructor(wsServer) {
        this.wsServer = wsServer;
        wsServer.on("connection", (client, req) => {
            console.log(`req.connection.remoteAddress=${req.connection.remoteAddress}`);
            let ip = req.connection.remoteAddress;
            if (!ip) {
                const forwardHeaders = req.headers["x-forwarded-for"];
                console.log(`forwardHeaders=${JSON.stringify(forwardHeaders)}`);
                ip = forwardHeaders.split(/\s*,\s*/)[0];
            }
            
            const message = `Connected client ip ${ip}`;
            client.send(JSON.stringify({ type: "connection", data: {
                msg: message,
                games: Object.keys(games)
            } }));
            console.log(message);
            client.on("message", (msg) => {
                this.incoming(client, msg);
            });
            client.on("close", (code, reason) => {
                console.log(`client closed, code=${code}, reason=${reason}`);
            });
        });
        wsServer.on("error", (err) => {
            console.log(err);
        });
    }
    incoming(client, msgString) {
        const msg = JSON.parse(msgString);
        if (!msg.type) {
            console.log("no msg type!");
            return;
        }
        switch (msg.type) {
            case "newGame":
                this.addGame(client, msg.data);
                break;
            case "joinGame":
                this.joinGame(client, msg.data);
                break;
            case "requestGames":
                this.sendGames(client);
                break;
            case "mouseDown":
            case "mouseMove":
            case "mouseUp":
                break;
            default:
                this.broadcast(msgString);
                break;
        }
    }
    broadcast(msg) {
        let msgString = msg;
        if (typeof msg !== "string")
            msgString = JSON.stringify(msg);
        this.wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) { //client !== ws if not send to self
                client.send(msgString);
            }
        });
    }
    addGame(client, data) {
        const game = new Game(data.id, client);
        game.on("close", (id) => {
            this.closeGame(id);
        });
        games[data.id] = game;
        this.broadcastGames();
    }
    joinGame(client, data) {
        const game = games[data.id];
        if (!game) {
            const rejectMsg = {
                type: "gameRejected",
                data
            };
            client.send(rejectMsg);
        }
        game.join(client);
    }
    closeGame(id) {
        Reflect.deleteProperty(games, id);
        this.broadcastGames();
    }
    getGamesMsg() {
        return { 
            type: "gamesList",
            data: {
                games: Object.keys(games)
            }
        };
    }
    sendGames(client) {
        const msg = this.getGamesMsg();
        const msgString = JSON.stringify(msg);
        client.send(msgString);
    }
    broadcastGames() {
        const msg = this.getGamesMsg();
        this.broadcast(msg);
    }
}

export default SocketHandler;