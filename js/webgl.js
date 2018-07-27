'use strict';

// Required args: entity, to
// Optional args: offset-x, offset-y, offset-z
function webgl_attach(args){
    args = core_args({
      'args': args,
      'defaults': {
        'offset-x': 0,
        'offset-y': 0,
        'offset-z': 0,
      },
    });

    core_entities[args['entity']]['attach-to'] = args['to'];
    core_entities[args['entity']]['attach-offset-x'] = args['offset-x'];
    core_entities[args['entity']]['attach-offset-y'] = args['offset-y'];
    core_entities[args['entity']]['attach-offset-z'] = args['offset-z'];
}

// Required args: entity
// Optional args: axes
function webgl_billboard(args){
    args = core_args({
      'args': args,
      'defaults': {
        'axes': [
          'y',
        ],
      },
    });

    for(let axis in args['axes']){
        core_entities[args['entity']]['rotate-' + args['axes'][axis]] = 360 - webgl_characters['_me']['camera-rotate-' + args['axes'][axis]];
    }

    webgl_entity_radians({
      'entity': args['entity'],
    });
}

// Required args: colorData, normalData, textureData, vertexData
function webgl_buffer_set(args){
    return {
      'color': webgl_buffer_set_type({
        'data': args['colorData'],
      }),
      'normal': webgl_buffer_set_type({
        'data': args['normalData'],
      }),
      'texture': webgl_buffer_set_type({
        'data': args['textureData'],
      }),
      'vertex': webgl_buffer_set_type({
        'data': args['vertexData'],
      }),
    };
}

// Required args: data
// Optional args: type
function webgl_buffer_set_type(args){
    args = core_args({
      'args': args,
      'defaults': {
        'type': 'Float32Array',
      },
    });

    let buffer = webgl_buffer.createBuffer();
    webgl_buffer.bindBuffer(
      webgl_buffer.ARRAY_BUFFER,
      buffer
    );
    webgl_buffer.bufferData(
      webgl_buffer.ARRAY_BUFFER,
      new window[args['type']](args['data']),
      webgl_buffer.STATIC_DRAW
    );

    return buffer;
}

function webgl_camera_handle(){
    if(core_mouse['pointerlock-state']
      || core_mouse['down']){
        webgl_camera_rotate({
          'character': webgl_characters['_me']['camera-zoom-max'] === 0 || core_mouse['button'] === 2,
          'x': core_mouse['movement-y'] / 10,
          'y': core_mouse['movement-x'] / 10,
        });
    }
}

// Optional args: camera, character, x, xlock, y, z
function webgl_camera_rotate(args){
    args = core_args({
      'args': args,
      'defaults': {
        'camera': true,
        'character': true,
        'x': 0,
        'xlock': true,
        'y': 0,
        'z': 0,
      },
    });

    let axes = {
      'x': args['x'],
      'y': args['y'],
      'z': args['z'],
    };
    let prefix = args['camera']
      ? 'camera-rotate-'
      : 'rotate-';
    for(let axis in axes){
        webgl_characters['_me'][prefix + axis] = core_clamp({
          'max': 360,
          'min': 0,
          'value': core_round({
            'number': webgl_characters['_me'][prefix + axis] + axes[axis],
          }),
          'wrap': true,
        });
    }

    if(args['xlock']){
        let max = webgl_characters['_me'][prefix + 'x'] > 180
          ? 360
          : 89;
        webgl_characters['_me'][prefix + 'x'] = core_clamp({
          'max': max,
          'min': max - 89,
          'value': webgl_characters['_me'][prefix + 'x'],
        });
    }

    for(let axis in axes){
        webgl_characters['_me'][prefix + 'radians-' + axis] = core_degrees_to_radians({
          'degrees': webgl_characters['_me'][prefix + axis],
        });
    }

    if(args['camera']
      && args['character']){
        if(core_mouse['down']){
            webgl_characters['_me']['rotate-y'] = webgl_characters['_me']['camera-rotate-y'];
            webgl_characters['_me']['rotate-radians-y'] = webgl_characters['_me']['camera-rotate-radians-y'];

        }else{
            webgl_characters['_me']['rotate-y'] += args['y'];
            webgl_characters['_me']['rotate-radians-y'] = core_degrees_to_radians({
              'degrees': webgl_characters['_me']['rotate-y'],
            });
        }
    }
}

function webgl_camera_zoom(event){
    if(event.deltaY > 0){
        webgl_characters['_me']['camera-zoom-current'] = Math.min(
          webgl_characters['_me']['camera-zoom-current'] + 1,
          webgl_characters['_me']['camera-zoom-max']
        );

    }else{
        webgl_characters['_me']['camera-zoom-current'] = Math.max(
          webgl_characters['_me']['camera-zoom-current'] - 1,
          0
        );
    }
}

// Optional args: character
function webgl_character_level(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': '_me',
      },
    });

    if(webgl_characters[args['character']]
      && 'level' in webgl_characters[args['character']]){
        return webgl_characters[args['character']]['level'];

    }else{
        return -2;
    }
}

// Optional args: character
function webgl_character_origin(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': '_me',
      },
    });

    webgl_entity_move_to();
    webgl_characters[args['character']]['camera-rotate-radians-x'] = 0;
    webgl_characters[args['character']]['camera-rotate-radians-y'] = 0;
    webgl_characters[args['character']]['camera-rotate-radians-z'] = 0;
    webgl_characters[args['character']]['camera-rotate-x'] = 0;
    webgl_characters[args['character']]['camera-rotate-y'] = 0;
    webgl_characters[args['character']]['camera-rotate-z'] = 0;
    webgl_characters[args['character']]['dx'] = 0;
    webgl_characters[args['character']]['dy'] = 0;
    webgl_characters[args['character']]['dz'] = 0;
    webgl_characters[args['character']]['rotate-radians-x'] = 0;
    webgl_characters[args['character']]['rotate-radians-y'] = 0;
    webgl_characters[args['character']]['rotate-radians-z'] = 0;
    webgl_characters[args['character']]['rotate-x'] = 0;
    webgl_characters[args['character']]['rotate-y'] = 0;
    webgl_characters[args['character']]['rotate-z'] = 0;
}

// Optional args: character
function webgl_character_spawn(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': '_me',
      },
    });

    webgl_character_origin({
      'character': args['character'],
    });
    webgl_entity_move_to({
      'x': webgl_properties['spawn-translate-x'],
      'y': webgl_properties['spawn-translate-y'],
      'z': webgl_properties['spawn-translate-z'],
    });
    webgl_camera_rotate({
      'x': webgl_properties['spawn-rotate-x'],
      'y': webgl_properties['spawn-rotate-y'],
      'z': webgl_properties['spawn-rotate-z'],
    });
}

// Required args: alpha, blue, green, red
function webgl_clearcolor_set(args){
    webgl_properties['clearcolor-alpha'] = args['alpha'];
    webgl_properties['clearcolor-blue'] = args['blue'];
    webgl_properties['clearcolor-green'] = args['green'];
    webgl_properties['clearcolor-red'] = args['red'];
    webgl_buffer.clearColor(
      webgl_properties['clearcolor-red'],
      webgl_properties['clearcolor-green'],
      webgl_properties['clearcolor-blue'],
      webgl_properties['clearcolor-alpha']
    );
}

