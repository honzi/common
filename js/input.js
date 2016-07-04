'use strict';

function check_todo(object, key){
    if(object.hasOwnProperty(key)
      && !object[key]['loop']){
        object[key]['todo']();
    }
}

function get_keycode(event){
    var code = event.keyCode || event.which;
    return {
      'code': code,
      'key': String.fromCharCode(code),
    };
}

function handle_keydown(event){
    var key = get_keycode(event);

    if(keys.hasOwnProperty(key['code'])){
        if(!keys[key['code']]['loop']){
            keys[key['code']]['todo']();
        }
        keys[key['code']]['state'] = true;
    }

    if(keys.hasOwnProperty('all')){
        if(!keys['all']['loop']){
            keys['all']['todo']();
        }
        keys['all']['state'] = true;
    }
}

function handle_keyup(event){
    var key = get_keycode(event);

    if(keys.hasOwnProperty(key['code'])){
        keys[key['code']]['state'] = false;
    }

    if(keys.hasOwnProperty('all')){
        var all = false;
        for(var key in keys){
            if(key !== 'all'
              && keys[key]['state']){
                all = true;
                break;
            }
        }
        keys['all']['state'] = all;
    }
}

function handle_mousedown(event){
    mouse['down'] = true;
    mouse['down-x'] = mouse['x'];
    mouse['down-y'] = mouse['y'];
    check_todo(
      mouse['todo'],
      'mousedown'
    );
}

function handle_mousemove(event){
    mouse['movement-x'] = event.movementX;
    mouse['movement-y'] = event.movementY;
    mouse['x'] = event.pageX;
    mouse['y'] = event.pageY;
    check_todo(
      mouse['todo'],
      'mousemove'
    );
}

function handle_mouseup(event){
    mouse['down'] = false;
    check_todo(
      mouse['todo'],
      'mouseup'
    );
}

function handle_mousewheel(event){
    var delta = Number(
      event.wheelDelta
        || -event.detail
    );
    check_todo(
      mouse['todo'],
      'mousewheel'
    );
}

function init_input(keybinds, mousebinds){
    keybinds = keybinds || false;
    if(keybinds !== false){
        update_keys(
          keybinds,
          true
        );

        window.onkeydown = handle_keydown;
        window.onkeyup = handle_keyup;
    }

    mouse = {
      'down': false,
      'down-x': 0,
      'down-y': 0,
      'movement-x': 0,
      'movement-y': 0,
      'todo': {},
      'x': 0,
      'y': 0,
    };
    mousebinds = mousebinds || false;
    if(mousebinds !== false){
        update_mousebinds(
          mousebinds,
          true
        );

        window.onmousedown = handle_mousedown;
        window.onmousemove = handle_mousemove;
        window.onmouseup = handle_mouseup;
        window.ontouchend = handle_mouseup;
        window.ontouchmove = handle_mousemove;
        window.ontouchstart = handle_mousedown;

        if('onmousewheel' in window){
            window.onmousewheel = handle_mousewheel;

        }else{
            document.addEventListener(
              'DOMMouseScroll',
              handle_mousewheel,
              false
            );
        }
    }
}

function repeat_input_todos(){
    for(var key in keys){
        if(keys[key]['loop']
          && keys[key]['state']){
            keys[key]['todo']();
        }
    }
    for(var mousebind in mouse['todo']){
        if(mouse['todo'][mousebind]['loop']){
            mouse['todo'][mousebind]['todo']();
        }
    }
}

function requestpointerlock(id){
    document.getElementById(id).requestPointerLock();
}

function update_keybinds(keybinds, clear){
    clear = clear || false;
    if(clear){
        keys = {};
    }

    for(var key in keybinds){
        keys[key] = {};
        keys[key]['loop'] = keybinds[key]['loop'] || false;
        keys[key]['state'] = false;
        keys[key]['todo'] = keybinds[key]['todo'] || function(){};
    }
}

function update_mousebinds(mousebinds){
    clear = clear || false;
    if(clear){
        mouse['todo'] = {};
    }

    for(var mousebind in mousebinds){
        mouse['todo'][mousebind] = {};
        mouse['todo'][mousebind]['loop'] = mousebinds[mousebind]['loop'] || false;
        mouse['todo'][mousebind]['todo'] = mousebinds[mousebind]['todo'] || function(){};
    }
}

var keys = {};
var mouse = {};
