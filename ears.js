// beginGLSL

// --------------- //
// fonds-marins----//
// --------------- //
setBothShaders(`
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform float amplitude;
float plot(vec2 s, float p) {
  float largeur = abs(sin(time * 0.01)) * 0.1 + 0.1;
  return smoothstep(p - largeur, p, s.y) - smoothstep(p, p + largeur, s.y);
}
float circ(float size, float vx, float vy, vec2 center) {
//   float x = center.x * (1.0 + sin(time * 20.) * 0.5);
//   float y = center.y * (1.0 + cos(time * 20.) * 0.5);
  vec2 v = center - vec2(vx, vy);
  float d = 1.0 / length(v * size);
  return d;
}
float Circle(vec2 uv, vec2 p, float r, float blur) {
    float d = length(uv - p); 
    float c = smoothstep(r, r - blur, d); 
    return c;
}
vec3 CircleRGB(vec2 uv, vec2 p, float r, float blur, vec3 col) {
    float d = length(uv - p); 
    float c = smoothstep(r, r - blur, d); 
    return col * c;
}
vec3 InvCircleRGB(vec2 uv, vec2 p, float r, float blur, vec3 col) {
    float d = length(p - uv); 
    float c = smoothstep(r - blur, r, d); 
    return col * c;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1280, 800);
    uv -= vec2(0.5, 0.5);
    uv.x *= 1280.0/800.0;
//  uv *= 1.2;
//     uv *= 2.;
    vec2 uvf = uv * 10.;
    float d = length(uv);
    float a = amplitude;
    float t = time;
    vec2 p = vec2(0.0, 0.0);
    float ttt = sin(time * 10.) * 5.;
    vec2 p2 = vec2((fract(uv.x) - 0.5), 0);
//     p2 *= sin(uv.y * 10000.) * 0.01;
    float red = cos(cos(a) + uv.x * 1. * a * 100.);
    float green = sin(uv.x * 1. * a * 20. + sin(t * 10.) * 10.);
    float blue = sin(uv.x * 10. * a * 100. + sin(t * 10.) * 15.);
    vec3 col = CircleRGB(uv, p2, 0.2 * a * 100., 0.9, vec3(red, green, blue));
    float rando = rand(uvf) * 0.1;
    gl_FragColor = vec4(col - rando, 1.0);
}
`);



// --------------- //
// fonds-marins----//
// --------------- //
setBothShaders(`
precision mediump float;
varying vec2 vTexCoord;
uniform float time;
uniform float amplitude;
float plot(vec2 s, float p) {
  float largeur = abs(sin(time * 0.01)) * 0.1 + 0.1;
  return smoothstep(p - largeur, p, s.y) - smoothstep(p, p + largeur, s.y);
}
float circ(float size, float vx, float vy, vec2 center) {
//   float x = center.x * (1.0 + sin(time * 20.) * 0.5);
//   float y = center.y * (1.0 + cos(time * 20.) * 0.5);
  vec2 v = center - vec2(vx, vy);
  float d = 1.0 / length(v * size);
  return d;
}
float Circle(vec2 uv, vec2 p, float r, float blur) {
    float d = length(uv - p); 
    float c = smoothstep(r, r - blur, d); 
    return c;
}
vec3 CircleRGB(vec2 uv, vec2 p, float r, float blur, vec3 col) {
    float d = length(uv - p); 
    float c = smoothstep(r, r - blur, d); 
    return col * c;
}
vec3 InvCircleRGB(vec2 uv, vec2 p, float r, float blur, vec3 col) {
    float d = length(p - uv); 
    float c = smoothstep(r - blur, r, d); 
    return col * c;
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453 * (2.0 + sin(time)));
}
void main() {
    vec2 uv = gl_FragCoord.xy / vec2(1280, 800);
    uv -= vec2(0.5, 0.5);
    uv.x *= 1280.0/800.0;
//  uv *= 1.2;
//     uv *= 2.;
    vec2 uvf = uv * 10.;
    float d = length(uv);
    float a = amplitude;
    float t = time;
    vec2 p = vec2(0.0, 0.0);
    float ttt = sin(time * 10.) * 5.;
    vec2 p2 = vec2(0, 0);
//     p2 *= sin(uv.y * 10000.) * 0.01;
    float red = cos(cos(a) + uv.x + uv.y * 5. * a * 100.);
    float green = sin(uv.x + uv.y * 1. * a * 20. + sin(t * 10.) * 10.);
    float blue = sin(uv.x + uv.y * 10. * a * 100. + sin(t * 20.) * a * 150.);
    vec3 col = CircleRGB(uv, p2, 0.2 * a * 400., 0.9, vec3(red, green, blue));
    float rando = rand(uvf) * 0.1;
    gl_FragColor = vec4(col - rando, 1.0);
}
`);