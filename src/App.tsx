import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import AppSwipeBrickBreaker from './game/swipe/appswipebrickbreaker';
import WebGLSwipeBrickBreaker from './webgl/swipe/webglswipebrickbreaker';
import Text2D from './webgl/text2d';
import WebGL from './webgl/webgl';

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
    public text2d: Text2D;
    public webgl: WebGL;
    public swipeGL: WebGLSwipeBrickBreaker;
    constructor(props: any) {
        super(props);
        this.state = {
            etime: 0,
            height: 800,
            ratio: 1,
            width: 600,
        };
        this.swipeGame = new AppSwipeBrickBreaker;
        this.swipeGame.init(
            this.state.width,
            this.state.height);
        this.text2d = new Text2D;
        this.webgl = new WebGL;
        this.swipeGL = new WebGLSwipeBrickBreaker;
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    public componentDidMount(): void {
        if (this.underCanvas === null) {
            throw new Error("App underCanvas is null");
        }
        if (this.overCanvas === null) {
            throw new Error("App overCanvas is null");
        }
        this.text2d.init(this.overCanvas);
        this.webgl.init(this.underCanvas);
        this.swipeGL.init(this.text2d, this.webgl, this.swipeGame.swipe);
        this.componentWillUpdate();
    }

    public componentWillUpdate(): void {
        const dtime = 3 / 100;
        setTimeout((args: any[]) => {
            const app: App = args[0];
            app.setState({
                etime: app.state.etime + dtime
            });
            app.swipeGame.doUpdate(dtime);
        }, dtime, [this]);
    }

    public onClickHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        e.preventDefault();
        this.swipeGame.doShot(e.clientX, e.clientY);
    }

    public render(): JSX.Element {
        if (this.underCanvas != null && this.overCanvas != null) {
            this.webgl.begin();
            this.swipeGL.draw();
            this.text2d.begin();
            this.swipeGL.drawText();
        }
        return (
            <div className="App">
                <h1 className="App-title">Welcome to React</h1>
                <canvas className="Under" ref={canvas => (this.underCanvas = canvas)}
                    width={this.state.width * this.state.ratio}
                    height={this.state.height * this.state.ratio}
                    onClick={this.onClickHandler}
                />
                <canvas className="Over" ref={canvas => (this.overCanvas = canvas)}
                    width={this.state.width * this.state.ratio}
                    height={this.state.height * this.state.ratio}
                />
            </div>
        );
    }
}

export default App;
