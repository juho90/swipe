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
            for (let index = 0; index < line.length; ++index) {
                const brick = (line[index] as BreakableBrick);
                if (brick === null) {
                    continue;
                }
                for (const ball of this.gun.balls) {
                    const result = MyMath.collisionBrickWithBall(brick, ball);
                    if (result.hit) {
                        switch (result.cw) {
                            case Clockwise.NONE:
                                ball.dir.reverse();
                                break;
                            case Clockwise.TRUE:
                                ball.dir.reverseXAsix();
                                break;
                            case Clockwise.ANTI:
                                ball.dir.reverseYAsix();
                                break;
                        }
                        brick.break();
                        if (brick.usable() !== true) {
                            break;
                        }
                    }
                }
                if (brick.usable() !== true) {
                    line[index] = null;
                }
            }
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