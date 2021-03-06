import SwipeBrickBreaker from "../../game/swipe/swipebrickbreaker";
import PixelShader from "../default.x-fragment";
import VertexShader from "../default.x-vertex";
import Text2D from "../text2d";
import WebGL from "../webgl";

export default class WebGLSwipeBrickBreaker {
    public text2d: Text2D;
    public gl: WebGL;
    public swipe: SwipeBrickBreaker;
    public proj: number[];
    public world: number[];
    private shootCount: number;

    constructor(text2d: Text2D, gl: WebGL, swipe: SwipeBrickBreaker) {
        gl.registerProgram("swipe", VertexShader, PixelShader, [
            "proj",
            "world"
        ]);
        {
            gl.registerShape(
                "brick",
                [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5],
                [0, 1, 1, 2, 2, 3, 3, 0]
            );
        }
        {
            const count = 50;
            const vertices: number[] = [];
            const indices: number[] = [];
            for (let index = 0; index < count; ++index) {
                const angle = (index / count) * (2.0 * Math.PI);
                vertices.push(Math.cos(angle));
                vertices.push(Math.sin(angle));
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
                const angle = (index / count) * (2.0 * Math.PI);
                vertices.push(Math.cos(angle));
                vertices.push(Math.sin(angle));
                indices.push(0);
                indices.push(index + 1);
            }
            gl.registerShape("star", vertices, indices);
        }
        this.text2d = text2d;
        this.gl = gl;
        this.swipe = swipe;
        this.swipe.onReload = count => {
            this.shootCount = count;
        };
        this.swipe.onShoot = (ball, body) => {
            this.shootCount--;
        };
        this.proj = [
            2 / swipe.w,
            0,
            0,
            0,
            0,
            -2 / swipe.h,
            0,
            0,
            0,
            0,
            1,
            0,
            -1 + 1 / swipe.w,
            1 - 1 / swipe.h,
            0,
            1
        ];
        this.world = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.shootCount = 0;
    }

    public draw(): void {
        this.gl.begin();
        this.gl.useProgram("swipe");
        this.gl.setUniformMatrix4fv("proj", this.proj);
        this.gl.useShape("brick", "position", 2);
        this.swipe.bricks.forEach((value, key) => {
            WebGL.translate(this.world, key.position[0], key.position[1]);
            WebGL.scale(this.world, value.size, value.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
        this.gl.useShape("circle", "position", 2);
        this.swipe.balls.forEach((value, key) => {
            WebGL.translate(this.world, key.position[0], key.position[1]);
            WebGL.scale(this.world, value.size, value.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
        WebGL.translate(this.world, this.swipe.gunX, this.swipe.gunY);
        WebGL.scale(this.world, this.swipe.gunSize, this.swipe.gunSize);
        this.gl.setUniformMatrix4fv("world", this.world);
        this.gl.drawShape();
        this.gl.useShape("star", "position", 2);
        this.swipe.stones.forEach((value, key) => {
            WebGL.translate(this.world, key.position[0], key.position[1]);
            WebGL.scale(this.world, value.size, value.size);
            this.gl.setUniformMatrix4fv("world", this.world);
            this.gl.drawShape();
        });
    }

    public drawText(): void {
        this.text2d.begin();
        const fontSize = 16;
        this.text2d.setTextSize(fontSize);
        this.text2d.setTextColor("white");
        this.swipe.bricks.forEach((value, key) => {
            this.text2d.drawText(
                value.skin.toString(),
                key.position[0] - fontSize / 2,
                key.position[1] + fontSize / 2
            );
        });
        this.text2d.setTextSize(20);
        this.text2d.drawText(
            "X " + this.shootCount.toString(),
            this.swipe.gunX + 20,
            this.swipe.gunY - 10
        );
    }
}
