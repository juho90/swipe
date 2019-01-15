export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public multiply(value: number) {
        this.x *= value;
        this.y *= value;
    }

    public length(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    public nomalize(): void {
        const length = this.length();
        this.x /= length;
        this.y /= length;
    }

    public angle(radian: number): void {
        this.x = Math.cos(radian);
        this.y = Math.sin(radian);
    }

    public rotate(radian: number): void {
        const rX = this.x * Math.cos(radian) - this.y * Math.sin(radian);
        const rY = this.x * Math.sin(radian) + this.y * Math.cos(radian);
        this.x = rX;
        this.y = rY;
    }

    public reverseXAsix(): void {
        this.y *= -1;
    }

    public reverseYAsix(): void {
        this.x *= -1;
    }

    public reverse(): void {
        this.x *= -1;
        this.y *= -1;
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}