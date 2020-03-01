import { utcNow } from "../services/dateStuff.js";
import toastService from "./toastService.js";

class MessageParser {
    regular(msg) {
        const end = utcNow();
        let timeDiff = 0;
        let msgString;
        switch (msg.type) {
            case "ping":
            case "msg":
                timeDiff = end - msg.data.utcTimeStamp;
                msgString = `(${timeDiff}ms)`;
                msgString = `${msgString} (${msg.user})`;
                msgString = `${msgString} ${msg.data.msg}`;
                toastService.info(msgString);
                break;
            case "connection":
                // msgString = `(con) ${msg.data.msg}`;
                // toastService.info(msgString);
                break;
            case "gameCreated":
                msgString = `game created: ${msg.data.id}`;
                toastService.success(msgString);
                break;
            case "gameRejected":
                msgString = `game created: ${msg.data.id}`;
                toastService.error(msgString);
                break;
            case "gameJoined":
                msgString = `game joined: ${msg.data.id}`;
                toastService.info(msgString);
                break;
            case "gameReady":
                toastService.success("Ready to play!");
                // toastService.info("games refreshed");
                // msgString = `(${msg.type}) refreshed: length=${msg.data.games.length}`;
                break;
            default:
                msgString = `uknown message type ${msg.type}`;
                break;
        }
    }
}
export default new MessageParser();