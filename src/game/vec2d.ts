export default class Vec2d {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public zero(): void {
        this.x = 0;
        this.y = 0;
    }

    public multiply(value: number) {
        this.x *= value;
        this.y *= value;
    }

    public leng(): number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    public nomalize(): void {
        const length = this.leng();
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
}