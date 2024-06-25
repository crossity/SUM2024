export class Shader {
    constructor(rnd, name) {
       this.rnd = rnd;
       this.name = name;
       this.prg = null;
       this.attrs = [];
       this.uniforms = [];

       this._init();
    }
    
    async _init() {
        this.shaders =
        [
        {
            id: null,
            type: this.rnd.gl.FRAGMENT_SHADER,
            name: "frag",
            src: "",
        },
        {
            id: null,
            type: this.rnd.gl.VERTEX_SHADER,
            name: "vert",
            src: "",
        },
        ];

        for (const s of this.shaders) {
            let response = await fetch(`bin/shaders/${this.name}/${s.name}.glsl`);
            let src = await response.text();
            if (typeof src == "string" && src != "")
                s.src = src;
        }
        this.updateShadersSource();
    }

    updateShadersSource() { 
        this.shaders[0].id = null;
        this.shaders[1].id = null;
        this.prg = null;
        if (this.shaders[0].src == "" || this.shaders[1].src == "")
            return;
        this.shaders.forEach(s => {
            s.id = this.rnd.gl.createShader(s.type);
            this.rnd.gl.shaderSource(s.id, s.src);
            this.rnd.gl.compileShader(s.id);
            if (!this.rnd.gl.getShaderParameter(s.id, this.rnd.gl.COMPILE_STATUS)) {
                let buf = this.rnd.gl.getShaderInfoLog(s.id);
                console.log(`Shader ${this.name}/${s.name} compile fail: ${buf}`);
            }                                            
        });             
        this.prg = this.rnd.gl.createProgram();
        this.shaders.forEach(s => {
            if (s.id != null)
                this.rnd.gl.attachShader(this.prg, s.id);
        });
        this.rnd.gl.linkProgram(this.prg);
        if (!this.rnd.gl.getProgramParameter(this.prg, this.rnd.gl.LINK_STATUS)) {
            let buf = this.rnd.gl.getProgramInfoLog(this.prg);
            console.log(`Shader program ${this.name} link fail: ${buf}`);
        }                                            
        this.updateShaderData();    
    } 
    updateShaderData() {
        // Uniform data
        this.uniforms = {};
        const countUniforms = this.rnd.gl.getProgramParameter(this.prg, this.rnd.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < countUniforms; i++) {
        const info = this.rnd.gl.getActiveUniform(this.prg, i);
        this.uniforms[info.name] = {
            name: info.name,
            type: info.type,
            size: info.size,
            loc: this.rnd.gl.getUniformLocation(this.prg, info.name),
        };
        }

        // Setting textures locations
        this.rnd.gl.useProgram(this.prg);
        if (this.uniforms["Texture0"] != undefined)
            this.rnd.gl.uniform1i(this.uniforms["Texture0"].loc, 0);
        if (this.uniforms["Texture1"] != undefined)
            this.rnd.gl.uniform1i(this.uniforms["Texture1"].loc, 1);
        if (this.uniforms["Texture2"] != undefined)
            this.rnd.gl.uniform1i(this.uniforms["Texture2"].loc, 2);
        this.rnd.gl.useProgram(null);

        // Attributes
        this.attrs = {};
        const countAttrs = this.rnd.gl.getProgramParameter(this.prg, this.rnd.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < countAttrs; i++) {
            const info = this.rnd.gl.getActiveAttrib(this.prg, i);
            this.attrs[info.name] = {
                name: info.name,
                type: info.type,
                size: info.size,
                loc: this.rnd.gl.getAttribLocation(this.prg, info.name),
            };
        }
        // Uniform blocks
        this.uniformBlocks = {};
        const countUniformBlocks = this.rnd.gl.getProgramParameter(this.prg, this.rnd.gl.ACTIVE_UNIFORM_BLOCKS);
        for (let i = 0; i < countUniformBlocks; i++) {
            const block_name = this.rnd.gl.getActiveUniformBlockName(this.prg, i);
            const index = this.rnd.gl.getUniformBlockIndex(this.prg, block_name, );
            this.uniformBlocks[block_name] =  {
                name: block_name,
                size: this.rnd.gl.getActiveUniformBlockParameter(this.prg, index, this.rnd.gl.UNIFORM_BLOCK_DATA_SIZE),
                index: this.rnd.gl.getUniformBlockIndex(this.prg, block_name),
                bind: this.rnd.gl.getActiveUniformBlockParameter(this.prg, index, this.rnd.gl.UNIFORM_BLOCK_BINDING),
            };
        }
    }
    apply() {
        if (this.prg != null) {
            this.rnd.gl.useProgram(this.prg);
            return true;
        }
        return false;
    }
}