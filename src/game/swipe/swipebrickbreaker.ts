import MyMath, { Clockwise } from '../mymath';
import BreakableBrick from './breakablebrick';
import FlowdownBoard from './flowdownboard';
import Machinegun from './machinegun';

export default class SwipeBrickBreaker {
    public board: FlowdownBoard;
    public gun: Machinegun;
    public w: number;
    public h: number;

    constructor(w: number, h: number, cell: number) {
        this.w = w;
        this.h = h;
        this.board = new FlowdownBoard(w / cell, h / cell, cell);
        this.gun = new Machinegun;
        this.gun.setMM(cell / 8);
        this.gun.setPos(
            (w / 2) + this.gun.r,
            h - ((this.gun.r * 2) + 3));
        this.gun.setMagazine(20);
    }

    public checkLimitLine(): boolean {
        return this.board.bricks[this.board.h - 1].find((element) => {
            return element !== null;
        }) !== undefined;
    }

    public checkMovingBall(): boolean {
        return this.gun.balls.find((element): boolean => {
            return element.dir.x !== 0 || element.dir.y !== 0;
        }) !== undefined;
    }

    public update(dtime: number): void {
        this.gun.update(dtime);
        this.board.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick == null) {
                    return;
                }
                this.gun.balls.forEach(element => {
                    const result = MyMath.collisionBrickWithBall(brick, element);
                    if (result.hit) {
                        (brick as BreakableBrick).break();
                        switch (result.cw) {
                            case Clockwise.NONE:
                                element.dir.reverse();
                                break;
                            case Clockwise.TRUE:
                                element.dir.reverseXAsix();
                                break;
                            case Clockwise.ANTI:
                                element.dir.reverseYAsix();
                                break;
                        }
                    }
                });
            });
        });
        this.gun.balls.forEach(element => {
            const over = MyMath.collisionBoardWithBall(this.w, this.h, element);
            if (over.overH === -1) {
                element.stop();
            }
            else {
                if (over.overW) {
                    element.dir.x = over.overW * Math.abs(element.dir.x);
                }
                if (over.overH) {
                    element.dir.y = over.overH * Math.abs(element.dir.y);
                }
            }
        });
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.board.draw(ctx);
        this.gun.draw(ctx);
    }
}