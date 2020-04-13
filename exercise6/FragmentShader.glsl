precision mediump float;
uniform vec4 uColor;
varying vec3 vColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main(){
    //    gl_FragColor=vec4(vColor, 1);
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}