import Board from '../board';
import MyMath from '../mymath';
import BreakableBrick from './breakablebrick';

export default class FlowdownBoard extends Board {
    public genFlowdown(skin: number): void {
        this.flowdown();
        const line = MyMath.genRandomNumbers(
            1 + Math.floor(Math.random() * (this.w - 1)),
            0, this.w);
        line.forEach(element => {
            this.add(new BreakableBrick(skin), element, 0);
        });
    }

    public flowdown(): void {
        this.bricks.pop();
        this.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick != null) {
                    brick.y += this.cell;
                }
            });
        });
        this.bricks.unshift(new Array(this.w));
        this.bricks[0].fill(null, 0, this.w);
    }
}