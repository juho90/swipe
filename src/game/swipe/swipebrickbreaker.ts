import Brick from '../brick';
import BreakableBrick from './breakablebrick';
import FlowdownBoard from './flowdownboard';
import Machinegun from './machinegun';

export default class SwipeBrickBreaker {
    public board: FlowdownBoard;
    public gun: Machinegun;
    public w: number;
    public h: number;
    public onBrokenBrick: (brick: Brick) => void;

    constructor(w: number, h: number, cell: number) {
        this.w = w;
        this.h = h;
        this.board = new FlowdownBoard(w, h, cell);
        this.gun = new Machinegun;
        this.gun.setMM(cell / 8);
        this.gun.setPos(
            (w / 2) + this.gun.r,
            h - ((this.gun.r * 2) + 3));
        this.gun.setMagazine(20);
    }

    public checkLimitLine(): boolean {
        return this.board.bricks[this.board.column - 1].find((element) => {
            return element !== null;
        }) !== undefined;
    }

    public checkMovingBall(): boolean {
        return this.gun.balls.find(element => {
            return element.dir.x !== 0 || element.dir.y !== 0;
        }) !== undefined;
    }

    public update(dtime: number): void {
        this.gun.update(dtime);
        this.board.detect<BreakableBrick>(brick => {
            for (const ball of this.gun.balls) {
                if (ball.boundWithBrick(brick) === true) {
                    brick.break();
                    if (brick.usable() !== true) {
                        this.onBrokenBrick(brick);
                        return false;
                    }
                }
            }
            return true;
        });
        this.gun.balls.forEach(element => {
            element.boundWithBoard(this.w, this.h);
        });
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.board.draw(ctx);
        this.gun.draw(ctx);
    }
}