// Required args: target
// Optional args: character, entity
function webgl_collision(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': true,
        'entity': false,
      },
    });

    let collide_range = 0;
    let collision = false;
    let collision_sign = 1;
    let entity_dx = 0;
    let entity_dy = 0;
    let entity_dz = 0;
    let entity_x = 0;
    let entity_y = 0;
    let entity_z = 0;
    let target = core_entities[args['target']];

    if(args['character']){
        collide_range = webgl_characters['_me']['collide-range'];
        entity_dx = webgl_characters['_me']['dx'];
        entity_dy = webgl_characters['_me']['dy'];
        entity_dz = webgl_characters['_me']['dz'];
        entity_x = webgl_characters['_me']['translate-x'];
        entity_y = webgl_characters['_me']['translate-y'];
        entity_z = webgl_characters['_me']['translate-z'];

    }else{
        collide_range = core_entities[args['entity']]['collide-range'];
        entity_dx = core_entities[args['entity']]['dx'];
        entity_dy = core_entities[args['entity']]['dy'];
        entity_dz = core_entities[args['entity']]['dz'];
        entity_x = core_entities[args['entity']]['translate-x'];
        entity_y = core_entities[args['entity']]['translate-y'];
        entity_z = core_entities[args['entity']]['translate-z'];
    }

    if(target['normals'][0] !== 0){
        if(target['normals'][0] === 1
          && entity_dx < 0){
            if(entity_x >= target['translate-x']
              && entity_x <= target['translate-x'] + collide_range
              && entity_y > target['translate-y'] + target['vertices'][4] - collide_range
              && entity_y < target['translate-y'] + target['vertices'][0] + collide_range
              && entity_z >= target['translate-z'] + target['vertices'][2] - collide_range
              && entity_z <= target['translate-z'] + target['vertices'][10] + collide_range){
                collision = 'x';
                entity_dx = 0;
            }

        }else if(target['normals'][0] === -1
          && entity_dx > 0){
            if(entity_x >= target['translate-x'] - collide_range
              && entity_x <= target['translate-x']
              && entity_y > target['translate-y'] + target['vertices'][4] - collide_range
              && entity_y < target['translate-y'] + target['vertices'][0] + collide_range
              && entity_z >= target['translate-z'] + target['vertices'][2] - collide_range
              && entity_z <= target['translate-z'] + target['vertices'][10] + collide_range){
                collision = 'x';
                collision_sign = -1;
                entity_dx = 0;
            }
        }
    }

    if(target['normals'][1] !== 0){
        if(target['normals'][1] === 1
          && entity_dy < 0){
            if(entity_x >= target['translate-x'] + target['vertices'][4] - collide_range
              && entity_x <= target['translate-x'] + target['vertices'][0] + collide_range
              && entity_y >= target['translate-y']
              && entity_y <= target['translate-y'] + collide_range
              && entity_z >= target['translate-z'] + target['vertices'][2] - collide_range
              && entity_z <= target['translate-z'] + target['vertices'][10] + collide_range){
                collision = 'y';
                entity_dy = 0;
            }

        }else if(target['normals'][1] === -1
          && entity_dy > 0){
            if(entity_x >= target['translate-x'] + target['vertices'][4] - collide_range
              && entity_x <= target['translate-x'] + target['vertices'][0] + collide_range
              && entity_y >= target['translate-y'] - collide_range
              && entity_y <= target['translate-y']
              && entity_z >= target['translate-z'] + target['vertices'][2] - collide_range
              && entity_z <= target['translate-z'] + target['vertices'][10] + collide_range){
                collision = 'y';
                collision_sign = -1;
                entity_dy = 0;
            }
        }
    }

    if(target['normals'][2] !== 0){
        if(target['normals'][2] === 1
          && entity_dz < 0){
            if(entity_x >= target['translate-x'] + target['vertices'][4] - collide_range
              && entity_x <= target['translate-x'] + target['vertices'][0] + collide_range
              && entity_y > target['translate-y'] + target['vertices'][2] - collide_range
              && entity_y < target['translate-y'] + target['vertices'][10] + collide_range
              && entity_z >= target['translate-z']
              && entity_z <= target['translate-z'] + collide_range){
                collision = 'z';
                entity_dz = 0;
            }

        }else if(target['normals'][2] === -1
          && entity_dz > 0){
            if(entity_x >= target['translate-x'] + target['vertices'][4] - collide_range
              && entity_x <= target['translate-x'] + target['vertices'][0] + collide_range
              && entity_y > target['translate-y'] + target['vertices'][2] - collide_range
              && entity_y < target['translate-y'] + target['vertices'][10] + collide_range
              && entity_z >= target['translate-z'] - collide_range
              && entity_z <= target['translate-z']){
                collision = 'z';
                collision_sign = -1;
                entity_dz = 0;
            }
        }
    }

    if(collision !== false){
        if(args['character']){
            webgl_characters['_me']['dx'] = entity_dx;
            webgl_characters['_me']['dy'] = entity_dy;
            webgl_characters['_me']['dz'] = entity_dz;

            webgl_characters['_me']['translate-' + collision] = target['translate-' + collision] + (collide_range * collision_sign);

            if(webgl_characters['_me']['camera-type'] === 'gravity'){
                webgl_characters['_me']['jump-allow'] = webgl_characters['_me']['dy'] === 0;
            }

            if(target['item'] !== false){
                if(!(target['item'] in webgl_characters['_me']['inventory'])){
                    webgl_characters['_me']['inventory'][target['item']] = 0;
                }

                webgl_characters['_me']['inventory'][target['item']]++;

                core_entity_remove({
                  'entities': [
                    args['target'],
                  ],
                });

                return false;
            }

        }else if(core_groups['particles'][args['entity']]){
            core_entity_remove({
              'entities': [
                args['entity'],
              ],
            });

            return false;

        }else{
            core_entities[args['entity']]['dx'] = entity_dx;
            core_entities[args['entity']]['dy'] = entity_dy;
            core_entities[args['entity']]['dz'] = entity_dz;

            core_entities[args['entity']]['translate-' + collision] = target['translate-' + collision] + (collide_range * collision_sign);
        }
    }

    return true;
}

function webgl_draw(){
    webgl_buffer.clear(webgl_buffer.COLOR_BUFFER_BIT | webgl_buffer.DEPTH_BUFFER_BIT);

    webgl_buffer.uniformMatrix4fv(
      webgl_properties['shader']['mat_perspectiveMatrix'],
      false,
      core_matrices['perspective']
    );

    webgl_buffer.disable(webgl_buffer.DEPTH_TEST);
    core_group_modify({
      'groups': [
        'skybox',
      ],
      'todo': function(entity){
          webgl_draw_entity(entity);
      },
    });
    webgl_buffer.enable(webgl_buffer.DEPTH_TEST);
    core_group_modify({
      'groups': [
        'foreground',
        'particles',
      ],
      'todo': function(entity){
          if(core_entities[entity]['alpha'] === 1){
              webgl_draw_entity(entity);
          }
      },
    });
    core_group_modify({
      'groups': [
        'foreground',
        'particles',
      ],
      'todo': function(entity){
          if(core_entities[entity]['alpha'] < 1){
              webgl_draw_entity(entity);
          }
      },
    });

    webgl_canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    for(let text in webgl_text){
        Object.assign(
          webgl_canvas,
          webgl_text[text]['properties']
        );
        webgl_canvas.fillText(
          webgl_text[text]['text'],
          webgl_text[text]['x'],
          webgl_text[text]['y']
        );
    }

    if(webgl_characters['_me']['camera-zoom-current'] === 0){
        webgl_canvas.fillStyle = '#fff';
        webgl_canvas.fillRect(
          webgl_properties['canvas']['width-half'] - 1,
          webgl_properties['canvas']['height-half'] - 1,
          2,
          2
        );
    }
}

