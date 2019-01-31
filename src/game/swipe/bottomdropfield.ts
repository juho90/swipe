import Chip from '../chip';
import Field from '../field';
import IItem from '../item';
import IPos2d from '../pos2d';

export default class BottomDropField extends Field {
    public h: number;
    public t: number;

    constructor(h: number) {
        super();
        this.h = h;
        this.t = 1;
    }

    public setT(t: number): void {
        this.t = t;
    }

    public addAuto(p: IPos2d, item: IItem): void {
        const chip = new Chip(p.x, p.y);
        chip.follow({ x: p.x, y: this.h }, this.t);
        this.add(chip, item);
    }

    public update(dtime: number): void {
        this.chips.forEach(element => {
            element.update(dtime);
        });
    }
}