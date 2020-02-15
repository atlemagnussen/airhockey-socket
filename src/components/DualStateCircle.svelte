<script>
    import Circle from "./Circle.svelte";
    let state = false;
    const toggleState = () => {
        state = !state;
    };
    $: background = state ? "--red-trans" : "--purple-main";
</script>
<style>
    /* div:hover,
    div.active {
        background: var(--secondary-color);
        border-color: var(--main-color);
    } */
</style>

<Circle onclick="{toggleState}" background="{background}">
    <span>S</span>
</Circle>