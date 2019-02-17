import FiniteStateMachine from '../finitestatemachine';
import SwipeBrickBreaker from './swipebrickbreaker';

export default class AppSwipeBrickBreaker {
    public level: number;
    public swipe: SwipeBrickBreaker;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;

    public init(w: number, h: number): void {
        this.swipe = new SwipeBrickBreaker(w, h, 40);
        this.swipe.onDoNotMoveBalls = () => {
            this.fsm.set("next");
        };
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
            this.swipe.shootBalls(80, 80, [x, y]);
            this.fsm.set("run");
        }
    }

    public doUpdate(dtime: number): void {
        this.dtime = dtime;
        this.fsm.update();
        this.swipe.physics.update(this.dtime);
    }

    private onEnterState(state: any): void {
        switch (state) {
            case "ready":
                this.swipe.nextGenBricks(this.level);
                break;
            case "next":
                this.level++;
                this.swipe.reloadBalls();
                setTimeout((args: any[]) => {
                    const app: AppSwipeBrickBreaker = args[0];
                    app.fsm.set("ready");
                }, 3, [this]);
        }
    }

    private reset(): void {
        this.level = 1;
        this.endGame = false;
        this.swipe.init();
        this.swipe.genBalls(20);
        this.swipe.reloadBalls();
        this.fsm.set("ready");
    }

    private ready(): void {
        return;
    }

    private run(): void {
        if (this.endGame === true) {
            this.fsm.set("end");
        }
    }

    private end(): void {
        this.endGame = true;
    }

    private next(): void {
        return;
    }
}