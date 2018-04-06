#define KEY_BACK GDK_KEY_s
#define KEY_DOWN GDK_KEY_c
#define KEY_FORWARD GDK_KEY_w
#define KEY_LEFT GDK_KEY_a
#define KEY_ORIGIN GDK_KEY_h
#define KEY_RIGHT GDK_KEY_d
#define KEY_UP GDK_KEY_space

typedef struct entitystruct{
  GLuint array;
  GLuint buffer;
  gboolean draw;
  float rotate_x;
  float rotate_y;
  float rotate_z;
  float translate_x;
  float translate_y;
  float translate_z;
} entitystruct;

entitystruct camera = {
  0,
  0,
  FALSE,
  0,
  0,
  0,
  0,
  0,
  0,
};
float camera_matrix[16] = { 0 };
GLuint camera_matrix_location;
int entity_count = 0;
GtkWidget *glarea;
gboolean key_back = FALSE;
gboolean key_down = FALSE;
gboolean key_forward = FALSE;
gboolean key_left = FALSE;
gboolean key_right = FALSE;
gboolean key_up = FALSE;
gboolean mouse_down = FALSE;
float mouse_movement_x = 0;
float mouse_movement_y = 0;
float mouse_x = 0;
float mouse_y = 0;
GLuint program;
GLint shader_vertex_color;
GLint shader_vertex_position;
GLuint *vertex_arrays;
GLuint *vertex_buffers;
GLuint *vertex_colors;

gboolean opengl_camera_free_keypress(GtkWidget *widget, GdkEventKey *event, gpointer data);
gboolean opengl_camera_free_keyrelease(GtkWidget *widget, GdkEventKey *event, gpointer data);
gboolean opengl_camera_free_mousemove(GtkWidget *widget, GdkEventMotion *event, gpointer data);
gboolean opengl_camera_free_mousepress(GtkWidget *widget, GdkEventButton *event, gpointer data);
gboolean opengl_camera_free_mouserelease(GtkWidget *widget, GdkEventButton *event, gpointer data);
void opengl_camera_init_free(void);
void opengl_camera_move(const float speed, const gboolean strafe);
void opengl_camera_origin(void);
void opengl_camera_rotate(const float x, const float y, const float z);
void opengl_camera_rotation_clamp(void);
void opengl_camera_set_rotation(const float x, const float y, const float z);
void opengl_camera_set_translation(const float x, const float y, const float z);
void opengl_camera_translate(const float x, const float y, const float z);
void opengl_entity_create(GLfloat colors[], int id, float rotate_x, float rotate_y, float rotate_z, float translate_x, float translate_y, float translate_z, int vertex_count, int vertices_size, GLfloat vertices[]);
void opengl_entity_draw(const int id);
void opengl_generate_all(void);
void opengl_load_level(const char *filename);
void realize(GtkGLArea *area);
gboolean render(GtkGLArea *area, GdkGLContext *context);