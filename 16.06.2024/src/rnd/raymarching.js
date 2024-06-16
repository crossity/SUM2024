import { Prim, vertex } from "./prim.js";
import { vec3 } from "../mth/mth.js";

export class RaymarchingObject {
    constructor(mtl) {
        this.prim = new Prim(mtl, [vertex(vec3(-1, -1, 0.5)), vertex(vec3(3, -1, 0.5)), vertex(vec3(-1, 3, 0.5))], [0, 1, 2]);
    }
}