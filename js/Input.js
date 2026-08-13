export default class Input {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;

        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;

        this.counter = 0;
        this.limitShoot = true;

        /*
         * True ONLY after pressing OK/click.
         * Moving the Magic Remote never sets this.
         */
        this.shootRequested = false;

        canvas.addEventListener(
            "mousemove",
            (event) => {
                this.updatePointer(event);
            }
        );

        /*
         * Magic Remote OK / click.
         */
        canvas.addEventListener(
            "click",
            (event) => {
                this.updatePointer(event);
                this.shoot();
            }
        );

        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
                    
                // BACK
                case 461:
                    event.preventDefault();
                    if (game.gamestate === 1) {
                        game.openPauseMenu();
                    } else if (game.gamestate === 2) {
                        game.exitGame();
                    }
                    break;
                    
                // OK / ENTER
                case 13:
                    if (game.gamestate === 4) {
                        game.selectPauseMenu();
                    }
                    break;
                }
        });
    }

    updatePointer(event) {
        const rect = this.canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return;
        }

        const scaleX = this.canvas.width / rect.width;

        const scaleY = this.canvas.height / rect.height;

        this.mouseX = (event.clientX - rect.left) * scaleX;

        this.mouseY = (event.clientY - rect.top) * scaleY;

        this.mouseX = Math.max(
            0,
            Math.min(this.canvas.width, this.mouseX)
        );

        this.mouseY = Math.max(
            0,
            Math.min(this.canvas.height, this.mouseY)
        );
    }

    shoot() {
        const game = this.game;

        // MENU
        if (game.gamestate === 2) {
            this.menuStartGame();
            return;
        }

	if (game.gamestate === 4) {
            game.selectPauseMenu();
            return;
        }

        // Not playing.
        if (game.gamestate !== 1) {
            return;
        }

        /*
         * OK was pressed.
         * Collision will be checked on the next
         * game update.
         */
        if (
            game.canShoot &&
            this.limitShoot
        ) {
            this.shootRequested = true;

            game.sounds.gunShot.play();

            this.counter = 0;

            game.gameStats.shoot++;
        }
    }

    menuStartGame() {
        if (this.mouseX > 236 && this.mouseX < 531 && this.mouseY > 447 && this.mouseY < 473) {
            this.game.gamestate = 1;
            this.game.gameStats.round = 0;
            this.game.start();
            this.game.newRound();
            return;
        }
    }

    limitClick(deltaTime) {
        this.counter += deltaTime / 16;
        
        this.limitShoot = this.counter >= 50;
    }
}
