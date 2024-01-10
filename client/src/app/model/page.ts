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
}