attribute vec3 aVertexPosition;
attribute vec3 aColor;
uniform mat4 uProjectionMat;
uniform mat4 uModelMat;


void main(){
    gl_Position= uProjectionMat * uModelMat * vec4(aVertexPosition, 1);
}