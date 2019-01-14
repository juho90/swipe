export default class Brick {
	public x: number;
	public y: number;
	public w: number;
	public h: number;

	constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.fill();
		ctx.stroke();
	}
}