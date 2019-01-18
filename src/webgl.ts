export default class WebGL {
    public canvas: HTMLCanvasElement;
    public device: WebGLRenderingContext;
    constructor(canvas: HTMLCanvasElement) {
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl === null) {
            throw new Error("This browser doesn't support WebGL");
        }
        this.canvas = canvas;
        this.device = gl;
    }

    public loadShader(source: string, type: number): WebGLShader {
        const shader = this.device.createShader(type);
        if (shader == null) {
            throw new Error("Create failed webgl shader");
        }
        this.device.shaderSource(shader, source);
        this.device.compileShader(shader);
        if (this.device.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS) == undefined) {
            throw new Error("Create failed webgl shader");
        }
        return shader;
    }

    public loadProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
        const program = this.device.createProgram();
        if (program == null) {
            throw new Error("Create failed webgl program");
        }
        this.device.attachShader(program, this.loadShader(vertexShaderSource, WebGLRenderingContext.VERTEX_SHADER));
        this.device.attachShader(program, this.loadShader(fragmentShaderSource, WebGLRenderingContext.FRAGMENT_SHADER));
        this.device.linkProgram(program);
        if (this.device.getProgramParameter(program, WebGLRenderingContext.LINK_STATUS) == undefined) {
            throw new Error("Create failed webgl program");
        }
        return program;
    }

    public sample(): void {
        this.device.clearColor(1, 0, 1, 1);
        this.device.clear(this.device.COLOR_BUFFER_BIT);
        const positions = new Uint16Array([
            0.0, 0.0,
            50.0, 0.0,
            50.0, 50.0,
            0.0, 50.0]);
        const indices = new Uint16Array([
            0, 1,
            1, 2,
            2, 3,
            3, 0]);
        
        const positionBuffer = this.device.createBuffer();
        this.device.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, positionBuffer);
        this.device.bufferData(WebGLRenderingContext.ARRAY_BUFFER, positions, WebGLRenderingContext.STATIC_DRAW);
        
        const indexBuffer = this.device.createBuffer();
        this.device.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.device.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, indices, WebGLRenderingContext.STATIC_DRAW);
        
        const program = loadProgram(
            document.getElementById("vertexShader").text,
            document.getElementById("fragmentShader").text);
        this.device.useProgram(program);
        const positionLocation = this.device.getAttribLocation(program, "position");
        this.device.enableVertexAttribArray(positionLocation);
        this.device.vertexAttribPointer(
            positionLocation,  // index
            2,                 // number of components per element
            this.device.FLOAT, // type of data
            false,             // normalized
            0,                 // stride
            0);                // offset
        const matrix = [
            2 / this.canvas.width, 0, 0, 0,
            0, -2 / this.canvas.height, 0, 0,
            0, 0, 1, 0,
            -1 + 1 / this.canvas.width, 1 - 1 / this.canvas.height, 0, 1];
        const ploc = this.device.getUniformLocation(program, "projection");
        const mloc = this.device.getUniformLocation(program, "model");
        this.device.uniformMatrix4fv(ploc, false, matrix);
        for (var ii = 0; ii < 800; ii += 50) {
            const matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                ii, 0, 0, 1];
            this.device.uniformMatrix4fv(mloc, false, matrix);
            this.device.drawElements(
                this.device.LINES,          // what to draw
                8,                          // number of vertices
                this.device.UNSIGNED_SHORT, // type of indices
                0);                         // offset
        }
        for (var ii = 0; ii < 600; ii += 50) {
            const matrix = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, ii, 0, 1];
            this.device.uniformMatrix4fv(mloc, false, matrix);
            this.device.drawElements(
                this.device.LINES,           // what to draw
                8,                           // number of vertices
                this.device.UNSIGNED_SHORT,  // type of indices
                0);                          // offset
        }
    }
}