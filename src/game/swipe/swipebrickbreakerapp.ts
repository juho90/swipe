import FiniteStateMachine from '../finitestatemachine';
import SwipeBrickBreaker from './swipebrickbreaker';

export default class SwipeBrickBreakerApp {
    public swipe: SwipeBrickBreaker;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;

    constructor() {
        this.onEnterState = this.onEnterState.bind(this);
        this.ready = this.ready.bind(this);
        this.run = this.run.bind(this);
        this.end = this.end.bind(this);
        this.next = this.next.bind(this);
    }

    public init(w: number, h: number, cell: number): void {
        this.swipe = new SwipeBrickBreaker(w, h, cell);
        this.fsm = new FiniteStateMachine;
        this.fsm.onEnterState = this.onEnterState;
        this.fsm.register("ready", this.ready);
        this.fsm.register("run", this.run);
        this.fsm.register("end", this.end);
        this.fsm.register("next", this.next);
        this.endGame = false;
        this.dtime = 0;
        this.fsm.set("ready");
    }

    public doShot(dirX: number, dirY: number): void {
        if (this.fsm.currentState === "ready") {
            this.swipe.gun.shotTarget(3, dirX, dirY);
            this.fsm.set("run");
        }
    }

    public doUpdate(dtime: number): void {
        this.dtime = dtime;
        this.fsm.update();
    }

    public doRender(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.swipe.draw(ctx);
        }
    }

    private onEnterState(state: any): void {
        console.log(state);
        switch (state) {
            case "ready":
                this.swipe.gun.reload();
                break;
        }
    }

    private ready(): void {
        this.endGame = false;
    }

    private run(): void {
        if (this.endGame === true) {
            return;
        }
        this.swipe.update(this.dtime);
        if (this.swipe.checkMovingBall() !== true) {
            this.fsm.set("next");
        }
    }

    private end(): void {
        this.endGame = true;
    }

    private next(): void {
        if (this.swipe.checkLimitLine()) {
            this.fsm.set("end");
        }
        else {
            this.swipe.board.genFlowdown();
            this.fsm.set("ready");
        }
    }
}