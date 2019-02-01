interface IProgram {
    program: WebGLProgram;
    uniforms: {};
}

interface IVertexBuffer {
    vertexBuffer: WebGLBuffer;
    vertexBufferSize: number;
}

interface IIndexBuffer {
    indexBuffer: WebGLBuffer;
    indexBufferSize: number;
}

interface IShape {
    ivb: IVertexBuffer;
    iib: IIndexBuffer;
}

export default class WebGL {
    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public programMap: {};
    public shapeMap: {};
    public currentProgram: IProgram;
    public currentShape: IShape;

    constructor() {
        this.programMap = {};
        this.shapeMap = {};
    }

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

    public registerProgram(name: string, vertexShaderSource: string, fragmentShaderSource: string, uniforms: string[]): void {
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
        const iprogram: IProgram = { program, uniforms: {} }
        uniforms.forEach(element => {
            const uniform = this.gl.getUniformLocation(program, element);
            if (uniform == null) {
                throw new Error("Create failed webgl program uniforms " + element);
            }
            iprogram.uniforms[element] = uniform;
        });
        this.programMap[name] = iprogram;
    }

    public useProgram(name: string): void {
        this.currentProgram = this.programMap[name];
        this.gl.useProgram(this.currentProgram.program);
    }

    public registerShape(name: string, vertices: number[], indices: number[]): void {
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer === null) {
            throw new Error("Create failed webgl vertex buffer");
        }
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, new Float32Array(vertices), WebGLRenderingContext.STATIC_DRAW);
        const ivb: IVertexBuffer = {
            vertexBuffer,
            vertexBufferSize: vertices.length
        };
        const indexBuffer = this.gl.createBuffer();
        if (indexBuffer === null) {
            throw new Error("Create failed webgl index buffer");
        }
        this.gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), WebGLRenderingContext.STATIC_DRAW);
        const iib: IIndexBuffer = {
            indexBuffer,
            indexBufferSize: indices.length
        };
        const ishape: IShape = {
            iib,
            ivb
        };
        this.shapeMap[name] = ishape;
    }

    public useShape(name: string, key: string, perVertices: number): void {
        this.currentShape = this.shapeMap[name];
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, this.currentShape.ivb.vertexBuffer);
        this.gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, this.currentShape.iib.indexBuffer);
        const positionLocation = this.gl.getAttribLocation(this.currentProgram.program, key);
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(
            positionLocation,
            perVertices,
            this.gl.FLOAT,
            false,
            0,
            0);
    }

    public setUniformMatrix4fv(name: string, matrix: number[]): void {
        this.gl.uniformMatrix4fv(this.currentProgram.uniforms[name], false, matrix);
    }

    public begin(): void {
        this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
    }

    public drawShape(): void {
        this.gl.drawElements(
            WebGLRenderingContext.LINES,
            this.currentShape.iib.indexBufferSize,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0);
    }

    private createShader(source: string, type: number): WebGLShader {
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
}