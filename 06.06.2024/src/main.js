import {Render} from './rnd/rnd.js'
import {vec3, rotate, translate} from './mth/mth.js'
import {Prim, autoNormals, vertex} from './rnd/prim.js'

let rnd, rnd1;

let prim;

function init() {
  rnd = new Render(document.getElementById("myCan"));
  rnd1 = new Render(document.getElementById("myCan1"));
  let z = 0;

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

  autoNormals(verts, inds);

  prim = new Prim(rnd, verts, inds);
}

// Initialization
window.addEventListener("load", () => {
  init();

  const draw = () => {
      rnd.render();
      const date = new Date();
      let t = date.getMinutes() * 60 +
              date.getSeconds() +
              date.getMilliseconds() / 1000;
      prim.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -30)))
      prim.draw(rnd);
      rnd1.render();
      window.requestAnimationFrame(draw);
  }
  draw();
})
