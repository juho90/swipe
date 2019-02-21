interface IProgram {
    program: WebGLProgram;
    uniforms: Map<string, WebGLUniformLocation>;
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
    public static translate(
        matrix: number[],
        x?: number,
        y?: number,
        z?: number
    ) {
        matrix[12] = x !== undefined ? x : 0;
        matrix[13] = y !== undefined ? y : 0;
        matrix[14] = z !== undefined ? z : 0;
    }

    public static scale(matrix: number[], x?: number, y?: number, z?: number) {
        matrix[0] = x !== undefined ? x : 1;
        matrix[5] = y !== undefined ? y : 1;
        matrix[10] = z !== undefined ? z : 1;
    }

    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public programMap: Map<string, IProgram>;
    public shapeMap: Map<string, IShape>;
    public currentProgram: IProgram | undefined;
    public currentShape: IShape | undefined;

    constructor(canvas: HTMLCanvasElement) {
        const gl =
            canvas.getContext("webgl", { preserveDrawingBuffer: true }) ||
            canvas.getContext("experimental-webgl", {
                preserveDrawingBuffer: true
            });
        if (gl === null) {
            throw new Error("This browser doesn't support WebGL");
        }
        this.programMap = new Map();
        this.shapeMap = new Map();
        this.canvas = canvas;
        this.gl = gl;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(WebGLRenderingContext.DEPTH_TEST);
        gl.depthFunc(WebGLRenderingContext.LEQUAL);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
    }

    public registerProgram(
        name: string,
        vertexShaderSource: string,
        fragmentShaderSource: string,
        uniforms: string[]
    ): void {
        const program = this.gl.createProgram();
        if (program === null) {
            throw new Error("Create failed webgl program");
        }
        this.gl.attachShader(
            program,
            this.createShader(
                vertexShaderSource,
                WebGLRenderingContext.VERTEX_SHADER
            )
        );
        this.gl.attachShader(
            program,
            this.createShader(
                fragmentShaderSource,
                WebGLRenderingContext.FRAGMENT_SHADER
            )
        );
        this.gl.linkProgram(program);
        if (
            this.gl.getProgramParameter(
                program,
                WebGLRenderingContext.LINK_STATUS
            ) === undefined
        ) {
            throw new Error("Create failed webgl program");
        }
        const iprogram: IProgram = { program, uniforms: new Map() };
        uniforms.forEach(element => {
            const uniform = this.gl.getUniformLocation(program, element);
            if (uniform == null) {
                throw new Error(
                    "Create failed webgl program uniforms " + element
                );
            }
            iprogram.uniforms.set(element, uniform);
        });
        this.programMap.set(name, iprogram);
    }

    public useProgram(name: string): void {
        this.currentProgram = this.programMap.get(name);
        if (this.currentProgram === undefined) {
            return;
        }
        this.gl.useProgram(this.currentProgram.program);
    }

    public registerShape(
        name: string,
        vertices: number[],
        indices: number[]
    ): void {
        const vertexBuffer = this.gl.createBuffer();
        if (vertexBuffer === null) {
            throw new Error("Create failed webgl vertex buffer");
        }
        this.gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(vertices),
            WebGLRenderingContext.STATIC_DRAW
        );
        const ivb: IVertexBuffer = {
            vertexBuffer,
            vertexBufferSize: vertices.length
        };
        const indexBuffer = this.gl.createBuffer();
        if (indexBuffer === null) {
            throw new Error("Create failed webgl index buffer");
        }
        this.gl.bindBuffer(
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );
        this.gl.bufferData(
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            WebGLRenderingContext.STATIC_DRAW
        );
        const iib: IIndexBuffer = {
            indexBuffer,
            indexBufferSize: indices.length
        };
        const ishape: IShape = {
            iib,
            ivb
        };
        this.shapeMap.set(name, ishape);
    }

    public useShape(name: string, key: string, perVertices: number): void {
        if (this.currentProgram === undefined) {
            return;
        }
        this.currentShape = this.shapeMap.get(name);
        if (this.currentShape === undefined) {
            return;
        }
        this.gl.bindBuffer(
            WebGLRenderingContext.ARRAY_BUFFER,
            this.currentShape.ivb.vertexBuffer
        );
        this.gl.bindBuffer(
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            this.currentShape.iib.indexBuffer
        );
        const positionLocation = this.gl.getAttribLocation(
            this.currentProgram.program,
            key
        );
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(
            positionLocation,
            perVertices,
            this.gl.FLOAT,
            false,
            0,
            0
        );
    }

    public setUniformMatrix4fv(name: string, matrix: number[]): void {
        if (this.currentProgram === undefined) {
            return;
        }
        const uniform = this.currentProgram.uniforms.get(name);
        if (uniform === undefined) {
            return;
        }
        this.gl.uniformMatrix4fv(uniform, false, matrix);
    }

    public begin(): void {
        this.gl.clear(
            WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
        );
    }

    public drawShape(): void {
        if (this.currentShape === undefined) {
            return;
        }
        this.gl.drawElements(
            WebGLRenderingContext.LINES,
            this.currentShape.iib.indexBufferSize,
            WebGLRenderingContext.UNSIGNED_SHORT,
            0
        );
    }

    private createShader(source: string, type: number): WebGLShader {
        const shader = this.gl.createShader(type);
        if (shader === null) {
            throw new Error("Create failed webgl shader");
        }
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (
            this.gl.getShaderParameter(
                shader,
                WebGLRenderingContext.COMPILE_STATUS
            ) === undefined
        ) {
            throw new Error("Create failed webgl shader");
        }
        return shader;
    }
}
