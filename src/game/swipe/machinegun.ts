import Vec2 from '../vec2';
import Tengnamball from './tengnamball';

export default class Machinegun {
    public balls: Tengnamball[];
    public x: number;
    public y: number;
    public r: number;
    public dir: Vec2;
    public timer: number;
    private etime: number
    private count: number;

    constructor() {
        this.balls = [];
        this.dir = new Vec2;
        this.etime = 0;
        this.count = 0;
    }

    public setMagazine(amount: number): void {
        this.balls = [];
        for (let index = 0; index < amount; ++index) {
            this.balls.push(new Tengnamball(this.r, this.x, this.y));
        }
    }

    public setMM(r: number): void {
        this.r = r;
        this.balls.forEach(element => {
            element.r = this.r;
        });
    }

    public setPos(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.balls.forEach(element => {
            element.x = x;
            element.y = y;
        });
    }

    public shotAngle(fps: number, radian: number): void {
        this.dir.angle(radian);
        this.dir.multiply(40);
        this.timer = 1 / fps;
        this.etime = 0;
        this.count = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.setDir(this.dir.x, this.dir.y);
        });
    }
    
    public shotTarget(fps: number, x: number, y:number): void {
        this.dir.x = x - this.x;
        this.dir.y = y - this.y;
        this.dir.nomalize();
        this.dir.multiply(40);
        this.timer = 1 / fps;
        this.etime = 0;
        this.count = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.setDir(this.dir.x, this.dir.y);
        });
    }

    public reload(): void {
        this.etime = 0;
        this.count = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.setDir(0, 0);
        });
    }

    public update(dtime: number): void {
        this.etime += dtime;
        if (this.timer <= this.etime) {
            this.etime = 0;
            this.count = Math.min(this.count + 1, this.balls.length);
        }
        for (let index = 0; index < this.count; ++index) {
            this.balls[index].move(dtime);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.balls.forEach(element => {
            element.draw(ctx);
        });
    }
}