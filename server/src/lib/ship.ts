class Ship {
    private length: number;
    private hitsNum: number;
    constructor(length: number) {
        this.length = length;
        this.hitsNum = 0;
    }
    public hit() {
        this.hitsNum++;
    }
    public isSunk() {
        return this.hitsNum === this.length;
    }

    public getLength() {
        return this.length;
    }
}

export default Ship;