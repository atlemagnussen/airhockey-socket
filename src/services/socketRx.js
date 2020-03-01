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
    hookMouseEvents(canvas) {
        const wrapper = document.getElementById("game-wrapper");
        const uiCanvas = document.getElementById("ui");
        const mousedownObs = fromEvent(wrapper, "mousedown");
        const mousemoveObs = fromEvent(wrapper, "mousemove");
        const mouseupObs = fromEvent(wrapper, "mouseup");
        const mouseoutObs = fromEvent(wrapper, "mouseout");
        const touchstartObs = fromEvent(uiCanvas, "touchstart");
        const touchmoveObs = fromEvent(uiCanvas, "touchmove");
        const touchendObs = fromEvent(uiCanvas, "touchend");
        const touchcancelObs = fromEvent(uiCanvas, "touchcancel");

        const down = (evt) => {
            const msg = {
                type: "mouseDown",
                events: [],
                width: canvas.width,
                height: canvas.height
            };
            const mts = evt.clientX ? [evt] : evt.touches;
            for (let i = 0; i < mts.length; i++) {
                const mt = mts[i];
                const x = mt.clientX;
                const y = mt.clientY;
                msg.events.push({x, y});
            }
            this.activePadStartVec = this.getMouseTouchPos(evt);
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
        const touchMove = (evt) => {
            if (this.activePadStartVec) {
                const pos = this.getMouseTouchPos(evt);
                const x = -(this.activePadStartVec.x - pos.x);
                const y = -(this.activePadStartVec.y - pos.y);
                const msg = {
                    type: "touchMove",
                    event: {x, y}
                };
                ws.next(msg);
                this.activePadStartVec = this.getMouseTouchPos(evt);
            }
            evt.preventDefault();
        };
        mousedownObs.subscribe(down);
        mousemoveObs.subscribe(move);
        mouseupObs.subscribe(up);
        mouseoutObs.subscribe(up);
        touchstartObs.subscribe(down);
        touchmoveObs.subscribe(touchMove);
        touchendObs.subscribe(up);
        touchcancelObs.subscribe(up);
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
    getMouseTouchPos(e) {
        const mt = e.clientX ? e : e.touches[0];
        const x = mt.clientX;
        const y = mt.clientY;
        return {x, y};
    }
    getGames() {
        const msg = {
            type: "requestGames"
        };
        ws.next(msg);
    }
    getStatics() {
        const msg = {
            type: "requestStatics"
        };
        ws.next(msg);
    }
    subStatics(fn) {
        ws.subscribe((msg) => {
            if (msg.type == "drawStatics")
                fn(msg);
        });
    }
    subDynamics(fn) {
        ws.subscribe((msg) => {
            if (msg.type == "drawDynamics")
                fn(msg);
        });
    }
}

export default new SocketRx();