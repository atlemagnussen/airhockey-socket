<script>
    import { onMount, onDestroy } from "svelte";
    import { userName, gameStore } from "../store";
    import socket from "../services/socketRx.js";
    import msgParser from "../services/messageParser.js";
    let user;
    let gameId;
    let msgs = "";
    let games = [];
    const unsubscribe = userName.subscribe(value => {
        user = value;
    });
    onMount(() => {
        socket.subscribe(cb);
        socket.getGames();
    });
    onDestroy(unsubscribe);
    let cb = (msg) => {
        let msgString = msgParser.regular(msg);
        msgs = `${msgs}${msgString}<br>`;
        if (msg.type === "gameCreated" || msg.type === "gameJoined") {
            let game = {
                inGame: true,
                started: false,
                id: msg.data.id
            };
            gameStore.set(game);
        }
        if (msg.type === "gamesList" || msg.type === "connection") {
            if (msg.data.games) {
                let g = msg.data.games;
                if (Array.isArray(g)) {
                    games = [...g];
                    console.log(games);
                }
            }
        }
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
    let join = (id) => {
        socket.joinGame(id);
    }
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
    .game {
        cursor: pointer;
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
<h4>Existing games to join</h4>
<ul>
{#each games as game, i}
    <li class="game" on:click={join(game)}>{game}</li>
{/each}
</ul>