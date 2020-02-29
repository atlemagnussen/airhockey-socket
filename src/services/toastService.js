import { toastStore } from "../store";

class ToastService {
    info(msg) {
        const options = {
            type: "info",
            position: "left",
            msg
        };
        toastStore.add(options);
    }
    error(msg) {
        const options = {
            type: "error",
            position: "right",
            msg
        };
        toastStore.add(options);
    }
}

export default new ToastService();