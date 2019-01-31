import Ball from '../ball';
import Brick from '../brick';
import MyMath, { Clockwise } from '../mymath';
import Vec2 from '../vec2';

export default class Tengnamball extends Ball {
    public dir: Vec2;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        super(r, x, y);
        this.dir = new Vec2;
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
        const over = MyMath.collisionBoardWithBall(w, h, this);
        if (over.overH === -1) {
            this.stop();
            return true;
        }
        else {
            let result: boolean = false;
            if (over.overW) {
                this.dir.x = over.overW * Math.abs(this.dir.x);
                result = true;
            }
            if (over.overH) {
                this.dir.y = over.overH * Math.abs(this.dir.y);
                result = true;
            }
            return result;
        }
    }

    public update(dtime: number): void {
        this.x += this.dir.x * dtime;
        this.y += this.dir.y * dtime;
    }
}