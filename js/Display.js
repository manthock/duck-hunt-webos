export default class Display {
    constructor(game) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.ctx = game.ctx;

        this.logoImage = document.querySelector('#logo');
        this.shotImage = document.querySelector('#shot');
        this.subroundsDuckWhite = document.querySelector('#subround_duck_white');
        this.subroundsDuckRed = document.querySelector('#subround_duck_red');
        this.smallButton = document.querySelector('#small_button');
        this.bigButton = document.querySelector('#big_button');

        this.posXMouseWhenHitDuck = null;
        this.posYMouseWhenHitDuck = null;
        
        this.displayCurrentRound = false;
    }

    menuScreen() {
        this.ctx.rect(0, 0, this.gameWidth, this.gameHeight);
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fill();
        this.ctx.font = "30px 'Press Start 2P'";
        this.ctx.fillStyle = '#ff9c39';
        this.ctx.textAlign = 'center';

        this.ctx.drawImage(
            this.logoImage,
            this.gameWidth / 2 - this.logoImage.width / 2,
            this.gameHeight * 0.1
        );

        this.ctx.fillText('START GAME', this.gameWidth / 2, this.gameHeight * 0.66);
        this.ctx.font = "20px 'Press Start 2P'";


        this.ctx.fillStyle = '#47dd24';
        this.ctx.fillText(`BEST SCORE  =  ${this.game.gameStats.bestScore}`, this.gameWidth / 2, this.gameHeight * 0.8);

        this.ctx.fillStyle = 'white';
        this.ctx.fillText('© 2026 manthock', this.gameWidth / 2, this.gameHeight * 0.86);
        this.ctx.fillText('© 2020 Adi52', this.gameWidth / 2, this.gameHeight * 0.90);
    }

    drawBigButton(string1, string2) {
        this.ctx.drawImage(
            this.bigButton,
            this.gameWidth/2 - this.bigButton.width/2,
            this.gameHeight * 0.3
        );
        this.ctx.font = "22px 'Press Start 2P'";
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        if (string1 === 'PERFECT!!') {
            this.ctx.font = "14px 'Press Start 2P'";
        }
        this.ctx.fillText(string1,
            this.gameWidth/2,
            this.gameHeight * 0.36);
        this.ctx.font = "22px 'Press Start 2P'";
        this.ctx.fillText(string2,
            this.gameWidth/2,
            this.gameHeight * 0.41);
    }

    drawSmallButton(string) {
        this.ctx.drawImage(
            this.smallButton,
            this.gameWidth/2 - this.smallButton.width/2,
            this.gameHeight * 0.34
        );
        this.ctx.font = "22px 'Press Start 2P'";
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(string,
            this.gameWidth/2,
            this.gameHeight * 0.391);
    }
    
    pauseMenuScreen() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        this.ctx.textAlign = "center";
        this.ctx.font = "30px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.fillText("PAUSE", this.gameWidth / 2, this.gameHeight * 0.35);
        
        const y = this.game.input.mouseY;

        this.ctx.font = "22px 'Press Start 2P'";
        this.ctx.fillStyle = y >= this.gameHeight * 0.45 && y <= this.gameHeight * 0.55 ? "#ff9c39" : "white";
        this.ctx.fillText("RESUME", this.gameWidth / 2, this.gameHeight * 0.50);

        this.ctx.fillStyle = y >= this.gameHeight * 0.55 && y <= this.gameHeight * 0.65 ? "#ff9c39" : "white";
        this.ctx.fillText("EXIT", this.gameWidth / 2, this.gameHeight * 0.60);
    }
    
    displayPointsForDuck() {
        this.ctx.font = "22px 'Teko'";
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.game.duck.points, this.posXMouseWhenHitDuck + 25, this.posYMouseWhenHitDuck + 40);
    }

    showNumberRound() {
        this.ctx.font = "18px 'Press Start 2P'";
        this.ctx.fillStyle = '#47dd24';

        let round = "00" + this.game.gameStats.round;
        round = round.substr(round.length-2);

        this.ctx.fillText('R=' + round, 109, 598.5);
    }

    showScore() {
        // Thanks it we can display score in format 'SSSSSS'
        let score = "000000" + this.game.gameStats.score;
        score = score.substr(score.length-6);

        this.ctx.font = "22px 'Press Start 2P'";
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(score, 647, 647);
        this.ctx.fillText('SCORE', 658, 672);
    }

    showAvailableShoots() {
        for (let i = 0; i < 3 - this.game.gameStats.shoot; i++) {
            this.ctx.drawImage(this.shotImage, 78 + (i * 22), 625);
        }
    }

    showSubRoundsScore() {
        this.game.gameStats.correctHits.forEach((hit, index) => {
            if (hit === -1 || hit === 0) {
                this.ctx.drawImage(this.subroundsDuckWhite, 274 + (index * 25), 625);
            } else if (hit === 1) {
                this.ctx.drawImage(this.subroundsDuckRed, 274 + (index * 25), 625);
            }
        })
    }

    newRoundButton() {
        this.drawBigButton('ROUND', this.game.gameStats.round)
    }

    perfectButton() {
        this.drawBigButton('PERFECT!!', this.game.gameStats.perfectBonusScore)
    }

    flyAwayButton() {
        this.drawSmallButton('FLY AWAY');
    }

    gameOverButton() {
        this.drawBigButton('GAME', 'OVER');
    }

    draw() {

        if (this.game.gamestate === 2) {
            this.menuScreen();
            return;
        }

        this.showNumberRound();
        this.showScore();
        this.showAvailableShoots();
        this.showSubRoundsScore();

        if (this.game.perfectRound) {
            this.perfectButton();
        } else if (this.game.display.displayCurrentRound) {
            this.newRoundButton();
        }

        if (this.game.gamestate === 3) {
            this.gameOverButton();
        }

        if (this.game.gamestate === 4) {
            this.pauseMenuScreen();
        }
    }
}
