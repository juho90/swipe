export default class Text2D {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;

    public init(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw new Error("This browser doesn't support 2D");
        }
        this.canvas = canvas;
        this.ctx = ctx;
    }

    public begin(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public setTextColor(color: string): void {
        this.ctx.fillStyle = color;
    }

    public setTextSize(px: number): void {
        this.ctx.font = px.toString() + "px Arial";
    }

    public drawText(text: string, x: number, y: number) {
        this.ctx.fillText(text, x, y);
    }
}