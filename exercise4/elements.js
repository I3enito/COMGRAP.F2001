/**
 *
 * Define a wire frame cube with methods for drawing it.
 *
 * @param gl the webgl context
 * @param color the color of the cube
 * @returns object with draw method
 * @constructor
 */
function WireFrameCube(gl, color) {
    function defineVertices(gl) {
// define the vertices of the cube
        var vertices = [
            0, 0, 0, // v0
            1, 0, 0, // v1
            0, 0, 1, // v2
            1, 0, 1, // v3
            0, 1, 0, // v4
            1, 1, 0, // v5
            0, 1, 1, // v6
            1, 1, 1, // v7
        ];

        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        return buffer;
    }

    function defineEdges(gl) {
// define the edges for the cube , there are 12 edges in a cube
        var vertexIndices = [
            0, 1,
            0, 2,
            1, 3,
            2, 3,
            4, 5,
            4, 6,
            5, 7,
            6, 7,
            1, 5,
            3, 7,
            2, 6,
            0, 4,
        ];
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices),
            gl.STATIC_DRAW);
        return buffer;
    }

    return {
        bufferVertices: defineVertices(gl),
        bufferEdges: defineEdges(gl),
        color: color,
        draw: function (actualGl, aVertexPositionId, aVertexColorId) {
            gl.bindBuffer(actualGl.ARRAY_BUFFER, this.bufferVertices);
            gl.vertexAttribPointer(aVertexPositionId, 3, actualGl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aVertexPositionId);
            gl.bindBuffer(actualGl.ELEMENT_ARRAY_BUFFER, this.bufferEdges);
            gl.drawElements(actualGl.LINES, 24   /* Anzahl Indices */, actualGl.UNSIGNED_SHORT, 0);
        }
    }
}