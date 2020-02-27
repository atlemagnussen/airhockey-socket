<script>
    import { gameStore } from "../store";
    import socket from "../services/socketRx.js";
    import states from "../services/socketStates.js";
    import { socketState } from "../store";
    import Link from "../components/Link.svelte";
    import Connect from "./Connect.svelte";
    import Dashboard from "./Dashboard.svelte";
    import Game from "./Game.svelte";
    let msg = "ping";
    let msgs = "";
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
</style>
{#if $gameStore.inGame}
    <Game></Game>
{:else}
    <article>
        <h1>Welcome to AirSockey</h1>
        <div>
            {#if $socketState === 3}
                <Connect></Connect>
            {:else if $socketState === 1}
                <Dashboard></Dashboard>
            {:else}
                <p>{stateText}</p>
            {/if}
        </div>

        <datalist id="dtWsUrls">
            <option value="airhockey-socket.appspot.com"></option>
            <option value="localhost:5001"></option>
        </datalist>
    </article>
{/if}