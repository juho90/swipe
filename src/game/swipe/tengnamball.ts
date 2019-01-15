import Ball from '../ball';
import Vec2 from '../vec2';

export default class Tengnamball extends Ball {
    public dir: Vec2;

    constructor(r: number = 0, x: number = 0, y: number = 0) {
        super(r, x, y);
        this.dir = new Vec2;
    }

    public setDir(x: number, y: number) {
        this.dir.x = x;
        this.dir.y = y;
    }

    public move(dtime: number) {
        this.x += this.dir.x * dtime;
        this.y += this.dir.y * dtime;
    }
}