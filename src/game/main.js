import canvas from "./canvas.js";
import config from "./config.js";
import draw from "./draw.js";
import * as paddles from "./paddles.js";
import { Vec2, World, Edge, Circle } from "planck-js";

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
        const dt = 1 / 60;
        const world = this.world;
        const now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        world.step(dt, elapsed / 1000);
        if (this.puck.reset) {
            this.puck.setPosition(Vec2(0, 0));
            this.puck.setStatic();
            this.puck.setDynamic();
            this.puck.reset = false;
        }
        const w = document.body.clientWidth,
            h = document.body.clientHeight;
        this.offscreenCtx.clearRect(-w / 2, -h / 2, w, h);
        this.drawDynamic();
        window.requestAnimationFrame(() => this.renderer());
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
        const table = this.world.createBody();

        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        this.goal1Sensor = table.createFixture(Edge(Vec2(-4, 22.5), Vec2(4, 22.5)), goalFixureDefinition);
        this.goal2Sensor = table.createFixture(Edge(Vec2(-4, -22.5), Vec2(4, -22.5)), goalFixureDefinition);
        const statics = [this.goal1Sensor, this.goal2Sensor];
        //Create Paddle Blocking Walls
        statics.push(
            table.createFixture(Edge(Vec2(-4, 21), Vec2(4, 21)), {
                filterMaskBits: 0x0002,
            })
        );
        statics.push(
            table.createFixture(Edge(Vec2(-4, -21), Vec2(4, -21)), {
                filterMaskBits: 0x0002,
            })
        );
        statics.push(
            table.createFixture(Edge(Vec2(-12, 0), Vec2(12, 0)), {
                filterMaskBits: 0x0002,
            })
        );

        canvas.initBackground(table, statics, this.score);
        this.createPuck();
        this.createPaddles();
        this.world.on("begin-contact", e => this.handleContact(e));
    }
    handleContact(contact) {
        const fixtureA = contact.getFixtureA();
        if (fixtureA == this.goal1Sensor) {
            this.score.p1 += 1;
            this.alertGoal("player1");
        }
        if (fixtureA == this.goal2Sensor) {
            this.score.p2 += 1;
            this.alertGoal("player2");
        }
    }
    createPuck() {
        this.puck = this.world.createBody({
            type: "dynamic",
            position: Vec2(0, 0),
            bullet: true,
            linearDamping: 0.1,
            angularDamping: 0.02,
        });
        const puckFixture = this.puck.createFixture(Circle(1), {
            density: 0.25,
            restitution: 0.9,
            filterCategoryBits: 0x0004,
        });

        this.dynamicObjects.push({
            type: "circle",
            body: this.puck,
            fixture: puckFixture,
            color: "green",
        });
    }
    createPaddles() {
        paddles.create(this.world, this.dynamicObjects, this.offscreenCanvas);
        window.addEventListener("resize", e => this.resizeOffscreenCanvas(e));
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
    alertGoal(scorer) {
        const txt = `${scorer} scored!`;
        console.log(txt);
        canvas.flashText(txt);
        this.puck.reset = true;
    }
}

export default new GameMain();
