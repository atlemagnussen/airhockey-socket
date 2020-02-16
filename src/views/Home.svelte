<script>
    import socket from "../services/socketManager.js";
    import states from "../services/socketStates.js";
    import { socketState } from "../store";
    let msg = "hello";
    let msgs = "";
    let start;
    let wsProtocol;
    let wsUrl;
    let wsHost;
    let connect = () => {
        wsUrl = `${wsProtocol}://${wsHost}`;
        socket.connect(wsUrl);
    };
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
            <button on:click="{connect}">Connect</button>
            <select bind:value="{wsProtocol}">
                <option>wss</option>
                <option>ws</option>
            </select>
            <input bind:value={wsHost} autocomplete="true" list="dtWsUrls">
        {:else if $socketState === 1}
            <button on:click="{socket.disconnect}">Disconnect</button>
            <input bind:value={msg} placeholder="message">
            <button on:click="{submitMsg}">Submit</button>
            <span>{wsUrl}</span>
        {:else}
            <p>{stateText}</p>
        {/if}
    </div>
    
    <div class="text-output">{@html msgs}</div>

    <datalist id="dtWsUrls">
        <option value="airhockey-socket.appspot.com"></option>
        <option value="localhost:5000"></option>
    </datalist>
</article>
