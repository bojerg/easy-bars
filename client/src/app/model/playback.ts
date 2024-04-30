import { PlaybackPhrase } from "../component/canvas/canvas.component";

export class Playback {
    public playing: boolean;
    public paused: boolean;
    public metronome: boolean;
    public bar: number;
    public beat: number;
    public bpm: number;
    public barsQueue1: PlaybackPhrase[][];
    public barsQueue2: PlaybackPhrase[][];
    public barsQueue3: PlaybackPhrase[][];

    constructor(playing: boolean, paused: boolean, metronome: boolean, bar: number, beat: number, bpm: number) {
        this.playing = playing;
        this.paused = paused;
        this.metronome = metronome;
        this.bar = bar;
        this.beat = beat;
        this.bpm = bpm;

        this.barsQueue1 = [];
        this.barsQueue2 = [];
        this.barsQueue3 = [];
    }

}