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

        /*
         * Start loading asynchronously.
         * This MUST NOT block the game.
         */
        loadBuffer(src);
    }

    play() {
        const context = getAudioContext();

        const resume = context.state === "suspended" ? context.resume() : Promise.resolve();

        resume
            .then(() => loadBuffer(this.src))
            .then((buffer) => {
                if (!buffer) {
                    return;
                }

                if (this.source) {
                    try {
                        this.source.stop();
                    } catch (e) {
                        // Already stopped
                    }
                }

                const source = context.createBufferSource();
                const gain = context.createGain();

                source.buffer = buffer;
                source.loop = this.loop;

                gain.gain.value = this.volume;

                source.connect(gain);
                gain.connect(masterGain);

                source.onended = () => {
                    if (!this.loop && this.source === source) {
                        this.source = null;
                    }
                };

                this.source = source;

                try {
                    source.start(0);
                } catch (error) {
                    console.error("Duck Hunt: audio playback error:", this.src, error);
                }
            })
            .catch((error) => {
                console.error("Duck Hunt: failed to play sound:", this.src, error);
            });
    }

    stop() {
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
