import Player from '../src/lib/player';
import { Coord } from '../src/lib/types';

describe('Player class', () => {
    let player: Player;

    beforeEach(() => {
        player = new Player('TestPlayer', '1234');
    });

    describe('Initialization', () => {
        test('should create a player with the correct name', () => {
            expect(player.getName()).toBe('TestPlayer');
        });
    });

    describe('Ship Management', () => {
        test('should add a ship and decrease the number of ships', () => {
            const result = player.addShip([0, 0]);
            expect(result).toBe(true);
            expect(player.getAvaliableShips()).toBe(4);
        });

        test('should not add a ship if no ships are left', () => {
            for (let i = 0; i < 5; i++) {
                player.addShip([i, 0]);
            }
            const result = player.addShip([5, 0]);
            expect(result).toBe(false);
        });

        test('should rotate the ship orientation', () => {
            const initialOrientation = player.rotateShip();
            const newOrientation = player.rotateShip();
            expect(newOrientation).toBe(!initialOrientation);
        });

        test('should place ships randomly until the player is ready', () => {
            player.placeShipsRandomly();
            expect(player.isReady()).toBe(true);
        });
    });

    describe('Game Play', () => {
        test('should receive attack at the given coordinate', () => {
            const coord: Coord = [0, 0];
            player.addShip(coord);
            const result = player.receiveAttack(coord);
            expect(result).toBe(true);
        });

        test('should return true if all ships are sunk', () => {
            player.addShip([0, 0]);
            player.receiveAttack([0, 0]);
            player.receiveAttack([0, 1]);
            player.receiveAttack([0, 2]);
            player.receiveAttack([0, 3]);
            player.receiveAttack([0, 4]);
            const result = player.hasLost();
            expect(result).toBe(true);
        });

        test('should return false if not all ships are sunk', () => {
            player.addShip([0, 0]);
            const result = player.hasLost();
            expect(result).toBe(false);
        });

        test('should return true if the coordinate is occupied', () => {
            player.addShip([0, 0]);
            player.receiveAttack([0, 0]);
            const result = player.isConqueredCell([0, 0]);
            expect(result).toBe(true);
        });

        test('should return false if the coordinate is not occupied', () => {
            const result = player.isConqueredCell([0, 0]);
            expect(result).toBe(false);
        });
    });

    describe('Player Status', () => {
        test('should return true if the player is ready', () => {
            player.placeShipsRandomly();
            expect(player.isReady()).toBe(true);
        });

        test('should return false if the player is not ready', () => {
            expect(player.isReady()).toBe(false);
        });
    });
});
