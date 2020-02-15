<script>
    import Circle from "./Circle.svelte";
    let state = false;
    const toggleState = () => {
        state = !state;
    };
    $: background = state ? "--red-trans" : "--purple-main";
    $: color = state ? "--purple-main" : "--red-trans";
</script>
<style>
    /* span {
        cursor: pointer;
    } */
</style>

<Circle onclick="{toggleState}" 
    background="{background}"
    color="{color}"
    cursor="pointer"
    >
    <span>S</span>
</Circle>