import Brick from './brick';

export default class BreakableBrick extends Brick {
    public skin: number;

    constructor(skin: number, x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        super(x, y, w, h);
        this.skin = skin;
    }

    public break(): void {
        if (0 < --this.skin) {
            return;
        }
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }
}