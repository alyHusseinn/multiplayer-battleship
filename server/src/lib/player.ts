import Board from './board';
import { Coord } from './types';
class Player {
    private name: string;
    private avaliableShips: number;
    private isShipsHorizontal: boolean;
    private board: Board;

    constructor(name: string) {
        this.name = name;
        this.avaliableShips = 5;
        this.isShipsHorizontal = true;
        this.board = new Board();
    }

    public addShip(coord: Coord): boolean {
        if (this.avaliableShips === 0) {
            return false;
        }

        const isShipAdded = this.board.addShip(
            this.avaliableShips,
            coord,
            this.isShipsHorizontal
        );

        if (isShipAdded) {
            this.avaliableShips--;
        }

        return isShipAdded;
    }

    public getName(): string {
        return this.name;
    }

    public rotateShip(): boolean {
        this.isShipsHorizontal = !this.isShipsHorizontal;
        return this.isShipsHorizontal;
    }

    public receiveAttack(coord: Coord): boolean {
        return this.board.receiveAttack(coord);
    }

    public hasLost(): boolean {
        return this.board.isAllShipsSunk();
    }

    public isReady(): boolean {
        return this.avaliableShips === 0;
    }

    public isConqueredCell(coord: Coord): boolean {
        return this.board.isHittedCell(coord);
    }

    // public getGameBoard(): Board {
    //     return this.board;
    // }

    public getAvaliableShips(): number {
        return this.avaliableShips;
    }

    public placeShipsRandomly(): void {
        while (!this.isReady()) {
            const randomRow = Math.floor(Math.random() * 10);
            const randomCol = Math.floor(Math.random() * 10);

            this.addShip([randomRow, randomCol]);
            // rotate the ship randomly
            if (Math.random() < 0.5) {
                this.rotateShip();
            }
        }
    }
}

export default Player;



