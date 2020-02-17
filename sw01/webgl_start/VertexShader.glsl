attribute vec2 vertexPosition;
varying vec3 vColor;

void main(){
    gl_Position=vec4(vertexPosition, 0, 1);
}