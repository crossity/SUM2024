#version 300 es
precision highp float;

in vec3 DrawNormal;
in vec3 DrawPos;
out vec4 OutColor;

uniform float Time;

void main( void )
{
    vec3 color = vec3(1.0, 0.1, 8.0);
    vec3 N = normalize(DrawNormal);
    N = faceforward(N, normalize(DrawPos), N);

    float d = max(0.1, dot(normalize(vec3(-1, 1, 1)), normalize(N)));

    OutColor = vec4(color * d, 1.0);
}