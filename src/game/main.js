import canvas from "./canvas.js";
import config from "./config.js";
import draw from "./draw.js";
import socket from "../services/socketRx.js";

class GameMain {
    constructor() {
        this.dynamicObjects = [];
        this.score = {
            p1: 0,
            p2: 0,
        };
    }
    init() {
        canvas.init();
        this.createOffScreenCanvas();
        //this.world = World();
        //this.createField();
        this.renderer();
    }
    renderer() {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCtx.clearRect(-w / 2, -h / 2, w, h);
        this.drawDynamic();
        //window.requestAnimationFrame(() => this.renderer());
    }

    drawDynamic() {
        for (let i = 0; i < this.dynamicObjects.length; i++) {
            const object = this.dynamicObjects[i];
            draw.draw(this.offscreenCtx, object);
        }
        canvas.updateGame(this.offscreenCanvas);
    }

    createOffScreenCanvas() {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCanvas = document.createElement("canvas");
        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(w / 2, h / 2);
        this.offscreenCtx.scale(config.scale, config.scale);
    }
    
    createField() {
        //canvas.initBackground(table, statics, this.score);
        // this.createPuck();
        // this.createPaddles();
        // this.world.on("begin-contact", e => this.handleContact(e));
        //window.addEventListener("resize", e => this.resizeOffscreenCanvas(e));
    }
    resizeOffscreenCanvas() {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenCtx = this.offscreenCanvas.getContext("2d");
        this.offscreenCtx.translate(w / 2, h / 2);
        this.offscreenCtx.scale(config.scale, config.scale);
    }
}

export default new GameMain();
