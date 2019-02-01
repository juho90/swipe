import Ball from './ball';
import Brick from './brick';
import Vec2d from './vec2d';

export enum Clockwise {
    NONE,
    TRUE,
    ANTI,
}

export interface IBoardOver {
    overW: number;
    overH: number;
}

const MyMath = {
    collisionBoardWithBall: (w: number, h: number, pos: Vec2d, r: number): IBoardOver => {
        let overW = 0;
        if (pos.x <= 0) {
            pos.x = 0;
            overW = 1;
        }
        else if (w <= (pos.x + (r * 2))) {
            pos.x = w - (r * 2);
            overW = -1;
        }
        let overH = 0;
        if (pos.y <= 0) {
            pos.y = 0;
            overH = 1;
        }
        else if (h <= (pos.y + (r * 2))) {
            pos.y = h - (r * 2);
            overH = -1;
        }
        return {
            overH,
            overW
        }
    },
    collisionBrickWithBall: (brick: Brick, ball: Ball): any => {
        const hit = MyMath.detectBrickWithBall(brick, ball);
        if (hit) {
            const d = MyMath.distanceBrickWithBall(brick, ball);
            d.nomalize();
            d.multiply(ball.r);
            return {
                cw: hit ? MyMath.getClockwise(new Vec2d(brick.w, brick.h), d) : Clockwise.NONE,
                hit
            }
        }
        else {
            return {
                hit
            }
        }
    },
    detectBrickWithBall: (brick: Brick, ball: Ball): boolean => {
        const hbrickW = brick.w / 2;
        const hbrickH = brick.h / 2;
        const dx = Math.abs((ball.x + ball.r) - (brick.x + hbrickW));
        const dy = Math.abs((ball.y + ball.r) - (brick.y + hbrickH));
        if (dx > (hbrickW + ball.r)) {
            return false;
        }
        if (dy > (hbrickH + ball.r)) {
            return false;
        }
        if (dx <= (hbrickW)) {
            return true;
        }
        if (dy <= (hbrickH)) {
            return true;
        }
        const dotX = (dx - hbrickW);
        const dotY = (dy - hbrickH);
        const sq = (dotX * dotX) + (dotY * dotY);
        return (sq <= (ball.r * ball.r));
    },
    distanceBrickWithBall: (brick: Brick, ball: Ball): Vec2d => {
        return new Vec2d(
            Math.abs((ball.x + ball.r) - (brick.x + brick.w / 2)),
            Math.abs((ball.y + ball.r) - (brick.y + brick.h / 2)));
    },
    genRandomNumbers: (count: number, min: number, max: number): number[] => {
        const line: number[] = [];
        const limit = max - min;
        if (limit < count) {
            throw new Error("invalid (max - min) < count");
        }
        for (let index = 0; index < count;) {
            const value = min + Math.floor((Math.random() * limit));
            if (line.find((element: number) => {
                return element === value;
            }) === undefined) {
                ++index;
                line.push(value);
            }
        }
        return line;
    },
    getClockwise: (p1: Vec2d, p2: Vec2d): Clockwise => {
        const dy = Math.abs(p1.y - p2.y);
        const dx = Math.abs(p1.x - p2.x);
        const dh = (dy / dx * p1.x) - p1.y;
        if (0 === dh) {
            return Clockwise.NONE;
        }
        else if (dh < 0) {
            return Clockwise.TRUE;
        }
        else {
            return Clockwise.ANTI;
        }
    },
    lerp: (v1: number, v2: number, d: number): number => {
        return (1 - d) * v1 + d * v2;
    },
    posLerp: (p1: Vec2d, p2: Vec2d, d: number): Vec2d => {
        return new Vec2d(
            MyMath.lerp(p1.x, p2.x, d),
            MyMath.lerp(p1.y, p2.y, d));
    },
    resolveDirOverBoard: (dir: Vec2d, over: IBoardOver, rule: (dir: Vec2d) => void): void => {
        if (over.overH) {
            dir.y = over.overH * Math.abs(dir.y);
            if (over.overH === -1) {
                rule(dir);
            }
        }
        if (over.overW) {
            dir.x = over.overW * Math.abs(dir.x);
        }
    },
}

export default MyMath;