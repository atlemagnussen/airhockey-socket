<script>
    import { onDestroy } from "svelte";
    import { userName } from "../store";
    import socket from "../services/socketRx.js";
    let user, wsHost;
    let wsProtocol = "wss";
    let wsUrl;
    const unsubscribe = userName.subscribe(value => {
        user = value;
    });
    onDestroy(unsubscribe);

    let connect = () => {
        wsUrl = `${wsProtocol}://${wsHost}`;
        socket.connect(wsUrl);
        userName.set(user);
    };
    if (location.host.startsWith("localhost")) {
        wsHost = location.host;
        wsProtocol = "ws";
    } else {
        wsHost = "airhockey-socket.appspot.com";
    }
</script>
<style>
    .ws-host {
        width: 300px;
    }
</style>
<button on:click="{connect}">Connect</button>
<input bind:value={user} class="ws-host">
<input bind:value={wsHost} autocomplete="true" list="dtWsUrls" class="ws-host">