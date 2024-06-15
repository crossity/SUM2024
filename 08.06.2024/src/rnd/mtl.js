import { UniformBlock } from "./buffers.js";
import { Texture } from "./textures.js"

export class Material {
    constructor(shd, ka, kd, ks, ph, trans) {
        this.shd = shd;

        this.ubo = new UniformBlock(shd.rnd, "Material", 16 * 4, 2);
        this.ubo.update(0, new Float32Array([ka.x, ka.y, ka.z, 0, kd.x, kd.y, kd.z, trans, ks.x, ks.y, ks.z, ph, 0, 0, 0, 0]));

        this.textures = [null, null, null, null];
        this.textureFlags = [false, false, false, false];
    }
    setTexture(ind, tex) {
        if (ind >= this.textureFlags.length)
            return;

        this.textures[ind] = tex;
        this.textureFlags = true;

        this.ubo.update(16 * 3, new Float32Array([this.textureFlags]));
    }
    apply() {
        if (this.shd.apply()) {
            this.ubo.apply(this.shd);

            for (let i = 0; i < this.textureFlags.length; i++) {
                if (!this.textureFlags[i])
                    continue;

                rnd.gl.activeTexture(this.shd.rnd.gl.TEXTURE0 + i);
                rnd.gl.bindTexture(this.shd.rnd.gl.TEXTURE_2D, this.textures[i].tex);
            }
            return true;
        }
        return false;
    }
}