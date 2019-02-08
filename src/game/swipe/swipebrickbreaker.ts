import * as Matter from 'matter-js';
import Physics2D from '../physics2d';

interface IBrick {
    id: number;
    skin: number;
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
    public balls: Map<IBrick, Matter.Body>;
    public stones: Map<IBrick, Matter.Body>;
    public gunX: number;
    public gunY: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.bricks = new Map;
        this.balls = new Map;
        this.stones = new Map;
    }

    public dropBricks(deep: number): void {
        this.bricks.forEach(value => {
            Matter.Body.setPosition(value, { x: value.position.x, y: value.position.y + deep });
        });
    }

    public genBricks(physics: Physics2D, skin: number, size: number): void {
        const line = SwipeBrickBreaker.genRandoms(0, Math.floor(this.w / size));
        line.forEach(element => {
            const brick = { id: 0, skin, size };
            const body = physics.addBox(element * size, 0, size, size, true, "brick");
            body.id = brick.id;
            this.bricks.set(brick, body);
        });
    }
}