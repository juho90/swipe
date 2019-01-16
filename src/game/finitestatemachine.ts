export default class FiniteStateMachine {
    public onEnterState: (state: any) => void;
    public onLeaveState: (state: any) => void;
    public stateMap: {};
    public currentState: any;

    constructor() {
        this.currentState = undefined;
        this.stateMap[this.currentState] = () => { };
    }

    public register(state: any, func: () => void): void {
        this.stateMap[state] = func;
    }

    public unregister(state: any): void {
        this.stateMap[state] = () => { };
    }

    public set(state: any): void {
        if (this.currentState != state) {
            this.onLeaveState(this.currentState);
        }
        this.currentState = state;
        this.onEnterState(this.currentState);
    }

    public update(): void {
        this.stateMap[this.currentState]();
    }
}