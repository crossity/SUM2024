function isPowerOf2(value) {
return (value & (value - 1)) === 0;
}

export class Texture {
    constructor(gl, url) {
        this.gl = gl;
        this.url = url;

        this.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);

        this.level = 0;
        this.internalFormat = gl.RGBA;
        this.width = 1;
        this.height = 1;
        this.border = 0;
        this.srcFormat = gl.RGBA;
        this.srcType = gl.UNSIGNED_BYTE;

        const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
        gl.texImage2D(
            gl.TEXTURE_2D,
            this.level,
            this.internalFormat,
            this.width,
            this.height,
            this.border,
            this.srcFormat,
            this.srcType,
            pixel,
        );

        this.image = new Image();
        this.image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texImage2D(
                gl.TEXTURE_2D,
                this.level,
                this.internalFormat,
                this.srcFormat,
                this.srcType,
                this.image,
            );
            
            if (isPowerOf2(this.image.width) && isPowerOf2(this.image.height)) {
                // Yes, it's a power of 2. Generate mips.
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            }
        };
            
        this.image.src = url;
    }
}