export default class LoadAssets {
    constructor(startGameFun) {
        this.startGameFun = startGameFun;
        this.started = false;

        this.imagesSrc = [
            "big_button.png",
            "dog.png",
            "duck_fall.png",
            "duck_fly_up.png",
            "game_board.png",
            "game_board_grass.png",
            "logo.png",
            "shot.png",
            "small_button.png",
            "subround_duck_red.png",
            "subround_duck_white.png"
        ];

        this.imagesId = [
            "big_button",
            "dogImg",
            "ducksFall",
            "ducksFlyUpImg",
            "background",
            "grass",
            "logo",
            "shot",
            "small_button",
            "subround_duck_red",
            "subround_duck_white"
        ];
    }

    loadImages() {
        let remaining = this.imagesSrc.length;

        const imageDone = () => {
            remaining--;

            console.log(
                "Duck Hunt: images remaining:",
                remaining
            );

            if (remaining === 0) {
                this.start();
            }
        };

        for (
            let i = 0;
            i < this.imagesSrc.length;
            i++
        ) {
            const image =
                document.createElement("img");

            image.id = this.imagesId[i];

            image.style.position =
                "absolute";

            image.style.left =
                "-10000px";

            image.style.top =
                "-10000px";

            image.style.visibility =
                "hidden";

            image.style.pointerEvents =
                "none";

            image.onload = () => {
                console.log(
                    "Duck Hunt: loaded:",
                    this.imagesSrc[i]
                );

                imageDone();
            };

            image.onerror = () => {
                console.error(
                    "Duck Hunt: FAILED:",
                    image.src
                );

                imageDone();
            };

            image.src =
                "images/" +
                this.imagesSrc[i];

            document.body.appendChild(image);
        }
    }

    start() {
        if (this.started) {
            return;
        }

        this.started = true;
        this.startGameFun();
    }
}
