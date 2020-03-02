import * as Planck from "planck-js";
import config from "./config.js";
import field from "./field.js";
const { World, Edge, Circle, Vec2 } = Planck.default;

class GameWorld {
    constructor() {
        this.staticObjects = [];
        this.dynamicObjects = [];
        this.score = { p1: 0, p2: 0 };
        this.world = World();
    }
    init(cbRenderer) {cbRenderer;
        this.cbRenderer = cbRenderer;
        this.createField();
        this.createPuck();
        this.createPaddles();
        setInterval(() => {
            this.renderer();
        }, 1000/60);
    }
    renderer() {
        const dt = 1 / 60;
        const now = Date.now();
        var elapsed = now - this.lastUpdate;
        this.lastUpdate = now;
        this.world.step(dt, elapsed / 1000);
        if (this.puck.reset) {
            this.puck.setPosition(Vec2(0, 0));
            this.puck.setStatic();
            this.puck.setDynamic();
            this.puck.reset = false;
        }
        this.cbRenderer(this.dynamicObjects);
    }
    createField() {
        const table = this.world.createBody();
        let statics = [];
        //Create Goal Detection Sensors
        const goalFixureDefinition = { isSensor: true, filterMaskBits: 0x0004 };
        this.goal1Sensor = table.createFixture(Edge(Vec2(-4, 22.5), Vec2(4, 22.5)), goalFixureDefinition);
        this.goal2Sensor = table.createFixture(Edge(Vec2(-4, -22.5), Vec2(4, -22.5)), goalFixureDefinition);
        statics = [this.goal1Sensor, this.goal2Sensor];

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
        this.world.on("begin-contact", e => this.handleContact(e));
        const tableMap = field.buildTableMap();

        tableMap.map(edge => {
            const fixture = table.createFixture(Edge(Vec2(edge.from.x, edge.from.y), Vec2(edge.to.x, edge.to.y)));
            this.staticObjects.push({
                type: "edge",
                body: table,
                fixture,
                color: "white",
            });
        });
        for (let i = 0; i < statics.length; i++) {
            this.staticObjects.push({
                type: "edge",
                body: table,
                fixture: statics[i],
                color: "white",
            });
        }
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
            fill: true
        });
    }
    createPaddles() {
        const paddleBodyDefinition = position => ({
            type: "dynamic",
            position: position,
            bullet: false,
            linearDamping: 10,
            angularDamping: 1,
        });
        const paddleFixtureDefinition = {
            restitution: 0,
            filterCategoryBits: 0x0002,
        };
        this.paddle1 = this.world.createBody(paddleBodyDefinition(Vec2(0, 16)));
        const paddle1Fix = this.paddle1.createFixture(Circle(1.5), paddleFixtureDefinition);
        this.dynamicObjects.push({
            type: "circle",
            body: this.paddle1,
            fixture: paddle1Fix,
            color: "green",
        });

        this.paddle2 = this.world.createBody(paddleBodyDefinition(Vec2(0, -16)));
        const paddle2Fix = this.paddle2.createFixture(Circle(1.5), paddleFixtureDefinition);

        this.dynamicObjects.push({
            type: "circle",
            body: this.paddle2,
            fixture: paddle2Fix,
            color: "green",
        });
    }
    alertGoal(scorer) {
        const txt = `${scorer} scored!`;
        console.log(txt);
        this.puck.reset = true;
    }
    checkPaddle(msg) {
        let paddle;
        if (msg.player === 1) {
            paddle = this.paddle1;
        } else {
            paddle = this.paddle2;
        }
        const pos = this.scaleVec(paddle.getPosition());
        const radius =
        paddle.getFixtureList().getShape().getRadius() * config.scale;
        if (this.isPaddleInside(pos, radius, msg.events, msg.width, msg.height)) {
            paddle.selected = true;
        } else {
            paddle.selected = false;
        }
    }
    isPaddleInside(pos, r, events, width, height) {
        for (let i = 0; i < events.length; i++) {
            const mt = events[i];
            const x = mt.x - width / 2;
            const y = mt.y - height / 2;
            const y1 = y > pos.y - r;
            const y2 = y < pos.y + r;
            const x1 = x > pos.x - r;
            const x2 = x < pos.x + r;
            const isin = y1 && y2 && x1 && x2;
            if (isin) return true;
        }
        return false;
    }
    scaleVec(vec) {
        return Vec2(vec.x * config.scale, vec.y * config.scale);
    }
    releasePaddle(msg) {
        if (msg.player === 1) {
            this.paddle1.selected = false;
        } else {
            this.paddle2.selected = false;
        }
    }
    updatePosition(msg) {
        let paddle;
        if (msg.player === 1) {
            paddle = this.paddle1;
        } else {
            paddle = this.paddle2;
        }
        if (paddle.selected) {
            const vector = Vec2(msg.event.x * config.force, msg.event.y * config.force);
            paddle.applyForce(vector, Vec2(paddle.getPosition()), true);
        }
    }
}

export default GameWorld;