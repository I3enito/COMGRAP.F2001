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
    aVertexPositionId: -1,

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
    loadTexture();
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
    gl. bindBuffer (gl. ARRAY_BUFFER , cubeObject3d.vertexBuffer );
    gl. vertexAttribPointer ( ctx.aVertexPositionId , 3, gl.FLOAT , false , 0, 0);
    gl. enableVertexAttribArray ( ctx.aVertexPositionId );
    gl. bindBuffer (gl. ELEMENT_ARRAY_BUFFER , edgeBuffer );
    gl. drawElements (gl.LINES , 6 /* Anzahl Indices */ ,gl. UNSIGNED_SHORT , 0);
}



