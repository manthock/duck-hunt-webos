import Game from "./Game.js";
import LoadAssets from "./LoadAssets.js";

const GAME_WIDTH = 768;
const GAME_HEIGHT = 720;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

function resizeCanvas() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const gameRatio = GAME_WIDTH / GAME_HEIGHT;
    const screenRatio = screenWidth / screenHeight;

    let width;
    let height;

    if (screenRatio > gameRatio) {
        height = screenHeight;
        width = height * gameRatio;
    } else {
        width = screenWidth;
        height = width / gameRatio;
    }

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let game = null;

function startGame() {
    game = new Game(GAME_WIDTH, GAME_HEIGHT, ctx);

    game.start();

    let lastTime = performance.now();

    function loop(timestamp) {
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        // Prevent huge jumps after the TV wakes up or the app loses focus
        deltaTime = Math.min(deltaTime, 100);

        try {
            game.update(deltaTime);
            game.draw();
        } catch (error) {
            console.error("Duck Hunt game loop error:", error);
            return;
        }
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

const assets = new LoadAssets(startGame);

assets.loadImages();
assets.loadSounds();
