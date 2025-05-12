#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
varying vec2 v_uv;




void main() {
    
    vec3 color = vec3(v_uv.x, v_uv.y, v_uv.x);
    // Couleur du fragment
    gl_FragColor = vec4(color, 1.0);    

}