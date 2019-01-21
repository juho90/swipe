export default '\
attribute vec2 position;\
uniform mat4 proj;\
uniform mat4 world;\
void main(void) {\
    gl_Position = proj * world * vec4(position, 0.0, 1.0);\
}';