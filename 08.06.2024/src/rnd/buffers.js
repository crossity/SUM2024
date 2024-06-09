export class UniformBlock {
    constructor(shd, name) {
        this.name = name;
        this.index = shd.rnd.gl.getUniformBlockIndex(shd.prg, name);
        this.size = shd.rnd.gl.getActiveUniformBlockParameter(shd.prg, this.index, shd.rnd.gl.UNIFORM_BLOCK_DATA_SIZE);
        this.bind = shd.rnd.gl.getActiveUniformBlockParameter(shd.prg, this.index, shd.rnd.gl.UNIFORM_BLOCK_BINDING);
        this.buffer = shd.rnd.gl.createBuffer();
        this.shd = shd;

        shd.rnd.gl.bindBuffer(shd.rnd.gl.UNIFORM_BUFFER, this.buffer);
        shd.rnd.gl.bufferData(shd.rnd.gl.UNIFORM_BUFFER, this.size, shd.rnd.gl.DYNAMIC_DRAW);
        shd.rnd.gl.bindBufferBase(shd.rnd.gl.UNIFORM_BUFFER, this.bind, this.buffer);
    }

    update(offset, data) {
        this.shd.rnd.gl.bindBuffer(this.shd.rnd.gl.UNIFORM_BUFFER, this.buffer);
        this.shd.rnd.gl.bufferSubData(
            this.shd.rnd.gl.UNIFORM_BUFFER,
            offset,
            data, 0
        )
    }
}