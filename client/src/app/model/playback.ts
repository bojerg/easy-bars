export class Playback {
    public playing: boolean;
    public paused: boolean;
    public bar: number;
    public beat: number;
    public bpm: number;

    constructor(playing: boolean, paused: boolean, bar: number, beat: number, bpm: number) {
        this.playing = playing;
        this.paused = paused;
        this.bar = bar;
        this.beat = beat;
        this.bpm = bpm;
    }

}