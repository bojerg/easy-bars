export class Playback {
    public playing: boolean;
    public paused: boolean;
    public metronome: boolean;
    public bar: number;
    public beat: number;
    public bpm: number;

    constructor(playing: boolean, paused: boolean, metronome: boolean, bar: number, beat: number, bpm: number) {
        this.playing = playing;
        this.paused = paused;
        this.metronome = metronome;
        this.bar = bar;
        this.beat = beat;
        this.bpm = bpm;
    }

}