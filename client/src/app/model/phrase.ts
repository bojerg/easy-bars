export class Phrase {
    public content: string;
    public duration: number;
    public isPause: boolean;

    constructor(content: string, duration: number, isPause: boolean) {
        this.content = content;
        this.duration = duration;
        this.isPause = isPause;
    }

    public isEmpty(): boolean {
        return this.content === "" || this.content === null;
    }
}