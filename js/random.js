'use strict';

function random_boolean(chance){
    chance = chance !== void 0
      ? chance
      : .5;

    return Math.random() <= chance;
}

function random_hex(hash){
    hash = hash !== void 0
      ? false
      : true;
    var color = random_rgb();

    var blue = '0' + color['blue'].toString(16);
    var green = '0' + color['green'].toString(16);
    var red = '0' + color['red'].toString(16);

    var hex = hash ? '#' : '';
    hex += red.slice(-2) + green.slice(-2) + blue.slice(-2);

    return hex;
}

function random_rgb(){
  return {
    'blue': random_integer(256),
    'green': random_integer(256),
    'red': random_integer(256),
  };
}

function random_integer(max, todo){
    todo = todo || 'floor';
    return Math[todo](Math.random() * max);
}

function random_string(length, characters){
    var string = '';
    for(var loopCounter = 0; loopCounter < length; loopCounter++){
        string += characters[random_integer(characters.length - 1)];
    }
    return string;
}