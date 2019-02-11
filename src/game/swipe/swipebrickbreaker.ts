import * as Matter from 'matter-js';
import Physics2D from '../physics2d';

export interface IBrick {
    id: number;
    skin: number;
    size: number;
}

export interface IBall {
    id: number;
    size: number;
}

export default class SwipeBrickBreaker {
    public static genRandoms(min: number, max: number): number[] {
        const line: number[] = [];
        const limit = Math.abs(max - min);
        const count = 1 + Math.floor(Math.random() * (limit - 1));
        const tmin = Math.min(min, max);
        for (let index = 0; index < count;) {
            const value = tmin + Math.floor((Math.random() * limit));
            if (line.find((element: number) => {
                return element === value;
            }) === undefined) {
                ++index;
                line.push(value);
            }
        }
        return line;
    }

    public w: number;
    public h: number;
    public bricks: Map<IBrick, Matter.Body>;
    public balls: Map<IBall, Matter.Body>;
    public stones: Map<IBrick, Matter.Body>;
    public gunX: number;
    public gunY: number;
    public gunSize: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.gunSize = 10;
        const pos = this.getBasePosOfBall(this.gunSize);
        this.gunX = pos.x;
        this.gunY = pos.y;
        this.bricks = new Map;
        this.balls = new Map;
        this.stones = new Map;
    }

    public genBalls(physics: Physics2D, balls: IBall[]): void {
        balls.forEach(element => {
            const pos = this.getBasePosOfBall(element.size);
            const body = physics.addCircle("ball", pos.x, pos.y, element.size, { isStatic: true });
            body.id = element.id;
            this.balls.set(element, body);
        });
    }

    public shootBalls(fps: number, target: Matter.Vector): void {
        const dir = Matter.Vector.normalise({ x: target.x - this.gunX, y: target.y - this.gunY });
        let count = 0;
        this.balls.forEach((value) => {
            setTimeout((args: any[]) => {
                const ball: Matter.Body = args[0];
                Matter.Body.setStatic(ball, false);
                Matter.Body.setVelocity(ball, args[1]);
            }, count++ / fps, [value, dir]);
        });
    }

    public genBricks(physics: Physics2D, skin: number, size: number): void {
        const line = SwipeBrickBreaker.genRandoms(0, Math.floor(this.w / size));
        line.forEach(element => {
            const brick = { id: 0, skin, size };
            const body = physics.addBox("brick", element * size, 0, size, size, { isStatic: true });
            body.id = brick.id;
            this.bricks.set(brick, body);
        });
    }

    public dropBricks(deep: number): void {
        this.bricks.forEach(value => {
            Matter.Body.setPosition(value, { x: value.position.x, y: value.position.y + deep });
        });
    }

    private getBasePosOfBall(size: number): any {
        return {
            x: (this.w / 2) + size,
            y: this.h - ((size * 2) + 3)
        }
    }
}