function webgl_draw_entity(entity){
    if(!core_entities[entity]['draw']){
        return;
    }

    if(core_entities[entity]['billboard'] !== false){
        webgl_billboard({
          'axes': core_entities[entity]['billboard'],
          'entity': entity,
        });
    }

    core_matrix_clone({
      'id': 'camera',
      'to': 'cache',
    });

    core_matrix_translate({
      'dimensions': [
        -core_entities[entity]['translate-x'],
        -core_entities[entity]['translate-y'],
        -core_entities[entity]['translate-z'],
      ],
      'id': 'camera',
    });
    if(core_entities[entity]['attach-to'] !== false){
        if(core_entities[entity]['attach-to'] === '_character-camera'){
            if(!core_groups['skybox'][entity]){
                core_matrix_rotate({
                  'dimensions': [
                    webgl_characters['_me']['rotate-radians-x'],
                    -webgl_characters['_me']['rotate-radians-y'],
                    webgl_characters['_me']['rotate-radians-z'],
                  ],
                  'id': 'camera',
                });
            }

        }else{
            core_matrix_rotate({
              'dimensions': [
                core_entities[core_entities[entity]['attach-to']]['rotate-radians-x'],
                core_entities[core_entities[entity]['attach-to']]['rotate-radians-y'],
                core_entities[core_entities[entity]['attach-to']]['rotate-radians-z'],
              ],
              'id': 'camera',
            });
        }
    }
    core_matrix_rotate({
      'dimensions': [
        core_entities[entity]['rotate-radians-x'],
        core_entities[entity]['rotate-radians-y'],
        core_entities[entity]['rotate-radians-z'],
      ],
      'id': 'camera',
    });

    webgl_buffer.bindBuffer(
      webgl_buffer.ARRAY_BUFFER,
      core_entities[entity]['buffer']['normal']
    );
    webgl_buffer.vertexAttribPointer(
      webgl_properties['attributes']['vec_vertexNormal'],
      3,
      webgl_buffer.FLOAT,
      false,
      0,
      0
    );

    webgl_buffer.bindBuffer(
      webgl_buffer.ARRAY_BUFFER,
      core_entities[entity]['buffer']['color']
    );
    webgl_buffer.vertexAttribPointer(
      webgl_properties['attributes']['vec_vertexColor'],
      4,
      webgl_buffer.FLOAT,
      false,
      0,
      0
    );

    webgl_buffer.bindBuffer(
      webgl_buffer.ARRAY_BUFFER,
      core_entities[entity]['buffer']['vertex']
    );
    webgl_buffer.vertexAttribPointer(
      webgl_properties['attributes']['vec_vertexPosition'],
      4,
      webgl_buffer.FLOAT,
      false,
      0,
      0
    );

    webgl_buffer.bindBuffer(
      webgl_buffer.ARRAY_BUFFER,
      core_entities[entity]['buffer']['texture']
    );
    webgl_buffer.vertexAttribPointer(
      webgl_properties['attributes']['vec_texturePosition'],
      2,
      webgl_buffer.FLOAT,
      false,
      0,
      0
    );

    webgl_buffer.activeTexture(webgl_buffer.TEXTURE0);
    webgl_buffer.bindTexture(
      webgl_buffer.TEXTURE_2D,
      core_entities[entity]['texture-gl']
    );

    webgl_buffer.uniform1f(
      webgl_properties['shader']['alpha'],
      core_entities[entity]['alpha']
    );
    webgl_buffer.uniformMatrix4fv(
      webgl_properties['shader']['mat_cameraMatrix'],
      false,
      core_matrices['camera']
    );

    webgl_buffer.drawArrays(
      webgl_buffer[core_entities[entity]['draw-type']],
      0,
      core_entities[entity]['vertices-length']
    );

    core_matrix_copy({
      'id': 'cache',
      'to': 'camera',
    });
}

function webgl_drawloop(){
    if(!core_menu_open){
        webgl_draw();
    }
    core_interval_animationFrame({
      'id': 'webgl-animationFrame',
    });
}

// Optional args: entity, multiplier, strafe, y
function webgl_entity_move(args){
    args = core_args({
      'args': args,
      'defaults': {
        'entity': false,
        'multiplier': 1,
        'strafe': false,
        'y': 0,
      },
    });

    if(args['entity'] === false){
        let movement = core_move_3d({
          'angle': webgl_characters['_me']['rotate-y'],
          'speed': webgl_characters['_me']['speed'] * args['multiplier'],
          'strafe': args['strafe'],
        });

        webgl_characters['_me']['dx'] += movement['x'];
        webgl_characters['_me']['dy'] += args['y'];
        webgl_characters['_me']['dz'] += movement['z'];

    }else{
        let movement = core_move_3d({
          'angle': core_entities[args['entity']]['rotate-y'],
          'speed': core_entities[args['entity']]['speed'] * args['multiplier'],
          'strafe': args['strafe'],
        });

        core_entities[args['entity']]['dx'] = movement['x'];
        core_entities[args['entity']]['dy'] = args['y'];
        core_entities[args['entity']]['dz'] = movement['z'];
    }
}

// Optional args: entity, x, y, z
function webgl_entity_move_to(args){
    args = core_args({
      'args': args,
      'defaults': {
        'entity': false,
        'x': 0,
        'y': 0,
        'z': 0,
      },
    });

    if(args['entity'] === false){
        webgl_characters['_me']['translate-x'] = args['x'];
        webgl_characters['_me']['translate-y'] = args['y'];
        webgl_characters['_me']['translate-z'] = args['z'];

    }else{
        core_entities[args['entity']]['translate-x'] = args['x'];
        core_entities[args['entity']]['translate-y'] = args['y'];
        core_entities[args['entity']]['translate-z'] = args['z'];
    }
}

// Required args: entity
function webgl_entity_radians(args){
    core_entities[args['entity']]['rotate-radians-x'] = core_degrees_to_radians({
      'degrees': core_entities[args['entity']]['rotate-x'],
    });
    core_entities[args['entity']]['rotate-radians-y'] = core_degrees_to_radians({
      'degrees': core_entities[args['entity']]['rotate-y'],
    });
    core_entities[args['entity']]['rotate-radians-z'] = core_degrees_to_radians({
      'degrees': core_entities[args['entity']]['rotate-z'],
    });
}

function webgl_entity_todo(entity){
    core_entities[entity]['vertices-length'] = core_entities[entity]['vertices'].length / 4;

    core_entities[entity]['normals'] = webgl_normals({
      'rotate-x': core_entities[entity]['rotate-x'],
      'rotate-y': core_entities[entity]['rotate-y'],
      'rotate-z': core_entities[entity]['rotate-z'],
      'vertices-length': core_entities[entity]['vertices-length'],
    });

    webgl_entity_radians({
      'entity': entity,
    });

    if(!core_entities[entity]['draw']){
        return;
    }

    core_entities[entity]['buffer'] = webgl_buffer_set({
      'colorData': core_entities[entity]['vertex-colors'],
      'normalData': core_entities[entity]['normals'],
      'textureData': core_entities[entity]['textureData'],
      'vertexData': core_entities[entity]['vertices'],
    });

    webgl_texture_set({
      'entityid': entity,
      'image': webgl_textures[core_entities[entity]['texture']],
    });
}

