import SwipeBrickBreaker from '../../game/swipe/swipebrickbreaker';
import PixelShader from '../default.x-fragment';
import VertexShader from '../default.x-vertex';
import WebGL from '../webgl';

export default class WebGLSwipeBrickBreaker {
    public gl: WebGL;
    public swipe: SwipeBrickBreaker;
    public proj: number[];
    public world: number[];
    constructor() {
        this.gl = new WebGL;
    }

    public init(gl: WebGL, swipe: SwipeBrickBreaker): void {
        gl.registerProgram("swipe", VertexShader, PixelShader, ["proj", "world"]);
        gl.registerShape("brick",
            [
                0, 0,
                swipe.board.cell, 0,
                swipe.board.cell, swipe.board.cell,
                0, swipe.board.cell
            ],
            [
                0, 1,
                1, 2,
                2, 3,
                3, 0
            ]);
        this.gl = gl;
        this.swipe = swipe;
        this.proj = [
            2 / swipe.w, 0, 0, 0,
            0, -2 / swipe.h, 0, 0,
            0, 0, 1, 0,
            -1 + 1 / swipe.w, 1 - 1 / swipe.h, 0, 1];
        this.world = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    public move(x: number, y: number): void {
        this.world[12] = x;
        this.world[13] = y;
        this.gl.setUniformMatrix4fv("world", this.world);
    }

    public draw(): void {
        this.gl.useProgram("swipe");
        this.gl.setUniformMatrix4fv("proj", this.proj);
        this.gl.useShape("brick", "position", 2);
        this.swipe.board.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick == null) {
                    return;
                }
                this.move(brick.x, brick.y);
                this.gl.drawLine();
            });
        });
    }
}