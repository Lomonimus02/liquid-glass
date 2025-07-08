uniform float uTime;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  float noiseFreq = 2.0;
  float noiseAmp = 0.2;
  vec2 noisePos = pos.xz * noiseFreq + uTime;
  pos.y += sin(noisePos.x + uTime) * noiseAmp;
  pos.y += cos(noisePos.y + uTime) * noiseAmp;

  vec2 diff = uv - uMouse;
  float ripple = exp(-20.0 * dot(diff, diff)) * 0.3;
  pos.y += ripple;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
