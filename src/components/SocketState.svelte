<script>
    import { onDestroy } from "svelte";
    import { socketState } from "../store";
    import Circle from "./Circle.svelte";
    import states from "../services/socketStates.js";
    
    const backgroundColors = {
        0: "--yellow-dark",
        1: "--green-dark",
        2: "--orange-dark",
        3: "--red-dark"
    };
    export let state = 3;
    
    $: background = backgroundColors[state];
    $: stateText = states[state];

    const unsubscribe = socketState.subscribe(value => {
        state = value;
    });
    onDestroy(unsubscribe);
</script>
<style>
    /* span {
        cursor: pointer;
    } */
</style>

<Circle 
    background="{background}"
    color="--grey-light"
    >
    <span title="{stateText}">WS</span>
</Circle>