import MyMath from './mymath';
import IPos2d from './pos2d';
import Vec2d from './vec2d';

export default class FunctionalPos<T extends IPos2d = Vec2d> {
    public pos: T;
    public target: IPos2d | null;
    public dir: IPos2d | null;
    private interval: number;
    private timer: number;

    constructor(creater: new () => T) {
        this.pos = new creater();
        this.target = null;
        this.dir = null;
    }

    public follow(target: IPos2d | null, interval: number = 0): void {
        this.target = target;
        this.interval = interval;
        this.timer = 0;
    }

    public move(dir: IPos2d): void {
        this.dir = dir;
    }

    public update(dtime: number) {
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