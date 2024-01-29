export class Phrase {
    public content: string;
    public duration: number;

    constructor(content: string, duration: number) {
        this.content = content;
        this.duration = duration;
    }

    public isEmpty(): boolean {
        return this.content === "" || this.content === null;
    }
}