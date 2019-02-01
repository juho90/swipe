import FiniteStateMachine from '../finitestatemachine';
import Vec2d from '../vec2d';
import BottomDropField from './bottomdropfield';
import SwipeBrickBreaker from './swipebrickbreaker';

export default class SwipeBrickBreakerApp {
    public level: number;
    public swipe: SwipeBrickBreaker;
    public field: BottomDropField;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;
    private nextInterval: number;
    private nextTimer: number;

    public init(w: number, h: number, cell: number): void {
        this.level = 1;
        this.swipe = new SwipeBrickBreaker(w, h, cell);
        this.swipe.board.genFlowdown(this.level);
        this.fsm = new FiniteStateMachine;
        this.fsm.onEnterState = this.onEnterState.bind(this);
        this.fsm.register("ready", this.ready.bind(this));
        this.fsm.register("run", this.run.bind(this));
        this.fsm.register("end", this.end.bind(this));
        this.fsm.register("next", this.next.bind(this));
        this.field = new BottomDropField(w, h);
        this.swipe.onBrokenBrick = (brick => {
            this.field.addAuto(
                brick.center(),
                { type: 0, id: 0 });
        });
        this.endGame = false;
        this.dtime = 0;
        this.fsm.set("ready");
    }

    public doShot(dirX: number, dirY: number): void {
        if (this.fsm.currentState === "ready") {
            this.swipe.gun.shootTarget(3, dirX, dirY);
            this.fsm.set("run");
        }
    }

    public doUpdate(dtime: number): void {
        this.dtime = dtime;
        this.field.update(dtime);
        this.fsm.update();
    }

    public doDraw(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.swipe.draw(ctx);
        }
    }

    private onEnterState(state: any): void {
        switch (state) {
            case "ready":
                this.swipe.gun.reload();
                this.field.releaseAll(item => {
                    this.swipe.gun.add();
                });
                this.field.doDrop();
                break;
            case "next":
                this.nextInterval = 3;
                this.nextTimer = 0;
                this.field.doFollow(
                    new Vec2d(this.swipe.gun.x, this.field.h),
                    this.nextInterval);
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
        this.nextTimer += this.dtime;
        if (this.nextInterval <= this.nextTimer) {
            if (this.swipe.checkLimitLine()) {
                this.fsm.set("end");
            }
            else {
                this.swipe.board.genFlowdown(++this.level);
                this.fsm.set("ready");
            }
        }
    }
}