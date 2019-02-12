import FiniteStateMachine from '../finitestatemachine';
import Physics2D from '../physics2d';
import SwipeBrickBreaker from './swipebrickbreaker';

export default class AppSwipeBrickBreaker {
    public level: number;
    public cell: number;
    public physics: Physics2D;
    public swipe: SwipeBrickBreaker;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;

    public init(w: number, h: number, cell: number): void {
        this.cell = cell;
        this.physics = new Physics2D;
        this.swipe = new SwipeBrickBreaker(w, h);
        this.swipe.registerSource(this.physics);
        this.fsm = new FiniteStateMachine;
        this.fsm.onEnterState = this.onEnterState.bind(this);
        this.fsm.register("reset", this.reset.bind(this));
        this.fsm.register("ready", this.ready.bind(this));
        this.fsm.register("run", this.run.bind(this));
        this.fsm.register("end", this.end.bind(this));
        this.fsm.register("next", this.next.bind(this));
        this.dtime = 0;
        this.fsm.set("reset");
    }

    public doShot(x: number, y: number): void {
        if (this.fsm.currentState === "ready") {
            this.swipe.shootBalls(30, [x, y]);
            this.fsm.set("run");
        }
    }

    public doUpdate(dtime: number): void {
        this.dtime = dtime;
        this.fsm.update();
        this.physics.update(this.dtime);
    }

    private onEnterState(state: any): void {
        switch (state) {
            case "ready":
                this.swipe.dropBricks(this.cell);
                this.swipe.genBricks(this.physics, this.level, this.cell);
                break;
            case "next":
                this.level++;
                setTimeout((args: any[]) => {
                    const app: AppSwipeBrickBreaker = args[0];
                    app.fsm.set("ready");
                }, 3, [this]);
        }
    }

    private reset(): void {
        this.level = 1;
        this.endGame = false;
        this.physics.clear();
        this.swipe.genBoard(this.physics);
        this.swipe.genBalls(this.physics, [{ id: 0, size: this.cell / 8 }]);
        this.fsm.set("ready");
    }

    private ready(): void {
        return;
    }

    private run(): void {
        if (this.endGame === true) {
            return;
        }
        this.fsm.set("next");
    }

    private end(): void {
        this.endGame = true;
    }

    private next(): void {
        return;
    }
}