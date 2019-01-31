import Brick from './brick';

export default class Board {
    public bricks: Array<Array<Brick | null>>;
    public cell: number;
    public w: number;
    public h: number;

    constructor(w: number, h: number, cell: number) {
        this.bricks = new Array(h);
        this.bricks.fill(new Array(w), 0, h);
        this.bricks.forEach(element => {
            element.fill(null, 0, w);
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