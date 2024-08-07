class Cell {
  private shipNum: number = 0;
  private hitted: boolean;

  constructor() {
    this.shipNum = 0;
    this.hitted = false;
  }

  public addToken(val: number) {
    this.shipNum = val;
  }

  public hasShip(): boolean {
    return this.shipNum > 0;
  }

  public getValue(): number {
    return this.shipNum;
  }

  public isHitted(): boolean {
    return this.hitted;
  }

  public hit(): boolean {
    this.hitted = true;
    if (this.hasShip()) {
        // -2 menas their is a ship in it and it has been hited
      this.shipNum = -2;
      return true;
    }
    // -1 means their is no ship in it and it has been hited
    this.shipNum = -1;
    return false;
  }
}

export default Cell;
