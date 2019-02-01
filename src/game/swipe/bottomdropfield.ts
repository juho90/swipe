import Chip from '../chip';
import Field from '../field';
import IItem from '../item';
import MyMath from '../mymath';
import Vec2d from '../vec2d';

export default class BottomDropField extends Field {
    public w: number;
    public h: number;
    public r: number;

    constructor(w: number, h: number) {
        super();
        this.w = w;
        this.h = h;
        this.r = 1;
    }

    public addAuto(p: Vec2d, item: IItem): void {
        const chip = new Chip(p.x, p.y);
        chip.push(new Vec2d(5 - Math.random() * 10, 0));
        this.add(chip, item);
    }

    public update(dtime: number): void {
        this.chips.forEach(element => {
            element.gravity(9.8, dtime);
            if (element.dir !== null) {
                const over = MyMath.collisionBoardWithBall(this.w, this.h, element.pos, this.r);
                MyMath.resolveDirOverBoard(element.dir, over, dir => {
                    dir.multiply(0.3);
                    if (dir.leng() <= Math.LOG2E) {
                        dir.zero();
                    }
                });
            }
            element.update(dtime);
        });
    }
}