<script>
    import { onDestroy } from "svelte";
    import socket from "../services/socketRx.js";
    import states from "../services/socketStates.js";
    import msgParser from "../services/messageParser.js";
    import { socketState, userName } from "../store";
    import Link from "../components/Link.svelte";
    let msg = "ping";
    let msgs = "";
    let start;
    let wsProtocol;
    let wsUrl;
    let wsHost;
    let gameId;
    let user;

    const unsubscribe = userName.subscribe(value => {
        user = value;
    });
    onDestroy(unsubscribe);

    let cb = (msg) => {
        let msgString = msgParser.regular(msg);
        msgs = `${msgs}${msgString}<br>`;
    };
    let connect = () => {
        start = new Date();
        wsUrl = `${wsProtocol}://${wsHost}`;
        socket.connect(wsUrl);
        socket.subscribe(cb);
        userName.set(user);
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
    $: stateText = states[$socketState];

    if (location.host.startsWith("localhost")) {
        wsHost = location.host;
        wsProtocol = "ws";
    } else {
        wsHost = "airhockey-socket.appspot.com";
    }
</script>

<style>
    article {
        box-sizing: border-box;
        display: flex;
        height: 100%;
        flex-direction: column;
        overflow-y: auto;
    }
    .ws-host {
        width: 300px;
    }
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
<article>
    <h1>Welcome to AirSockey</h1>
    <div>
        {#if $socketState === 3}
            <button on:click="{connect}">Connect</button>
            <!-- <select bind:value="{wsProtocol}">
                <option>wss</option>
                <option>ws</option>
            </select> -->
            <input bind:value={user} class="ws-host">
            <input bind:value={wsHost} autocomplete="true" list="dtWsUrls" class="ws-host">
        {:else if $socketState === 1}
            <button on:click="{disconnect}">Disconnect</button>
            <input bind:value={gameId} placeholder="game id">
            <button on:click="{createGame}">Create game</button>
            <button on:click="{ping}">Ping</button>
            <Link page="{{ path: '/game', name: 'Game' }}" />
            <span>{wsUrl}</span>
        {:else}
            <p>{stateText}</p>
        {/if}
    </div>
    
    <div class="text-output">{@html msgs}</div>

    <datalist id="dtWsUrls">
        <option value="airhockey-socket.appspot.com"></option>
        <option value="localhost:5001"></option>
    </datalist>
</article>
