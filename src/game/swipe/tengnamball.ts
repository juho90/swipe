import Ball from '../ball';
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

    public update(dtime: number): void {
        this.x += this.dir.x * dtime;
        this.y += this.dir.y * dtime;
    }
}