// Optional args: ambient-blue, ambient-green, ambient-red, clearcolor-alpha,
//   clearcolor-blue, clearcolor-green, clearcolor-red, directional-blue, directional-green,
//   directional-red, directional-vector, fog-density, fog-state, gravity-acceleration, gravity-max,
//   spawn-rotate-x, spawn-rotate-y, spawn-rotate-z, spawn-translate-x, spawn-translate-y,
//   spawn-translate-z
function webgl_init(args){
    args = core_args({
      'args': args,
      'defaults': {
        'ambient-blue': 1,
        'ambient-green': 1,
        'ambient-red': 1,
        'clearcolor-alpha': 1,
        'clearcolor-blue': 0,
        'clearcolor-green': 0,
        'clearcolor-red': 0,
        'directional-blue': 1,
        'directional-green': 1,
        'directional-red': 1,
        'directional-vector': false,
        'fog-density': .0001,
        'fog-state': false,
        'gravity-acceleration': -.05,
        'gravity-max': -1,
        'spawn-rotate-x': 0,
        'spawn-rotate-y': 0,
        'spawn-rotate-z': 0,
        'spawn-translate-x': 0,
        'spawn-translate-y': 0,
        'spawn-translate-z': 0,
      },
    });

    webgl_properties = {
      'ambient-blue': args['ambient-blue'],
      'ambient-green': args['ambient-green'],
      'ambient-red': args['ambient-red'],
      'attributes': {},
      'canvas': {
        'fillStyle': '#fff',
        'font': webgl_fonts['medium'],
        'height': 0,
        'height-half': 0,
        'lineJoin': 'miter',
        'lineWidth': 1,
        'strokeStyle': '#fff',
        'textAlign': 'start',
        'textBaseline': 'alphabetic',
        'width': 0,
        'width-half': 0,
      },
      'clearcolor-alpha': args['clearcolor-alpha'],
      'clearcolor-blue': args['clearcolor-blue'],
      'clearcolor-green': args['clearcolor-green'],
      'clearcolor-red': args['clearcolor-red'],
      'directional-blue': args['directional-blue'],
      'directional-green': args['directional-green'],
      'directional-red': args['directional-red'],
      'directional-vector': args['directional-vector'],
      'fog-density': args['fog-density'],
      'fog-state': args['fog-state'],
      'gravity-acceleration': args['gravity-acceleration'],
      'gravity-max': args['gravity-max'],
      'shader': {},
      'spawn-rotate-x': args['spawn-rotate-x'],
      'spawn-rotate-y': args['spawn-rotate-y'],
      'spawn-rotate-z': args['spawn-rotate-z'],
      'spawn-translate-x': args['spawn-translate-x'],
      'spawn-translate-y': args['spawn-translate-y'],
      'spawn-translate-z': args['spawn-translate-z'],
    };

    core_html({
      'parent': document.body,
      'properties': {
        'id': 'canvas',
      },
      'type': 'canvas',
    });
    core_html({
      'parent': document.body,
      'properties': {
        'id': 'buffer',
      },
      'type': 'canvas',
    });

    core_matrices['camera'] = core_matrix_create();
    core_matrices['perspective'] = core_matrix_create();

    webgl_buffer = document.getElementById('buffer').getContext(
      'webgl',
      {
        'alpha': false,
        'antialias': true,
        'depth': true,
        'premultipliedAlpha': false,
        'preserveDrawingBuffer': false,
        'stencil': false,
      }
    );
    webgl_canvas = document.getElementById('canvas').getContext(
      '2d',
      {
        'alpha': false,
      }
    );

    window.onresize = webgl_resize;
    webgl_resize();

    webgl_clearcolor_set({
      'alpha': webgl_properties['clearcolor-alpha'],
      'blue': webgl_properties['clearcolor-blue'],
      'green': webgl_properties['clearcolor-green'],
      'red': webgl_properties['clearcolor-red'],
    });
    webgl_buffer.enable(webgl_buffer.BLEND);
    webgl_buffer.enable(webgl_buffer.CULL_FACE);
    webgl_buffer.enable(webgl_buffer.DEPTH_TEST);

    webgl_buffer.blendFunc(
      webgl_buffer.SRC_ALPHA,
      webgl_buffer.ONE_MINUS_SRC_ALPHA
    );

    webgl_shader_update();

    core_groups['particles'] = {};
    core_groups['skybox'] = {};
    core_entity_set({
      'default': true,
      'groups': [
        'foreground',
      ],
      'properties': {
        'alpha': 1,
        'attach-to': false,
        'attach-offset-x': 0,
        'attach-offset-y': 0,
        'attach-offset-z': 0,
        'billboard': false,
        'collide-range': 2.5,
        'collides': false,
        'collision': false,
        'draw': true,
        'draw-type': 'TRIANGLE_FAN',
        'dx': 0,
        'dy': 0,
        'dz': 0,
        'gravity': false,
        'item': false,
        'normals': [],
        'rotate-radians-x': 0,
        'rotate-radians-y': 0,
        'rotate-radians-z': 0,
        'rotate-x': 0,
        'rotate-y': 0,
        'rotate-z': 0,
        'scale-x': 1,
        'scale-y': 1,
        'scale-z': 1,
        'speed': .2,
        'texture': '_default',
        'textureData': [
          0, 1,
          0, 0,
          1, 0,
          1, 1,
        ],
        'translate-x': 0,
        'translate-y': 0,
        'translate-z': 0,
        'vertices-length': 0,
      },
      'todo': function(entity){
          webgl_entity_todo(entity);
      },
      'type': 'webgl',
    });

    core_interval_modify({
      'id': 'webgl-interval',
      'paused': true,
      'todo': webgl_logicloop,
    });
    core_interval_modify({
      'animationFrame': true,
      'id': 'webgl-animationFrame',
      'paused': true,
      'todo': webgl_drawloop,
    });
}

// Optional args: camera-type, camera-zoom-current, camera-zoom-max, collide-range, collides,
//   dx, dy, dz, entities, experience, health-current, health-max, id, inventory, jump-height, level, speed
function webgl_init_character(args){
    args = core_args({
      'args': args,
      'defaults': {
        'camera-type': 'gravity',
        'camera-zoom-current': 20,
        'camera-zoom-max': 30,
        'collide-range': 2.5,
        'collides': true,
        'dx': 0,
        'dy': 0,
        'dz': 0,
        'entities': [],
        'experience': 0,
        'health-current': 100,
        'health-max': 100,
        'id': '_me',
        'inventory': false,
        'jump-height': .6,
        'level': -1,
        'speed': .2,
      },
    });

    webgl_characters[args['id']] = {
      'camera-rotate-radians-x': 0,
      'camera-rotate-radians-y': 0,
      'camera-rotate-radians-z': 0,
      'camera-rotate-x': 0,
      'camera-rotate-y': 0,
      'camera-rotate-z': 0,
      'camera-type': args['camera-type'],
      'camera-zoom-current': args['camera-zoom-current'],
      'camera-zoom-max': args['camera-zoom-max'],
      'collide-range': args['collide-range'],
      'collides': args['collides'],
      'dx': args['dx'],
      'dy': args['dy'],
      'dz': args['dz'],
      'entities': args['entities'],
      'experience': args['experience'],
      'health-current': args['health-current'],
      'health-max': args['health-max'],
      'inventory': {},
      'jump-allow': false,
      'jump-height': args['jump-height'],
      'level': args['level'],
      'rotate-radians-x': 0,
      'rotate-radians-y': 0,
      'rotate-radians-z': 0,
      'rotate-x': 0,
      'rotate-y': 0,
      'rotate-z': 0,
      'speed': args['speed'],
      'translate-x': 0,
      'translate-y': 0,
      'translate-z': 0,
    };
    if(args['inventory'] !== false){
        Object.assign(
          webgl_characters[args['id']]['inventory'],
          args['inventory']
        );
    }
}

