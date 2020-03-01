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
    };
    
    let cb = (msg) => {
        if (msg.type === "gameReady") {
            game.started = true;
            gameStore.set(game);
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
