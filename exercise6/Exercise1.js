//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

window.onmousemove = handleMouseMove;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object with the name ctx (for context)
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aVertexColorId: -1,
    aVertexNormalId: -1,
    uModelMatId: -1,
    uViewMatId: -1,
    uProjectionMatId: -1,
    uNormalMatId: -1,
    uLightPositionId: -1,
    uLightColorId: -1,
};

var solidCube;

var modelMat;
var viewMat;
var projectionMat;
var normalMat;

var rad = 0;
var rotAxis = [0,1,0];
var speed = 0;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();

    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();

    // set the clear color here
    gl.clearColor(1.0,1.0,1.0,1);


    solidCube = new SolidCube(gl);

    setUpViewMat();
    setUpProjectionMat();
}

function setUpModelMat() {
    modelMat = mat4.create();
    mat4.fromScaling(modelMat, [1,1,1]);
    mat4.rotate(modelMat, modelMat, rad, rotAxis);
}

function setUpViewMat() {
    viewMat = mat4.create();
    mat4.lookAt(viewMat, [1,3,4], [0,0,0], [0,1,0]);
    //mat4.lookAt(viewMat, [0, 0, -4], [0, 0, 0], [0, 1, 0]);
}

function setUpNormalMat() {

    // calculate Model View Matrix
    var modelViewMat = mat4.create();
    mat4.multiply(modelViewMat, viewMat, modelMat);

    normalMat = mat3.create();
    mat3.normalFromMat4(normalMat, modelViewMat);
}

function setUpProjectionMat() {
    projectionMat = mat4.create();
    //mat4.ortho(projectionMat, -4, 4, -3,3,0.1, 10);

    // mat4.perspective(
    //     projectionMat,
    //     glMatrix.toRadian(45), // fovy
    //     gl.drawingBufferWidth / gl.drawingBufferHeight,
    //     0.1,
    //     1000);

    mat4.frustum(projectionMat, -2, 2, -1.5,1.5,2, 10);

}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
    ctx.uViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uViewMat");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uNormalMatId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMat");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor")

}

function submitUniforms() {
    gl.uniformMatrix4fv(ctx.uModelMatId, false, modelMat);
    gl.uniformMatrix4fv(ctx.uViewMatId, false, viewMat);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMat);
    gl.uniformMatrix3fv(ctx.uNormalMatId, false, normalMat);

    gl.uniform3fv(ctx.uLightPositionId, [0,0,2]);
    gl.uniform3fv(ctx.uLightColorId, [0.8, 1, 1]);
}


function handleMouseMove(event) {

    var direction = vec3.create();
    direction = vec3.subtract(direction, [event.pageY, event.pageX, 0], [395, 380, 0]);
    rotAxis = direction;
    speed = 0.0005 * vec3.length(direction);
}


/**
 * Draw the scene.
 */

function drawAnimated(timestamp) {
    console.log("Drawing");
    setUpModelMat();
    setUpNormalMat();
    submitUniforms();
    solidCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId, ctx.aVertexNormalId);
    rad = 0.001 * timestamp * speed;
    window.requestAnimationFrame(drawAnimated);
}
