attribute vec3 vertexPosition;


void main(){
    vec3 position = vertexPosition;
    gl_Position= vec4(vertexPosition, 1);
}