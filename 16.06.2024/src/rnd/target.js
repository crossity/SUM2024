export class Target {
    constructor(rnd, width, height) {
        this.texture = rnd.gl.createTexture();
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, this.texture);

        // define size and format of level 0
        const level = 0;
        const internalFormat = rnd.gl.RGBA;
        const border = 0;
        const format = rnd.gl.RGBA;
        const type = rnd.gl.UNSIGNED_BYTE;
        const data = null;

        this.rnd = rnd;

        rnd.gl.texImage2D(rnd.gl.TEXTURE_2D, level, internalFormat,
                        width, height, border,
                        format, type, data);
        
        // set the filtering so we don't need mips
        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_MIN_FILTER, rnd.gl.LINEAR);
        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_WRAP_S, rnd.gl.CLAMP_TO_EDGE);
        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_WRAP_T, rnd.gl.CLAMP_TO_EDGE);

        // Indexes texture
        this.indexes = rnd.gl.createTexture();
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, this.indexes);
        rnd.gl.pixelStorei(rnd.gl.UNPACK_ALIGNMENT, 1);
        rnd.gl.texImage2D(rnd.gl.TEXTURE_2D, level, internalFormat,
            width, height, border,
            format, type, data);

        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_MIN_FILTER, rnd.gl.LINEAR);
        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_WRAP_S, rnd.gl.CLAMP_TO_EDGE);
        rnd.gl.texParameteri(rnd.gl.TEXTURE_2D, rnd.gl.TEXTURE_WRAP_T, rnd.gl.CLAMP_TO_EDGE);
        
        // Creating frame buffer object
        this.fbo = rnd.gl.createFramebuffer();
        rnd.gl.bindFramebuffer(rnd.gl.FRAMEBUFFER, this.fbo);

        rnd.gl.framebufferTexture2D(rnd.gl.FRAMEBUFFER, rnd.gl.COLOR_ATTACHMENT0, rnd.gl.TEXTURE_2D, this.texture, level);
        rnd.gl.framebufferTexture2D(rnd.gl.FRAMEBUFFER, rnd.gl.COLOR_ATTACHMENT1, rnd.gl.TEXTURE_2D, this.indexes, level);
        rnd.gl.drawBuffers([ rnd.gl.COLOR_ATTACHMENT0, rnd.gl.COLOR_ATTACHMENT1 ]);
        rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, null);
    }
    apply() {
        this.rnd.gl.bindFramebuffer(this.rnd.gl.FRAMEBUFFER, this.fbo);
    }
};