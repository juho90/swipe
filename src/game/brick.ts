import IPos2d from './pos2d';

export default class Brick implements IPos2d {
	public w: number;
	public h: number;
	public x: number;
	public y: number;

	constructor(w: number = 0, h: number = 0, x: number = 0, y: number = 0) {
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
	}

	public center(): IPos2d {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.h / 2
		}
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fill();
		ctx.stroke();
	}
}