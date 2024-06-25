import { Render } from './rnd/rnd.js'
import { vec3, rotate, translate, scale } from './mth/mth.js'
import { Prim, autoNormals, vertex } from './rnd/prim.js'
import { Plat } from './rnd/plat.js'
import { Shader } from './rnd/shd.js'
import { Material } from './rnd/mtl.js'
import { Texture } from './rnd/textures.js'
import { RaymarchingObject } from './rnd/raymarching.js'
import { TYPE_BASIC, TYPE_LIGHT, FIGURE_BOX, FIGURE_SPHERE, FIGURE_PLANE, FIGURE_MANDEL, OP_PUT, OP_SUB, OP_UNI } from './rnd/raymarching.js'

let rnd;
let rm, rmshd, rmmtl;

let framesStill = -1;
let mode = 1;

function init() {
  console.log(hexToVec3(vec3ToHex(vec3(1, 0, 0))));

  rnd = new Render(document.getElementById("myCan"));

  rmshd = new Shader(rnd, "raytracing");
  rmmtl = new Material(rmshd, vec3(0, 0, 0), vec3(0, 0, 1), vec3(1, 1, 1), 10, 1);

  rm = new RaymarchingObject(rmmtl);

  objectSelectorInit();
}

// Initialization
window.addEventListener("load", () => {
  init();

  const draw = () => {
    inputUpdate();

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

    rm.draw(framesStill, editObject, raysCount, mode);

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

  if (e.buttons == 1 && mousePos.x >= 0 && mousePos.x <= 1 && mousePos.y >= 0 && mousePos.y <= 1) {
    let delta = {x: mousePos.x - lastMousePos.x, y: mousePos.y - lastMousePos.y};

    framesStill = 1;

    if (editObject != -1) {
      let pos = rm.objects[editObject].pos.sub(rnd.camera.loc);
      let d = pos.dot(rnd.camera.dir);

      if (keys['ctrl']) {
        let mx = d / rnd.camera.projDist * delta.x * rnd.camera.projSize;
        let my = d / rnd.camera.projDist * delta.y * rnd.camera.projSize;
        let newR = Math.sqrt(mx * mx + my * my) * Math.sign(mx);

        rm.objects[editObject].r += newR;
        rm.updateTexture();
      }
      else {
        let mx = d / rnd.camera.projDist * delta.x * rnd.camera.projSize;
        let my = d / rnd.camera.projDist * delta.y * rnd.camera.projSize;

        rm.objects[editObject].pos = rm.objects[editObject].pos.add(rnd.camera.right.mul(mx));
        rm.objects[editObject].pos = rm.objects[editObject].pos.add(rnd.camera.up.mul(my));
        rm.updateTexture();
      }
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

  x = Math.floor(x);
  y = Math.floor(y);

  const frameBuffer = gl.createFramebuffer();
  gl.bindFramebuffer( gl.FRAMEBUFFER, frameBuffer );
  gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0 );
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, outputBuffer);
}

let editObject = -1;

let keys = {
  "a": false,
  "d": false,
  "w": false,
  "s": false,
  "c": false,
  "middle": false,
  "ctrl": false,
  "backspace": false,
};

let prevKeys = {...keys};

let keysClick = {...keys};

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey)
    keys['ctrl'] = true;
  else if (e.key == "Backspace")
    keys['backspace'] = true;
  else
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  if (e.keyCode == 17)
    keys['ctrl'] = false;
  else if (e.key == "Backspace")
    keys['backspace'] = false;
  else
    keys[e.key] = false;
});

function selectObject() {
  $("#edit-div").show();
  $("#edit-button").show();
  document.getElementById("k-range").value = rm.objects[editObject].k * 100;
  document.getElementById("color-picker").value = vec3ToHex(rm.objects[editObject].color);
  document.getElementById("operator-button").value = "operator: " + (rm.objects[editObject].op == OP_SUB ? "sub" : "put");
  
  $("#object-selector").hide();
  $("#object-div").show();
  showAddMenu = false;
}