// Optional args: character, target
function webgl_json_export(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': true,
        'target': 'exported',
      },
    });

    let json = {};

    Object.assign(
      json,
      webgl_properties
    );

    delete json['attributes'];
    delete json['canvas'];
    delete json['shader'];

    if(args['character']
      && webgl_character_level() > -1){
        json['character'] = {};
        Object.assign(
          json['character'],
          webgl_characters['_me']
        );

        delete json['character']['camera-rotate-radians-x'];
        delete json['character']['camera-rotate-radians-y'];
        delete json['character']['camera-rotate-radians-z'];
        delete json['character']['camera-rotate-x'];
        delete json['character']['camera-rotate-y'];
        delete json['character']['camera-rotate-z'];
        delete json['character']['jump-allow'];
        delete json['character']['rotate-radians-x'];
        delete json['character']['rotate-radians-y'];
        delete json['character']['rotate-radians-z'];
        delete json['character']['rotate-x'];
        delete json['character']['rotate-y'];
        delete json['character']['rotate-z'];
        delete json['character']['translate-x'];
        delete json['character']['translate-y'];
        delete json['character']['translate-z'];

        json['entities'] = [];
        for(let entity in webgl_character_homebase){
            let entity_json = {};
            entity_json['id'] = webgl_character_homebase[entity]['id'];

            Object.assign(
              entity_json,
              webgl_character_homebase[entity]
            );

            delete entity_json['buffer'];
            delete entity_json['image'];
            delete entity_json['normals'];
            delete entity_json['rotate-radians-x'];
            delete entity_json['rotate-radians-y'];
            delete entity_json['rotate-radians-z'];
            delete entity_json['texture-gl'];
            delete entity_json['textureData'];
            delete entity_json['vertices-length'];

            json['entities'].push(entity_json);
        }

    }else{
        json['entities'] = [];
        for(let entity in core_entities){
            let entity_json = {};
            entity_json['id'] = core_entities[entity]['id'];

            Object.assign(
              entity_json,
              core_entities[entity]
            );

            delete entity_json['buffer'];
            delete entity_json['image'];
            delete entity_json['normals'];
            delete entity_json['rotate-radians-x'];
            delete entity_json['rotate-radians-y'];
            delete entity_json['rotate-radians-z'];
            delete entity_json['texture-gl'];
            delete entity_json['textureData'];
            delete entity_json['vertices-length'];

            json['entities'].push(entity_json);
        }
    }

    document.getElementById(args['target']).value = JSON.stringify(json);
}

// Optional args: character, json
function webgl_load_level(args){
    args = core_args({
      'args': args,
      'defaults': {
        'character': 0,
        'json': false,
      },
    });

    if(typeof args['json'] === 'object'){
        let filereader = new FileReader();
        filereader.onload = function(event){
            webgl_load_level_init({
              'character': args['character'],
              'json': JSON.parse(event.target.result),
            });
        };
        filereader.readAsText(args['json']);

    }else{
        webgl_load_level_init({
          'character': args['character'],
          'json': JSON.parse(args['json']),
        });
    }
}

// Required args: character
// Optional args: json
function webgl_load_level_init(args){
    args = core_args({
      'args': args,
      'defaults': {
        'json': false,
      },
    });

    if(args['json'] === false){
        args['json'] = {};
    }

    if(args['character'] === 1){
        if(args['json']['characters'] === false
          || !args['json']['characters']){
            return;
        }
    }

    core_entity_remove_all();
    core_storage_save();

    if(args['json']['characters']
      && args['json']['characters'] !== false){
        for(let character in args['json']['characters']){
            webgl_init_character({
              'camera-type': args['json']['characters'][character]['camera-type'],
              'camera-zoom-current': args['json']['characters'][character]['camera-zoom-current'],
              'camera-zoom-max': args['json']['characters'][character]['camera-zoom-max'],
              'collide-range': args['json']['characters'][character]['collide-range'],
              'collides': args['json']['characters'][character]['collides'],
              'dx': args['json']['characters'][character]['dx'],
              'dy': args['json']['characters'][character]['dy'],
              'dz': args['json']['characters'][character]['dz'],
              'entities': args['json']['characters'][character]['entities'],
              'experience': args['json']['characters'][character]['experience'],
              'health-current': args['json']['characters'][character]['health-current'],
              'health-max': args['json']['characters'][character]['health-max'],
              'id': args['json']['characters'][character]['id'],
              'inventory': args['json']['characters'][character]['inventory'],
              'jump-height': args['json']['characters'][character]['jump-height'],
              'level': args['json']['characters'][character]['level'],
              'speed': args['json']['characters'][character]['speed'],
            });

            if(args['json']['characters'][character]['id'] === '_me'){
                webgl_character_homebase = args['json']['entities'];
            }
        }
    }

    if(args['character'] === -1){
        webgl_init_character({
          'camera-type': 'free',
          'camera-zoom-current': 0,
          'camera-zoom-max': 0,
          'entities': [],
          'id': '_me',
        });
        webgl_character_homebase = [];

    }else if(!webgl_characters['_me']
      && (webgl_character_level() < 0
        || args['character'] === 1)){
        webgl_init_character({
          'level': args['character'],
        });
    }

    webgl_init({
      'ambient-blue': args['json']['ambient-blue'],
      'ambient-green': args['json']['ambient-green'],
      'ambient-red': args['json']['ambient-red'],
      'clearcolor-alpha': args['json']['clearcolor-alpha'],
      'clearcolor-blue': args['json']['clearcolor-blue'],
      'clearcolor-green': args['json']['clearcolor-green'],
      'clearcolor-red': args['json']['clearcolor-red'],
      'directional-blue': args['json']['directional-blue'],
      'directional-green': args['json']['directional-green'],
      'directional-red': args['json']['directional-red'],
      'directional-vector': args['json']['directional-vector'],
      'fog-density': args['json']['fog-density'],
      'fog-state': args['json']['fog-state'],
      'gravity-acceleration': args['json']['gravity-acceleration'],
      'gravity-max': args['json']['gravity-max'],
      'spawn-rotate-x': args['json']['spawn-rotate-x'],
      'spawn-rotate-y': args['json']['spawn-rotate-y'],
      'spawn-rotate-z': args['json']['spawn-rotate-z'],
      'spawn-translate-x': args['json']['spawn-translate-x'],
      'spawn-translate-y': args['json']['spawn-translate-y'],
      'spawn-translate-z': args['json']['spawn-translate-z'],
    });

    for(let entity in args['json']['entities']){
        core_entity_create({
          'id': args['json']['entities'][entity]['id'],
          'properties': args['json']['entities'][entity],
          'types': args['json']['entities'][entity]['types'],
        });

        let attach = false;

        if(args['json']['entities'][entity]['skybox'] === true){
            core_group_move({
              'entities': [
                args['json']['entities'][entity]['id'],
              ],
              'from': 'foreground',
              'to': 'skybox',
            });
            attach = '_character-camera';

        }else if(args['json']['entities'][entity]['attach-to'] !== void 0){
            attach = args['json']['entities'][entity]['attach-to'];
        }

        if(attach !== false){
            webgl_attach({
              'entity': args['json']['entities'][entity]['id'],
              'offset-x': args['json']['entities'][entity]['attach-offset-x'],
              'offset-y': args['json']['entities'][entity]['attach-offset-y'],
              'offset-z': args['json']['entities'][entity]['attach-offset-z'],
              'to': attach,
            });
        }
    }
    for(let character in webgl_characters){
        for(let entity in webgl_characters[character]['entities']){
            core_entity_create({
              'id': webgl_characters[character]['entities'][entity]['id'],
              'properties': webgl_characters[character]['entities'][entity],
              'types': webgl_characters[character]['entities'][entity]['types'],
            });
            if(character === '_me'){
                webgl_attach({
                  'entity': webgl_characters[character]['entities'][entity]['id'],
                  'offset-x': webgl_characters[character]['entities'][entity]['attach-offset-x'],
                  'offset-y': webgl_characters[character]['entities'][entity]['attach-offset-y'],
                  'offset-z': webgl_characters[character]['entities'][entity]['attach-offset-z'],
                  'to': '_character-camera',
                });
            }
        }
    }

    webgl_character_spawn();
    core_escape();
}

