import FiniteStateMachine from '../finitestatemachine';
import Physics2D from '../physics2d';
import SwipeBrickBreaker from './swipebrickbreaker';

export enum Category {
    BOARD = 2,
    BRICK = 4,
    BAll = 8,
    STONE = 16
};

export default class AppSwipeBrickBreaker {
    public level: number;
    public cell: number;
    public swipe: SwipeBrickBreaker;
    public physics: Physics2D;
    public fsm: FiniteStateMachine;
    public endGame: boolean;
    public dtime: number;
    private nextInterval: number;
    private nextTimer: number;

    public init(w: number, h: number, cell: number): void {
        this.level = 1;
        this.cell = cell;
        this.swipe = new SwipeBrickBreaker(w, h);
        this.physics = new Physics2D;
        this.physics.registerCategory("board", {
            category: Category.BOARD,
            mask: Category.BRICK | Category.BAll | Category.STONE,
            group: 1
        });
        this.physics.registerCategory("brick", {
            category: Category.BRICK,
            mask: Category.BOARD | Category.BAll,
            group: 1
        });
        this.physics.registerCategory("ball", {
            category: Category.BAll,
            mask: Category.BOARD | Category.BRICK,
            group: 1
        });
        this.physics.registerCategory("stone", {
            category: Category.STONE,
            mask: Category.BOARD,
            group: 1
        });
        this.physics.addBorder(0, 0, w, h, 1, "board");
        this.fsm = new FiniteStateMachine;
        this.fsm.onEnterState = this.onEnterState.bind(this);
        this.fsm.register("ready", this.ready.bind(this));
        this.fsm.register("run", this.run.bind(this));
        this.fsm.register("end", this.end.bind(this));
        this.fsm.register("next", this.next.bind(this));
        this.endGame = false;
        this.dtime = 0;
        this.fsm.set("ready");
    }

    public doShot(dirX: number, dirY: number): void {
        if (this.fsm.currentState === "ready") {
            this.fsm.set("run");
        }
    }

    public doUpdate(dtime: number): void {
        this.dtime = dtime;
        this.physics.update(dtime);
        this.fsm.update();
    }

    private onEnterState(state: any): void {
        switch (state) {
            case "ready":
                this.swipe.dropBricks(this.cell);
                this.swipe.genBricks(this.physics, this.level, this.cell);
                break;
            case "next":
                this.nextInterval = 3;
                this.nextTimer = 0;
                this.level++;
        }
    }

    private ready(): void {
        this.endGame = false;
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
        this.nextTimer += this.dtime;
        if (this.nextInterval <= this.nextTimer) {
            this.fsm.set("ready");
        }
    }
}