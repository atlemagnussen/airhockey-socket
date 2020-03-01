import config from "./config.js";
import draw from "./draw.js";
import socket from "../services/socketRx.js";

class Canvas {
    constructor() {
        this.staticObjects = [];
        this.score = {
            p1: 0,
            p2: 0
        };
    }
    rigElements() {
        this.wrapper = document.getElementById("game-wrapper");
        this.background = document.getElementById("background");
        this.backgroundCtx = this.background.getContext("2d");
        this.game = document.getElementById("game");
        this.gameCtx = this.game.getContext("2d");
        this.ui = document.getElementById("ui");
        this.uiCtx = this.ui.getContext("2d");
    }
    get gameCanvas() {
        return this.game;
    }
    get uiCanvas() {
        return this.ui;
    }
    init() {
        this.rigElements();
        this.resizeCanvas(true);
        this.scale(this.backgroundCtx);
        socket.subStatics((m) => this.drawTable(m));
        window.addEventListener("resize", () => this.resizeCanvas());
        document.addEventListener("dblclick", e => this.fullscreen(e));
        this.initBackground();
    }
    setSize(ctx, w, h) {
        ctx.width = w;
        ctx.height = h;
    }
    center(ctx, w, h) {
        ctx.translate(w / 2, h / 2);
    }
    scale(ctx) {
        ctx.scale(config.scale, config.scale);
    }
    resizeCanvas(init) {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.setSize(this.background, w, h);
        this.center(this.backgroundCtx, w, h);
        this.setSize(this.game, w, h);
        this.center(this.gameCtx, w, h);
        this.setSize(this.ui, w, h);
        this.center(this.uiCtx, w, h);
        if (!init) {
            this.scale(this.backgroundCtx);
            this.setBackground();
        }
    }
    initBackground() {
        // this.score = score;
        
        this.setBackground();
    }
    setBackground() {
        this.setBackgroundColor();
        this.setScore();
        socket.getStatics();
    }
    setBackgroundColor() {
        const w = this.background.width,
            h = this.background.height;
        const ctx = this.backgroundCtx;
        ctx.clearRect(-w / 2, -h / 2, w, h);
        ctx.fillStyle = "black";
        ctx.fillRect(-w / 2, -h / 2, w, h);
    }
    drawTable(msg) {
        for (let i = 0; i < msg.data.length; i++) {
            const o = msg.data[i];
            draw.draw(this.backgroundCtx, o);
        }
    }
    updateGame(ctxBuf) {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.gameCtx.clearRect(-w / 2, -h / 2, w, h);
        this.gameCtx.drawImage(ctxBuf, -this.game.width / 2, -this.game.height / 2);
    }
    fullscreen() {
        const el = this.wrapper;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if (el.mozRequestFullScreen) {
            /* Firefox */
            el.mozRequestFullScreen();
        } else if (el.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
            /* IE/Edge */
            el.msRequestFullscreen();
        }
    }
    unflashText() {
        this.textField.visible = false;
        this.setBackground();
    }
    setScore() {
        if (this.scoreField) {
            this.scoreField.text = `Player1 ${this.score.p1} - ${this.score.p2} Player2`;
        } else {
            this.scoreField = {
                type: "text",
                text: `Player1 ${this.score.p1} - ${this.score.p2} Player2`,
                pos: {
                    x: -9,
                    y: -25,
                },
                visible: true,
                color: "white",
            };
            this.staticObjects.push(this.scoreField);
        }
    }
    flashText(txt) {
        this.setScore();
        if (this.textField) {
            this.textField.text = txt;
            this.textField.visible = true;
        } else {
            this.textField = {
                type: "text",
                text: txt,
                pos: {
                    x: -7,
                    y: -1,
                },
                visible: true,
                color: "red",
            };
            this.staticObjects.push(this.textField);
        }
        this.setBackground();
        setTimeout(() => this.unflashText(), 2000);
    }
}

export default new Canvas();
