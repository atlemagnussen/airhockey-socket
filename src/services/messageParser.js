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
                msgString = `(con) ${msg.data.msg}`;
                break;
            case "gameCreated":
            case "gameRejected":
            case "gameJoined":
                msgString = `(${msg.type}) ${msg.data}`;
                break;
            case "gamesList":
                msgString = `(${msg.type}) refreshed: length=${msg.data.games.length}`;
                break;
            default:
                msgString = `uknown message type ${msg.type}`;
                break;
        }
        return msgString;
    }
}
export default new MessageParser();