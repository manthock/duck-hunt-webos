const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioContext = null;
let masterGain = null;

const buffers = new Map();
const loading = new Map();

function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
        masterGain = audioContext.createGain();
        masterGain.gain.value = 0.5;
        masterGain.connect(audioContext.destination);
    }
    return audioContext;
}

async function loadBuffer(src) {
    const context = getAudioContext();

    if (!context) {
        return null;
    }

    if (buffers.has(src)) {
        return buffers.get(src);
    }

    if (loading.has(src)) {
        return loading.get(src);
    }

    const promise = fetch("audio/" + src)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }
            return response.arrayBuffer();
        })
        .then((data) => {
            return context.decodeAudioData(data);
        })
        .then((buffer) => {
            buffers.set(src, buffer);

            loading.delete(src);

            return buffer;
        })
        .catch((error) => {
            loading.delete(src);
            console.error("Duck Hunt: audio failed:", src, error);
            return null;
        });

    loading.set(src, promise);

    return promise;
}

export default class Sound {
    constructor(
        src,
        loop = false
    ) {
        this.src = src;

        this.loop = loop;

        this.volume = 1;

        this.source = null;

        this.playGeneration = 0;

        /*
         * Start loading asynchronously.
         * This MUST NOT block the game.
         */
        loadBuffer(src);
    }

    play() {
        const generation = ++this.playGeneration;

        const resumePromise =
            audioContext.state === "suspended"
                ? audioContext.resume()
                : Promise.resolve();

        return resumePromise
            .then(() => loadBuffer(this.src))
            .then((buffer) => {
                if (generation !== this.playGeneration) {
                    return;
                }

                if (this.source) {
                    try {
                        this.source.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }

                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);

                source.onended = () => {
                    if (this.source === source) {
                        this.source = null;
                    }
                };

                this.source = source;
                source.start(0);
            })
            .catch((error) => {
                console.error(`Unable to play sound ${this.src}:`, error);
            });
    }

    stop() {
        this.playGeneration++;

        if (this.source) {
            try {
                this.source.stop();
            } catch (e) {
                // Already stopped
            }

            this.source = null;
        }
    }

}

export function pauseAudio() {
    if (audioContext && audioContext.state === "running") {
        audioContext.suspend();
    }
}

export function resumeAudio() {
    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}
