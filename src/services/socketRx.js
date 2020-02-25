import { webSocket } from "rxjs/webSocket";
import { fromEvent } from "rxjs";
import socketManager from "./socketManager.js";
import { socketState } from "../store";
import { utcNow } from "./dateStuff.js";

let ws;

class SocketRx {
    connect(url) {
        if (!url) {
            url = socketManager.getDefaultWsUrl();
        }
        ws = webSocket(url);
        ws.subscribe((msg) => {
            console.log(`got msg: ${msg.data}`);
            this.setState();
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
        const mousedownObs = fromEvent(document, "mousedown");
        // const mousemoveObs = fromEvent(document, "mousemove");
        // const mouseupObs = fromEvent(document, "mouseup");

        mousedownObs.subscribe((evt) => {
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
        });
    }
}

export default new SocketRx();