import { writable } from "svelte/store";
const lsPrefix = "airsockey-";
export const curRoute = writable("/");
export const socketState = writable(3);

const createWritableLocalStorageStore = (key, startValue) => {
    var lsKey = `${lsPrefix}${key}`;
    const { subscribe, set } = writable(startValue);
    const json = localStorage.getItem(lsKey);
    if (json) {
        set(JSON.parse(json));
    }    
    subscribe(current => {
        localStorage.setItem(lsKey, JSON.stringify(current));
    });
    return {
        subscribe,
        set
    };
};

export const userName = createWritableLocalStorageStore("userName", "");
export const gameStore = writable({inGame: false});

const createToastStore = () => {
    const { subscribe, set } = writable([]);
    let list = [];
    const add = (options, timeout) => {
        if (!timeout) timeout = 10;
        list.push(options);
        set(list);
        setTimeout(() => {
            const index = list.indexOf(options);
            list.splice(index, 1);
            set(list);
        }, timeout * 1000);
    };
    const reset = () => {
        list = [];
        set(list);
    };
    
    return {
        subscribe,
        add,
        reset
    };
};

export const toastStore = createToastStore();