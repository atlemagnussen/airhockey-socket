<script>
    import { onMount, onDestroy } from "svelte";
    import { userName, gameStore } from "../store";
    import toastService from "../services/toastService.js";
    import socket from "../services/socketRx.js";
    import msgParser from "../services/messageParser.js";
    let user;
    let gameId;
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
            toastService.error("Need game id");
            return;
        }
        socket.newGame(gameId);
    };
    let join = (id) => {
        socket.joinGame(id);
    }
    let keyDown = (e) => {
        if (e.keyCode == 13) createGame();
    };
</script>
<style>
    .game {
        cursor: pointer;
    }
    h4, li {
        color: var(--cyan);
    }

</style>
<!-- <button on:click="{disconnect}">Disconnect</button> -->
<input bind:value={gameId} placeholder="game id" on:keydown={keyDown}>
<button on:click="{createGame}">Create game</button>
<button on:click="{ping}">Ping</button>

<h4>Existing games to join</h4>
<ul>
{#each games as game, i}
    <li class="game" on:click={join(game)}>{game}</li>
{/each}
</ul>