import GameWorld from "./gameworld.js";

console.log("test world");
const render = (dynObjects) => {
    for(let i = 0; i < dynObjects.length; i++) {
        const obj = dynObjects[i];
        console.log(`Type: ${obj.type} Color: ${obj.color}`);
    }
};
const gameworld = new GameWorld();
const world = gameworld.init(render);

console.log("after world");