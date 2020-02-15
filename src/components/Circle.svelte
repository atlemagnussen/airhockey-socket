<script>
    export let onclick = () => {};
    export let cursor = "unset";
    export let background = "--main-color";
    export let color = "--secondary-text";
    export let border = null
    $: borderColor = border !== null ? border : background;
</script>
<style>
    div {
        display: inline-block;
        height: 2.5rem;
        width: 2.5rem;
        line-height: 2.5rem;
        vertical-align: middle;
        border-radius: 50%;
        text-align: center;
        font-family: "Roboto Mono", monospace;
        border: 1px solid;
    }
    
</style>

<div on:click="{onclick}" 
    style="background-color: var({background});
            color: var({color});
            border-color: var({borderColor});
            cursor: {cursor}">
    <slot>*</slot>
</div>
