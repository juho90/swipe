import BreakableBrick from '../../game/swipe/breakablebrick';
import SwipeBrickBreaker from '../../game/swipe/swipebrickbreaker';
import PixelShader from '../default.x-fragment';
import VertexShader from '../default.x-vertex';
import Text2D from '../text2d';
import WebGL from '../webgl';

export default class WebGLSwipeBrickBreaker {
    public text2d: Text2D;
    public gl: WebGL;
    public swipe: SwipeBrickBreaker;
    public proj: number[];
    public world: number[];

    constructor() {
        this.gl = new WebGL;
    }

    public init(text2d: Text2D, gl: WebGL, swipe: SwipeBrickBreaker): void {
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
        const count = 50;
        const vertices: number[] = [];
        const indices: number[] = [];
        for (let index = 0; index < count; ++index) {
            const angle = index / count * (2.0 * Math.PI);
            vertices.push(swipe.gun.r * Math.cos(angle));
            vertices.push(swipe.gun.r * Math.sin(angle));
            indices.push(index);
            indices.push(index + 1);
        }
        indices[vertices.length - 2] = count - 1;
        indices[vertices.length - 1] = 0;
        gl.registerShape("circle", vertices, indices);
        this.text2d = text2d;
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

    public draw(): void {
        this.gl.useProgram("swipe");
        this.gl.setUniformMatrix4fv("proj", this.proj);
        this.gl.useShape("brick", "position", 2);
        this.swipe.board.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick == null) {
                    return;
                }
                this.world[12] = brick.x;
                this.world[13] = brick.y;
                this.gl.setUniformMatrix4fv("world", this.world);
                this.gl.drawLine();
            });
        });
        this.gl.useShape("circle", "position", 2);
        this.swipe.gun.balls.forEach(element => {
            this.world[12] = element.x + element.r;
            this.world[13] = element.y + element.r;
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawLine();
        });
        this.world[12] = this.swipe.gun.x + this.swipe.gun.r;
        this.world[13] = this.swipe.gun.y + this.swipe.gun.r;
        this.gl.setUniformMatrix4fv("world", this.world);
        this.gl.drawLine();
        this.swipe.field.chips.forEach(element => {
            this.world[12] = element.pos.x;
            this.world[13] = element.pos.y;
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawLine();
        });
    }

    public drawText(): void {
        this.text2d.setTextColor("white");
        this.swipe.board.bricks.forEach(line => {
            line.forEach(brick => {
                if (brick == null) {
                    return;
                }
                this.text2d.drawText((brick as BreakableBrick).skin.toString(),
                    brick.x + brick.w / 2 - 10,
                    brick.y + brick.h / 2 + 10);
            });
        });
        this.text2d.setTextSize(20);
        this.text2d.drawText("X " +
            (this.swipe.gun.balls.length - this.swipe.gun.shootCount).toString(),
            this.swipe.gun.x + 20,
            this.swipe.gun.y - 10);
    }
}