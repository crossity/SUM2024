import { Prim, vertex } from "./prim.js";
import { vec3 } from "../mth/mth.js";

export const TYPE_BASIC = 0;
export const TYPE_LIGHT = 1;

export const FIGURE_SPHERE = 0;
export const FIGURE_BOX    = 1;
export const FIGURE_PLANE  = 2;
export const FIGURE_MANDEL = 3;

export const OP_PUT = 0;
export const OP_SUB = 1;
export const OP_UNI = 2;

export const FLOATS_IN_OBJECT = 11;

export class RaymarchingObject {
    constructor(mtl) {
        this.mtl = mtl;
        this.prim = new Prim(mtl, [vertex(vec3(-1, -1, 0.5)), vertex(vec3(3, -1, 0.5)), vertex(vec3(-1, 3, 0.5))], [0, 1, 2]);

        this.objects = [
            {
                pos: vec3(-0.8, -0.8, -10.0),
                r: 2.0, 
                color: vec3(0.9),
                type: TYPE_BASIC, 
                k: 1.0,
                figure: FIGURE_SPHERE,
                op: OP_PUT
            },
            {
                pos: vec3(1).norm(),
                r: 10.0,
                color: vec3(1),
                type: TYPE_LIGHT,
                k: 0.1,
                figure: FIGURE_PLANE,
                op: OP_PUT
            },
            {
                pos: vec3(2.5, 1.3, -10.0),
                r: 1.5, 
                color: vec3(1, 0.5, 1),
                type: TYPE_BASIC,
                k: 0.03,
                figure: FIGURE_SPHERE,
                op: OP_PUT
            },
            {
                pos: vec3(2.5, -2.0, -10.0),
                r: 1.3, 
                color: vec3(0.7, 0.2, 0.9),
                type: TYPE_LIGHT,
                k: 3.0, 
                figure: FIGURE_SPHERE,
                op: OP_PUT
            },
            {
                pos: vec3(0, -12, -5),
                r: 10.0, 
                color: vec3(0.9),
                type: TYPE_BASIC,
                k: 1.0,
                figure: FIGURE_BOX,
                op: OP_PUT
            },
            {
                pos: vec3(0.5 - 0.8, 3.0 - 2.0, -10.0),
                r: 1.0,
                color: vec3(0.9),
                type: TYPE_BASIC,
                k: 1.0,
                figure: FIGURE_SPHERE,
                op: OP_SUB
            },
        ];

        this.updateTexture();
    }

    updateTexture() {
        const data = new Float32Array(FLOATS_IN_OBJECT * this.objects.length + 1);
        let gl = this.mtl.shd.rnd.gl;

        data[0] = this.objects.length;

        for (let i = 0; i < this.objects.length; i++) {
            let j = i * FLOATS_IN_OBJECT + 1;

            data[j + 0] = this.objects[i].pos.x;
            data[j + 1] = this.objects[i].pos.y;
            data[j + 2] = this.objects[i].pos.z;
            data[j + 3] = this.objects[i].color.x;
            data[j + 4] = this.objects[i].color.y;
            data[j + 5] = this.objects[i].color.z;
            data[j + 6] = this.objects[i].r;
            data[j + 7] = this.objects[i].k;
            data[j + 8] = this.objects[i].type;
            data[j + 9] = this.objects[i].figure;
            data[j + 10] = this.objects[i].op;
        }

        this.tex = gl.createTexture();
        
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R32F,
            FLOATS_IN_OBJECT * this.objects.length + 1,
            1,
            0,
            gl.RED,
            gl.FLOAT,
            data
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    draw(framesStill, editObject, raysCount, mode, numOfReflections) {
        let rnd = this.mtl.shd.rnd;

        rnd.gl.disable(rnd.gl.DEPTH_TEST);
        rnd.gl.activeTexture(rnd.gl.TEXTURE0);
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, rnd.targets[(rnd.curTarget + 1) % 2].texture);

        rnd.gl.activeTexture(rnd.gl.TEXTURE1);
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, this.tex);

        rnd.gl.activeTexture(rnd.gl.TEXTURE2);
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, rnd.targets[(rnd.curTarget + 1) % 2].indexes);

        let applied = this.mtl.shd.apply();
        if (applied && this.mtl.shd.uniforms["uSamplePart"] != undefined)
            this.mtl.shd.rnd.gl.uniform1f(this.mtl.shd.uniforms["uSamplePart"].loc, 1 / framesStill);
        if (applied && this.mtl.shd.uniforms["Random"] != undefined)
            this.mtl.shd.rnd.gl.uniform1f(this.mtl.shd.uniforms["Random"].loc, Math.random());
        if (applied && this.mtl.shd.uniforms["EditObject"] != undefined)
            this.mtl.shd.rnd.gl.uniform1i(this.mtl.shd.uniforms["EditObject"].loc, editObject);
        if (applied && this.mtl.shd.uniforms["MaxRayCount"] != undefined)
            this.mtl.shd.rnd.gl.uniform1i(this.mtl.shd.uniforms["MaxRayCount"].loc, raysCount);
        if (applied && this.mtl.shd.uniforms["Mode"] != undefined)
            this.mtl.shd.rnd.gl.uniform1i(this.mtl.shd.uniforms["Mode"].loc, mode);
        if (applied && this.mtl.shd.uniforms["NumOfReflections"] != undefined)
            this.mtl.shd.rnd.gl.uniform1i(this.mtl.shd.uniforms["NumOfReflections"].loc, numOfReflections);

        this.prim.draw(rnd);
        rnd.gl.enable(rnd.gl.DEPTH_TEST);
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, null);
    }
}