import * as React from 'react';
import './App.css';
import Ball from './ball';
import Board from './board';
import { CollisionBrickWithBall } from './mymath';

interface IState {
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  private canvas: HTMLCanvasElement | null;
  private board: Board;
  private ball: Ball;

  constructor(props: any) {
    super(props);
    this.state = {
      height: 800,
      ratio: 1,
      width: 600,
    };
  }

  public componentDidMount(): void {
    const cell = 40.0;
    this.board = new Board(
      this.state.width / cell,
      this.state.height / cell,
      cell);
    this.ball = new Ball(0, 0, cell / 2);
    this.board.addMany([
      { x: 1, y: 1 },
    ]);
    this.updateCanvas();
  }

  public componentDidUpdate(): void {
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
    this.board.bricks.forEach(line => {
      line.forEach(brick => {
        if (brick == null) {
          return;
        }
        CollisionBrickWithBall(brick, this.ball);
      });
    });
    this.board.draw(ctx);
    this.ball.draw(ctx);
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
