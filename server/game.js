import EventEmitter from "events";
import GameWorld from "./gameworld.js";
import draw from "./draw.js";
const moveTypes = ["mouseDown", "mouseMove", "mouseUp"];

class Game extends EventEmitter {
    constructor(id, player1) {
        super();
        this.id = id;
        this.player1 = player1;
        player1.send(JSON.stringify({ type: "gameCreated", data: { id } }));
        player1.on("close", () => {
            this.emit("close", this.id);
        });
    }
    join(player2) {
        this.player2 = player2;
        player2.send(JSON.stringify({ type: "gameJoined", data: { id: this.id } }));
        this.msgBoth({type: "gameReady", data: { id: this.id }});
        player2.on("close", () => {
            this.emit("close", this.id);
        });
        this.setupMouseEvents();
        this.setupWorld();
    }
    mouseDown(msg) {
        console.log(JSON.stringify(msg));
    }
    msgBoth(msg) {
        const msgString = JSON.stringify(msg);
        this.player1.send(msgString);
        this.player2.send(msgString);
    }
    setupMouseEvents() {
        this.player1.on("message", (msgString) => {
            const msg = JSON.parse(msgString);
            if (msg.type === "requestStatics") {
                this.sendStatics(this.player1);
                return;
            }
            if (!moveTypes.includes(msg.type)) return;
            msg.player = 1;
            this.handleMouse(msg);
        });
        this.player2.on("message", (msgString) => {
            const msg = JSON.parse(msgString);
            if (msg.type === "requestStatics") {
                this.sendStatics(this.player2);
                return;
            }
            if (!moveTypes.includes(msg.type)) return;
            msg.player = 2;
            this.handleMouse(msg);
        });
    }
    setupWorld() {
        this.gameWorld = new GameWorld();
        this.gameWorld.init((d) => this.render(d));
    }
    render(dynObjects) {
        const dynamics = draw.getDataFromObjects(dynObjects);
        const msg = {
            type: "drawDynamics",
            data: dynamics
        };
        this.msgBoth(msg);
    }
    sendStatics(client) {
        const statics = draw.getDataFromObjects(this.gameWorld.staticObjects);
        const msg = {
            type: "drawStatics",
            data: statics
        };
        const msgString = JSON.stringify(msg);
        client.send(msgString);
    }
    handleMouse(msg) {
        switch (msg.type) {
            case "mouseDown":
                this.gameWorld.checkPaddle(msg);
                break;
            case "mouseMove":
                this.gameWorld.updatePosition(msg);
                break;
            case "mouseUp":
                this.gameWorld.releasePaddle();
                break;
            default:
                break;
        }
    }
}

export default Game;