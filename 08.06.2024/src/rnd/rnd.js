import {Camera} from './camera.js'
import {vec3} from '../mth/mth.js'

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

        this.gl.clearColor(0.5, 0.4, 1, 1);

        // Setup camera
        this.camera = new Camera(this.width, this.height, vec3(0, 0, 5), vec3(0), vec3(0, 1, 0));
    } // End of 'constructor' function

    // WebGL rendering function.
    renderStart() { 
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    } // End of 'render' function
}