export default class Ball {
    public x: number;
    public y: number;
    public r: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.arc(
            this.x + this.r,
            this.y + this.r,
            this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}