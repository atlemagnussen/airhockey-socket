<script>
    import socket from "../services/socketManager.js";
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
</script>

<style>
    .text-output {
        background: white;
        color: black;
        width: 500px;
        height: 500px;
    }
    @media only screen and (max-width: 768px) {
        .text-output {
            width: 100%;
        }
    }
</style>
<h1>Welcome to AirHockey Socket</h1>

<p>{$socketState}</p>

<button on:click="{socket.connect}">Connect</button>
<button on:click="{socket.disconnect}">Disonnect</button>

<input bind:value={msg} placeholder="message">
<button on:click="{submitMsg}">Submit</button>

<div class="text-output">{@html msgs}</div>