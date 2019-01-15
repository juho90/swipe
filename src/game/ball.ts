export default class Ball {
    public r: number;
    public x: number;
    public y: number;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        this.r = r;
        this.x = x;
        this.y = y;
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