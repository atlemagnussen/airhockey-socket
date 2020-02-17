import Home from "./views/Home.svelte";
import About from "./views/About.svelte";
import Game from "./views/Game.svelte";

export default [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "about",
        name: "About",
        component: About,
    },
    {
        path: "game",
        name: "Game",
        component: Game,
    }
];
