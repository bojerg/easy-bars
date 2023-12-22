import { Phrase } from "./phrase";

export class Page {
    title: string;
    lyrics: Phrase[];
    hasFlow: boolean;
    startsOn: number;
    duration: number;

    constructor(title: string, lyrics: Phrase[], hasFlow: boolean) {
        this.title = title;
        this.lyrics = lyrics;
        this.hasFlow = hasFlow;
        this.startsOn = 0;
        this.duration = 0;

        //calculate duration or set default (16 beats)
        this.lyrics.forEach((lyric) => { this.duration += lyric.duration; })
        this.duration = this.duration >= 16 ? this.duration : 16;
    }
}