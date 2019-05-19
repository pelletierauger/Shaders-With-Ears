function setShaders() {
    /*======================= Shaders =======================*/
    // vertex shader source code
    var vertCode = `
        // beginGLSL
        // our vertex data
        attribute vec3 aPosition;
        // our texcoordinates
        attribute vec2 aTexCoord;
        // this is a variable that will be shared with the fragment shader
        // we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
        // it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
        varying vec2 vTexCoord;
        void main() {
        // copy the texture coordinates
        vTexCoord = aTexCoord;
        // copy the position data into a vec4, using 1.0 as the w component
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        // send the vertex information on to the fragment shader
        gl_Position = positionVec4;
        }
        // endGLSL
    `;
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // fragment shader source code
    var fragCode = `
// beginGLSL
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
//      uv *= 1.2;
    vec2 uvf = uv * 10.;
//     uv.x += 0.25;
    uv.y += 0.4;
    uv *= 0.5;
    float d = length(uv);
    float t = time * 0.125 * 0.06125 * 0.5;
    t *= 2.;
//     t = time * 0.125;
    float c = d;
//     if (d < 0.3) c = 1.; else c = 0.;
    float r = 0.3;
//     c = smoothstep(r, r - 0.1, d);
//     c = c - smoothstep(r * 0.5, r * 0.5 - 0.1, d);
    vec2 p = vec2(1.0, -1.4);
    c = Circle(uv, p, 0.3, 0.1);
    vec2 p2 = vec2(0.1 * sin(t * 100.), 0.1 * cos(t * 100.)) * 0.4;
    vec2 p3 = vec2(0.1 * sin(t * 50.), 0.1 * cos(t * 50.)) * 0.4;
    float siz = sin(t * 100.);
    float siz2 = sin(t * 50.);
    p2 = vec2(0.0, 0.0);
    vec3 col = CircleRGB(uv, p2, 1.9 * amplitude, 0.2, vec3(1., 1.4, 1.0));
    col.r *= sin(length(uv - p) * (6. + sin(1. * 20.) * 0.0001));
    col.r += abs(sin(length(uv - p) * (0.1 + sin(1. * 2.) * 0.001)) * 5.);
//     col.g *= sin(length(uv - p) * (6. + sin(1. * 20.) * 0.01));
    vec2 newV = (uv + tan(uv.y * 3.)) - (p + sin(uv.x * 3.));
    newV += cos(sin(uv * 20. * amplitude * 10.));
//     col *= sin(atan(newV.x, newV.y));
      col *= sin(sin(atan(newV.x, newV.y) * (sin(t * 100.) * 1.)) * 10. + sin(t * 10.) * 100.);
      col *= sin(cos(atan(newV.x, newV.y) * (sin(t * 100.) * 1.)) * 10. + cos(t * 10.) * 100.);
      col *= sin(sin(atan(newV.x, newV.y) * (sin(t * 100.) * 1.)) * 10. + cos(t * 10.) * 100.);
//col -=  CircleRGB(uv, p2, 0.2, 0.2, vec3(1.0, 1.0, 1.0));
//     col = max(col, 0.);
//col += CircleRGB(uv, p2, 0.5, 0.1, vec3(0.2, 0.0, 0.8));
    col += CircleRGB(uv, p2, 0.4, 0.2, vec3(0.0, 0.4, 1.0));
            col += CircleRGB(uv, p2, 0.5, 0.2, vec3(0.5, 0.7, 0.0) * 0.75);
//             col += CircleRGB(uv, p2, 0.5, 0.2, vec3(0.5, 0.7, 0.0));
//     col -= InvCircleRGB(uv, p2, 0.6, 0.2, vec3(1.5, 1.7, 1.0));
    float rando = rand(uvf) * 0.1;
//     col.r -= rando * 1.;
     col.g *= 0.5;
    gl_FragColor = vec4(col - rando, 1.0);
}
// endGLSL
    `;
    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to
    // store the combined shader program
    shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);
    timeUniform = gl.getUniformLocation(shaderProgram, "time");
    amplitudeUniform = gl.getUniformLocation(shaderProgram, "amplitude");
}
setShaders();




function setBothShaders(fragCode) {
    // vertex shader source code
    var vertCode = `
        // our vertex data
        attribute vec3 aPosition;
        // our texcoordinates
        attribute vec2 aTexCoord;
        // this is a variable that will be shared with the fragment shader
        // we will assign the attribute texcoords to the varying texcoords to move them from the vert shader to the frag shader
        // it can be called whatever you want but often people prefiv it with 'v' to indicate that it is a varying
        varying vec2 vTexCoord;
        void main() {
        // copy the texture coordinates
        vTexCoord = aTexCoord;
        // copy the position data into a vec4, using 1.0 as the w component
        vec4 positionVec4 = vec4(aPosition, 1.0);
        positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
        // send the vertex information on to the fragment shader
        gl_Position = positionVec4;
        }
    `;
    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to
    // store the combined shader program
    shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);
    timeUniform = gl.getUniformLocation(shaderProgram, "time");
    amplitudeUniform = gl.getUniformLocation(shaderProgram, "amplitude");
}