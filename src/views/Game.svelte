<script>
    import main from "../game/main.js";
    let started = false;
    let start = () => {
        started = true;
        main.init();
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

#ui {
    z-index: 3;
}
#game {
    z-index: 2;
}
#background {
    z-index: 1;
}
.start-btn {
    z-index: 100;
    top: 400px;
}
</style>
<div id="game-wrapper" class="{started ? 'game-wrapper started' : 'game-wrapper'}">
    <canvas id="ui">canvas?</canvas>
    <canvas id="game">canvas?</canvas>
    <canvas id="background">canvas?</canvas>
    <button on:click="{start}" class="start-btn">Start</button>
</div>
