const moveTypes = ["mouseDown", "mouseMove", "mouseUp"];

class Game {
    constructor(id, player1) {
        this.id = id;
        this.player1 = player1;
        player1.on("message", (msgString) => {
            const msg = JSON.parse(msgString);
            if (!moveTypes.includes(msg.type)) return;
            this.player1.send(msgString);
        });
        player1.send(JSON.stringify({ type: "game", data: `You created new game ${id}` }));
    }
    join(player2) {
        this.player2 = player2;
    }
    mouseDown(msg) {
        console.log(JSON.stringify(msg));
    }
}

export default Game;