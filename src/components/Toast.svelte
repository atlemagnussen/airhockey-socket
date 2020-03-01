<script>
    import { onMount, onDestroy } from "svelte";
    import { toastStore } from "../store";
    let toasts = [];
    let unsubscribe;
    onMount(() => {
        unsubscribe = toastStore.subscribe(value => {
            toasts = value;
        });
    });
    onDestroy(() => {
        unsubscribe();
    });
    let top = (i) => {
        const distance = 15 + (i*44);
        return `${distance}px`;
    }
</script>

<style>
    .toast-container {
        position: fixed;
        z-index: 9;
    }
    .top {
        top: 15px;
    }
    .bottom {
        bottom: 15px;
    }
    .left {
        left: -200px;
        animation: slide-left 0.5s forwards;
        animation-delay: 0s;
    }
    @keyframes slide-left {
        100% { left: 15px; }
    }
    .right {
        right: -200px;
        animation: slide-right 0.5s forwards;
        animation-delay: 0s;
    }
    @keyframes slide-right {
        100% { right: 15px; }
    }
    .center {
        left: 50%;
        transform: translateX(-50%);
    }
    .toast {
        height: 38px;
        line-height: 38px;
        padding: 0 20px;
        box-shadow: 0 1px 3px rgba(255, 255, 255, 0.12), 0 2px 4px rgba(255, 255, 255, 0.98);
        color: #fff;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        animation: fadein 1s;
        opacity: 0.8;
    }
    .info {
        background-color: var(--cyan-dark);
    }
    .success {
        background-color: var(--green);
    }
    .error {
        background-color: var(--red-dark);
    }
    .default {
        background-color: var(--background-color);
    }
    @keyframes pulse {
        0% { background-color: var(--background-color); }
        100% { background-color: var(--red-dark); }
    }
    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 0.8; }
    }
</style>
{#each toasts as toast, i}
    <div class="toast-container {toast.position}" style="top: {top(i)}">
        <div class="toast {toast.type}">{toast.msg}</div>
    </div>
{/each}
