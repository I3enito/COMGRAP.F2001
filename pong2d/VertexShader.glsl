attribute vec2 vertexPosition;
attribute vec3 aColor;
varying vec3 vColor;
attribute vec2 aVertexTextureCoord;
varying vec2 vTextureCoord;
uniform mat3 uProjectionMath;
uniform mat3 uModelMatrix;


void main(){
    vColor = aColor;
    vTextureCoord = aVertexTextureCoord;
    vec3 position = uProjectionMath * uModelMatrix * vec3(vertexPosition, 1);
    gl_Position= vec4(position.xy / position[2], 0, 1);
}