import {mat4} from '../mth/mth.js'

export class Camera {
    constructor(width, height) {
        this.projSize = 0.1;
        this.projDist = 0.1;
        this.farClip = 300;

        this.width = width;
        this.height = height;

        let rx = this.projSize;
        let ry = this.projSize;

        if (this.width >= this.height)
            rx *= this.width / this.height;
        else
            ry *= this.height / this.width;

        this.proj = mat4();
        this.proj.setFrustum(-rx * 0.5, rx * 0.5, -ry * 0.5, ry * 0.5, this.projDist, this.farClip);
    }
}