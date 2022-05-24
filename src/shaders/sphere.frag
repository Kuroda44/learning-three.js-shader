uniform float time;

varying vec3 vWorldPosition;

void main() {
    vec3 color1 = vec3(1, 0.3, 0.4);
    vec3 color2 = vec3(1, 0.7, 0.3);
    float h = normalize(vWorldPosition).y;

    vec3 mixedColor = mix(color1, color2, smoothstep(-1.0, 1.0, sin((h + time))));

    gl_FragColor = vec4(mixedColor, 1.0);
}