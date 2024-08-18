// the game has a gameID, two players and the game logic
// when create new game -> pass the two palyers together to the game controller
import Player from './player';
import { type Coord } from './types';
import { v4 as uuidv4 } from 'uuid';

class Game {
    private player1: Player;
    private player2: Player;
    private activePlayer: Player;
    private nonActivePlayer: Player;
    private gameId: string;

    constructor(player1: Player, player2: Player) {
        this.player1 = player1;
        this.player2 = player2;
        this.activePlayer = player1;
        this.nonActivePlayer = player2;
        this.gameId = uuidv4();
    }

    public isGameOver(): boolean {
        return this.player1.hasLost() || this.player2.hasLost();
    }

    public getGameId(): string {
        return this.gameId;
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
                return this.player2.getName()
            } else {
                return this.player1.getName()
            }
        }
    }

    public getNonActivePlayerId(): string {
        return this.nonActivePlayer.getId();
    }

    public getActivePlayerId(): string {
        return this.activePlayer.getId();
    }

    public getPlayerWithId(id: string): Player | undefined {
        if (this.player1.getId() == id) {
            return this.player1;
        } else if (this.player2.getId() == id) {
            return this.player2;
        }
    }

    private switchPlayers(): void {
        [this.nonActivePlayer, this.activePlayer] = [this.activePlayer, this.nonActivePlayer];
    }
}

export default Game;