import { Render } from './rnd/rnd.js'
import { vec3, rotate, translate, scale } from './mth/mth.js'
import { Prim, autoNormals, vertex } from './rnd/prim.js'
import { Plat } from './rnd/plat.js'
import { Shader } from './rnd/shd.js'
import { Material } from './rnd/mtl.js'
import { Texture } from './rnd/textures.js'
import { RaymarchingObject } from './rnd/raymarching.js'

let rnd;
let rm, rmshd, rmmtl;

let framesStill = 0;

function init() {
  rnd = new Render(document.getElementById("myCan"));

  rmshd = new Shader(rnd, "raymarching");
  rmmtl = new Material(rmshd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

  rm = new RaymarchingObject(rmmtl);
}

// Initialization
window.addEventListener("load", () => {
  init();

  const draw = () => {
    rnd.renderStart();
    /*
    prim.world = scale(vec3(0.8)).mul(rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(-1, Math.sin(t * 2), -6))));
    prim.draw(rnd);
    prim1.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(1, Math.sin(t * 4) * 2, -6)))
    prim1.draw(rnd);
    */

    rnd.gl.disable(rnd.gl.DEPTH_TEST);

    rnd.gl.activeTexture(rnd.gl.TEXTURE0);
    rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, rnd.targets[(rnd.curTarget + 1) % 2].texture);

    if (rmshd.apply() && rmshd.uniforms["uSamplePart"] != undefined)
      rmshd.rnd.gl.uniform1f(rmshd.uniforms["uSamplePart"].loc, 1 / framesStill);
    rm.prim.draw(rnd);
    rnd.gl.enable(rnd.gl.DEPTH_TEST);
    rnd.gl.bindTexture(rnd.gl.TEXTURE_2D, null);

    rnd.renderEnd();
    window.requestAnimationFrame(draw);

    framesStill++;
  }
  draw();
})

let mousePos = {x: 0, y: 0}, lastMousePos;

let sens = 3, speed = 0.1;

let anglex = 0, angley = 0;

function mouseDrag(e) {
  let rect = document.getElementById("myCan").getBoundingClientRect();
  let width = rect.right - rect.left + 1;
  let height = rect.bottom - rect.top + 1;

  lastMousePos = {x: mousePos.x, y: mousePos.y};

  mousePos.x = (e.clientX - rect.left) / width;
  mousePos.y = -(e.clientY - rect.top) / height + 1;

  if (e.buttons == 1) {
    let delta = {x: mousePos.x - lastMousePos.x, y: mousePos.y - lastMousePos.y};

    anglex += delta.y * sens;
    angley -= delta.x * sens;

    let at = vec3(0, 0, -1).pointTransform(rotate(anglex, vec3(1, 0, 0)));
    at = at.pointTransform(rotate(angley, vec3(0, 1, 0)));
    // at = at.pointTransform(rotate(-delta.x * sens, vec3(0, 1, 0))).add(rnd.camera.loc);

    at = at.add(rnd.camera.loc);
    rnd.camera.update(rnd.camera.loc, at, vec3(0, 1, 0));

    framesStill = 1;
  }
}

window.addEventListener("mousemove", (e) => {
  mouseDrag(e);
})

document.addEventListener("keypress", (e) => {
  if (e.key == 'w') {
    framesStill = 1;
    let delta = rnd.camera.dir.mul(speed);

    rnd.camera.update(rnd.camera.loc.add(delta), rnd.camera.at.add(delta), vec3(0, 1, 0));
  }
});