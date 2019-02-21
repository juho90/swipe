import FiniteStateMachine from "../finitestatemachine";
import SwipeBrickBreaker from "./swipebrickbreaker";

export default class AppSwipeBrickBreaker {
    public level: number;
    public swipe: SwipeBrickBreaker;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;

    constructor() {
        this.level = 0;
        this.swipe = new SwipeBrickBreaker();
        this.fsm = new FiniteStateMachine();
        this.fsm.onEnterState = this.onEnterState.bind(this);
        this.fsm.register("reset", this.reset.bind(this));
        this.fsm.register("ready", this.ready.bind(this));
        this.fsm.register("run", this.run.bind(this));
        this.fsm.register("end", this.end.bind(this));
        this.fsm.register("next", this.next.bind(this));
        this.endGame = false;
        this.dtime = 0;
    }

    public init(w: number, h: number): void {
        this.swipe.init(w, h, 60);
        this.dtime = 0;
        this.fsm.set("reset");
    }

    public doShot(x: number, y: number): void {
        if (this.fsm.currentState === "ready") {
            this.swipe.shoot(80, 80, [x, y]);
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
                this.swipe.nextGen(this.level);
                break;
            case "next":
                this.swipe.pickUpItem((stone, body) => {
                    return;
                });
                this.level++;
                this.swipe.reload();
                setTimeout(
                    (args: any[]) => {
                        const app: AppSwipeBrickBreaker = args[0];
                        app.fsm.set("ready");
                    },
                    3,
                    [this]
                );
        }
    }

    private reset(): void {
        this.level = 1;
        this.endGame = false;
        this.swipe.onBreak = (brick, body) => {
            this.swipe.dropItem(0, body.position[0], body.position[1]);
        };
        this.swipe.onEnd = () => {
            this.fsm.set("next");
        };
        this.swipe.reset();
        this.swipe.load(20);
        this.swipe.reload();
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
