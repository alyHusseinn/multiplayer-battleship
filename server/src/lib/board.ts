import Cell from "./cell";
import Ship from "./ship";
import { Coord } from "./types";

// when creating the board we set the value of each cell that given by the client
// the validation of the board is done in the client side
class Board {
    private SIZE: number;
    private board: Array<Array<Cell>>;
    private ships: Array<Ship>;
    constructor() {
        this.ships = [];
        this.SIZE = 10;
        this.board = Array.from({ length: this.SIZE }, () => Array.from({ length: this.SIZE }, () => new Cell()));
    }

    public addShip(length: number, coord: Coord, isHorizontal: boolean) {
        const [startingPoint, endingPoint] = this.getStartEndPoints(length, coord, isHorizontal);

        if (!this.isPlacementPossible(startingPoint, endingPoint, isHorizontal)) {
            return false;
        }

        const newShip = new Ship(length);
        this.ships.push(newShip);

        const [startRow, startCol] = startingPoint;
        const [endRow, endCol] = endingPoint;

        // const addTokenToCell = (row: number, col: number) => this.board[row][col].addToken(length);

        if (isHorizontal) {
            for (let col = startCol; col <= endCol; col++) {
                this.board[startRow][col].addToken(length);
            }
        } else {
            for (let row = startRow; row <= endRow; row++) {
                this.board[row][startCol].addToken(length);
            }
        }

        return true;
    }
    /*determines whether or not the attack hit a ship and then sends the ‘hit’ function 
    to the correct ship, or records the coordinates of the missed shot.*/
    public receiveAttack(coord: Coord) {
        const [rowIdx, colIdx] = coord;

        if (this.board[rowIdx][colIdx].hasShip()) {
            this.ships.forEach(ship => {
                if (ship.getLength() == this.board[rowIdx][colIdx].getValue()) {
                    ship.hit();
                }
            })
        }
        return this.board[rowIdx][colIdx].hit();
    }

    public isAllShipsSunk(): boolean {
        return this.ships.every((ship) => ship.isSunk());
    }

    public isHittedCell(coord: Coord): boolean {
        return this.board[coord[0]][coord[1]].isHitted();
    }


    public getBoard(): Array<Array<Cell>> {
        return this.board;
    }

    public getBoardValues(): Array<Array<number>> {
        // return 2d board with the cells values
        return this.board.map((row) => row.map((cell) => cell.getValue()));
    }
    // isPlacementPossible(startingPoint: Coord, endingPoint: Coord, isHorizontal: boolean): boolean {
    //     // we should check that these two points exist in the board
    //     // we should check that they are empty, so the points between them.
    //     if (endingPoint[0] >= this.SIZE || endingPoint[1] >= this.SIZE) {
    //         return false;
    //     }
    //     if (isHorizontal) {
    //         const rowIdx = startingPoint[0];
    //         for (let i = startingPoint[1]; i <= endingPoint[1]; i++) {
    //             if (this.board[rowIdx][i].hasShip()) return false; // hasShip in cell
    //         }
    //     }
    //     else {
    //         const colIdx = startingPoint[1];
    //         for (let i = startingPoint[0]; i <= endingPoint[0]; i++) {
    //             if (this.board[i][colIdx].hasShip()) return false;
    //         }
    //     }
    //     return true;
    // }
    public isPlacementPossible(startingPoint: Coord, endingPoint: Coord, isHorizontal: boolean) {
        const { SIZE, board } = this;
        const [startRow, startCol] = startingPoint;
        const [endRow, endCol] = endingPoint;

        if (endRow >= SIZE || endCol >= SIZE) {
            return false;
        }

        const getCell = (row: number, col: number) => board[row]?.[col];

        const checkCells = (row: number, col: number, deltaRow: number, deltaCol: number) => {
            while (row !== endRow || col !== endCol) {
                if (getCell(row, col)?.hasShip()) {
                    return false;
                }
                row += deltaRow;
                col += deltaCol;
            }
            return true;
        };

        return isHorizontal ?
            checkCells(startRow, startCol, 0, 1) :
            checkCells(startRow, startCol, 1, 0);
    }

    public getStartEndPoints(length: number, coord: Coord, isHorizontal: boolean): [Coord, Coord] {
        const [rowIdx, colIdx] = coord;
        const endRowIdx = isHorizontal ? rowIdx : rowIdx + length - 1;
        const endColIdx = isHorizontal ? colIdx + length - 1 : colIdx;
        return [[rowIdx, colIdx], [endRowIdx, endColIdx]];
    }
}
export default Board;