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
        let loaded = this.shd.apply();

        if (!loaded)
            return false;

        if (this.shd.uniforms["Time"] != undefined)
            this.shd.rnd.gl.uniform1f(this.shd.uniforms["Time"].loc, this.shd.rnd.timer.globalTime);
        if (this.shd.uniforms["DeltaTime"] != undefined)
            this.shd.rnd.gl.uniform1f(this.shd.uniforms["DeltaTime"].loc, this.shd.rnd.timer.globalDeltaTime);

        if (this.shd.apply() && this.shd.uniformBlocks[Material] != undefined) {
            this.ubo.apply(this.shd);

            let gl = this.shd.rnd.gl;
            let useTex = false;

            for (let i = 0; i < this.textureFlags.length; i++) {
                if (!this.textureFlags[i])
                    continue;
                useTex = true;

                this.shd.rnd.gl.activeTexture(this.shd.rnd.gl.TEXTURE0 + i);
                this.shd.rnd.gl.bindTexture(this.shd.rnd.gl.TEXTURE_2D, this.textures[i].tex);
            }
            
            return true;
        }
        return false;
    }
}