function webgl_logicloop(){
    if(webgl_characters['_me']['camera-type'] !== false){
        if(core_keys[core_storage_data['move-←']]['state']){
            if(webgl_characters['_me']['camera-zoom-max'] === 0
              || (core_mouse['down']
              && core_mouse['button'] === 2)){
                webgl_entity_move({
                  'multiplier': -1,
                  'strafe': true,
                });

            }else{
                webgl_camera_rotate({
                  'camera': !(core_mouse['down']
                    && core_mouse['button'] === 0),
                  'y': -5,
                });
            }
        }

        if(core_keys[core_storage_data['move-→']]['state']){
            if(webgl_characters['_me']['camera-zoom-max'] === 0
              || (core_mouse['down']
              && core_mouse['button'] === 2)){
                webgl_entity_move({
                  'strafe': true,
                });

            }else{
                webgl_camera_rotate({
                  'camera': !(core_mouse['down']
                    && core_mouse['button'] === 0),
                  'y': 5,
                });
            }
        }

        if(core_keys[core_storage_data['move-↓']]['state']){
            webgl_entity_move();
        }

        if(core_keys[core_storage_data['move-↑']]['state']){
            webgl_entity_move({
              'multiplier': -1,
            });
        }

        if(webgl_characters['_me']['camera-type'] === 'free'){
            if(core_keys[32]['state']){
                webgl_entity_move({
                  'multiplier': 0,
                  'y': webgl_characters['_me']['speed'],
                });
            }

            if(core_keys[67]['state']){
                webgl_entity_move({
                  'multiplier': 0,
                  'y': -webgl_characters['_me']['speed'],
                });
            }
        }
    }

    logic();

    if(webgl_characters['_me']['camera-type'] === 'gravity'){
        webgl_characters['_me']['dy'] = Math.max(
          webgl_characters['_me']['dy'] + webgl_properties['gravity-acceleration'],
          webgl_properties['gravity-max']
        );

        if(webgl_characters['_me']['jump-allow']
          && core_keys[32]['state']){
            webgl_characters['_me']['jump-allow'] = false;
            webgl_characters['_me']['dy'] = webgl_characters['_me']['jump-height'];
        }
    }

    if(webgl_characters['_me']['collides']){
        for(let entity in core_entities){
            if(core_entities[entity]['collision']){
                webgl_collision({
                  'character': true,
                  'target': entity,
                });
            }
        }
    }

    core_group_modify({
      'groups': [
        'webgl',
      ],
      'todo': function(entity){
          webgl_logicloop_handle_entity(entity);
      },
    });

    core_group_modify({
      'groups': [
        'particles',
      ],
      'todo': function(entity){
          webgl_entity_move({
            'entity': entity,
            'multiplier': -1,
          });

          core_entities[entity]['lifespan'] -= 1;
          if(core_entities[entity]['lifespan'] <= 0){
              core_entity_remove({
                'entities': [
                  entity,
                ],
              });
          }
      },
    });

    webgl_characters['_me']['translate-x'] = core_round({
      'number': webgl_characters['_me']['translate-x'] + webgl_characters['_me']['dx'],
    });
    webgl_characters['_me']['translate-y'] = core_round({
      'number': webgl_characters['_me']['translate-y'] + webgl_characters['_me']['dy'],
    });
    webgl_characters['_me']['translate-z'] = core_round({
      'number': webgl_characters['_me']['translate-z'] + webgl_characters['_me']['dz'],
    });

    webgl_characters['_me']['dx'] = 0;
    if(webgl_characters['_me']['camera-type'] === 'free'){
        webgl_characters['_me']['dy'] = 0;
    }
    webgl_characters['_me']['dz'] = 0;

    core_matrix_identity({
      'id': 'camera',
    });
    core_matrix_translate({
      'dimensions': [
        0,
        0,
        webgl_characters['_me']['camera-zoom-current'],
      ],
      'id': 'camera',
    });
    core_matrix_rotate({
      'dimensions': [
        webgl_characters['_me']['camera-rotate-radians-x'],
        webgl_characters['_me']['camera-rotate-radians-y'],
        webgl_characters['_me']['camera-rotate-radians-z'],
      ],
      'id': 'camera',
    });
    core_matrix_translate({
      'dimensions': [
        webgl_characters['_me']['translate-x'],
        webgl_characters['_me']['translate-y'],
        webgl_characters['_me']['translate-z'],
      ],
      'id': 'camera',
    });
}

function webgl_logicloop_handle_entity(entity){
    if(core_entities[entity]['logic']){
        core_entities[entity]['logic']();
    }

    if(core_entities[entity]['attach-to'] !== false){
        if(core_entities[entity]['attach-to'] === '_character-camera'){
            core_entities[entity]['translate-x'] = webgl_characters['_me']['translate-x']
              + webgl_characters['_me']['dx']
              + core_entities[entity]['attach-offset-x'];
            core_entities[entity]['translate-y'] = webgl_characters['_me']['translate-y']
              + webgl_characters['_me']['dy']
              + core_entities[entity]['attach-offset-y'];
            core_entities[entity]['translate-z'] = webgl_characters['_me']['translate-z']
              + webgl_characters['_me']['dz']
              + core_entities[entity]['attach-offset-z'];

        }else{
            let attachto = core_entities[core_entities[entity]['attach-to']];
            core_entities[entity]['translate-x'] = attachto['translate-x']
              + attachto['dx']
              + core_entities[entity]['attach-offset-x'];
            core_entities[entity]['translate-y'] = attachto['translate-y']
              + attachto['dy']
              + core_entities[entity]['attach-offset-y'];
            core_entities[entity]['translate-z'] = attachto['translate-z']
              + attachto['dz']
              + core_entities[entity]['attach-offset-z'];
        }

    }else{
        if(core_entities[entity]['gravity']){
            core_entities[entity]['dy'] = Math.max(
              core_entities[entity]['dy'] + webgl_properties['gravity-acceleration'],
              webgl_properties['gravity-max']
            );
        }

        if(core_entities[entity]['collides']){
            for(let other_entity in core_entities){
                if(core_entities[other_entity]['collision']
                  && entity !== other_entity){
                    if(!webgl_collision({
                      'character': false,
                      'entity': entity,
                      'target': other_entity,
                    })){
                        return;
                    }
                }
            }
        }

        core_entities[entity]['translate-x'] = core_round({
          'number': core_entities[entity]['translate-x'] + core_entities[entity]['dx'],
        });
        core_entities[entity]['translate-y'] = core_round({
          'number': core_entities[entity]['translate-y'] + core_entities[entity]['dy'],
        });
        core_entities[entity]['translate-z'] = core_round({
          'number': core_entities[entity]['translate-z'] + core_entities[entity]['dz'],
        });
    }
}

