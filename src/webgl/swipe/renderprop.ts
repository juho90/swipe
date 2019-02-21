export default interface IRenderProp {
    x: number;
    y: number;
    r: number;
    s: number;
    life: number;
    lifeCycle: number;
    update(dtime: number): void;
    draw(gl: WebGLRenderingContext, matrix: number[]): void;
}