<script>
    import { onMount, onDestroy } from "svelte";
    import { toastStore } from "../store";
    let toasts = [];
    let unsubscribe;
    onMount(() => {
        unsubscribe = toastStore.subscribe(value => {
            toasts = value;
        });
    })
    onDestroy(() => {
        unsubscribe();
    })
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
        animation-delay: 0.1s;
    }
    @keyframes slide-left {
        100% { left: 15px; }
    }
    .right {
        right: -200px;
        animation: slide-right 0.5s forwards;
        animation-delay: 0.1s;
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
        animation: fadein 2s;
        opacity: 0.8;
    }
    .visible {
        opacity: 1;

    }
    .info {
        background-color: #0091ea;
    }
    .success {
        background-color: #4caf50;
    }
    .error {
        background-color: #f44336;
    }
    .default {
        background-color: #353535;
    }
    .anim {
        opacity: 1;
        transform: translateY(0);
    }
    @keyframes pulse {
        0% { background-color: #001F3F; }
        100% { background-color: #FF4136; }
    }
    @keyframes fadein {
        from { opacity: 0; }
        to   { opacity: 0.8; }
    }
</style>
{#each toasts as toast}
    <div class="toast-container top {toast.position}">
        <div class="toast {toast.type}">{toast.msg}</div>
    </div>
{/each}
