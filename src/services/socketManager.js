import { socketState } from "../store";
let socket, callback;
class SocketManager {
    connect() {
        if (!socket || socket.readyState === socket.CLOSED) {
            var url = "ws://";
            if (location.protocol === "https:") {
                url = "wss://";
            }
            url += location.host;
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
            socket.addEventListener("message", (msg) => {
                callback(msg.data);
                socketState.set(socket.readyState);
            });
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
        } else {
            let state = 3;
            if (socket && socket.readyState)
                state = socket.readyState;
            callback(`state is ${state}`);
        }
    }

    setCallback(cb) {
        callback = cb;
    }
    respond(msg) {
        callback(msg);
    }
}

export default new SocketManager();