

class Index {
    constructor() {
        this.inputMsg = document.getElementById("inputMsg");
        this.inputMsg.value = "hello";
        this.btnSubmit = document.getElementById("btnSubmit");
        this.textOutput = document.getElementById("textOutput");
        this.initWs();
        this.initBtn();
    }

    initWs() {
        if (!this.socket || this.socket.readyState === this.socket.CLOSED) {
            var url = "ws://";
            if (location.protocol === "https:") {
                url = "wss://";
            }
            url += location.host;
            this.socket = new WebSocket(url);
            this.socket.addEventListener("error", () => {
                console.log("WebSocket error");
            });
            this.socket.addEventListener("open", () => {
                console.log("WebSocket connection established");
            });
            this.socket.addEventListener("close", () => {
                console.log("WebSocket connection closed");
            });
            this.socket.addEventListener("message", (msg) => {
                this.respond(msg.data);
            });
        } else {
            console.log("web socket is already open. readyState=" + this.socket.readyState);
        }
    }
    
    disconnectWs() {
        if (this.socket && this.socket.readyState === this.socket.OPEN) {
            this.socket.close();
        } else {
            console.log("web socket is not open. readyState=" + this.socket.readyState);
        }
    }

    respond(msg) {
        const end = new Date();
        const timeDiff = end - this.start;
        const msgString = `(${timeDiff}ms) ${JSON.stringify(msg)}`;
        const msgEl = document.createElement("article");
        msgEl.innerText = msgString;
        this.textOutput.appendChild(msgEl);
    }

    initBtn() {
        this.btnSubmit.addEventListener("click", () => {
            const msg = this.inputMsg.value;
            //this.socket.emit("msg", msg);
            this.socket.send(msg);
            this.start = new Date();
        });
    }
    // async initWs() {
    //     this.socket = io();
    //     this.socket.on("broadcast", (msg) => {
    //         this.respond(msg);
    //     });
    // }
}

export default new Index();