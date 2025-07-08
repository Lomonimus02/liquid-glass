varying vec2 vUv;
void main() {
  vec3 color = vec3(0.1, 0.4 + 0.2 * vUv.y, 0.6);
  gl_FragColor = vec4(color, 1.0);
}
