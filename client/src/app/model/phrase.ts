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

    public getBeats(): string {
        const whole = Math.floor(this.duration);
        const fraction = this.duration - whole;
        const wholeStr = whole > 0 ? whole.toString() : "";
        
        // https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
        var gcd = function(a:number, b:number): number {
            return b ? gcd(b, a%b) : a;
        }
        const fractionStr = fraction == 0 ? "" : ((fraction/0.0625)/gcd(16, fraction/0.0625)).toString() + "/" + (16/gcd(16, fraction/0.0625)).toString();

        return (wholeStr + " " + fractionStr).trim();
    }

}