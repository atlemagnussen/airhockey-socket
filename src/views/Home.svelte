<script>
    import socket from "../services/socketManager.js";
    import states from "../services/socketStates.js";
    import { socketState } from "../store";
    let msg = "hello";
    let msgs = "";
    let start;
    let submitMsg = () => {
        start = new Date();
        socket.send(msg);
    }
    let cb = (msg) => {
        const end = new Date();
        const timeDiff = end - start;
        const msgString = `(${timeDiff}ms) ${JSON.stringify(msg)}`;
        msgs = `${msgs}${msgString}<br>`;
    }
    socket.setCallback(cb);
    $: stateText = states[$socketState];
</script>

<style>
    article {
        box-sizing: border-box;
        display: flex;
        height: 100%;
        flex-direction: column;
        overflow-y: auto;
    }
    .text-output {
        background: white;
        color: black;
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
    <h1>Welcome to AirHockey Socket</h1>
    <div>
        {#if $socketState === 3}
            <button on:click="{socket.connect}">Connect</button>
        {:else if $socketState === 1}
            <button on:click="{socket.disconnect}">Disconnect</button>
            <input bind:value={msg} placeholder="message">
            <button on:click="{submitMsg}">Submit</button>
        {:else}
            <p>{stateText}</p>
        {/if}
    </div>
    

    <div class="text-output">{@html msgs}</div>
</article>