// Optional args: rotate-x, rotate-y, rotate-z, vertices-length
function webgl_normals(args){
    args = core_args({
      'args': args,
      'defaults': {
        'rotate-x': 0,
        'rotate-y': 0,
        'rotate-z': 0,
        'vertices-length': 1,
      },
    });

    let normal_x = 0;
    let normal_y = 0;
    let normal_z = 0;

    if(args['rotate-x'] !== 0){
        normal_z = core_round({
          'number': Math.sin(core_degrees_to_radians({
            'degrees': args['rotate-x'],
          })),
        });

    }else if(args['rotate-z'] !== 0){
        normal_x = -core_round({
          'number': Math.sin(core_degrees_to_radians({
            'degrees': args['rotate-z'],
          })),
        });

    }else{
        normal_y = core_round({
          'number': Math.cos(core_degrees_to_radians({
            'degrees': args['rotate-y'],
          })),
        });
    }

    let normals = [];
    for(let i = 0; i < args['vertices-length']; i++){
        normals.push(
          normal_x,
          normal_y,
          normal_z
        );
    }

    return normals;
}

// Optional args: collide-range, collides, color, count, gravity, lifespan,
//   rotate-x, rotate-y, rotate-z, speed, translate-x, translate-y, translate-z
function webgl_particles_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'collide-range': 1,
        'collides': true,
        'color': [1, 1, 1, 1],
        'count': 1,
        'gravity': true,
        'lifespan': 100,
        'rotate-x': webgl_characters['_me']['rotate-x'],
        'rotate-y': webgl_characters['_me']['rotate-y'],
        'rotate-z': webgl_characters['_me']['rotate-z'],
        'speed': 1,
        'translate-x': webgl_characters['_me']['translate-x'],
        'translate-y': webgl_characters['_me']['translate-y'],
        'translate-z': webgl_characters['_me']['translate-z'],
      },
    });

    for(let i = 0; i < args['count']; i++){
        let id = '_particle-' + core_uid();

        core_entity_create({
          'id': id,
          'properties': {
            'collide-range': args['collide-range'],
            'collides': args['collides'],
            'draw-type': 'POINTS',
            'gravity': args['gravity'],
            'lifespan': args['lifespan'],
            'normals': [0, 1, 0],
            'rotate-x': args['rotate-x'],
            'rotate-y': args['rotate-y'],
            'rotate-z': args['rotate-z'],
            'speed': args['speed'],
            'translate-x': args['translate-x'],
            'translate-y': args['translate-y'],
            'translate-z': args['translate-z'],
            'vertex-colors': args['color'],
            'vertices': [0, 0, 0, 1],
          },
        });
        webgl_entity_radians({
          'entity': id,
        });
        core_group_move({
          'entities': [
            id,
          ],
          'from': 'foreground',
          'to': 'particles',
        });
    }
}

function webgl_perspective(){
    core_matrices['perspective'][0] = webgl_properties['canvas']['height'] / webgl_properties['canvas']['width'];
    core_matrices['perspective'][5] = 1;
    core_matrices['perspective'][10] = -1;
    core_matrices['perspective'][11] = -1;
    core_matrices['perspective'][14] = -2;
}

// Required args: x, y
function webgl_pick_color(args){
    let pixelarray = new Uint8Array(4);

    webgl_buffer.readPixels(
      args['x'],
      window.innerHeight - args['y'],
      1,
      1,
      webgl_buffer.RGBA,
      webgl_buffer.UNSIGNED_BYTE,
      pixelarray
    );

    return pixelarray;
}

// Required args: id, shaderlist
function webgl_program_create(args){
    let program = webgl_buffer.createProgram();
    for(let shader in args['shaderlist']){
        webgl_buffer.attachShader(
          program,
          args['shaderlist'][shader]
        );
    }
    webgl_buffer.linkProgram(program);
    webgl_buffer.useProgram(program);

    return program;
}

function webgl_resize(){
    let buffer = document.getElementById('buffer');
    let canvas = document.getElementById('canvas');

    webgl_properties['canvas']['height'] = window.innerHeight;
    webgl_properties['canvas']['height-half'] = webgl_properties['canvas']['height'] / 2;
    buffer.height = webgl_properties['canvas']['height'];
    canvas.height = webgl_properties['canvas']['height'];

    webgl_properties['canvas']['width'] = window.innerWidth;
    webgl_properties['canvas']['width-half'] = webgl_properties['canvas']['width'] / 2;
    buffer.width = webgl_properties['canvas']['width'];
    canvas.width = webgl_properties['canvas']['width'];

    webgl_buffer.viewportHeight = webgl_properties['canvas']['height'];
    webgl_buffer.viewportWidth = webgl_properties['canvas']['width'];
    webgl_buffer.viewport(
      0,
      0,
      webgl_properties['canvas']['width'],
      webgl_properties['canvas']['height']
    );

    Object.assign(
      webgl_buffer,
      webgl_properties['canvas']
    );

    webgl_perspective();

    core_call({
      'todo': 'resize_logic',
    });
}

// Required args: id, source, type
function webgl_shader_create(args){
    let shader = webgl_buffer.createShader(args['type']);
    webgl_buffer.shaderSource(
      shader,
      args['source']
    );
    webgl_buffer.compileShader(shader);

    return shader;
}

