

class Index {
    constructor() {
        this.inputMsg = document.getElementById("inputMsg");
        this.btnSubmit = document.getElementById("btnSubmit");
        this.textOutput = document.getElementById("textOutput");
        this.initWs();
    }
    async initWs() {
        this.socket = io();
        this.socket.on("broadcast", (msg) => {
            const end = new Date();
            const timeDiff = end - this.start;
            const msgString = `(${timeDiff}ms) ${JSON.stringify(msg)}`;
            const msgEl = document.createElement("article");
            msgEl.innerText = msgString;
            this.textOutput.appendChild(msgEl);
        });
        
        this.btnSubmit.addEventListener("click", () => {
            const msg = this.inputMsg.value;
            this.socket.emit("msg", msg);
            this.start = new Date();
        });

    }
}

export default new Index();