import {mat4, vec3} from "../mth/mth.js"

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
    constructor(shd, verts, inds) {
        this._init(shd, verts, inds);
    }
    _init(shd, verts, inds) {
        let vtts = [], i = 0;
        this.shd = shd;
        this.verts = verts;
        this.inds = inds;
        this.loaded = true;

        for (let el of verts) {
            vtts[i++] = el.pos.x;
            vtts[i++] = el.pos.y;
            vtts[i++] = el.pos.z;
            vtts[i++] = el.norm.x;
            vtts[i++] = el.norm.y;
            vtts[i++] = el.norm.z;
        }
        this.vertexArray = shd.rnd.gl.createVertexArray();
        shd.rnd.gl.bindVertexArray(this.vertexArray);
        this.vertexBuffer = shd.rnd.gl.createBuffer();

        shd.rnd.gl.bindBuffer(shd.rnd.gl.ARRAY_BUFFER, this.vertexBuffer);
        shd.rnd.gl.bufferData(shd.rnd.gl.ARRAY_BUFFER, new Float32Array(vtts), shd.rnd.gl.STATIC_DRAW);

        if (shd.prg == null)
            this.loaded = false;
        if (shd.attrs["InPosition"] != undefined && shd.attrs["InNormal"] != undefined) {
            shd.rnd.gl.vertexAttribPointer(shd.attrs["InPosition"].loc, 3, shd.rnd.gl.FLOAT, false, 24, 0);
            shd.rnd.gl.enableVertexAttribArray(shd.attrs["InPosition"].loc);
            shd.rnd.gl.vertexAttribPointer(shd.attrs["InNormal"].loc, 3, shd.rnd.gl.FLOAT, false, 24, 12);
            shd.rnd.gl.enableVertexAttribArray(shd.attrs["InNormal"].loc);
        }

        this.indexBuffer = shd.rnd.gl.createBuffer();
        shd.rnd.gl.bindBuffer(shd.rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        shd.rnd.gl.bufferData(shd.rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(inds), shd.rnd.gl.STATIC_DRAW);

        this.numOfElements = inds.length;

        this.world = mat4(1);
    }
    draw() {
        if (this.shd.prg != null && !this.loaded)
            this._init(this.shd, this.verts, this.inds);
        if (!this.loaded)
            return;
        this.shd.rnd.gl.bindVertexArray(this.vertexArray);
        this.shd.rnd.gl.bindBuffer(this.shd.rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.shd.rnd.gl.drawElements(this.shd.rnd.gl.TRIANGLES, this.numOfElements, this.shd.rnd.gl.UNSIGNED_INT, 0);
        
        if (this.shd.uniformBlocks["Prim"] != undefined)
            this.shd.uniformBlocks["Prim"].update(0, new Float32Array([].concat(...(this.world.mul(this.shd.rnd.camera.proj)).a).concat(...this.world.a)));
    }
}