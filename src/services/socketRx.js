import { webSocket } from "rxjs/webSocket";
import socketManager from "./socketManager.js";
import { socketState } from "../store";

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
    sendMsg(msg) {
        ws.next({type: "msg", data: msg});
        this.setState();
    }
    close() {
        ws.complete();
        this.setState();
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
}

export default new SocketRx();