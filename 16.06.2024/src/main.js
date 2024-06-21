import { Render } from './rnd/rnd.js'
import { vec3, rotate, translate, scale } from './mth/mth.js'
import { Prim, autoNormals, vertex } from './rnd/prim.js'
import { Plat } from './rnd/plat.js'
import { Shader } from './rnd/shd.js'
import { Material } from './rnd/mtl.js'
import { Texture } from './rnd/textures.js'
import { OP_SUB, RaymarchingObject } from './rnd/raymarching.js'

let rnd;
let rm, rmshd, rmmtl;

let framesStill = -1;

function init() {
  rnd = new Render(document.getElementById("myCan"));

  rmshd = new Shader(rnd, "raytracing");
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

    /*
    rm.objects[1].pos.x = Math.sin(rnd.timer.globalTime);
    rm.updateTexture();

    framesStill = 1;
    */

    rm.draw(framesStill, editObject);

    rnd.renderEnd();
    window.requestAnimationFrame(draw);

    framesStill++;
  }
  draw();
})

let mousePos = {x: 0, y: 0}, lastMousePos;

let sens = 2, speed = 5;

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

    framesStill = 1;

    if (editObject != -1) {
      let pos = rm.objects[editObject].pos.sub(rnd.camera.loc);
      let d = pos.dot(rnd.camera.dir);

      let mx = d / rnd.camera.projDist * delta.x * rnd.camera.projSize;
      let my = d / rnd.camera.projDist * delta.y * rnd.camera.projSize;

      rm.objects[editObject].pos = rm.objects[editObject].pos.add(rnd.camera.right.mul(mx));
      rm.objects[editObject].pos = rm.objects[editObject].pos.add(rnd.camera.up.mul(my));
      rm.updateTexture();
    } else {
      anglex += delta.y * sens;
      angley -= delta.x * sens;

      let at = vec3(0, 0, -1).pointTransform(rotate(anglex, vec3(1, 0, 0)));
      at = at.pointTransform(rotate(angley, vec3(0, 1, 0)));
      // at = at.pointTransform(rotate(-delta.x * sens, vec3(0, 1, 0))).add(rnd.camera.loc);

      at = at.add(rnd.camera.loc);
      rnd.camera.update(rnd.camera.loc, at, vec3(0, 1, 0));
    }
  }
}

window.addEventListener("mousemove", (e) => {
  mouseDrag(e);
})

function readPixel(x, y, texture, outputBuffer) {
  let gl = rnd.gl;

  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer( gl.FRAMEBUFFER, frameBuffer );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0 );
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, outputBuffer);
}

let editObject = -1;

document.addEventListener("keypress", (e) => {
  if (e.key == 'w') {
    framesStill = 1;
    let delta = rnd.camera.dir.mul(speed * rnd.timer.globalDeltaTime);
    rnd.camera.update(rnd.camera.loc.add(delta), rnd.camera.at.add(delta), vec3(0, 1, 0));
  }
  if (e.key == 's') {
    framesStill = 1;
    let delta = rnd.camera.dir.mul(-speed * rnd.timer.globalDeltaTime);
    rnd.camera.update(rnd.camera.loc.add(delta), rnd.camera.at.add(delta), vec3(0, 1, 0));
  }
  if (e.key == 'f') {
    editObject = -1;
  }
  if (e.key == 'c') {
    if (editObject != -1) {
      rm.objects[editObject].op = OP_SUB;
      rm.updateTexture();
      editObject = -1;
      framesStill = 1;
    }
  }
});

document.addEventListener("mousedown", (e) => {
  if (e.button == 1) {
    let data = new Uint8Array(4);

    readPixel(mousePos.x * rnd.width, mousePos.y * rnd.height, rnd.targets[rnd.curTarget].indexes, data);
    if (data[0] == 255 || data[0] == editObject)
      editObject = -1;
    else
      editObject = data[0];
    e.preventDefault();
    framesStill = 1;
  }
});