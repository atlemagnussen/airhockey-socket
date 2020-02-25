import { Vec2, Circle } from "planck-js";
import socketRx from "../services/socketRx.js";
import config from "./config.js";
let world;
let dynamicObjects;
let offscreenCanvas;
let paddle1, paddle2;
let activePad;

export const create = (w, d, o) => {
    world = w;
    dynamicObjects = d;
    offscreenCanvas = o;

    paddle1 = world.createBody(paddleBodyDefinition(Vec2(0, 16)));
    const paddle1Fix = paddle1.createFixture(Circle(1.5), paddleFixtureDefinition);
    dynamicObjects.push({
        type: "circle",
        body: paddle1,
        fixture: paddle1Fix,
        color: "green",
    });

    paddle2 = world.createBody(paddleBodyDefinition(Vec2(0, -16)));
    const paddle2Fix = paddle2.createFixture(Circle(1.5), paddleFixtureDefinition);

    dynamicObjects.push({
        type: "circle",
        body: paddle2,
        fixture: paddle2Fix,
        color: "green",
    });

    setupEvents();
};

const setupEvents = () => {
    socketRx.hookMouseEvents();
    socketRx.subMouseDown(checkPaddle);
    socketRx.subMouseMove(updatePosition);
    socketRx.subMouseUp(releasePaddle);

    // const gameEl = canvas.uiCanvas;
    // gameEl.addEventListener("touchstart", e => checkPaddle(e));
    // gameEl.addEventListener("touchmove", e => touchMove(e));
    // gameEl.addEventListener("touchend", e => releasePaddle(e));
    // gameEl.addEventListener("touchcancel", e => releasePaddle(e));
};

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



const updatePosition = msg => {
    if (activePad) {
        const vector = Vec2(msg.event.x * config.force, msg.event.y * config.force);

        activePad.applyForce(vector, Vec2(activePad.getPosition()), true);
    }
};


const isPaddleInside = (pos, r, events) => {
    const can = offscreenCanvas;
    for (let i = 0; i < events.length; i++) {
        const mt = events[i];
        const x = mt.x - can.width / 2;
        const y = mt.y - can.height / 2;
        const y1 = y > pos.y - r;
        const y2 = y < pos.y + r;
        const x1 = x > pos.x - r;
        const x2 = x < pos.x + r;
        const isin = y1 && y2 && x1 && x2;
        if (isin) return true;
    }
    return false;
};

// const touchMove = e => {
//     if (this.activePad) {
//         const pos = getMouseTouchPos(e);
//         const vector = Vec2(
//             -(this.activePadStartVec.x - pos.x) * config.force,
//             -(this.activePadStartVec.y - pos.y) * config.force
//         );
//         this.activePad.applyForce(vector, Vec2(this.activePad.getPosition()), true);
//         this.activePadStartVec = Vec2(pos.x, pos.y);
//     }
//     e.preventDefault();
// };

const checkPaddle = msg => {
    const pos1 = scaleVec(paddle1.getPosition());
    const pos2 = scaleVec(paddle2.getPosition());
    const radius =
        paddle1
            .getFixtureList()
            .getShape()
            .getRadius() * config.scale;
    if (isPaddleInside(pos1, radius, msg.events)) {
        activePad = paddle1;
        activePad.selected = true;
        //this.activePadStartVec = getMouseTouchPos(evt);
    } else if (isPaddleInside(pos2, radius, msg.events)) {
        activePad = paddle2;
        activePad.selected = true;
        //this.activePadStartVec = getMouseTouchPos(evt);
    } else {
        activePad = null;
    }
};
const getMouseTouchPos = e => {
    const mt = e.clientX ? e : e.touches[0];
    const x = mt.clientX;
    const y = mt.clientY;
    return Vec2(x, y);
};
const releasePaddle = () => {
    if (activePad) {
        activePad.selected = false;
    }
    activePad = null;
};

const scaleVec = vec => {
    return Vec2(vec.x * config.scale, vec.y * config.scale);
};