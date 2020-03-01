import GameWorld from "./gameworld.js";
import draw from "./draw.js";

console.log("test world");
const render = (dynObjects) => {
    for(let i = 0; i < dynObjects.length; i++) {
        const obj = dynObjects[i];
        console.log(`Type: ${obj.type} Color: ${obj.color}`);
    }
};
const gameworld = new GameWorld();
gameworld.init(render);
const statics = draw.getDataFromObjects(gameworld.staticObjects);
const dynamics = draw.getDataFromObjects(gameworld.dynamicObjects);

console.log(dynamics);