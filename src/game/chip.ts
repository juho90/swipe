import FunctionalPos from './functinalpos';
import IItem from './item';
import Vec2d from './vec2d';

export default class Chip extends FunctionalPos {
    public item: IItem | null;

    constructor(x: number = 0, y: number = 0) {
        super(Vec2d);
        this.pos.x = x;
        this.pos.y = y;
    }

    public hideAndKeep(item: IItem) {
        this.item = item;
    }

    public release(): void {
        this.item = null;
    }
}