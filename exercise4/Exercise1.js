//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

var globalAngle = 2;
// we keep all local parameters for the program in a single object with the name ctx (for context)
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    aColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1

};

var cubeObject3d = {
    vertexBuffer: -1, edgeBuffer: -1,
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    this.wireFrameCube = new WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);

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
    gl.clearColor(0, 0, 0, 0.7);

    // add more necessary commands here
}

/**
 * Setup the buffers to use. If more objects are needed this should be split into one file per object.
 */
function setupBuffers() {
    "use strict";

    var vertices = [
        0, 0, 0, // v0
        1, 0, 0, // v1
        1, 1, 0, // v2
    ];
    cubeObject3d.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeObject3d.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var vertexIndices = [
        0, 1,
        1, 2,
        0, 2];
    cubeObject3d.edgeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeObject3d.edgeBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);


}


function setupAttributes() {
    // finds the index of the variable in the program
    ctx.aVertexPositionId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aVertexPosition"
    );
    ctx.aColorId = gl.getAttribLocation(
        ctx.shaderProgram,
        "aColor"
    );
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    /*gl.clear(gl.COLOR_BUFFER_BIT);*/

    // Set up the camera position | view * model = modelView
    var modelViewMat = mat4.create();
    mat4.lookAt(modelViewMat, [0, -3, 0], [0, 0, 0], [0, 0, 1]);
    mat4.rotate(modelViewMat,  // destination matrix
        modelViewMat,  // matrix to rotate
        globalAngle,     // amount to rotate in radians
        [0.2, 0.6, 1]);
    gl.uniformMatrix4fv(ctx.uModelMatId, false, modelViewMat);


    // Set up the projection of the object
    var projectionMat = mat4.create();
    //mat4.ortho(projectionMat, -1, 1, -1, 1, 0.1, 100);
    mat4.perspective(projectionMat, 45 * Math.PI / 180, 800 / 600, 0.1, 100);
    gl.uniformMatrix4fv(ctx.uProjectionMatId, false, projectionMat);

    /*    gl.bindBuffer(gl.ARRAY_BUFFER, cubeObject3d.vertexBuffer);
        gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(ctx.aVertexPositionId);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeObject3d.edgeBuffer);
        gl.drawElements(gl.LINES, 6 /!* Anzahl Indices *!/, gl.UNSIGNED_SHORT, 0);*/
    /*    const vertexBuffer = wiredCube.bufferVertices();
        const edgeBuffer = wiredCube.bufferEdges();*/

    wireFrameCube.draw(gl, ctx.aVertexPositionId, ctx.aColorId)
}



