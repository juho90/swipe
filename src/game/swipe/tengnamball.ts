import Ball from '../ball';
import Brick from '../brick';
import MyMath, { Clockwise } from '../mymath';
import Vec2d from '../vec2d';

export default class Tengnamball extends Ball {
    public dir: Vec2d;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        super(r, x, y);
        this.dir = new Vec2d;
    }

    public move(x: number, y: number): void {
        this.dir.x = x;
        this.dir.y = y;
    }

    public stop(): void {
        this.dir.x = 0;
        this.dir.y = 0;
    }

    public boundWithBrick(brick: Brick): boolean {
        const result = MyMath.collisionBrickWithBall(brick, this);
        if (result.hit) {
            switch (result.cw) {
                case Clockwise.NONE:
                    this.dir.reverse();
                    break;
                case Clockwise.TRUE:
                    this.dir.reverseXAsix();
                    break;
                case Clockwise.ANTI:
                    this.dir.reverseYAsix();
                    break;
            }
        }
        return result.hit;
    }

    public boundWithBoard(w: number, h: number): boolean {
        const over = MyMath.collisionBoardWithBall(w, h, this, this.r);
        MyMath.resolveDirOverBoard(this.dir, over, dir => {
            dir.zero();
        });
        return over.overW !== 0 || over.overH !== 0;
    }

    public update(dtime: number): void {
        this.x += this.dir.x * dtime;
        this.y += this.dir.y * dtime;
    }
}