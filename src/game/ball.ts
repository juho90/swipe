import IPos2d from './pos2d';

export default class Ball implements IPos2d {
    public r: number;
    public x: number;
    public y: number;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        this.r = r;
        this.x = x;
        this.y = y;
    }

    public center(): IPos2d {
        return {
            x: this.x + this.r,
            y: this.y + this.r
        }
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