import Ball from './ball';
import Brick from './brick';

export enum Clockwise {
    NONE,
    TRUE,
    ANTI,
}

export function CollisionBrickWithBall(brick: Brick, ball: Ball): any {
    const hit = detectBrickWithBall(brick, ball);
    return {
        dir: hit ? Clockwise.NONE : getClockwise(brick.w, brick.h, brick.x - ball.x, brick.y - ball.y),
        hit
    }
}

export function detectBrickWithBall(brick: Brick, ball: Ball): boolean {
    const dx = Math.abs(brick.x - ball.x);
    const dy = Math.abs(brick.y - ball.y);
    if (dx > (brick.w / 2 + ball.r)) {
        return false;
    }
    if (dy > (brick.h / 2 + ball.r)) {
        return false;
    }
    if (dx <= (brick.w / 2)) {
        return true;
    }
    if (dy <= (brick.h / 2)) {
        return true;
    }
    const sq =
        Math.pow((dx - brick.w / 2), 2) +
        Math.pow((dy - brick.h / 2), 2);
    return (sq <= Math.pow(ball.r, 2));
}

export function getClockwise(x1: number, y1: number, x2: number, y2: number): Clockwise {
    const dy = Math.abs(y1 - y2);
    const dx = Math.abs(x1 - x2);
    const dh = (dy / dx * x1) - y1;
    if (0 === dh) {
        return Clockwise.NONE;
    }
    else if (dh < 0) {
        return Clockwise.TRUE;
    }
    else {
        return Clockwise.ANTI;
    }
}