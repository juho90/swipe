import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import SwipeBrickBreakerApp from './game/swipe/swipebrickbreakerapp';
import PixelShader from './shader/default.x-fragment';
import VertexShader from './shader/default.x-vertex';
import WebGL from './webgl';

interface IState {
  etime: number;
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  public canvas: HTMLCanvasElement | null;
  public game: SwipeBrickBreakerApp;
  public gl: WebGL;
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
    this.gl = new WebGL;
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  public componentDidMount(): void {
    if (this.canvas === null) {
      throw new Error("App canvas is null");
    }
    this.gl.init(this.canvas);
    this.gl.setProgram(this.gl.createProgram(VertexShader, PixelShader), "proj", "world");
    this.gl.setAttribProj([
      2 / this.canvas.width, 0, 0, 0,
      0, -2 / this.canvas.height, 0, 0,
      0, 0, 1, 0,
      -1 + 1 / this.canvas.width, 1 - 1 / this.canvas.height, 0, 1]);
    this.gl.setVertexBuffer(this.gl.createVertexBuffer([
      0.0, 0.0,
      50.0, 0.0,
      50.0, 50.0,
      0.0, 50.0]));
    this.gl.setIndexBuffer(this.gl.createIndexBuffer([
      0, 1,
      1, 2,
      2, 3,
      3, 0]));
    this.gl.setAttribVertexArray(2, "position");
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
      // this.game.doRender(this.canvas);
      this.gl.sample();
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
