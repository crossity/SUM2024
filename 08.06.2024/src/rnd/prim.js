import {mat4, vec3} from "../mth/mth.js"
import { UniformBlock } from "./buffers.js";

class _vertex {
    constructor(pos, norm) {
        this.pos = pos;
        this.norm = norm;
    }
}

export function vertex(pos, norm) {
    if (norm == undefined) 
        return new _vertex(pos, vec3());
    return new _vertex(pos, norm);
}

export function autoNormals(verts, inds) {
    /* Set all vertex normals to zero */
    for (let i = 0; i < verts.length; i++)
        verts[i].norm = vec3();
    
    /* Eval normal for every facet */
    for (let i = 0; i < inds.length; i += 3)
    {
        let
            n0 = inds[i], n1 = inds[i + 1], n2 = inds[i + 2];
        let
            p0 = verts[n0].pos,
            p1 = verts[n1].pos,
            p2 = verts[n2].pos,
            N = p1.sub(p0).cross(p2.sub(p0)).norm();
    
        verts[n0].norm = verts[n0].norm.add(N);
        verts[n1].norm = verts[n1].norm.add(N);
        verts[n2].norm = verts[n2].norm.add(N);
    }
    
    /* Normalize all vertex normals */
    for (let i = 0; i < verts.length; i++)
        verts[i].norm = verts[i].norm.norm();
}

export class Prim {
    constructor(mtl, verts, inds) {
        this._init(mtl, verts, inds);
    }
    _init(mtl, verts, inds) {
        let vtts = [], i = 0;
        this.mtl = mtl; 
        this.verts = verts;
        this.inds = inds;
        this.loaded = true;

        this.ubo = new UniformBlock(mtl.shd.rnd, "Prim", 64 * 2, 0);

        for (let el of verts) {
            vtts[i++] = el.pos.x;
            vtts[i++] = el.pos.y;
            vtts[i++] = el.pos.z;
            vtts[i++] = el.norm.x;
            vtts[i++] = el.norm.y;
            vtts[i++] = el.norm.z;
        }
        this.vertexArray = mtl.shd.rnd.gl.createVertexArray();
        mtl.shd.rnd.gl.bindVertexArray(this.vertexArray);
        this.vertexBuffer = mtl.shd.rnd.gl.createBuffer();

        mtl.shd.rnd.gl.bindBuffer(mtl.shd.rnd.gl.ARRAY_BUFFER, this.vertexBuffer);
        mtl.shd.rnd.gl.bufferData(mtl.shd.rnd.gl.ARRAY_BUFFER, new Float32Array(vtts), mtl.shd.rnd.gl.STATIC_DRAW);

        if (mtl.shd.prg == null)
            this.loaded = false;
        if (mtl.shd.attrs["InPosition"] != undefined && mtl.shd.attrs["InNormal"] != undefined) {
            mtl.shd.rnd.gl.vertexAttribPointer(mtl.shd.attrs["InPosition"].loc, 3, mtl.shd.rnd.gl.FLOAT, false, 24, 0);
            mtl.shd.rnd.gl.enableVertexAttribArray(mtl.shd.attrs["InPosition"].loc);
            mtl.shd.rnd.gl.vertexAttribPointer(mtl.shd.attrs["InNormal"].loc, 3, mtl.shd.rnd.gl.FLOAT, false, 24, 12);
            mtl.shd.rnd.gl.enableVertexAttribArray(mtl.shd.attrs["InNormal"].loc);
        }

        this.indexBuffer = mtl.shd.rnd.gl.createBuffer();
        mtl.shd.rnd.gl.bindBuffer(mtl.shd.rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        mtl.shd.rnd.gl.bufferData(mtl.shd.rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(inds), mtl.shd.rnd.gl.STATIC_DRAW);

        this.numOfElements = inds.length;

        this.world = mat4(1);
    }
    draw() {
        if (this.mtl.shd.prg != null && !this.loaded)
            this._init(this.mtl, this.verts, this.inds);
        if (!this.loaded)
            return;

        this.mtl.apply();

        if (this.mtl.shd.uniformBlocks["Prim"] != undefined) {
            this.ubo.update(0, new Float32Array([].concat(...(this.world.mul(this.mtl.shd.rnd.camera.viewProj)).a).concat(...this.world.a)));
            this.ubo.apply(this.mtl.shd);
        }
        if (this.mtl.shd.uniformBlocks["Camera"] != undefined) {
            this.mtl.shd.rnd.cameraUbo.apply(this.mtl.shd);
        }
        
        this.mtl.shd.rnd.gl.bindVertexArray(this.vertexArray);
        this.mtl.shd.rnd.gl.bindBuffer(this.mtl.shd.rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.mtl.shd.rnd.gl.drawElements(this.mtl.shd.rnd.gl.TRIANGLES, this.numOfElements, this.mtl.shd.rnd.gl.UNSIGNED_INT, 0);
    }
}