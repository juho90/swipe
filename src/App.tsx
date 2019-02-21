import * as React from "react";
import { setTimeout } from "timers";
import "./App.css";
import AppSwipeBrickBreaker from "./game/swipe/appswipebrickbreaker";
import WebGLSwipeBrickBreaker from "./webgl/swipe/webglswipebrickbreaker";
import Text2D from "./webgl/text2d";
import WebGL from "./webgl/webgl";

interface IState {
    etime: number;
    width: number;
    height: number;
    ratio: number;
}

class App extends React.Component<{}, IState> {
    public underCanvas: HTMLCanvasElement | null;
    public overCanvas: HTMLCanvasElement | null;
    public swipeGame: AppSwipeBrickBreaker;
    public swipeGL: WebGLSwipeBrickBreaker | null;

    constructor(props: any) {
        super(props);
        this.underCanvas = null;
        this.overCanvas = null;
        this.state = {
            etime: 0,
            height: 600,
            ratio: 1,
            width: 480
        };
        this.swipeGame = new AppSwipeBrickBreaker();
        this.swipeGame.init(this.state.width, this.state.height);
        this.swipeGL = null;
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    public componentDidMount(): void {
        if (this.underCanvas === null) {
            throw new Error("App underCanvas is null");
        }
        if (this.overCanvas === null) {
            throw new Error("App overCanvas is null");
        }
        this.swipeGL = new WebGLSwipeBrickBreaker(
            new Text2D(this.overCanvas),
            new WebGL(this.underCanvas),
            this.swipeGame.swipe
        );
        this.componentWillUpdate();
    }

    public componentWillUpdate(): void {
        const dtime = 3 / 100;
        setTimeout(
            (args: any[]) => {
                const app: App = args[0];
                app.setState({
                    etime: app.state.etime + dtime
                });
                app.swipeGame.doUpdate(dtime);
            },
            dtime,
            [this]
        );
    }

    public onClickHandler(
        e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
    ): void {
        e.preventDefault();
        this.swipeGame.doShot(e.clientX, e.clientY);
    }

    public render(): JSX.Element {
        if (this.swipeGL != null) {
            this.swipeGL.draw();
            this.swipeGL.drawText();
        }
        return (
            <div className="App">
                <h1 className="App-title">Welcome to React</h1>
                <canvas
                    className="Under"
                    ref={canvas => (this.underCanvas = canvas)}
                    width={this.state.width * this.state.ratio}
                    height={this.state.height * this.state.ratio}
                    onClick={this.onClickHandler}
                />
                <canvas
                    className="Over"
                    ref={canvas => (this.overCanvas = canvas)}
                    width={this.state.width * this.state.ratio}
                    height={this.state.height * this.state.ratio}
                />
            </div>
        );
    }
}

export default App;
