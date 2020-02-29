<script>
    import { onDestroy } from "svelte";
    import { userName } from "../store";
    import toastService from "../services/toastService.js";
    import socket from "../services/socketRx.js";
    let user, wsHost;
    let wsProtocol = "wss";
    let wsUrl;
    const unsubUser = userName.subscribe(val => { user = val });
    onDestroy(() => {
        unsubUser();
    });

    let connect = () => {
        if (!user) {
            toastService.error("Need a username");
            return;
        }
        wsUrl = `${wsProtocol}://${wsHost}`;
        socket.connect(wsUrl);
        userName.set(user);
    };
    let keyDown = (e) => {
        if (e.keyCode == 13) connect();
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
<input bind:value={user} class="ws-host" placeholder="username" on:keydown={keyDown}>
<!-- <input bind:value={wsHost} autocomplete="true" list="dtWsUrls" class="ws-host"> -->