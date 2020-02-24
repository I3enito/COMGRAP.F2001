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
    uColorId: -1,
    aColorId: -1,
    aVertexTextureId: -1,
    uSamplerId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1,
};

var rectangleObject = {buffer: -1};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj: {}
};

/**
 * Initialize a texture from an image
 * @param image the loaded image
 * @param textureObject WebGL Texture Object
 */
function initTexture(image, textureObject) {
// create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);
// set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
// turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/**
 * Load an image as a texture
 */
function loadTexture() {
    var image = new Image();
// create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function () {
        initTexture(image, lennaTxt.textureObj);
// make sure there is a redraw after the loading of the texture
        draw();
    };
// setting the src will trigger onload
    image.src = "lena512.png ";
}

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
    gl.clearColor(0, 0, 1, 1);

    // add more necessary commands here
}

/**
 * Setup the buffers to use. If more objects are needed this should be split into one file per object.
 */
function setupBuffers() {
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices =
        //      position        color               textureCoordinates
        [-50, -50, 1, 1, 1, 0, 0,
            50, -50, 0, 0, 0, 1, 0,
            50, 50, 0.3, 0.4, 0.5, 1, 1,
            -50, 50, 0.3, 1, 0.1, 0, 1];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

}


function setupAttributes() {
    // finds the index of the variable in the program
    ctx.vertexPositionId = gl.getAttribLocation(
        ctx.shaderProgram,
        "vertexPosition"
    );
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.aColorId = gl.getAttribLocation(ctx.shaderProgram, "aColor");
    ctx.aVertexTextureId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMath");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMatrix");

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
    gl.vertexAttribPointer(ctx.vertexPositionId, 2, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(ctx.vertexPositionId);

    gl.vertexAttribPointer(ctx.aColorId, 3, gl.FLOAT, false, 28, 8);
    gl.enableVertexAttribArray(ctx.aColorId);

    gl.vertexAttribPointer(ctx.aVertexTextureId, 2, gl.FLOAT, false, 28, 20);
    gl.enableVertexAttribArray(ctx.aVertexTextureId);

    gl.uniform4f(ctx.uColorId, 1.0, 1.0, 0.0, 1.0);


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSamplerId, 0);

    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0 / gl.drawingBufferWidth, 2.0 / gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

    var modelMat = mat3.create();
    mat3.fromRotation(modelMat, Math.PI);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
