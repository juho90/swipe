import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import BreakableBrick from './game/breakablebrick';
import FlowdownBoard from './game/flowdownboard';
import Machinegun from './game/machinegun';
import MyMath, { Clockwise } from './game/mymath';

interface IState {
  dtime: number;
  etime: number;
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  private canvas: HTMLCanvasElement | null;
  private board: FlowdownBoard;
  private gun: Machinegun;

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
    this.board = new FlowdownBoard(
      this.state.width / cell,
      this.state.height / cell,
      cell);
    this.gun = new Machinegun;
    this.gun.setPos(0, 0);
    this.gun.setMM(cell / 8);
    this.gun.setMagazine(20);
    this.gun.shot(3, Math.PI * 1.7);
    const brickAmount = 10 + Math.floor(Math.random() * (this.board.h - 10));
    for (let i = 0; i < brickAmount; ++i) {
      this.board.genFlowdown();
    }
    this.board.flowdown();
    this.board.flowdown();
    this.board.flowdown();
    this.updateTime(30 / 1000);
  }

  public componentWillUpdate(): void {
    this.updateCollision();
    this.updateCanvas();
    this.updateTime(30 / 1000);
  }

  public updateCollision(): void {
    this.gun.update(this.state.dtime);
    this.board.bricks.forEach(line => {
      line.forEach(brick => {
        if (brick == null) {
          return;
        }
        this.gun.balls.forEach(element => {
          const result = MyMath.collisionBrickWithBall(brick, element);
          if (result.hit) {
            (brick as BreakableBrick).break();
            switch (result.cw) {
              case Clockwise.NONE:
                element.dir.reverse();
                break;
              case Clockwise.TRUE:
                element.dir.reverseXAsix();
                break;
              case Clockwise.ANTI:
                element.dir.reverseYAsix();
                break;
            }
          }
        });
      });
    });
    this.gun.balls.forEach(element => {
      const over = MyMath.collisionBoardWithBall(this.state.width, this.state.height, element);
      if (over.overW) {
        element.dir.x = over.overW * Math.abs(element.dir.x);
      }
      if (over.overH) {
        element.dir.y = over.overH * Math.abs(element.dir.y);
      }
    });
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

  public updateCanvas(): void {
    if (this.canvas == null) {
      return;
    }
    const ctx = this.canvas.getContext('2d');
    if (ctx == null) {
      return;
    }
    ctx.clearRect(0, 0, this.state.width, this.state.height);
    this.board.draw(ctx);
    this.gun.draw(ctx);
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
