import Board from './board';
import MyMath from './mymath';

export default class FlowdownBoard extends Board {
    public genFlowdown(): void {
        this.flowdown();
        const lines = MyMath.genRandomNumbers(
            1 + Math.floor(Math.random() * (this.w - 1)),
            0, this.w);
        lines.forEach(element => {
            this.add(element, 0);
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
        this.bricks.unshift([]);
        for (let index = 0; index < this.w; ++index) {
            this.bricks[0][index] = null;
        }
    }
}