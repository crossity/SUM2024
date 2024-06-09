import {mat4} from '../mth/mth.js'

export class Camera {
    constructor(width, height, loc, at, up) {
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
        this.view = mat4();
        this.update(loc, at, up);
    }
    update(loc, at, up) {
        let info = this.view.setView(loc, at, up);
        this.loc = loc;
        this.at = at;
        this.right = info.right;
        this.up = info.up;
        this.dir = info.dir;

        this.viewProj = this.view.mul(this.proj);
    }
}