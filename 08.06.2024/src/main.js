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
