import { webSocket } from "rxjs/webSocket";
import { fromEvent } from "rxjs";
import socketManager from "./socketManager.js";
import { socketState } from "../store";
import { utcNow } from "./dateStuff.js";
import messageParser from "./messageParser.js";

let ws;
let stateSet = false;

class SocketRx {
    connect(url) {
        if (!url) {
            url = socketManager.getDefaultWsUrl();
        }
        ws = webSocket(url);
        ws.subscribe((msg) => {
            messageParser.regular(msg);
            if (!stateSet) {
                this.setState();
                stateSet = true;
            }
        },(err) => {
            console.log(`error=${JSON.stringify(err)}`);
            this.setState();
        },() => {
            console.log("closed");
            this.setState();
        });
    }
    subscribe(fn) {
        ws.subscribe(fn);
        this.setState();
    }
    sendMsg(msgString, user) {
        let msg = {
            type: "msg",
            user,
            data: {
                msg: msgString,
                utcTimeStamp: utcNow()
            }
        };
        ws.next(msg);
        this.setState();
    }
    ping(user) {
        let msg = {
            type: "ping",
            user,
            data: {
                msg: "pong",
                utcTimeStamp: utcNow()
            }
        };
        ws.next(msg);
        this.setState();
    }
    close() {
        ws.complete();
        this.setState();
    }
    newGame(gameId) {
        let msg = {
            type: "newGame",
            data: {
                id: gameId
            }
        };
        ws.next(msg);
    }
    joinGame(gameId) {
        let msg = {
            type: "joinGame",
            data: {
                id: gameId
            }
        };
        ws.next(msg);
    }
    setState(state) {
        if (!state) {
            if (ws && ws._socket) {
                state = ws._socket.readyState;
            } else {
                state = 3;
            }
        }
        socketState.set(state);
        console.log(`state=${state}`);
    }
    hookMouseEvents() {
        const wrapper = document.getElementById("game-wrapper");
        const mousedownObs = fromEvent(wrapper, "mousedown");
        const mousemoveObs = fromEvent(wrapper, "mousemove");
        const mouseupObs = fromEvent(wrapper, "mouseup");
        const mouseoutObs = fromEvent(wrapper, "mouseout");

        const down = (evt) => {
            const msg = {
                type: "mouseDown",
                events: []
            };
            const mts = evt.clientX ? [evt] : evt.touches;
            for (let i = 0; i < mts.length; i++) {
                const mt = mts[i];
                const x = mt.clientX;
                const y = mt.clientY;
                msg.events.push({x, y});
            }
            ws.next(msg);
        };
        const move = (evt) => {
            const x = evt.movementX;
            const y = evt.movementY;
            const msg = {
                type: "mouseMove",
                event: {x, y}
            };
            ws.next(msg);
        };
        const up = () => {
            const msg = {
                type: "mouseUp"
            };
            ws.next(msg);
        };
        mousedownObs.subscribe(down);
        mousemoveObs.subscribe(move);
        mouseupObs.subscribe(up);
        mouseoutObs.subscribe(up);
    }
    subMouseDown(fn) {
        ws.subscribe((msg) => {
            if (msg.type === "mouseDown")
                fn(msg);
        });
    }
    subMouseMove(fn) {
        ws.subscribe((msg) => {
            if (msg.type === "mouseMove")
                fn(msg);
        });
    }
    subMouseUp(fn) {
        ws.subscribe((msg) => {
            if (msg.type === "mouseUp")
                fn(msg);
        });
    }
    getGames() {
        const msg = {
            type: "requestGames"
        };
        ws.next(msg);
    }
}

export default new SocketRx();