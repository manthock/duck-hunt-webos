import Duck from "./Duck.js";


export default class RedDuck extends Duck {
    constructor(game) {
        super(game);
        this.currentRow = 1;
        this.points = 1000;
        this.duckSpeed = 1.3;
    }
}
