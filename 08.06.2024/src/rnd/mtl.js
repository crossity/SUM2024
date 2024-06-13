import { UniformBlock } from "./buffers.js";

export class Material {
    constructor(shd, ka, kd, ks, ph, trans) {
        this.shd = shd;

        this.ubo = new UniformBlock(shd.rnd, "Material", 16 * 3, 2);
        this.ubo.update(0, new Float32Array([ka.x, ka.y, ka.z, 0, kd.x, kd.y, kd.z, trans, ks.x, ks.y, ks.z, ph]));
    }
    apply() {
        if (this.shd.apply()) {
            this.ubo.apply(this.shd);
            return true;
        }
        return false;
    }
}