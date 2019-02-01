import MyMath from './mymath';
import Vec2d from './vec2d';

export default class FunctionalPos<T extends Vec2d = Vec2d> {
    public pos: T;
    public target: Vec2d | null;
    public dir: Vec2d | null;
    private interval: number;
    private timer: number;

    constructor(creater: new () => T) {
        this.pos = new creater();
        this.target = null;
        this.dir = null;
    }

    public follow(target: Vec2d | null, interval: number = 0): void {
        this.target = target;
        this.interval = interval;
        this.timer = 0;
    }

    public push(dir: Vec2d): void {
        if (this.dir === null) {
            this.dir = new Vec2d(0, 0);
        }
        this.dir.x += dir.x;
        this.dir.y += dir.y;
    }

    public gravity(g: number, dtime: number): void {
        if (this.dir == null) {
            this.dir = new Vec2d(0, 0);
        }
        this.dir.y += g * dtime;
    }

    public update(dtime: number): void {
        if (this.dir !== null) {
            this.pos.x += this.dir.x * dtime;
            this.pos.y += this.dir.y * dtime;
        }
        if (this.target !== null) {
            this.timer = Math.min(this.timer + dtime, this.interval);
            const pos = MyMath.posLerp(this.pos, this.target, this.timer / this.interval);
            this.pos.x = pos.x;
            this.pos.y = pos.y;
        }
    }
}