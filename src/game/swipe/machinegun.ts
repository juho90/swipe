import Vec2d from '../vec2d';
import Tengnamball from './tengnamball';

export default class Machinegun {
    public balls: Tengnamball[];
    public x: number;
    public y: number;
    public r: number;
    public dir: Vec2d;
    public shootCount: number;
    private shootInterval: number;
    private shootTimer: number;

    constructor() {
        this.balls = [];
        this.dir = new Vec2d;
        this.shootCount = 0;
        this.shootTimer = 0;
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

    public shootAngle(fps: number, radian: number): void {
        this.dir.angle(radian);
        this.dir.multiply(40);
        this.shootInterval = 1 / fps;
        this.shootTimer = 0;
        this.shootCount = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.move(this.dir.x, this.dir.y);
        });
    }

    public shootTarget(fps: number, x: number, y: number): void {
        this.dir.x = x - this.x;
        this.dir.y = y - this.y;
        this.dir.nomalize();
        this.dir.multiply(80);
        this.shootInterval = 1 / fps;
        this.shootTimer = 0;
        this.shootCount = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.move(this.dir.x, this.dir.y);
        });
    }

    public reload(): void {
        this.shootTimer = 0;
        this.shootCount = 0;
        this.balls.forEach(element => {
            element.x = this.x;
            element.y = this.y;
            element.stop();
        });
    }

    public add(): void {
        this.balls.push(new Tengnamball(this.r, this.x, this.y));
    }

    public update(dtime: number): void {
        this.shootTimer += dtime;
        if (this.shootInterval <= this.shootTimer) {
            this.shootTimer = 0;
            this.shootCount = Math.min(this.shootCount + 1, this.balls.length);
        }
        for (let index = 0; index < this.shootCount; ++index) {
            this.balls[index].update(dtime);
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.balls.forEach(element => {
            element.draw(ctx);
        });
    }
}