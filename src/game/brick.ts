import Vec2d from './vec2d';

export default class Brick extends Vec2d {
	public w: number;
	public h: number;

	constructor(w: number = 0, h: number = 0, x: number = 0, y: number = 0) {
		super(x, y);
		this.w = w;
		this.h = h;
	}

	public center(): Vec2d {
		return new Vec2d(
			this.x + this.w / 2,
			this.y + this.h / 2);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fill();
		ctx.stroke();
	}
}