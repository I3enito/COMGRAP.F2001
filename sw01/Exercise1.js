//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object with the name ctx (for context)
var ctx = {
  shaderProgram: -1,
  vertexPositionId: -1,
};

var rectangleObject = { buffer: -1 };

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
  "use strict";
  var canvas = document.getElementById("myCanvas");
  gl = createGLContext(canvas);
  initGL();
  draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
  "use strict";
  ctx.shaderProgram = loadAndCompileShaders(
    gl,
    "VertexShader.glsl",
    "FragmentShader.glsl"
  );
  setupAttributes();
  setupBuffers();

  // set the clear color here
  gl.clearColor(0, 0, 1, 1);

  // add more necessary commands here
}

/**
 * Setup the buffers to use. If more objects are needed this should be split into one file per object.
 */
function setupBuffers() {
  "use strict";
  rectangleObject.buffer = gl.createBuffer();
  var vertices = [0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5];
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}


function setupAttributes() {
  // finds the index of the variable in the program
  ctx.vertexPositionId = gl.getAttribLocation(
    ctx.shaderProgram,
    "vertexPosition"
  );
}

/**
 * Draw the scene.
 */
function draw() {
  "use strict";
  console.log("Drawing");
  gl.clear(gl.COLOR_BUFFER_BIT);
  // add drawing routines here
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
  gl.vertexAttribPointer(ctx.vertexPositionId, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(ctx.vertexPositionId);
  gl.drawArrays(gl.LINE_LOOP, 0, 4);
}
