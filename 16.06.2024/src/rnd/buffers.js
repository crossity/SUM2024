export class UniformBlock {
    constructor(rnd, name, size, bind) {
        this.name = name;
        this.size = size;
        this.bind = bind;
        this.buffer = rnd.gl.createBuffer();
        this.rnd = rnd;

        rnd.gl.bindBuffer(rnd.gl.UNIFORM_BUFFER, this.buffer);
        rnd.gl.bufferData(rnd.gl.UNIFORM_BUFFER, this.size, rnd.gl.DYNAMIC_DRAW);
    }

    update(offset, data) {
        this.rnd.gl.bindBuffer(this.rnd.gl.UNIFORM_BUFFER, this.buffer);
        this.rnd.gl.bufferSubData(
            this.rnd.gl.UNIFORM_BUFFER,
            offset,
            data, 0
        )
    }

    apply(shd) {
        if (shd.prg == undefined || this.rnd == undefined)
            return;
        this.rnd.gl.uniformBlockBinding(shd.prg, shd.uniformBlocks[this.name].index, this.bind);
        this.rnd.gl.bindBufferBase(this.rnd.gl.UNIFORM_BUFFER, this.bind, this.buffer);
    }
}