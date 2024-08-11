// the game has a gameID, two players and the game logic
// when create new game -> pass the two palyers together to the game controller
import Player from './player';
import { type Coord } from './types';

class Game {
    private player1: Player;
    private player2: Player;
    // active player how recvies attack
    private activePlayer: Player;
    private nonActivePlayer: Player;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.activePlayer = player1;
        this.nonActivePlayer = player2;
    }

    private isGameOver(): boolean {
        return this.player1.hasLost() || this.player2.hasLost();
    }

    public playRound(cord: Coord, id: string): boolean {
        if (id != this.activePlayer.getId()) {
            throw new Error('Not your turn');
        }

        const result = this.nonActivePlayer.receiveAttack(cord);
        if (!this.isGameOver()) {
            this.switchPlayers();
        }
        return result;
    }

    public getWinner(): string | undefined {
        if (this.isGameOver()) {
            if (this.player1.hasLost()) {
                return this.player2.getId();
            } else {
                return this.player1.getId();
            }
        }
    }

    private switchPlayers(): void {
        [this.nonActivePlayer, this.activePlayer] = [this.activePlayer, this.nonActivePlayer];
    }
}

export default Game;