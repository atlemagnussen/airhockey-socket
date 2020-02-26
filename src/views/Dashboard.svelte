<script>
    import { onMount, onDestroy } from "svelte";
    import { userName } from "../store";
    import socket from "../services/socketRx.js";
    import msgParser from "../services/messageParser.js";
    let user;
    let gameId;
    let msgs = "";
    const unsubscribe = userName.subscribe(value => {
        user = value;
    });
    onMount(() => {
        socket.subscribe(cb);
    });
    onDestroy(unsubscribe);
    let cb = (msg) => {
        let msgString = msgParser.regular(msg);
        msgs = `${msgs}${msgString}<br>`;
    };
    let submitMsg = () => {
        socket.sendMsg(msg, user);
    };
    let ping = () => {
        socket.ping(user);
    };
    
    let disconnect = () => socket.close();
    let createGame = () => {
        if (!gameId) {
            msgs = `${msgs}need game id!<br>`;
            return;
        }
        socket.newGame(gameId);
    };
</script>
<style>
    .text-output {
        color: white;
        background: black;
        width: 768px;
        flex-basis: 70vh;
        flex-grow: 1;
        flex-shrink: 0;
    }
    @media only screen and (max-width: 768px) {
        .text-output {
            width: 100%;
        }
    }
</style>
<button on:click="{disconnect}">Disconnect</button>
<input bind:value={gameId} placeholder="game id">
<button on:click="{createGame}">Create game</button>
<button on:click="{ping}">Ping</button>

<div class="text-output">{@html msgs}</div>