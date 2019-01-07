export default class Brick {
	public x: number;
	public y: number;
	public w: number;
	public h: number;

	constructor(x: number, y: number, w: number, h: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	public draw(canvas: CanvasRenderingContext2D): void {
		canvas.beginPath();
		canvas.rect(this.x, this.y, this.w, this.h);
		canvas.fill();
		canvas.stroke();
	}
}