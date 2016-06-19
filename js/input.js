'use strict';

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
        keys[key['code']]['state'] = true;
        if(!keys[key['code']]['loop']){
            keys[key['code']]['todo']();
        }
    }
}

function handle_keyup(event){
    var key = get_keycode(event);

    if(keys.hasOwnProperty(key['code'])){
        keys[key['code']]['state'] = false;
    }
}

function handle_mousedown(event){
    mouse['down'] = true;
    mouse['down-x'] = mouse['x'];
    mouse['down-y'] = mouse['y'];
    if(mouse['todo'].hasOwnProperty('mousedown')
      && !mouse['todo']['mousedown']['loop']){
        mouse['todo']['mousedown']['todo']();
    }
}

function handle_mousemove(event){
    mouse['x'] = event.pageX;
    mouse['y'] = event.pageY;
    if(mouse['todo'].hasOwnProperty('mousemove')
      && !mouse['todo']['mousemove']['loop']){
        mouse['todo']['mousemove']['todo']();
    }
}

function handle_mouseup(event){
    mouse['down'] = false;
    if(mouse['todo'].hasOwnProperty('mouseup')
      && !mouse['todo']['mouseup']['loop']){
        mouse['todo']['mouseup']['todo']();
    }
}

function handle_mousewheel(event){
    var delta = Number(
      event.wheelDelta
        || -event.detail
    );
    if(mouse['todo'].hasOwnProperty('mousewheel')
      && !mouse['todo']['mousewheel']['loop']){
        mouse['todo']['mousewheel']();
    }
}

function init_input(keybinds, mousebinds){
    keys = {};
    keybinds = keybinds || false;
    if(keybinds !== false){
        for(var key in keybinds){
            keys[key] = {};
            keys[key]['loop'] = keybinds[key]['loop'] || false;
            keys[key]['state'] = false;
            keys[key]['todo'] = keybinds[key]['todo'] || function(){};
        }

        window.onkeydown = handle_keydown;
        window.onkeyup = handle_keyup;
    }

    mouse = {
      'down': false,
      'down-x': 0,
      'down-y': 0,
      'todo': {},
      'x': 0,
      'y': 0,
    };
    mousebinds = mousebinds || false;
    if(mousebinds !== false){
        for(var mousebind in mousebinds){
            mouse['todo'][mousebind] = {};
            mouse['todo'][mousebind]['loop'] = mousebinds[mousebind]['loop'] || false;
            mouse['todo'][mousebind]['todo'] = mousebinds[mousebind]['todo'] || function(){};
        }

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
        if(keys[key]['loop']){
            keys[key]['todo']();
        }
    }
    for(var mousebind in mouse['todo']){
        if(mouse['todo'][mousebind]['loop']){
            mouse['todo'][mousebind]['todo']();
        }
    }
}

var keys = {};
var mouse = {};
