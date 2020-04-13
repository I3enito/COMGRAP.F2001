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

let gameConfig = {
    paddleConfig: {
        paddleHeight: 120,
        paddleWidth: 20,
        paddleX: 360,
    },
    ballConfig: {
        ballHeight: 20,
        ballWidth: 20,
    },
    paddleLeft: {
        y: 0,
    },
    paddleRight: {
        y: 0,
    },
    ball: {
        vector: {
            x: 2,
            y: 0,
        }, position: {
            x: 0,
            y: 0,
        }
    },
    keyMap: {
        w: false,
        s: false,
        arrowUp: false,
        arrowDown: false,
    }
}

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
    window.requestAnimationFrame(drawAnimated);
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
    rectangleObject.buffer = gl.createBuffer();
    var vertices =
        // position, color, textureCoordinates
        [-0.5, -0.5, 1, 1, 1, 0, 0,
            0.5, -0.5, 0, 0, 0, 1, 0,
            0.5, 0.5, 0.3, 0.4, 0.5, 1, 1,
            -0.5, 0.5, 0.3, 1, 0.1, 0, 1];
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

    // ball
    mat3.fromTranslation(modelMat, [gameConfig.ball.position.x, gameConfig.ball.position.y]);
    mat3.scale(modelMat, modelMat, [gameConfig.ballConfig.ballWidth, gameConfig.ballConfig.ballHeight]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    //paddle left
    mat3.fromTranslation(modelMat, [-gameConfig.paddleConfig.paddleX, gameConfig.paddleLeft.y]);
    mat3.scale(modelMat, modelMat, [gameConfig.paddleConfig.paddleWidth, gameConfig.paddleConfig.paddleHeight]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    //paddle right
    mat3.fromTranslation(modelMat, [gameConfig.paddleConfig.paddleX, gameConfig.paddleRight.y]);
    mat3.scale(modelMat, modelMat, [gameConfig.paddleConfig.paddleWidth, gameConfig.paddleConfig.paddleHeight]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    //line in the middle
    mat3.fromScaling(modelMat, [5, 600]);
    gl.uniformMatrix3fv(ctx.uModelMatId, false, modelMat);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawAnimated(timeStamp) {
// calculate time since last call
// move or change objects

    //destruct vars
    const {w, s, arrowUp, arrowDown} = gameConfig.keyMap;
    const {paddleLeft, paddleRight} = gameConfig;
    const maxPaddleY = gl.drawingBufferHeight / 2 - gameConfig.paddleConfig.paddleHeight / 2;

    //handle paddles
    if (w && paddleLeft.y < maxPaddleY) {
        gameConfig.paddleLeft.y += 5;
    }
    if (s && paddleLeft.y > -maxPaddleY) {
        gameConfig.paddleLeft.y -= 5;
    }
    if (arrowUp && paddleRight.y < maxPaddleY) {
        gameConfig.paddleRight.y += 5;
    }
    if (arrowDown && paddleRight.y > -maxPaddleY) {
        gameConfig.paddleRight.y -= 5;
    }

    //handle ball
    gameConfig.ball.position.x += gameConfig.ball.vector.x;
    gameConfig.ball.position.y += gameConfig.ball.vector.y;

    //collision detection
    const {x: ballX, y: ballY} = gameConfig.ball.position;
    const ballHalfWidth = gameConfig.ballConfig.ballWidth / 2;
    const ballHalfHeight = gameConfig.ballConfig.ballHeight / 2;

    const {y: paddleRightY} = gameConfig.paddleRight;
    const {y: paddleLeftY} = gameConfig.paddleLeft;
    const paddleX = gameConfig.paddleConfig.paddleX;
    const paddleHalfWidth = gameConfig.paddleConfig.paddleWidth / 2;
    const paddleHalfHeight = gameConfig.paddleConfig.paddleHeight / 2;

    //collision right paddle

    if ((ballX + ballHalfWidth) >= (paddleX - paddleHalfWidth) &&
        (
            (ballY + ballHalfHeight) >= (paddleRightY - paddleHalfHeight) ||
            (ballY - ballHalfHeight) <= (paddleRightY + paddleHalfHeight)
        )) {
        const collisionOffset = ballY - paddleRightY;
        let vector = vec2.fromValues(-gameConfig.ball.vector.x, gameConfig.ball.vector.y);
        const vectorCopy = vector;

        vec2.rotate(vector, vectorCopy, [0, 0], -collisionOffset * (Math.PI / 180));
        vec2.scale(vector, vector, 1.1);
        gameConfig.ball.vector.x = vector[0];
        gameConfig.ball.vector.y = vector[1];
    }

    //collision left paddle
    if ((ballX - ballHalfWidth) <= (-paddleX + paddleHalfWidth) &&
        (
            (ballY + ballHalfHeight) >= (paddleRightY - paddleHalfHeight) ||
            (ballY - ballHalfHeight) <= (paddleRightY + paddleHalfHeight)
        )) {
        const collisionOffset = ballY - paddleLeftY;
        let vector = vec2.fromValues(-gameConfig.ball.vector.x, gameConfig.ball.vector.y);
        const vectorCopy = vector;

        vec2.rotate(vector, vectorCopy, [0, 0], collisionOffset * (Math.PI / 180));
        vec2.scale(vector, vector, 1.1);
        gameConfig.ball.vector.x = vector[0];
        gameConfig.ball.vector.y = vector[1];
    }

    //collision top
    if (((ballY + ballHalfHeight) >= gl.drawingBufferHeight / 2) || (ballY - ballHalfHeight) <= -1 * (gl.drawingBufferHeight / 2)) {
        gameConfig.ball.vector.y *= -1;
    }

    draw();
// request the next frame
    window.requestAnimationFrame(drawAnimated);
}

document.addEventListener('keydown', () => {
        console.log(event.key);
        const key = event.key;
        if (key === "w") {
            gameConfig.keyMap.w = true;
        }
        if (key === "s") {
            gameConfig.keyMap.s = true;
        }
        if (key === "ArrowUp") {
            gameConfig.keyMap.arrowUp = true;
        }
        if (key === "ArrowDown") {
            gameConfig.keyMap.arrowDown = true;
        }

    }
);

document.addEventListener('keyup', () => {
        const key = event.key;
        if (key === "w") {
            gameConfig.keyMap.w = false;
        }
        if (key === "s") {
            gameConfig.keyMap.s = false;
        }
        if (key === "ArrowUp") {
            gameConfig.keyMap.arrowUp = false;
        }
        if (key === "ArrowDown") {
            gameConfig.keyMap.arrowDown = false;
        }
    }
);



