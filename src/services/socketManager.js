import { socketState } from "../store";
// import { fromEvent } from "rxjs";

let socket;
let msgObservable;
class SocketManager {
    connect(url) {
        if (!socket || socket.readyState === socket.CLOSED) {
            if (!url) {
                url = "ws://";
                if (location.protocol === "https:") {
                    url = "wss://";
                }
                url += location.host;
            }
            
            socket = new WebSocket(url);
            socketState.set(socket.readyState);
            socket.addEventListener("error", () => {
                console.log("WebSocket error");
                socketState.set(socket.readyState);
            });
            socket.addEventListener("open", () => {
                console.log("WebSocket connection established");
                socketState.set(socket.readyState);
            });
            socket.addEventListener("close", () => {
                console.log("WebSocket connection closed");
                socketState.set(socket.readyState);
            });

            // msgObservable = fromEvent(socket, "message");
            // msgObservable.subscribe(() => {
            //     socketState.set(socket.readyState);
            // });
        } else {
            console.log("web socket is already open. readyState=" + socket.readyState);
        }
    }
    
    disconnect() {
        if (socket && socket.readyState === socket.OPEN) {
            socket.close();
        } else {
            console.log("web socket is not open. readyState=" + socket.readyState);
        }
        socketState.set(socket.readyState);
    }

    send(msg) {
        if (socket && socket.readyState === socket.OPEN) {
            socket.send(msg);
        }
    }

    subscribe(fn) {
        msgObservable.subscribe(fn);
    }
}

export default new SocketManager();