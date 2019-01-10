import Ball from './ball';
import Vec2 from './vec2';

export default class Tengnamball {
    public ball: Ball;
    public dir: Vec2;

    constructor(x: number, y: number, r: number) {
        this.ball = new Ball(x, y, r);
        this.dir = new Vec2;
    }

    public setDir(x: number, y: number) {
        this.dir.x = x;
        this.dir.y = y;
    }

    public move(dTime: number) {
        this.ball.x += this.dir.x * dTime;
        this.ball.y += this.dir.y * dTime;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.ball.draw(ctx);
    }
}