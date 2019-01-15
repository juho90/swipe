import * as React from 'react';
import { setTimeout } from 'timers';
import './App.css';
import SwipeBrickBreaker from './game/swipe/swipebrickbreaker';

interface IState {
  etime: number;
  width: number;
  height: number;
  ratio: number;
}

class App extends React.Component<{}, IState> {
  public canvas: HTMLCanvasElement | null;
  public game: SwipeBrickBreaker;

  constructor(props: any) {
    super(props);
    this.state = {
      etime: 0,
      height: 800,
      ratio: 1,
      width: 600,
    };
    this.game = new SwipeBrickBreaker(
      this.state.width,
      this.state.height,
      40);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  public componentDidMount(): void {
    this.componentWillUpdate();
  }

  public componentWillUpdate(): void {
    const dtime = 30 / 1000;
    setTimeout((args: any[]) => {
      const app: App = args[0];
      app.setState({
        etime: app.state.etime + dtime
      });
      app.game.update(dtime);
    }, dtime, [this]);
  }

  public onClickHandler(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    e.preventDefault();
    this.game.start(e.clientX, e.clientY);
  }

  public render(): JSX.Element {
    if (this.canvas != null) {
      const ctx = this.canvas.getContext('2d');
      if (ctx != null) {
        ctx.clearRect(0, 0, this.state.width, this.state.height);
        this.game.draw(ctx);
      }
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
