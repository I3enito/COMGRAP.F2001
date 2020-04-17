precision mediump float;
varying vec4 vVertexColor ;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

const float ambientFactor = 0.2;
const float diffuseFactor = 0.5;
float specularFactor = 0.8;

const float shininess = 15.0;
const vec3 specularMaterialColor = vec3(0.4, 0.4, 0.4);



void main() {

    // calculate light direction as seen from the vertex position
    vec3 lightDirectionEye = uLightPosition - vVertexPositionEye;
    vec3 normal = normalize(vNormalEye);

    float dist = length(lightDirectionEye);
    float lightIntensityFactor = 20.0 / (1.0 + dist + pow(dist, 2.0));

    // ambient lighting
    vec3 ambientColor = ambientFactor * vVertexColor.rgb;

    // diffuse lighting
    vec3 diffuseColor = diffuseFactor * lightIntensityFactor *  vVertexColor.rgb * dot(normal, lightDirectionEye);

    // specular lighting
    vec3 specularColor = vec3(0, 0, 0);
    if (diffuseFactor > 0.0) {
        vec3 reflectionDir = normalize(reflect(-lightDirectionEye, normal));
        vec3 eyeDir = normalize(vec3(0,0,0) - vVertexPositionEye); // Kamera im Ursprung (Kamerakoordinatensystem)
        float cosPhi = dot(eyeDir, reflectionDir);
        specularColor = lightIntensityFactor * uLightColor * specularFactor * pow(cosPhi, shininess);
    }

    vec3 color = ambientColor + diffuseColor + specularColor;
    gl_FragColor = vec4(color, 1.0);
}

