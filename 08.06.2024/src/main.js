import {Render} from './rnd/rnd.js'
import {vec3, rotate, translate} from './mth/mth.js'
import {Prim, autoNormals, vertex} from './rnd/prim.js'
import {Plat} from './rnd/plat.js'
import {Shader} from './rnd/shd.js'
import { Material } from './rnd/mtl.js'

let 
  rnd, prim, shd, mtl, prim1, mtl1;

function init() {
  rnd = new Render(document.getElementById("myCan"));

  let pl = new Plat([]);
  pl = pl.createDodecahedron();

  shd = new Shader(rnd, "default");
  mtl = new Material(shd, vec3(0, 0, 0), vec3(1, 0, 1), vec3(1, 1, 1), 10, 1);

  prim = pl.createPrim(mtl);

  pl = new Plat([]);
  pl = pl.createIcosahedron();

  mtl1 = new Material(shd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

  prim1 = pl.createPrim(mtl1);
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
    prim.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(-1, Math.sin(t * 2), -6)))
    prim.draw(rnd);
    prim1.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(1, Math.sin(t * 4) * 2, -6)))
    prim1.draw(rnd);
    window.requestAnimationFrame(draw);
  }
  draw();
})
