import { Phrase } from "./phrase";

export class Page {
    id: number;
    title: string;
    lyrics: Phrase[];

    constructor(id: number, title: string, lyrics: Phrase[]) {
        this.id = id;
        this.title = title;
        this.lyrics = lyrics;
    }

    splitLyricsByWord() {
        let newLyrics!: Phrase[];
        this.lyrics.forEach( (phrase) => {
            const words = phrase.content.split(" ");
            if(words.length > 1) words.forEach( word => newLyrics.push(new Phrase(word + " ", 1)));
            else newLyrics.push(new Phrase(words[0], 1));
        });
        this.lyrics = newLyrics;
    }
}