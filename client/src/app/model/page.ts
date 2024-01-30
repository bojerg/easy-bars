import { Phrase } from "./phrase";

export class Page {
    id: number;
    title: string;
    lyrics: Phrase[];
    start: number;

    constructor(id: number, title: string, lyrics: Phrase[]) {
        this.id = id;
        this.title = title;
        this.lyrics = lyrics;
        this.start = 0;
    }

    getFullDuration(): number {
        let duration = 0;
        this.lyrics.forEach( phrase => duration += phrase.duration);
        return duration;
    }

    getPreview(): string {
        let preview = "";
        if(this.lyrics.length > 0 && this.lyrics[0].content !== "") {
            const content = this.lyrics[0].content;
            preview = content.length < 13 ? content : content.substring(0, 12);
        } else if(this.lyrics.length > 1) {
            for(let i = 1; i < this.lyrics.length; i++) {
                if(this.lyrics[i].content !== "") {
                    const content = this.lyrics[i].content;
                    preview = content.length < 13 ? content : content.substring(0, 12);
                    break;
                }
            }
        }
        return preview === "" ? "Empty page" : preview + " ...";
    }
}