function webgl_shader_update(){
    if(webgl_properties['shader']['program'] !== 0){
        webgl_buffer.deleteProgram(webgl_properties['shader']['program']);
    }

    webgl_properties['shader']['program'] = webgl_program_create({
      'id': 'shaders',
      'shaderlist': [
        webgl_shader_create({
          'id': 'fragment',
          'source':
              'uniform lowp float alpha;'
            + 'uniform lowp float float_fog;'
            + 'uniform int fog;'
            + 'uniform sampler2D sampler;'
            + 'varying mediump float float_fogDistance;'
            + 'varying mediump vec2 vec_textureCoord;'
            + 'varying mediump vec3 vec_lighting;'
            + 'varying lowp vec4 vec_fragmentColor;'
            + 'void main(void){'
            +     'if(fog == 1){'
            +         'gl_FragColor = mix('
            +           'vec4('
            +             webgl_properties['clearcolor-red'] + ','
            +             webgl_properties['clearcolor-green'] + ','
            +             webgl_properties['clearcolor-blue'] + ','
            +             webgl_properties['clearcolor-alpha']
            +           '),'
            +           'vec_fragmentColor,'
            +           'clamp(exp(' + webgl_properties['fog-density'] + ' * float_fogDistance * -float_fogDistance), 0.0, 1.0)'
            +         ') * texture2D(sampler, vec_textureCoord) * vec4(vec_lighting, 1.0) * alpha;'
            +     '}else{'
            +         'gl_FragColor = vec_fragmentColor * texture2D(sampler, vec_textureCoord) * vec4(vec_lighting, 1.0) * alpha;'
            +     '}'
            + '}',
          'type': webgl_buffer.FRAGMENT_SHADER,
        }),
        webgl_shader_create({
          'id': 'vertex',
          'source':
              'attribute vec2 vec_texturePosition;'
            + 'attribute vec3 vec_vertexNormal;'
            + 'attribute vec4 vec_vertexColor;'
            + 'attribute vec4 vec_vertexPosition;'
            + 'uniform int directional;'
            + 'uniform mat4 mat_cameraMatrix;'
            + 'uniform mat4 mat_perspectiveMatrix;'
            + 'varying float float_fogDistance;'
            + 'varying vec2 vec_textureCoord;'
            + 'varying vec3 vec_lighting;'
            + 'varying vec4 vec_fragmentColor;'
            + 'void main(void){'
            +     'gl_PointSize = 10.0;'
            +     'gl_Position = mat_perspectiveMatrix * mat_cameraMatrix * vec_vertexPosition;'
            +     'float_fogDistance = length(gl_Position.xyz);'
            +     'vec_fragmentColor = vec_vertexColor;'
            +     'vec_textureCoord = vec_texturePosition;'
            +     'if(directional == 1){'
            +         'vec4 transformedNormal = mat_perspectiveMatrix * vec4(vec_vertexNormal, 1.0);'
            +         'vec_lighting = vec3('
            +           webgl_properties['ambient-red'] + ','
            +           webgl_properties['ambient-green'] + ','
            +           webgl_properties['ambient-blue']
            +         ') + (vec3('
            +           webgl_properties['directional-red'] + ','
            +           webgl_properties['directional-green'] + ','
            +           webgl_properties['directional-blue']
            +         ') * max(dot(transformedNormal.xyz, normalize(vec3(' + webgl_properties['directional-vector'] + '))), 0.0));'
            +     '}else{'
            +         'vec_lighting = vec3('
            +           webgl_properties['ambient-red'] + ','
            +           webgl_properties['ambient-green'] + ','
            +           webgl_properties['ambient-blue']
            +         ');'
            +     '}'
            + '}',
          'type': webgl_buffer.VERTEX_SHADER,
        }),
      ],
    });

    webgl_vertexattribarray_set({
      'attributes': [
        'vec_vertexColor',
        'vec_vertexNormal',
        'vec_vertexPosition',
        'vec_texturePosition',
      ],
      'program': webgl_properties['shader']['program'],
    });

    let locations = {
      'alpha': 'alpha',
      'directional': 'directional',
      'fog-density': 'float_fog',
      'fog-state': 'fog',
      'mat_cameraMatrix': 'mat_cameraMatrix',
      'mat_perspectiveMatrix': 'mat_perspectiveMatrix',
      'sampler': 'sampler',
    };
    for(let location in locations){
        webgl_properties['shader'][location] = webgl_buffer.getUniformLocation(
          webgl_properties['shader']['program'],
          locations[location]
        );
    }

    webgl_buffer.uniform1i(
      webgl_properties['shader']['directional'],
      webgl_properties['directional-vector'] !== false
        ? 1
        : 0
    );
    webgl_buffer.uniform1f(
      webgl_properties['shader']['fog-density'],
      webgl_properties['fog-density']
    );
    webgl_buffer.uniform1i(
      webgl_properties['shader']['fog-state'],
      webgl_properties['fog-state']
        ? 1
        : 0
    );
}

// Required args: entityid
// Optional args: image
function webgl_texture_set(args){
    args = core_args({
      'args': args,
      'defaults': {
        'image': webgl_textures['_default'],
      },
    });

    core_entities[args['entityid']]['texture-gl'] = webgl_buffer.createTexture();
    core_entities[args['entityid']]['image'] = core_image({
      'id': args['entityid'] + '-texture',
      'src': args['image'],
      'todo': function(){
          webgl_texture_set_todo(args);
      },
    });
}

function webgl_texture_set_todo(args){
    webgl_buffer.bindTexture(
      webgl_buffer.TEXTURE_2D,
      core_entities[args['entityid']]['texture-gl']
    );
    webgl_buffer.texImage2D(
      webgl_buffer.TEXTURE_2D,
      0,
      webgl_buffer.RGBA,
      webgl_buffer.RGBA,
      webgl_buffer.UNSIGNED_BYTE,
      core_entities[args['entityid']]['image']
    );
    webgl_buffer.texParameteri(
      webgl_buffer.TEXTURE_2D,
      webgl_buffer.TEXTURE_MAG_FILTER,
      webgl_buffer.NEAREST
    );
    webgl_buffer.texParameteri(
      webgl_buffer.TEXTURE_2D,
      webgl_buffer.TEXTURE_MIN_FILTER,
      webgl_buffer.NEAREST
    );
    webgl_buffer.bindTexture(
      webgl_buffer.TEXTURE_2D,
      void 0
    );
}

// Required args: attributes, program
function webgl_vertexattribarray_set(args){
    for(let attribute in args['attributes']){
        webgl_properties['attributes'][args['attributes'][attribute]] = webgl_buffer.getAttribLocation(
          args['program'],
          args['attributes'][attribute]
        );
        webgl_buffer.enableVertexAttribArray(webgl_properties['attributes'][args['attributes'][attribute]]);
    }
}

// Optional args: rgbarray, vertexcount
function webgl_vertexcolorarray(args){
    args = core_args({
      'args': args,
      'defaults': {
        'rgbarray': [
          core_random_rgb(),
          core_random_rgb(),
          core_random_rgb(),
          core_random_rgb(),
        ],
        'vertexcount': 4,
      },
    });

    while(args['rgbarray'].length < args['vertexcount']){
        args['rgbarray'].push(args['rgbarray'][0]);
    }

    let color = [];
    for(let i = 0; i < args['vertexcount']; i++){
        color.push(
          args['rgbarray'][i]['red'] / 256,
          args['rgbarray'][i]['green'] / 256,
          args['rgbarray'][i]['blue'] / 256,
          1
        );
    }

    return color;
}

window.webgl_buffer = 0;
window.webgl_canvas = 0;
window.webgl_fonts = {
  'big': '300% monospace',
  'medium': '200% monospace',
  'small': '100% monospace',
};
window.webgl_characters = {};
window.webgl_character_homebase = [];
window.webgl_properties = {};
window.webgl_text = {};
window.webgl_textures = {
  '_debug': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAD1BMVEUAAP8A/wD/AAAAAAD///8hKtLYAAAAIklEQVQoz2NwQQMMTkoQIAgBIiNMwIEBAowhwGSECaAnBwAdPj4tFnzwQgAAAABJRU5ErkJggg==',
  '_default': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8////fwAKAAP+j4hsjgAAAABJRU5ErkJggg==',
};
