import Brick from './brick';

export default class Board {
    public bricks: Array<Array<Brick | null>>;
    public cell: number;
    public w: number;
    public h: number;

    constructor(w: number, h: number, cell: number) {
        this.bricks = [];
        for (let y = 0; y < h; ++y) {
            this.bricks[y] = [];
            for (let x = 0; x < w; ++x) {
                this.bricks[y][x] = null;
            }
        }
        this.cell = cell;
        this.w = w;
        this.h = h;
    }

    public add<T extends Brick = Brick>(brick: T, cellx: number, celly: number): void {
        brick.x = cellx * this.cell;
        brick.y = celly * this.cell;
        brick.w = this.cell;
        brick.h = this.cell;
        this.bricks[celly][cellx] = brick;
    }

    public remove(cellx: number, celly: number): void {
        this.bricks[celly][cellx] = null;
    }

    public find<T extends Brick = Brick>(cellx: number, celly: number): T | null {
        return this.bricks[celly][cellx] as T;
    }

    public detect<T extends Brick = Brick>(x: number, y: number): T | null {
        return this.find<T>(y / this.cell, x / this.cell);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick != null) {
                    brick.draw(ctx);
                }
            });
        });
    }
}