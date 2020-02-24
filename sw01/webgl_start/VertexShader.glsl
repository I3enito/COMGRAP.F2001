attribute vec2 vertexPosition;
attribute vec3 aColor;
varying vec3 vColor;
attribute vec2 aVertexTextureCoord;
varying vec2 vTextureCoord;


void main(){
    vColor = aColor;
    vTextureCoord = aVertexTextureCoord;
    gl_Position=vec4(vertexPosition, 0, 1);
}