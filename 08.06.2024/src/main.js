import { Render } from './rnd/rnd.js'
import { vec3, rotate, translate, scale } from './mth/mth.js'
import { Prim, autoNormals, vertex } from './rnd/prim.js'
import { Plat } from './rnd/plat.js'
import { Shader } from './rnd/shd.js'
import { Material } from './rnd/mtl.js'
import { Texture } from './rnd/textures.js'
import { RaymarchingObject } from './rnd/raymarching.js'

let 
  rnd, prim, shd, mtl, prim1, mtl1;
let tex;
let rm, rmshd, rmmtl;

function init() {
  rnd = new Render(document.getElementById("myCan"));

  let pl = new Plat([]);
  pl = pl.createDodecahedron();

  shd = new Shader(rnd, "default");
  mtl = new Material(shd, vec3(0, 0, 0), vec3(1, 0, 1), vec3(1, 1, 1), 10, 1);

  tex = new Texture(rnd.gl, "./bin/textures/a.png");
  mtl.setTexture(0, tex);
  /*
  prim = new Prim(mtl, [], []); // pl.createPrim(mtl);
  prim.loadOBJ("bin/models/untitled1.obj");
  */

  prim = pl.createPrim(mtl);

  pl = new Plat([]);
  pl = pl.createIcosahedron();

  mtl1 = new Material(shd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

  prim1 = pl.createPrim(mtl1);

  rmshd = new Shader(rnd, "raymarching");
  rmmtl = new Material(rmshd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

  rm = new RaymarchingObject(rmmtl);
}

// Initialization
window.addEventListener("load", () => {
  init();

  const draw = () => {
    rnd.renderStart();

    const date = new Date();
    let t = date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;

    /*
    prim.world = scale(vec3(0.8)).mul(rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(-1, Math.sin(t * 2), -6))));
    prim.draw(rnd);
    prim1.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(1, Math.sin(t * 4) * 2, -6)))
    prim1.draw(rnd);
    */

    rnd.gl.disable(rnd.gl.DEPTH_TEST);
    rm.prim.draw(rnd);
    rnd.gl.enable(rnd.gl.DEPTH_TEST);
    window.requestAnimationFrame(draw);
  }
  draw();
})

let mousePos = {x: 0, y: 0}, lastMousePos;

let sens = 1.5;

function mouseDrag(e) {
  let rect = document.getElementById("myCan").getBoundingClientRect();
  let width = rect.right - rect.left + 1;
  let height = rect.bottom - rect.top + 1;

  lastMousePos = {x: mousePos.x, y: mousePos.y};

  mousePos.x = (e.clientX - rect.left) / width;
  mousePos.y = -(e.clientY - rect.top) / height + 1;

  if (e.buttons == 1) {
    let delta = {x: mousePos.x - lastMousePos.x, y: mousePos.y - lastMousePos.y};

    let at = rnd.camera.at.sub(rnd.camera.loc).pointTransform(rotate(-delta.y * sens, vec3(1, 0, 0)));
    at = at.pointTransform(rotate(delta.x * sens, vec3(0, 1, 0))).add(rnd.camera.loc);
    console.log("HELLO");
    rnd.camera.update(rnd.camera.loc, at, vec3(0, 1, 0));
  }
}

window.addEventListener("mousemove", (e) => {
  mouseDrag(e);
})
