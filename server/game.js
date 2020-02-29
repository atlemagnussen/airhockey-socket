import EventEmitter from "events";
import * as Planck from "planck-js";
const { World } = Planck.default;

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
        this.setupMouseEvents();
        player2.on("close", () => {
            this.emit("close", this.id);
        });
        this.world = World();
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
            if (!moveTypes.includes(msg.type)) return;
            msg.player = 1;
            this.msgBoth(msg);
        });
        this.player2.on("message", (msgString) => {
            const msg = JSON.parse(msgString);
            if (!moveTypes.includes(msg.type)) return;
            msg.player = 2;
            this.msgBoth(msg);
        });
    }
}

export default Game;