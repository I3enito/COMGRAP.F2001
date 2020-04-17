
attribute vec3 aVertexPosition;

uniform mat4 uModelMat;
uniform mat4 uViewMat;
uniform mat4 uProjectionMat;

attribute vec3 aVertexNormal;

uniform mat3 uNormalMat;
varying vec3 vNormalEye;

attribute vec4 aVertexColor;
varying vec4 vVertexColor ;

varying vec3 vVertexPositionEye;


void main() {
    gl_Position = uProjectionMat * uViewMat * uModelMat * vec4(aVertexPosition, 1);


    vec4 vertexPositionEye4 = uViewMat * uModelMat * vec4 (aVertexPosition , 1);
    vVertexPositionEye = vertexPositionEye4 .xyz / vertexPositionEye4 .w;


    // calculate the normal vector in eye coordinates
    vNormalEye = normalize(uNormalMat * aVertexNormal);


    // Einfache Varying Übergaben
    vVertexColor = aVertexColor;
}