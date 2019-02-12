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
        {
            gl.registerShape("brick",
                [
                    -0.5, -0.5,
                    0.5, -0.5,
                    0.5, 0.5,
                    -0.5, 0.5
                ],
                [
                    0, 1,
                    1, 2,
                    2, 3,
                    3, 0
                ]);
        }
        {
            const count = 50;
            const vertices: number[] = [];
            const indices: number[] = [];
            for (let index = 0; index < count; ++index) {
                const angle = index / count * (2.0 * Math.PI);
                vertices.push(Math.cos(angle) - 0.5);
                vertices.push(Math.sin(angle) - 0.5);
                indices.push(index);
                indices.push(index + 1);
            }
            indices[vertices.length - 2] = count - 1;
            indices[vertices.length - 1] = 0;
            gl.registerShape("circle", vertices, indices);
        }
        {
            const count = 5;
            const vertices: number[] = [];
            const indices: number[] = [];
            vertices.push(0);
            vertices.push(0);
            for (let index = 0; index < count; ++index) {
                const angle = index / count * (2.0 * Math.PI);
                vertices.push(Math.cos(angle) - 0.5);
                vertices.push(Math.sin(angle) - 0.5);
                indices.push(0);
                indices.push(index + 1);
            }
            gl.registerShape("star", vertices, indices);
        }
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
        this.swipe.bricks.forEach((value, key) => {
            WebGL.translate(this.world, value.position[0], value.position[1]);
            WebGL.scale(this.world, key.size, key.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
        this.gl.useShape("circle", "position", 2);
        this.swipe.balls.forEach((value, key) => {
            WebGL.translate(this.world, value.position[0], value.position[1]);
            WebGL.scale(this.world, key.size, key.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
        WebGL.translate(this.world, this.swipe.gunX, this.swipe.gunY)
        WebGL.scale(this.world, this.swipe.gunSize, this.swipe.gunSize);
        this.gl.setUniformMatrix4fv("world", this.world);
        this.gl.drawShape();
        this.gl.useShape("star", "position", 2);
        this.swipe.stones.forEach((value, key) => {
            WebGL.translate(this.world, value.position[0], value.position[1]);
            WebGL.scale(this.world, key.size, key.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
    }

    public drawText(): void {
        const fontSize = 16;
        this.text2d.setTextSize(fontSize);
        this.text2d.setTextColor("white");
        this.swipe.bricks.forEach((value, key) => {
            this.text2d.drawText(
                key.skin.toString(),
                value.position[0] + 1,
                value.position[1] + fontSize + 1);
        });
    }
}