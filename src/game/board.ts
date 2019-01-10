import Brick from './brick';

export default class Board {
    public bricks: Array<Array<Brick | null>>;
    public cell: number;

    constructor(w: number, h: number, cell: number) {
        this.bricks = [];
        for (let y = 0; y < h; ++y) {
            this.bricks[y] = [];
            for (let x = 0; x < w; ++x) {
                this.bricks[y][x] = null;
            }
        }
        this.cell = cell;
    }

    public addMany(list: any[]): void {
        list.forEach(element => {
            this.add(element.x, element.y);
        });
    }

    public add(cellx: number, celly: number): void {
        this.bricks[celly][cellx] = new Brick(
            cellx * this.cell,
            celly * this.cell,
            this.cell,
            this.cell);
    }

    public remove(cellx: number, celly: number): void {
        this.bricks[celly][cellx] = null;
    }

    public find(cellx: number, celly: number): Brick | null {
        return this.bricks[celly][cellx];
    }

    public detect(x: number, y: number): Brick | null {
        return this.find(y / this.cell, x / this.cell);
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
