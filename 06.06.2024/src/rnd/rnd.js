import {mat4} from '../mth/mth.js'

export class Render {
    // Load and compile shader function
    loadShader(shaderType, shaderSource) {
        const shader = this.gl.createShader(shaderType);
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            let buf = this.gl.getShaderInfoLog(shader);
            console.log('Shader compile fail: ' + buf);
        }                                            
        return shader;
    } // End of 'loadShader' function

    // GL Initializatoin + class names initializaiton function.
    constructor(canvas) {
        let rect = canvas.getBoundingClientRect();

        this.gl = canvas.getContext("webgl2");
        this.width = rect.right - rect.left + 1;
        this.height = rect.bottom - rect.top + 1;

        this.gl.enable(this.gl.DEPTH_TEST);

        // Shader creation
        let vs_txt =
        `#version 300 es
        precision highp float;
        in vec3 InPosition;
        in vec3 InNormal;
            
        out vec3 DrawPos;
        out vec3 DrawNormal;
        uniform float Time;
        uniform mat4 MatWVP;
        uniform mat4 MatW;
        
        void main( void )
        {
            DrawPos = vec3(MatW * vec4(InPosition, 1));
            gl_Position = MatWVP * vec4(InPosition, 1);
            DrawNormal = mat3(transpose(inverse(MatW))) * InNormal;
        }
        `;
        let fs_txt =
        `#version 300 es
        precision highp float;

        in vec3 DrawNormal;
        in vec3 DrawPos;
        out vec4 OutColor;
        
        uniform float Time;
        
        void main( void )
        {
            vec3 color = vec3(1.0, 0.1, 8.0);
            vec3 N = normalize(DrawNormal);
            N = faceforward(N, normalize(DrawPos), N);

            float d = max(0.1, dot(normalize(vec3(-1, 1, 1)), normalize(N)));

            OutColor = vec4(color * d, 1.0);
        } 
        `;
        let
            vs = this.loadShader(this.gl.VERTEX_SHADER, vs_txt),
            fs = this.loadShader(this.gl.FRAGMENT_SHADER, fs_txt);
        this.prg = this.gl.createProgram();
        this.gl.attachShader(this.prg, vs); 
        this.gl.attachShader(this.prg, fs);
        this.gl.linkProgram(this.prg);
        if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
            let buf = this.gl.getProgramInfoLog(this.prg);
            console.log('Shader program link fail: ' + buf);
        }                                            

        // Uniform data
        this.timeLoc = this.gl.getUniformLocation(this.prg, "Time");
        this.wvpLoc = this.gl.getUniformLocation(this.prg, "MatWVP");
        this.wLoc = this.gl.getUniformLocation(this.prg, "MatW");
        
        this.gl.useProgram(this.prg);
        this.gl.clearColor(0.5, 0.4, 1, 1);

        // Get matrixes
        this.projSize = 0.1;
        this.projDist = 0.1;
        this.farClip = 300;

        let rx = this.projSize;
        let ry = this.projSize;

        if (this.width >= this.height)
            rx *= this.width / this.height;
        else
            ry *= this.height / this.width;

        this.proj = mat4();
        this.proj.frustum(-rx * 0.5, rx * 0.5, -ry * 0.5, ry * 0.5, this.projDist, this.farClip);
    } // End of 'constructor' function

    // WebGL rendering function.
    render() { 
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
                                                    
        if (this.timeLoc != -1) {
            const date = new Date();
            let t = date.getMinutes() * 60 +
                    date.getSeconds() +
                    date.getMilliseconds() / 1000;
        
            this.gl.uniform1f(this.timeLoc, t);
        }
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    } // End of 'render' function
}