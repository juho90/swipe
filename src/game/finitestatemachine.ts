export default class FiniteStateMachine {
    public onEnterState: (state: any) => void;
    public onLeaveState: (state: any) => void;
    public stateMap: Map<any, () => void>;
    public currentState: any;

    constructor() {
        this.onEnterState = this.empty;
        this.onLeaveState = this.empty;
        this.currentState = undefined;
        this.stateMap = new Map();
        this.stateMap.set(this.currentState, this.empty);
    }

    public register(state: any, func: () => void): void {
        this.stateMap.set(state, func);
    }

    public unregister(state: any): void {
        this.stateMap.set(state, this.empty);
    }

    public set(state: any): void {
        if (this.currentState !== state) {
            this.onLeaveState(this.currentState);
        }
        this.currentState = state;
        this.onEnterState(this.currentState);
    }

    public update(): void {
        const func = this.stateMap.get(this.currentState);
        if (func !== undefined) {
            func();
        }
    }

    public empty(): void {
        return;
    }
}