function diselectObject() {
  $("#edit-selector").hide();
  $("#material-selector").hide();
  $("#interaction-selector").hide();
  $("#edit-div").hide();
  showMaterialMenu = false;
  showEditMenu = false;

  $("#object-div").show();
}

function inputUpdate() {
  let pressed = false;
  let dir = vec3(0);

  for (let i in keys) {
    keysClick[i] = false;
    if (!prevKeys[i] && keys[i])
      keysClick[i] = true;
  }

  if (keys['w']) {
    framesStill = 1;
    pressed = true;
    dir.z++;
  }
  if (keys['s']) {
    framesStill = 1;
    pressed = true;
    dir.z--;
  }
  if (keys['a']) {
    framesStill = 1;
    pressed = true;
    dir.x--;
  }
  if (keys['d']) {
    framesStill = 1;
    pressed = true;
    dir.x++;
  }

  if (pressed) {
    dir = dir.norm();

    let delta = rnd.camera.right.mul(speed * dir.x).add(rnd.camera.dir.mul(speed * dir.z)).mul(rnd.timer.globalDeltaTime);
    rnd.camera.update(rnd.camera.loc.add(delta), rnd.camera.at.add(delta), vec3(0, 1, 0));
  }

  if (keysClick['c'])
    if (editObject != -1) {
      let object;

      rm.objects[editObject].op = OP_SUB;

      object = rm.objects[editObject];
      rm.objects.splice(editObject, 1);
      rm.objects.unshift(object);
      rm.updateTexture();
      editObject = -1;
      framesStill = 1;
    }
  
  if (keysClick['middle']) {
    let data = new Uint8Array(4);

    readPixel(mousePos.x * rnd.width, mousePos.y * rnd.height, rnd.targets[(rnd.curTarget + 1) % 2].indexes, data);
    if (data[0] == 255 || data[0] == editObject)
      editObject = -1;
    else
      editObject = data[0];
    framesStill = 1;

    // Buttons updating
    if (editObject == -1) {
      diselectObject();
    } else {
      selectObject();
    }
  }

  if (keysClick['backspace']) {
    if (editObject != -1) {
      rm.objects.splice(editObject, 1);
      rm.updateTexture();
      editObject = -1;
      framesStill = 1;
    }
  }

  // Updating clicks
  prevKeys = {...keys};
}

document.addEventListener("mousedown", (e) => {
  if (e.button == 1) {
    keys['middle'] = true;
    e.preventDefault();
  }
});

document.addEventListener("mouseup", (e) => {
  if (e.button == 1) {
    keys['middle'] = false;
    e.preventDefault();
  }
});

function hexToVec3(hex) {
  let v = vec3(0);

  v.x = Number("0x" + hex.slice(1, 3)) / 255.0;
  v.y = Number("0x" + hex.slice(3, 5)) / 255.0;
  v.z = Number("0x" + hex.slice(5, 7)) / 255.0;

  return v;
}

function vec3ToHex(v) {
    let hex = "#";

    hex += Math.floor(v.x * 255).toString(16);
    if (hex.length % 2 == 0)
      hex += "0";
    hex += Math.floor(v.y * 255).toString(16);
    if (hex.length % 2 == 0)
      hex += "0";
    hex += Math.floor(v.z * 255).toString(16);
    if (hex.length % 2 == 0)
      hex += "0";

    return hex;
}

let 
  showAddMenu = false, 
  showMaterialMenu = false, 
  showSettingsMenu = false,
  showEditMenu = false,
  showInteractionMenu = false;

let raysCount = 4;

