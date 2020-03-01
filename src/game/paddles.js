import { Vec2 } from "planck-js";

export const create = () => {
    setupEvents();
};

const setupEvents = () => {
    
    // socketRx.subMouseDown(checkPaddle);
    // socketRx.subMouseMove(updatePosition);
    // socketRx.subMouseUp(releasePaddle);

    // const gameEl = canvas.uiCanvas;
    // gameEl.addEventListener("touchstart", e => checkPaddle(e));
    // gameEl.addEventListener("touchmove", e => touchMove(e));
    // gameEl.addEventListener("touchend", e => releasePaddle(e));
    // gameEl.addEventListener("touchcancel", e => releasePaddle(e));
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

const getMouseTouchPos = e => {
    const mt = e.clientX ? e : e.touches[0];
    const x = mt.clientX;
    const y = mt.clientY;
    return Vec2(x, y);
};
