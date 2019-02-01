import Chip from '../chip';
import Field from '../field';
import FiniteStateMachine from '../finitestatemachine';
import IItem from '../item';
import MyMath from '../mymath';
import Vec2d from '../vec2d';

export default class BottomDropField extends Field {
    public w: number;
    public h: number;
    public r: number;
    public fsm: FiniteStateMachine;
    public dtime: number;

    constructor(w: number, h: number) {
        super();
        this.w = w;
        this.h = h;
        this.r = 3;
        this.fsm = new FiniteStateMachine;
        this.fsm.register("drop", this.drop.bind(this));
        this.fsm.register("follow", this.follow.bind(this));
    }

    public addAuto(p: Vec2d, item: IItem): void {
        const chip = new Chip(p.x, p.y);
        chip.push(new Vec2d(5 - Math.random() * 10, 0));
        this.add(chip, item);
    }

    public doDrop(): void {
        this.fsm.set("drop");
    }

    public doFollow(pos: Vec2d, time: number): void {
        this.chips.forEach(element => {
            element.follow(pos, time);
        });
        this.fsm.set("follow");
    }

    public update(dtime: number): void {
        this.dtime = dtime;
        this.fsm.update();
    }

    private drop(): void {
        this.chips.forEach(element => {
            element.gravity(9.8, this.dtime);
            if (element.dir !== null) {
                const over = MyMath.collisionBoardWithBall(this.w, this.h, element.pos, this.r);
                MyMath.resolveDirOverBoard(element.dir, over, dir => {
                    dir.multiply(0.3);
                    if (dir.leng() <= Math.LOG2E) {
                        dir.zero();
                    }
                });
            }
            element.update(this.dtime);
        });
    }

    private follow(): void {
        this.chips.forEach(element => {
            element.update(this.dtime);
        });
    }
}