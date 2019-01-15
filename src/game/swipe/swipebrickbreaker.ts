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
            h - ((this.gun.r * 2) + 1));
        this.gun.setMagazine(20);
        const brickAmount = 10 + Math.floor(Math.random() * (this.board.h - 13));
        for (let i = 0; i < brickAmount; ++i) {
            this.board.genFlowdown();
        }
    }

    public start(dirX: number, dirY: number): void {
        this.gun.shotTarget(5, dirX, dirY);
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
            if (over.overW) {
                element.dir.x = over.overW * Math.abs(element.dir.x);
            }
            if (over.overH) {
                element.dir.y = over.overH * Math.abs(element.dir.y);
            }
        });
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.board.draw(ctx);
        this.gun.draw(ctx);
    }
}