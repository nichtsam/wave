uniform float uWaveElevation;
uniform vec3 uCrestColor;
uniform vec3 uTroughColor;
uniform float uColorDifference;
uniform float uColorOffset;

varying float vElevation;

void main() {
    float strength = clamp((vElevation + uWaveElevation) * uColorDifference + uColorOffset, 0.0, 1.0);
    vec3 waveColor = mix(uTroughColor,uCrestColor, strength);
    gl_FragColor = vec4(waveColor,1.0);
  }
