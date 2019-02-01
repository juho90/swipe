import Brick from './brick';

export default class Board {
    public bricks: Array<Array<Brick | null>>;
    public cell: number;
    public w: number;
    public h: number;
    public row: number;
    public column: number;

    constructor(w: number, h: number, cell: number) {
        this.row = w / cell;
        this.column = h / cell;
        this.bricks = new Array(this.column);
        this.bricks.fill(new Array(this.row), 0, this.column);
        this.bricks.forEach(element => {
            element.fill(null, 0, this.row);
        });
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

    public detect<T extends Brick = Brick>(func: (brick: T) => boolean): void {
        this.bricks.forEach(line => {
            line.forEach((brick, index, array) => {
                if (brick == null) {
                    return;
                }
                if (func(brick as T) !== true) {
                    array[index] = null;
                }
            });
        });
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