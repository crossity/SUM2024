import {Render} from './rnd/rnd.js'
import {vec3, rotate, translate} from './mth/mth.js'
import {Prim, autoNormals, vertex} from './rnd/prim.js'
import {Plat} from './rnd/plat.js'

let rnd, rnd1, rnd2, rnd3, rnd4;

let prim, prim1, prim2, prim3, prim4;

function init() {
  rnd = new Render(document.getElementById("myCan"));
  rnd1 = new Render(document.getElementById("myCan1"));
  rnd2 = new Render(document.getElementById("myCan2"));
  rnd3 = new Render(document.getElementById("myCan3"));
  rnd4 = new Render(document.getElementById("myCan4"));
  let z = 0;

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
  pl = pl.createTetrohedron();
  prim = pl.createPrim(rnd);
  pl = pl.createCube();
  prim1 = pl.createPrim(rnd1);
  pl = pl.createOctahedron();
  prim2 = pl.createPrim(rnd2);
  pl = pl.createIcosahedron();
  prim3 = pl.createPrim(rnd3);
  pl = pl.createDodecahedron();
  prim4 = pl.createPrim(rnd4);
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
    prim.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    prim.draw(rnd);
    rnd1.render();
    prim1.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    prim1.draw(rnd1);
    rnd2.render();
    prim2.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    prim2.draw(rnd2);
    rnd3.render();
    prim3.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    prim3.draw(rnd3);
    rnd4.render();
    prim4.world = rotate(t * 1, vec3(0, 1, 0)).mul(translate(vec3(0, Math.sin(t * 2), -6)))
    prim4.draw(rnd4);
    window.requestAnimationFrame(draw);
  }
  draw();
})
