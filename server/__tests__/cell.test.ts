import Cell  from '../src/lib/cell';

describe('Cell', () => {
  let cell: Cell;

  beforeEach(() => {
    cell = new Cell();
  });

  afterEach(() => {
    cell = new Cell();
  });

  test('test the defalut value of the cell', () => {
    expect(cell.getValue()).toBe(0);
  })

  test('addToken should add a token to the cell', () => {
    const token = 1;
    cell.addToken(token);
    expect(cell.getValue()).toBe(token);
  });

  test('hasShip should return true if the cell has a ship', () => {
    const token = 1;
    cell.addToken(token);
    expect(cell.hasShip()).toBeTruthy();
  });

  test('hasShip should return false if the cell has no ship', () => {
    expect(cell.hasShip()).toBeFalsy();
  });

  test('getValue should return the value of the cell', () => {
    const token = 1;
    cell.addToken(token);
    expect(cell.getValue()).toBe(token);
  });

  test('isHitted should return false if the cell has not been hit', () => {
    expect(cell.isHitted()).toBeFalsy();
  });

  test('isHitted should return true if the cell has been hit', () => {
    cell.hit();
    expect(cell.isHitted()).toBeTruthy();
  });

  test('hit should return true if the cell has a ship', () => {
    const token = 1;
    cell.addToken(token);
    expect(cell.hit()).toBeTruthy();
  });

  test('hit should return false if the cell has no ship', () => {
    expect(cell.hit()).toBeFalsy();
  });
});