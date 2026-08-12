export default class Collision {
    constructor(game) {
        this.game = game;

        this.gameStats = game.gameStats;

        this.input = game.input;
    }

    hitTestPoint(x1, y1, w1, h1, x2, y2) {
        if (x2 === null || y2 === null) {
            return false;
        }

        return (x1 <= x2 && x1 + w1 + 35 >= x2) &&
            (y1 <= y2 && y1 + h1 + 35 >= y2);
    }

    update(duck) {
        /*
         * Collision is checked ONLY when the
         * player actually pressed OK.
         */
        if (!this.input.shootRequested) {
            return;
        }

        /*
         * Consume the shot request immediately.
         */
        this.input.shootRequested = false;

        if (!this.game.canShoot || !this.input.limitShoot) {
            return;
        }

        if (!duck.duckAlive || duck.beHit) {
            return;
        }

        if (this.hitTestPoint(duck.position.x, duck.position.y, duck.widthDuck, duck.heightDuck, this.input.mouseX, this.input.mouseY)) {
            duck.beHit = true;

            this.game.sounds.duckFlapping.stop();

            this.gameStats.score += duck.points;

            this.gameStats.correctHits[this.gameStats.currentSubRound - 1] = 1;

            // need for display Score per Duck in background
            this.game.display.posXMouseWhenHitDuck = duck.position.x;
            this.game.display.posYMouseWhenHitDuck = duck.position.y;

            this.input.mouseX = null;
            this.input.mouseY = null;
        }
    }
}
