/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function SolidCube(gl) {
    function defineVertices(gl) {

        // define the vertices of the cube
        var vertices = [
            // back
            -1, -1, -1,       // v0
            1, -1, -1,       // v1
            1,  1, -1,       // v2
            -1,  1, -1,       // v3
            // front
            -1, -1, 1,        // v4
            1, -1, 1,        // v5
            1,  1, 1,        // v6
            -1,  1, 1,        // v7
            // right
            1, -1, -1,       // v8 = v1
            1,  1, -1,       // v9 = v2
            1,  1,  1,       // v10 = v6
            1, -1,  1,       // v11 = v5
            // left
            -1, -1, -1,       // v12 = v0
            -1,  1, -1,       // v13 = v3
            -1,  1,  1,       // v14 = v7
            -1, -1,  1,       // v15 = v4
            // top
            -1, 1, -1,        // v16 = v3
            -1, 1,  1,        // v17 = v7
            1, 1,  1,        // v18 = v6
            1, 1, -1,        // v19 = v2
            //bottom
            -1, -1, -1,       // v20 = v0
            -1, -1, 1,        // v21 = v4
            1, -1, 1,        // v22 = v5
            1, -1, -1        // v23 = v1
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER , buffer );
        gl.bufferData(gl.ARRAY_BUFFER , new Float32Array (vertices), gl.STATIC_DRAW );
        return buffer;
    }

    function defineSides(gl) {
        // define the edges for the cube, there are 12 edges in a cube
        var vertexIndices = [
            0,2,1, // face 0 (back)
            2,0,3,
            4,5,6, // face 1 (front)
            4,6,7,
            8,9,10, // face 2 (right)
            10,11,8,
            12,15,14, // face 3 (left)
            14,13,12,
            16,17,18, // face 4 (top)
            18,19,16,
            20,23,22, // face 5 (bottom)
            22,21,20
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
        return buffer;
    }


    function defineColors(gl) {

        var back = [249/255, 178/255, 148/255, 1];
        var front = [242/255, 114/255, 127/255,1];
        var right = [183/255, 104/255, 128/255,1];
        var left = [109/255, 92/255, 126/255,1];
        var top = [50/255, 93/255, 127/255,1];
        var bottom = [141/255, 224/255, 194/255,1];

        var allSides = back.concat(back,back,back, front,front,front,front, right,right,right,right, left,left,left,left, top,top,top,top, bottom,bottom,bottom,bottom)

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSides), gl.STATIC_DRAW);
        return buffer;
    }

    function defineNormals(gl) {
        var backNormal = [0.0, 0.0, -1.0];
        var frontNormal = [0.0, 0.0, 1.0];
        var rightNormal = [1.0, 0.0, 0.0];
        var leftNormal = [-1.0, 0.0, 0.0];
        var topNormal = [0.0, 1.0, 0.0];
        var bottomNormal = [0.0, -1.0, 0.0];

        // make 4 entries, one for each vertex
        var backSideNormal    = backNormal.concat(backNormal, backNormal, backNormal);
        var frontSideNormal   = frontNormal.concat(frontNormal, frontNormal, frontNormal);
        var rightSideNormal   = rightNormal.concat(rightNormal, rightNormal, rightNormal);
        var leftSideNormal    = leftNormal.concat(leftNormal, leftNormal, leftNormal);
        var topSideNormal     = topNormal.concat(topNormal, topNormal, topNormal);
        var bottomSideNormal  = bottomNormal.concat(bottomNormal, bottomNormal, bottomNormal);

        var allSidesNormal = backSideNormal.concat(frontSideNormal, rightSideNormal, leftSideNormal, topSideNormal, bottomSideNormal);

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(allSidesNormal), gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferSides: defineSides(gl),
        bufferColors: defineColors(gl),
        bufferNormals: defineNormals(gl),


        draw: function (gl , aVertexPositionId , aVertexColorId, aVertexNormalId) {
            "use strict";
            console.log("Drawing");
            gl.clear(gl.COLOR_BUFFER_BIT);

            //Backface Culling
            gl. frontFace (gl.CCW );
            gl. cullFace (gl. BACK );
            gl. enable (gl. CULL_FACE );



            // Vertices Buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);

            // Edges Buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufferSides);

            // Color Buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColors);
            gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexColorId);

            // Normalenvektoren
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferNormals);
            gl.vertexAttribPointer(aVertexNormalId, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexNormalId);


            // Drawing
            gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        }
    }
}