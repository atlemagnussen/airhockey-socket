<script>
    import { onMount, onDestroy } from "svelte";
    import socket from "../services/socketRx.js";
    import main from "../game/main.js";
    import { userName, gameStore } from "../store";
    let user, game;
    const unsuer = userName.subscribe(val => { user = val });
    const ungame = gameStore.subscribe(val => {
        game = val;
        if (game.started)
            start();
    });
    onMount(() => {
        socket.subscribe(cb);
    });
    onDestroy(() => {
        unsuer();
        ungame();
    });
    let started = false;
    let start = () => {
        started = true;
        main.init();
        fullscreen();
    };
    
    let cb = (msg) => {
        if (msg.type === "gameReady") {
            game.started = true;
            gameStore.set(game);
        }
    };
    let fullscreen = () => {
        const el = document.getElementById("game-wrapper");
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
    };
</script>

<style>
#game-wrapper {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.game-wrapper.started canvas {
    position: absolute;
}
.waiting {
    color: var(--cyan);
}
.waiting.started {
    display: none;
}
#ui {
    z-index: 3;
}
#game {
    z-index: 2;
}
#background {
    z-index: 1;
}
</style>
<div class="{started ? 'waiting started' : 'waiting'}">
    Waiting for player to join
</div>
<div id="game-wrapper" class="{started ? 'game-wrapper started' : 'game-wrapper'}">
    <canvas id="ui">canvas?</canvas>
    <canvas id="game">canvas?</canvas>
    <canvas id="background">canvas?</canvas>
</div>
