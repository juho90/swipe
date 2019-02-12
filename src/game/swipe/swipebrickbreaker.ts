import Physics2D, { P2 } from '../physics2d';

export enum Category {
    BOARD = 0x02,
    BRICK = 0x04,
    BALL = 0x08,
    STONE = 0x10
};

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
    public bricks: Map<IBrick, P2.Body>;
    public balls: Map<IBall, P2.Body>;
    public stones: Map<IBrick, P2.Body>;
    public gunX: number;
    public gunY: number;
    public gunSize: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
        this.gunSize = 5;
        const pos = this.getBasePosOfBall(this.gunSize);
        this.gunX = pos.x;
        this.gunY = pos.y;
        this.bricks = new Map;
        this.balls = new Map;
        this.stones = new Map;
    }

    public registerSource(physics: Physics2D): void {
        physics.registerFilter("board", {
            group: Category.BOARD,
            mask: Category.BRICK | Category.BALL | Category.STONE
        });
        physics.registerFilter("brick", {
            group: Category.BRICK,
            mask: Category.BOARD | Category.BALL
        });
        physics.registerFilter("ball", {
            group: Category.BALL,
            mask: Category.BOARD | Category.BRICK
        });
        physics.registerFilter("stone", {
            group: Category.STONE,
            mask: Category.BOARD
        });
        physics.registerMaterial("board", "ball", 0);
        physics.registerMaterial("brick", "ball", 0);
        physics.registerMaterial("board", "stone", 0.3);
    }

    public genBoard(physics: Physics2D): void {
        physics.addBorder(50, 0, 0, this.w, this.h, {
            collisionResponse: true,
            filter: "board",
            material: "board",
            gravityScale: 0,
            isStatic: true,
            mass: 1
        });
    }

    public genBalls(physics: Physics2D, balls: IBall[]): void {
        balls.forEach(element => {
            const pos = this.getBasePosOfBall(element.size);
            const body = physics.addCircle(pos.x, pos.y, element.size, {
                collisionResponse: true,
                filter: "ball",
                material: "ball",
                gravityScale: 0,
                isStatic: false,
                mass: 1
            });
            body.id = element.id;
            this.balls.set(element, body);
        });
    }

    public shootBalls(fps: number, target: number[]): void {
        const dir: number[] = [];
        P2.vec2.normalize(dir, [target[0] - this.gunX, target[1] - this.gunY]);
        P2.vec2.multiply(dir, dir, [40, 40]);
        let count = 0;
        this.balls.forEach((value) => {
            setTimeout((args: any[]) => {
                const ball: P2.Body = args[0];
                P2.vec2.copy(ball.velocity, args[1]);
            }, count++ / fps, [value, dir]);
        });
    }

    public genBricks(physics: Physics2D, skin: number, size: number): void {
        const line = SwipeBrickBreaker.genRandoms(0, Math.floor(this.w / size));
        line.forEach(element => {
            const brick = { id: 0, skin, size };
            const body = physics.addBox(element * size, 0, size, size, {
                collisionResponse: true,
                filter: "brick",
                material: "brick",
                gravityScale: 0,
                isStatic: true,
                mass: 1
            });
            body.id = brick.id;
            this.bricks.set(brick, body);
        });
    }

    public dropBricks(deep: number): void {
        this.bricks.forEach(value => {
            value.position[1] = value.position[1] + deep;
        });
    }

    private getBasePosOfBall(size: number): any {
        return {
            x: (this.w / 2) + size,
            y: this.h - ((size * 2) + 3)
        }
    }
}