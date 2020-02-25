import { utcNow } from "../services/dateStuff.js";

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
                break;
            case "connection":
                msgString = `(con) ${msg.data}`;
                break;
            case "game":
                msgString = `(game) ${msg.data}`;
                break;
            default:
                msgString = `uknown message type ${msg.type}`;
                break;
        }
        return msgString;
    }
}
export default new MessageParser();