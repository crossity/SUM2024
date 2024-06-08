import {Render} from './rnd/rnd.js'
import {vec3, rotate, translate} from './mth/mth.js'
import {Prim, autoNormals, vertex} from './rnd/prim.js'
import {Plat} from './rnd/plat.js'
import {Shader} from './rnd/shd.js'

let rnd;
let prim;
let shd;

function init() {
  rnd = new Render(document.getElementById("myCan"));

  /*
  let verts = [
    vertex(vec3(-1, -1, z - 1)), vertex(vec3(-1, 1, z - 1)), vertex(vec3(1, 1, z - 1)), vertex(vec3(1, -1, z - 1)),
    vertex(vec3(-1, -1, z + 1)), vertex(vec3(-1, 1, z + 1)), vertex(vec3(1, 1, z + 1)), vertex(vec3(1, -1, z + 1)),
  ]
  let inds = [
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    0, 1, 4, 1, 4, 5,
    2, 6, 7, 2, 7, 3, 
    1, 5, 6, 1, 6, 2,
    0, 4, 7, 0, 7, 3
  ]
  */
 /*
  let verts = [
    vertex(vec3(-1, -1, 0), vec3(0, 0, 1)), vertex(vec3(-1, 1, 0), vec3(0, 0, 1)), vertex(vec3(1, 1, 0), vec3(0, 0, 1)), vertex(vec3(1, -1, 0), vec3(0, 0, 1))
  ]
  let inds = [
    0, 1, 2, 2, 3, 0
  ]

  autoNormals(verts, inds);

  prim = new Prim(rnd, verts, inds);
  */
  let pl = new Plat([]);
  pl = pl.createDodecahedron();

  shd = new Shader(rnd, "default");

  prim = pl.createPrim(shd);
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
    prim.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    shd.apply();
    prim.draw(rnd);
    window.requestAnimationFrame(draw);
  }
  draw();
})
