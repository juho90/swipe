import Vec2d from './vec2d';

export default class Ball extends Vec2d {
    public r: number;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        super(x, y);
        this.r = r;
    }

    public center(): Vec2d {
        return new Vec2d(
            this.x + this.r,
            this.y + this.r);
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