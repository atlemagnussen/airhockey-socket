class Game {
    constructor(id, player1) {
        this.id = id;
        this.player1 = player1;
        player1.send(JSON.stringify({ type: "game", data: `You created new game ${id}` }));
    }
    join(player2) {
        this.player2 = player2;
    }
}

export default Game;