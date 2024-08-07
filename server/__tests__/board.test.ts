import Board from '../src/lib/board';
// import { Coord } from '../src/lib/types';

describe('Board class', () => {
    let board: Board;

    beforeEach(() => {
        board = new Board();
    });

    describe('Initialization', () => {
        test('should initialize board with cells', () => {
            const cells = board.getBoard();
            expect(cells.length).toBe(10);
            cells.forEach(row => expect(row.length).toBe(10));
        });
    });

    describe('Ship Management', () => {
        test('should add a ship to the board', () => {
            const result = board.addShip(3, [0, 0], true);
            expect(result).toBe(true);
            expect(board.addShip(3, [0, 0], true)).toBe(false); 
        });

        test('check placement possibility in the row', () => {
            expect(board.addShip(5, [0, 0], true)).toBe(true);
            expect(board.addShip(4, [0, 5], true)).toBe(true);
            expect(board.addShip(3, [0, 9], true)).toBe(false);
        });

        test('check placement possibility in the column', () => {
            expect(board.addShip(5, [0, 0], false)).toBe(true);
            expect(board.addShip(4, [5, 0], false)).toBe(true);
            expect(board.addShip(3, [9, 0], false)).toBe(false);
        });
    });

    describe('Game Play', () => {
        test('should receive an attack and hit a ship', () => {
            board.addShip(3, [0, 0], true);
            const result = board.receiveAttack([0, 0]);
            expect(result).toBe(true);
            expect(board.getBoard()[0][0].isHitted()).toBe(true);
        });

        test('should return true if all ships are sunk', () => {
            board.addShip(3, [0, 0], true);
            board.receiveAttack([0, 0]); // Simulate hitting the ship
            board.receiveAttack([0, 1]); // Simulate hitting the ship
            board.receiveAttack([0, 2]); // Simulate hitting the ship
            const result = board.isAllShipsSunk();
            expect(result).toBe(true);
        });

        test('should return false if not all ships are sunk', () => {
            board.addShip(3, [0, 0], true);
            board.receiveAttack([0, 0]); // Simulate hitting the ship
            const result = board.isAllShipsSunk();
            expect(result).toBe(false);
        });

        test('should return true if the coordinate is occupied', () => {
            board.addShip(3, [0, 0], true);
            board.receiveAttack([0, 0]);
            const result = board.isHittedCell([0, 0]);
            expect(result).toBe(true);
        });

        test('should return false if the coordinate is not occupied', () => {
            const result = board.isHittedCell([0, 0]);
            expect(result).toBe(false);
        });
    });
});