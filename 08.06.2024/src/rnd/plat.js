import { autoNormals, Prim, vertex } from "./prim.js"
import { vec3, vec2 } from "../mth/mth.js"

export class Plat {
    constructor(verts) {
        this.verts = [...verts];
    }
    createCube() {
        let verts = [
            [vec3(-0.5, -0.5, -0.5), vec3(-0.5, 0.5, -0.5), vec3(0.5, 0.5, -0.5), vec3(0.5, -0.5, -0.5)], // front
            [vec3(-0.5, -0.5, 0.5), vec3(-0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, -0.5, 0.5)],     // back
            [vec3(-0.5, -0.5, -0.5), vec3(-0.5, 0.5, -0.5), vec3(-0.5, 0.5, 0.5), vec3(-0.5, -0.5, 0.5)], // left
            [vec3(0.5, -0.5, -0.5), vec3(0.5, 0.5, -0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, -0.5, 0.5)],     // right
            [vec3(-0.5, -0.5, -0.5), vec3(-0.5, -0.5, 0.5), vec3(0.5, -0.5, 0.5), vec3(0.5, -0.5, -0.5)], // bottom
            [vec3(-0.5, 0.5, -0.5), vec3(-0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, -0.5)],     // bottom
        ];

        return new Plat(verts);
    }
    createTetrohedron() {
        let sq2 = Math.sqrt(2), sq3 = Math.sqrt(3);
        let k = sq3 / 2, k1 = sq2 / sq3;
        let p0 = vec3(-0.5, -1/3 * k, 0), p1 = p0.add(vec3(0.5, k, 0)), p2 = p0.add(vec3(1, 0, 0));
        let p3 = p0.add(p1).add(p2).div(3).add(vec3(0, 0, -k1));

        let verts = [
            [p0, p1, p2],
            [p0, p1, p3],
            [p1, p2, p3], 
            [p2, p0, p3]
        ]
        return new Plat(verts);
    }

    createOctahedron() {
        let k = 1 / Math.sqrt(2);
        let verts = [
            [vec3(-0.5, 0, -0.5), vec3(0, k, 0), vec3(0.5, 0, -0.5)],
            [vec3(0.5, 0, -0.5), vec3(0, k, 0), vec3(0.5, 0, 0.5)],
            [vec3(0.5, 0, 0.5), vec3(0, k, 0), vec3(-0.5, 0, 0.5)],
            [vec3(-0.5, 0, 0.5), vec3(0, k, 0), vec3(-0.5, 0, -0.5)],
            [vec3(-0.5, 0, -0.5), vec3(0, -k, 0), vec3(0.5, 0, -0.5)],
            [vec3(0.5, 0, -0.5), vec3(0, -k, 0), vec3(0.5, 0, 0.5)],
            [vec3(0.5, 0, 0.5), vec3(0, -k, 0), vec3(-0.5, 0, 0.5)],
            [vec3(-0.5, 0, 0.5), vec3(0, -k, 0), vec3(-0.5, 0, -0.5)],
        ]
        return new Plat(verts);
    }

    createIcosahedron() {
        let verts = [];
        let layer1 = [];
        let layer2 = [];

        let r = 1 / (2 * Math.sin(36 / 180 * Math.PI)); 
        let d = Math.sqrt(1 - 2 * Math.sin(18 / 180 * Math.PI) * r);

        for (let angle = 0; angle < 360; angle += 72) {
            let a = angle / 180 * Math.PI;

            layer1.push(vec3(r * Math.sin(a), r * Math.cos(a), d * 0.5));
        }
        for (let angle = 36; angle < 360; angle += 72) {
            let a = angle / 180 * Math.PI;

            layer2.push(vec3(r * Math.sin(a), r * Math.cos(a), -d * 0.5));
        }
        for (let i = 0; i < layer1.length; i++) {
            let tri = [layer1[i], layer2[i], layer2[(i - 1 + 5) % 5]]
            verts.push(tri);
        }
        for (let i = 0; i < layer2.length; i++) {
            let tri = [layer2[i], layer1[i], layer1[(i + 1) % 5]]
            verts.push(tri);
        }

        let top = vec3(0, 0, r), bottom = vec3(0, 0, -r);
        for (let i = 0; i < 5; i++) {
            verts.push([layer1[i], layer1[(i + 1) % 5], top]);
            verts.push([layer2[i], layer2[(i + 1) % 5], bottom]);
        }

        return new Plat(verts);
    } 
    createDodecahedron() {
        let verts = [];
        let r = (Math.sqrt(10) * Math.sqrt(5 + Math.sqrt(5))) / 10;
        let R = 0.25 * (1 + Math.sqrt(5)) * Math.sqrt(3);
        let h = Math.sqrt(R * R - r * r);
        let r0 = r * 2 * Math.cos(36 / 180 * Math.PI);
        let d = Math.sqrt(R * R - r0 * r0);

        let top = [], bottom = [];
        let tm = [], bm = [];
        let middle = [];

        for (let angle = 0; angle < 360; angle += 72) {
            let a = angle / 180 * Math.PI;
            let b = (angle + 36) / 180 * Math.PI;

            top.push(vec3(Math.sin(a) * r, Math.cos(a) * r, h));
            bottom.push(vec3(Math.sin(b) * r, Math.cos(b) * r, -h));

            middle.push(vec3(Math.sin(a) * r0, Math.cos(a) * r0, d));
            middle.push(vec3(Math.sin(b) * r0, Math.cos(b) * r0, -d));
        }

        verts.push(top);
        verts.push(bottom);

        for (let i = 0; i < 5; i++) {
            verts.push([top[i], middle[i * 2], middle[(i * 2 + 1) % 10], middle[(i * 2 + 2) % 10], top[(i + 1) % 5]]);
            verts.push([bottom[i], middle[(i * 2 + 1) % 10], middle[(i * 2 + 2) % 10], middle[(i * 2 + 3) % 10], bottom[(i + 1) % 5]]);
        }

        //verts.push(middle);
        return new Plat(verts);
    }

    createPrim(mtl) {
        let inds = [];
        let v = [];
        let j = 0;

        for (let g of this.verts)
        {
            for (let p of g)
                v.push(vertex(p));

            for (let i = 2; i < g.length; i++) {
                inds.push(0 + j);
                inds.push(i - 1 + j);
                inds.push(i + j);
            }
            j += g.length;
        }

        autoNormals(v, inds);

        let r = v[0].pos.len();
        let rr = v[0].pos.x * v[0].pos.x + v[0].pos.z * v[0].pos.z;

        rr = Math.sqrt(rr);

        for (let i = 0; i < v.length; i++) {
            v[i].texCoord.x = (Math.atan2(v[i].pos.x / rr, v[i].pos.z / rr) + Math.PI) / Math.PI * 0.5;
            v[i].texCoord.y = (Math.acos(v[i].pos.y / r)) / Math.PI;
            // v[i].texCoord.x = (Math.atan(v[i].pos.y / v[i].pos.x) + Math.PI / 2) / Math.PI;
            // v[i].texCoord.y = Math.acos(v[i].pos.z / r) / Math.PI;
        }

        return new Prim(mtl, v, inds);
    }
}