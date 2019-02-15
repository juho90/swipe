import Physics2D, { P2 } from '../physics2d';

export enum Category {
    BOARD = 0x02,
    BRICK = 0x04,
    BALL = 0x08,
    STONE = 0x10
};

export enum Board {
    LEFT = 1,
    TOP,
    RIGHT,
    BOTTOM
};

export interface IBrick {
    id: number;
    skin: number;
    size: number;
}

export interface IBall {
    id: number;
    stop: boolean;
    size: number;
}

export interface IStone {
    id: number;
    item: number;
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

    public static getBasePosOfBall(w: number, h: number, size: number): any {
        return {
            x: (w / 2) + size,
            y: h - ((size * 2) + 3)
        }
    }

    public w: number;
    public h: number;
    public cell: number;
    public physics: Physics2D;
    public bricks: Map<P2.Body, IBrick>;
    public balls: Map<P2.Body, IBall>;
    public stones: Map<P2.Body, IStone>;
    public gunX: number;
    public gunY: number;
    public gunSize: number;
    private noBoundedBall: number;

    constructor(w: number, h: number, cell: number) {
        this.w = w;
        this.h = h;
        this.cell = cell;
        this.physics = new Physics2D;
        this.bricks = new Map;
        this.balls = new Map;
        this.stones = new Map;
        this.gunSize = 5;
        const pos = SwipeBrickBreaker.getBasePosOfBall(w, h, this.gunSize);
        this.gunX = pos.x;
        this.gunY = pos.y;
    }

    public init(): void {
        this.physics.clear();
        this.physics.registerFilter("board", {
            group: Category.BOARD,
            mask: Category.BRICK | Category.BALL | Category.STONE
        });
        this.physics.registerFilter("brick", {
            group: Category.BRICK,
            mask: Category.BOARD | Category.BALL
        });
        this.physics.registerFilter("ball", {
            group: Category.BALL,
            mask: Category.BOARD | Category.BRICK
        });
        this.physics.registerFilter("stone", {
            group: Category.STONE,
            mask: Category.BOARD
        });
        this.physics.registerMaterial("board", "ball", 1);
        this.physics.registerMaterial("brick", "ball", 1);
        this.physics.registerMaterial("board", "stone", 0.3);
        this.physics.onCollisionEnd = this.onCollisionEnd.bind(this);
        this.noBoundedBall = 0;
        this.genBoard();
    }

    public nextGenBricks(skin: number): void {
        this.dropBricks(this.cell);
        this.genBricks(skin, this.cell);
    }

    public genBalls(count: number): void {
        const balls = [];
        for (let index = 0; index < count; index++) {
            balls.push({ id: 0, stop: true, size: this.cell / 8 });
        }
        balls.forEach(element => {
            const pos = SwipeBrickBreaker.getBasePosOfBall(this.w, this.h, element.size);
            const body = this.physics.addCircle(pos.x, pos.y, element.size, {
                collisionResponse: true,
                filter: "ball",
                material: "ball",
                gravityScale: 0,
                isStatic: false,
                mass: 1
            });
            element.id = body.id;
            this.balls.set(body, element);
        });
    }

    public shootBalls(speed: number, fps: number, target: number[]): void {
        this.noBoundedBall = this.balls.size;
        const dir: number[] = [];
        P2.vec2.normalize(dir, [target[0] - this.gunX, target[1] - this.gunY]);
        P2.vec2.multiply(dir, dir, [speed, speed]);
        let count = 0;
        this.balls.forEach((value, key) => {
            setTimeout((args: any[]) => {
                const ball: P2.Body = args[0];
                P2.vec2.copy(ball.velocity, args[1]);
            }, fps * count++, [key, dir]);
            value.stop = false;
        });
    }

    public boundedBalls(): boolean {
        return 0 < this.noBoundedBall;
    }

    private genBoard(): void {
        this.physics.addBorder(50, 0, 0, this.w, this.h, {
            collisionResponse: true,
            filter: "board",
            material: "board",
            gravityScale: 0,
            isStatic: true,
            mass: 1
        });
    }

    private genBricks(skin: number, size: number): void {
        const line = SwipeBrickBreaker.genRandoms(0, Math.floor(this.w / size));
        line.forEach((element, index) => {
            const brick = { id: index, skin, size };
            const body = this.physics.addBox(element * size, 0, size, size, {
                collisionResponse: true,
                filter: "brick",
                material: "brick",
                gravityScale: 0,
                isStatic: true,
                mass: 1
            });
            brick.id = body.id;
            this.bricks.set(body, brick);
        });
    }

    private dropBricks(deep: number): void {
        this.bricks.forEach((value, key) => {
            key.position[1] = key.position[1] + deep;
        });
    }

    private onCollisionEnd(abody: P2.Body, ashape: P2.Shape, bbody: P2.Body, bshape: P2.Shape): void {
        const categoryA = ashape.collisionGroup;
        const categoryB = bshape.collisionGroup;
        if (categoryA === Category.BALL || categoryB === Category.BALL) {
            if (categoryA === Category.BALL) {
                const ball = this.balls.get(abody);
                if (ball === undefined) {
                    throw new Error("onCollisionEnd not found ball");
                }
                switch (categoryB) {
                    case Category.BRICK:
                        {
                            const brick = this.bricks.get(bbody);
                            if (brick === undefined) {
                                throw new Error("onCollisionEnd not found brick");
                            }
                            this.onBallWithBrick(ball, brick);
                            if (brick.skin <= 0) {
                                this.physics.remove(bbody);
                                this.bricks.delete(bbody);
                            }
                        }
                        return;
                    case Category.BOARD:
                        {
                            this.onBallWithBoard(ball, bbody.id);
                            if (ball.stop === true) {
                                P2.vec2.set(abody.velocity, 0, 0);
                                this.noBoundedBall--;
                            }
                        }
                        return;
                    default:
                        return;
                }
            }
            else {
                this.onCollisionEnd(bbody, bshape, abody, ashape);
            }
            return;
        }
    }

    private onBallWithBrick(ball: IBall, brick: IBrick): void {
        brick.skin--;
    }

    private onBallWithBoard(ball: IBall, board: number): void {
        if (board === Board.BOTTOM) {
            ball.stop = true;
        }
    }
}