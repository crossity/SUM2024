import { Camera } from './camera.js'
import { vec3 } from '../mth/mth.js'
import { UniformBlock } from './buffers.js';
import { Target } from './target.js';
import { Prim, vertex } from './prim.js';
import { Shader } from './shd.js'
import { Material } from './mtl.js'
import { Timer } from './timer.js'

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

        this.canvas = canvas;

        this.gl = canvas.getContext("webgl2");
        this.width = rect.right - rect.left;
        this.height = rect.bottom - rect.top;

        this.gl.enable(this.gl.DEPTH_TEST);

        this.cameraUbo = new UniformBlock(this, "Camera", 80, 1);

        this.gl.clearColor(0.5, 0.4, 1, 1);

        this.targets = [new Target(this, this.width, this.height), new Target(this, this.width, this.height)];

        this.curTarget = 0;

        // Setup camera
        this.camera = new Camera(this.width, this.height, vec3(0, 0, 0), vec3(0, 0, -1), vec3(0, 1, 0));

        this.shd = new Shader(this, "onscreen");
        this.mtl = new Material(this.shd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

        this.prim = new Prim(this.mtl, [vertex(vec3(-1, -1, 0.2)), vertex(vec3(3, -1, 0.2)), vertex(vec3(-1, 3, 0.2))], [0, 1, 2])

        // Timer initialization
        this.timer = new Timer();
        // this.gl.getExtension('OES_texture_float');
        const ext2 = this.gl.getExtension("OES_texture_float_linear");
        if (!ext2)
            alert("need OES_texture_float_linear");
    } // End of 'constructor' function

    // WebGL rendering function.
    renderStart() {
        this.timer.update();

        // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

        this.cameraUbo.update(0, new Float32Array([
            this.camera.loc.x, this.camera.loc.y, this.camera.loc.z, this.camera.projDist, 
            this.camera.dir.x, this.camera.dir.y, this.camera.dir.z, this.camera.projSize,
            this.camera.right.x, this.camera.right.y, this.camera.right.z, 0,
            this.camera.up.x, this.camera.up.y, this.camera.up.z, 0,
            this.camera.width, this.camera.height, 0, 0
        ]));

        this.targets[this.curTarget].apply();
        // this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    } // End of 'render' function

    renderEnd() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targets[this.curTarget].texture);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.prim.draw();
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

        this.curTarget = (this.curTarget + 1) % 2;
    }
}