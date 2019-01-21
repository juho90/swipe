import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import SwipeBrickBreakerApp from './game/swipe/swipebrickbreakerapp';
import WebGLSwipeBrickBreaker from './webgl/swipe/webglswipebrickbreaker';
import WebGL from './webgl/webgl';

interface IState {
  etime: number;
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  public canvas: HTMLCanvasElement | null;
  public game: SwipeBrickBreakerApp;
  public webgl: WebGL;
  public webglswipe: WebGLSwipeBrickBreaker;
  constructor(props: any) {
    super(props);
    this.state = {
      etime: 0,
      height: 800,
      ratio: 1,
      width: 600,
    };
    this.game = new SwipeBrickBreakerApp;
    this.game.init(
      this.state.width,
      this.state.height,
      40);
    this.webgl = new WebGL;
    this.webglswipe = new WebGLSwipeBrickBreaker;
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  public componentDidMount(): void {
    if (this.canvas === null) {
      throw new Error("App canvas is null");
    }
    this.webgl.init(this.canvas);
    this.webglswipe.init(this.webgl, this.game.swipe);
    this.componentWillUpdate();
  }

  public componentWillUpdate(): void {
    const dtime = 30 / 1000;
    setTimeout((args: any[]) => {
      const app: App = args[0];
      app.setState({
        etime: app.state.etime + dtime
      });
      app.game.doUpdate(dtime);
    }, dtime, [this]);
  }

  public onClickHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    e.preventDefault();
    this.game.doShot(e.clientX, e.clientY);
  }

  public render(): JSX.Element {
    if (this.canvas != null) {
      this.webgl.begin();
      this.webglswipe.draw();
    }
    return (
      <div className="App">
        <h1 className="App-title">Welcome to React</h1>
        <canvas className="Canvas" ref={canvas => (this.canvas = canvas)}
          width={this.state.width * this.state.ratio}
          height={this.state.height * this.state.ratio}
          onClick={this.onClickHandler}
        />
      </div>
    );
  }
}

export default App;
