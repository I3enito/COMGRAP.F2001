attribute vec2 vertexPosition;
attribute vec3 aColor;
varying vec3 vColor;

void main(){
    vColor = aColor;
    gl_Position=vec4(vertexPosition, 0, 1);
}