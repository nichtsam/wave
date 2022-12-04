uniform float uWaveElevation;
uniform vec3 uCrestColor;
uniform vec3 uTroughColor;
uniform float uColorDifference;
uniform float uColorOffset;

uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying float vElevation;

void main() {
    float strength = clamp((vElevation + uWaveElevation) * uColorDifference + uColorOffset, 0.0, 1.0);
    vec3 waveColor = mix(uTroughColor,uCrestColor, strength);
    
    gl_FragColor = vec4(waveColor,1.0);
    
    #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif
  }
