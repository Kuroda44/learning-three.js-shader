varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vNormal = normalMatrix * normal;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 mvPosition = viewMatrix * worldPosition;
    vViewPosition = mvPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}