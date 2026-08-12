import Duck from "./Duck.js";


export default class BlueDuck extends Duck {
    constructor(game) {
        super(game);
        this.currentRow = 2;
        this.points = 1500;
        this.duckSpeed = 1.6;
    }
}