function objectSelectorInit() {
  $("#object-selector").hide();

  $("#object-button").on("click", () => {
    showAddMenu = !showAddMenu;

    if (showAddMenu)
      $("#object-selector").slideDown();
    else
      $("#object-selector").slideUp();
  });

  $("#sphere-button").on("click", () => {
    rm.objects.push({
      pos: rnd.camera.dir.mul(5.0).add(rnd.camera.loc),
      r: 1.0, 
      color: vec3(0.9),
      type: TYPE_BASIC, 
      k: 1.0,
      figure: FIGURE_SPHERE,
      op: OP_PUT
    });
    framesStill = 1;

    rm.updateTexture();
  });

  $("#box-button").on("click", () => {
    rm.objects.push({
      pos: rnd.camera.dir.mul(5.0).add(rnd.camera.loc),
      r: 1.0, 
      color: vec3(0.9),
      type: TYPE_BASIC, 
      k: 1.0,
      figure: FIGURE_BOX,
      op: OP_PUT
    });
    framesStill = 1;

    rm.updateTexture();
  });

  $("#mandel-button").on("click", () => {
    rm.objects.push({
      pos: rnd.camera.dir.mul(5.0).add(rnd.camera.loc),
      r: 1.0, 
      color: vec3(0.9),
      type: TYPE_BASIC, 
      k: 1.0,
      figure: FIGURE_MANDEL,
      op: OP_PUT
    });
    framesStill = 1;

    rm.updateTexture();
  });

  /* $("#material-button").hide(); */
  $("#material-selector").hide();

  /*$("#material-div").hide(); */

  $("#material-button").on("click", () => {
    showMaterialMenu = !showMaterialMenu;

    if (showMaterialMenu) 
      $("#material-selector").slideDown();
    else
      $("#material-selector").slideUp();
  });

  $("#k-range").on("input", () => {
    rm.objects[editObject].k = document.getElementById("k-range").value / 100.0;
    rm.updateTexture();
    framesStill = 1;
  });

  $("#color-picker").on("input", () => {
    rm.objects[editObject].color = hexToVec3(document.getElementById("color-picker").value);
    rm.updateTexture();
    framesStill = 1;
  });

  $("#edit-selector").hide();
  $("#edit-div").hide();

  $("#edit-button").on("click", () => {
    showEditMenu = !showEditMenu;

    if (showEditMenu) 
      $("#edit-selector").slideDown();
    else
      $("#edit-selector").slideUp();

    $("#material-selector").slideUp();
    showMaterialMenu = false;
    $("#interaction-selector").slideUp();
    showInteractionMenu = false;
  });

  $("#interaction-selector").hide();
  $("#interaction-button").on("click", () => {
    showInteractionMenu = !showInteractionMenu;

    if (showInteractionMenu) 
      $("#interaction-selector").slideDown();
    else
      $("#interaction-selector").slideUp();
  });

  $("#operator-button").on("click", () => {
    rm.objects[editObject].op = (rm.objects[editObject].op + 1) % 3;

    rm.updateTexture();
    framesStill = 1;

    let str;

    if (rm.objects[editObject].op == OP_SUB)
      str = "sub";
    else if (rm.objects[editObject].op == OP_UNI)
      str = "union";
    else 
      str = "put";

    console.log(rm.objects[editObject].op);
    document.getElementById("operator-button").value = "operator: " + str;
  });

  $("#type-button").on("click", () => {
    rm.objects[editObject].type = (rm.objects[editObject].type + 1) % 2;
    let str;

    if (rm.objects[editObject].type == TYPE_BASIC)
      str = "basic";
    else
      str = "light";
    document.getElementById("type-button").value = "type: " + str;
    rm.updateTexture();
    framesStill = 1;
  });

  $("#settings-selector").hide();

  $("#settings-button").on("click", () => {
    showSettingsMenu = !showSettingsMenu;

    if (showSettingsMenu)
      $("#settings-selector").slideDown();
    else
      $("#settings-selector").slideUp();
  });

  $("#rays-range").on("change", () => {
    raysCount = document.getElementById("rays-range").value;
    framesStill = 1;
  });

  $("#mode-selector").on("click", () => {
    mode = (mode + 1) % 2;
    document.getElementById("mode-selector").value = mode ? "final" : "debug";
    framesStill = 1;
    editObject = -1;
    diselectObject();
  });
}