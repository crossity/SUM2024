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
    constructor(rnd, verts, inds) {
        let vtts = [], i = 0;

        for (let el of verts) {
            vtts[i++] = el.pos.x;
            vtts[i++] = el.pos.y;
            vtts[i++] = el.pos.z;
            vtts[i++] = el.norm.x;
            vtts[i++] = el.norm.y;
            vtts[i++] = el.norm.z;
        }
        const posLoc = rnd.gl.getAttribLocation(rnd.prg, "InPosition");        this.vertexArray = rnd.gl.createVertexArray();
        const normLoc = rnd.gl.getAttribLocation(rnd.prg, "InNormal");
        rnd.gl.bindVertexArray(this.vertexArray);
        this.vertexBuffer = rnd.gl.createBuffer();

        rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.vertexBuffer);
        rnd.gl.bufferData(rnd.gl.ARRAY_BUFFER, new Float32Array(vtts), rnd.gl.STATIC_DRAW);
        
        if (posLoc != -1) {
            rnd.gl.vertexAttribPointer(posLoc, 3, rnd.gl.FLOAT, false, 24, 0);
            rnd.gl.enableVertexAttribArray(posLoc);
            rnd.gl.vertexAttribPointer(normLoc, 3, rnd.gl.FLOAT, false, 24, 12);
            rnd.gl.enableVertexAttribArray(normLoc);
        }

        this.indexBuffer = rnd.gl.createBuffer();
        rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        rnd.gl.bufferData(rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(inds), rnd.gl.STATIC_DRAW);

        this.numOfElements = inds.length;

        this.world = mat4(1);
    }
    draw(rnd) {
        rnd.gl.bindVertexArray(this.vertexArray);
        rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        rnd.gl.drawElements(rnd.gl.TRIANGLES, this.numOfElements, rnd.gl.UNSIGNED_INT, 0);
        if (rnd.wvpLoc != -1) {
            rnd.gl.uniformMatrix4fv(rnd.wvpLoc, false, new Float32Array([].concat(...(this.world.mul(rnd.proj)).a)));
        }
    }
}