interface IVertexBuffer {
    vertexBuffer: WebGLBuffer;
    vertexBufferSize: number;
}

interface IIndexBuffer {
    indexBuffer: WebGLBuffer;
    indexBufferSize: number;
}

export default class WebGL {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;
    public vb: IVertexBuffer;
    public ib: IIndexBuffer;
    public proj: WebGLUniformLocation;
    public world: WebGLUniformLocation;

    public init(canvas: HTMLCanvasElement): void {
        const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }) || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
        if (gl === null) {
            throw new Error("This browser doesn't support WebGL");
        }
        this.canvas = canvas;
        this.gl = gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(WebGLRenderingContext.DEPTH_TEST);
        gl.depthFunc(WebGLRenderingContext.LEQUAL);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
    }

    public createShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if (shader === null) {
            throw new Error("Create failed webgl shader");
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (this.gl.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS) === undefined) {
            throw new Error("Create failed webgl shader");
        }
        return shader;
    }

    public createProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram {
        const program = this.gl.createProgram();
        if (program === null) {
            throw new Error("Create failed webgl program");
        }
        this.gl.attachShader(program, this.createShader(vertexShaderSource, WebGLRenderingContext.VERTEX_SHADER));
        this.gl.attachShader(program, this.createShader(fragmentShaderSource, WebGLRenderingContext.FRAGMENT_SHADER));
        this.gl.linkProgram(program);
        if (this.gl.getProgramParameter(program, WebGLRenderingContext.LINK_STATUS) === undefined) {
            throw new Error("Create failed webgl program");
        }
        return program;
    }

    public createProgramFromDom(vertexShaderDom: string, fragmentShaderDom: string): WebGLProgram {
        const vertexShader = document.getElementById(vertexShaderDom);
        if (vertexShader === null) {
            throw new Error("Create failed webgl program");
        }
        const fragmentShader = document.getElementById(fragmentShaderDom);
        if (fragmentShader === null) {
            throw new Error("Create failed webgl program");
        }
        return this.createProgram(vertexShader.innerText, fragmentShader.innerText);
    }

    public createVertexBuffer(vertices: number[]): IVertexBuffer {
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer === null) {
            throw new Error("Create failed webgl vertex buffer");
        }
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(vertices), WebGLRenderingContext.STATIC_DRAW);
        return {
            vertexBuffer,
            vertexBufferSize: vertices.length
        };
    }

    public createIndexBuffer(indices: number[]): IIndexBuffer {
        const indexBuffer = this.gl.createBuffer();
        if (indexBuffer === null) {
            throw new Error("Create failed webgl index buffer");
        }
        this.gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), WebGLRenderingContext.STATIC_DRAW);
        return {
            indexBuffer,
            indexBufferSize: indices.length
        };
    }

    public setProgram(program: WebGLProgram, projkey: string, worldkey: string): void {
        const proj = this.gl.getUniformLocation(program, projkey);
        if (proj === null) {
            throw new Error("setProgram failed webgl " + projkey);
        }
        const world = this.gl.getUniformLocation(program, worldkey);
        if (world === null) {
            throw new Error("setProgram failed webgl " + worldkey);
        }
        this.gl.useProgram(program);
        this.program = program;
        this.proj = proj;
        this.world = world;
    }

    public setAttribProj(matrix: number[]): void {
        this.gl.uniformMatrix4fv(this.proj, false, matrix);
    }

    public setAttribWorld(matrix: number[]): void {
        this.gl.uniformMatrix4fv(this.world, false, matrix);
    }

    public setAttribVertexArray(perSize: number, key: string): void {
        const positionLocation = this.gl.getAttribLocation(this.program, key);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(
            positionLocation,
            perSize,
            this.gl.FLOAT,
            false,
            0,
            0);
    }

    public setVertexBuffer(vb: IVertexBuffer): void {
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vb.vertexBuffer);
        this.vb = vb;
    }

    public setIndexBuffer(ib: IIndexBuffer): void {
        this.gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, ib.indexBuffer);
        this.ib = ib;
    }

    public begin(): void {
        this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
    }

    public drawLine(matrix: number[]): void {
        this.setAttribWorld(matrix);
        this.gl.drawElements(
            this.gl.LINES,
            this.vb.vertexBufferSize,
            this.gl.UNSIGNED_SHORT,
            0);
    }

    public sample(): void {
        this.begin();
        for (let ii = 0; ii < 800; ii += 50) {
            this.drawLine([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                ii, 0, 0, 1]);
        }
        for (let ii = 0; ii < 600; ii += 50) {
            this.drawLine([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, ii, 0, 1]);
        }
    }
}