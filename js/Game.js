import Input from "./Input.js";
import Display from "./Display.js";
import Sounds from "./Sounds.js";
import Collision from "./Collision.js";
import GameStats from "./GameStats.js";

import Dog from "./Dog.js";
import Duck from "./Duck.js";
import RedDuck from "./RedDuck.js";
import BlueDuck from "./BlueDuck.js";

const GAMESTATE = {
    RUNNING: 1,
    MENU: 2,
    GAMEOVER: 3,
    PAUSE_MENU: 4
};

export default class Game {
    constructor(gameWidth, gameHeight, ctx) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.ctx = ctx;

        this.sounds = new Sounds();

        this.input = new Input(this, document.querySelector("#canvas"));

        this.gameStats = new GameStats(this);

        this.collision = new Collision(this);

        this.display = new Display(this);

        this.grassImage = document.querySelector("#grass");
		
		this.backgroundImage = document.querySelector('#background');

        this.gamestate = GAMESTATE.MENU;
        
        this.sounds.start.play();
    }

    start() {
        this.runLaugh = true;

        this.timer = 0;

        this.ducks = [new Duck(this), new RedDuck(this), new BlueDuck(this)];

        this.dog = new Dog(this);

        this.duck = this.ducks[0];

        this.canShoot = false;
    }

    runIntro() {
        this.sounds.start.stop();

        this.sounds.intro.play();

        this.dog.runIntro = true;
    }

    respawnDuck() {
        this.duck.startRespawn = true;
    }

    newRound() {
        this.gameStats.checked = false;

        this.timer = 0;

        this.canShoot = false;

        this.dog.drawGrass = false;

        this.display.displayCurrentRound = true;

        this.perfectRound = false;

        this.gameStats.update();

        this.gameStats.correctHits = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ];

        this.gameStats.currentSubRound = 0;
        this.gameStats.missHits = 0;

        this.gameStats.round++;

        this.runIntro();

        this.newSubRound();
    }

    newSubRound() {
        this.dog.resetPropertiesAfterRound();

        this.duck = this.ducks[Math.floor(Math.random() * 3)];
		this.duck.wholeDistanceTraveled = 0;
		this.duck.dropSoundActive = true;

        this.dog.canStartNextSubRound = false;

        this.canFlyAway = true;

        this.gameStats.currentSubRound++;

        this.gameStats.shoot = 0;

        this.respawn = true;
    }

    loseSubRound() {
    	this.canShoot = false;

    	if (!this.duck.beHit && this.duck.duckAlive && this.canFlyAway) {
        	this.canFlyAway = false;
        	this.duck.flyAwayNow = true;

        	this.gameStats.correctHits[this.gameStats.currentSubRound - 1] = -1;
    	}
    }

    showPerfectButton(deltaTime) {
        this.timer += deltaTime / 16;

        this.display.perfectButton();

        if (this.timer > 100) {
            this.newRound();
        }
    }

    summaryRound(deltaTime) {
        if (this.gameStats.currentSubRound !== 10) {
            this.newSubRound();
        } else {
            if (!this.gameStats.checked) {
                this.gameStats.summaryRounds();
            }

            if (this.perfectRound) {
                this.sounds.perfect.play();
                this.showPerfectButton(deltaTime);
                return;
            }

            if (this.gamestate !== GAMESTATE.GAMEOVER) {
                this.newRound();
            }
        }
    }

    gameOver(deltaTime) {
        this.canShoot = false;

        if (this.runLaugh) {
            this.dog.laugh();
            this.runLaugh = false;
        }

        this.timer += deltaTime / 16;

        this.dog.update(deltaTime);

        if (this.timer > 350) {
            this.gamestate = GAMESTATE.MENU;
            this.sounds.start.play();
            this.gameStats.score = 0;
        }
    }
    
    openPauseMenu() {
        if (this.gamestate !== GAMESTATE.RUNNING) {
            return;
        }
        this.sounds.pause();
        this.gamestate = GAMESTATE.PAUSE_MENU;
    }
    
    resumeGame() {
       this.sounds.resume();
       this.gamestate = GAMESTATE.RUNNING;
    }
    
    selectPauseMenu() {
        const y = this.input.mouseY;

        if (y >= this.gameHeight * 0.45 &&
            y <= this.gameHeight * 0.55) {
            this.resumeGame();
            return;
        }
        
        if (y >= this.gameHeight * 0.55 &&
            y <= this.gameHeight * 0.65) {
            this.exitGame();
        }
    }

    exitGame() {
        if (window.webOS && typeof webOS.platformBack === "function") {
            webOS.platformBack();
            return;
	}
	window.close();
    }

    draw() {
    	// Clear previous frame
    	this.ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);

      	//GAME BACKGROUND
    	if (this.backgroundImage) {
             this.ctx.drawImage(this.backgroundImage, 0, 0, this.gameWidth, this.gameHeight);
    	}

    	//DOG + DUCK
    	this.dog.draw();
    	this.duck.draw();
    	
    	//FLYAWAY BACKGROUND
    	if (this.duck.flyAwayNow) {
    	    this.ctx.fillStyle = 'rgba(207, 38, 8, 0.6)';
    	    this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    	    this.display.flyAwayButton();
	}

      	// GRASS
    	if (this.dog.drawGrass && this.grassImage) {
             this.ctx.drawImage(this.grassImage, 0, 0, this.gameWidth, this.gameHeight);
    	}

      	// HUD / SCORE / ROUND
    	this.display.draw();

      	// Points awarded for the current duck.
    	if (this.duck.beHit && this.display.posXMouseWhenHitDuck !== null) {
             this.display.displayPointsForDuck();
    	}
    }

    update(deltaTime) {
        if (this.gamestate === GAMESTATE.PAUSE_MENU) {
            return;
        }

        if (this.gamestate === GAMESTATE.MENU) {
            return;
        }

        if (this.gamestate === GAMESTATE.GAMEOVER) {
            this.gameOver(deltaTime);
            return;
        }

        if (this.duck.runDogPickUp) {
            this.dog.pickUp(1, this.duck.position.x);
            this.duck.runDogPickUp = false;
        }

        this.collision.update(this.duck);

        this.dog.update(deltaTime);

        this.duck.update(deltaTime);

        this.input.limitClick(deltaTime);

        if (!this.dog.runIntro && this.respawn) {
            this.respawnDuck();

            this.canShoot = true;

            this.respawn = false;
        }

        if (this.gameStats.shoot >= 3) {
            this.loseSubRound();
        }

        if (this.dog.canStartNextSubRound) {
            this.summaryRound(deltaTime);
        }
    }
}
