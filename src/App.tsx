import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import Board from './game/board';
import {
  Clockwise,
  collisionBoardWithBall,
  collisionBrickWithBall
}
  from './game/mymath';
import Tengnamball from './game/tengnamball';

interface IState {
  dtime: number;
  etime: number;
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  private canvas: HTMLCanvasElement | null;
  private board: Board;
  private tball: Tengnamball;

  constructor(props: any) {
    super(props);
    this.state = {
      dtime: 0,
      etime: 0,
      height: 800,
      ratio: 1,
      width: 600,
    };
  }

  public componentDidMount(): void {
    const cell = 40;
    this.board = new Board(
      this.state.width / cell,
      this.state.height / cell,
      cell);
    this.tball = new Tengnamball(0, 0, cell / 8);
    this.tball.setDir(3, 5);
    this.board.addMany([
      { x: 1, y: 1 },
    ]);
    this.updateCanvas();
  }

  public componentWillUpdate(): void {
    this.updateCanvas();
  }

  public updateCanvas(): void {
    if (this.canvas == null) {
      return;
    }
    const ctx = this.canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    this.tball.move(this.state.dtime);
    this.board.bricks.forEach(line => {
      line.forEach(brick => {
        if (brick == null) {
          return;
        }
        const result = collisionBrickWithBall(brick, this.tball.ball);
        if (result.hit) {
          switch (result.cw) {
            case Clockwise.NONE:
              this.tball.dir.reverse();
              break;
            case Clockwise.TRUE:
              this.tball.dir.reverseXAsix();
              break;
            case Clockwise.ANTI:
              this.tball.dir.reverseYAsix();
              break;
          }
        }
      });
    });
    const over = collisionBoardWithBall(this.state.width, this.state.height, this.tball.ball);
    if (over.overW) {
      this.tball.dir.x = over.overW * Math.abs(this.tball.dir.x);
    }
    if (over.overH) {
      this.tball.dir.y = over.overH * Math.abs(this.tball.dir.y);
    }
    ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.board.draw(ctx);
    this.tball.draw(ctx);
    this.updateTime(30 / 1000);
  }

  public updateTime(dTime: number): void {
    setTimeout((args: any[]) => {
      const app: App = args[0];
      app.setState({
        dtime: dTime,
        etime: app.state.etime + dTime
      });
    }, dTime, [this]);
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <h1 className="App-title">Welcome to React</h1>
        <canvas className="Canvas" ref={canvas => (this.canvas = canvas)}
          width={this.state.width * this.state.ratio}
          height={this.state.height * this.state.ratio}
        />
      </div>
    );
  }
}

export default App;
