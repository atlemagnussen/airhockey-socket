import { toastStore } from "../store";

class ToastService {
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