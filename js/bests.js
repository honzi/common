'use strict';

function bests_init(newprefix, bests, defaultvalue){
    bests_default = defaultvalue || 0;
    bests_prefix = newprefix;

    for(var best in bests){
        bests_bests[best] = parseFloat(window.localStorage.getItem(bests_prefix + best))
          || bests[best];
    }
}

function bests_reset(){
    if(!window.confirm('Reset best?')){
        return;
    }

    for(var best in bests_bests){
        bests_bests[best] = bests_default;
        bests_update(bests_bests[best]);
    }
}

function bests_update(key, value){
    if(value > bests_bests[key]){
        bests_bests[key] = value;
    }

    if(bests_bests[key] !== bests_default){
        window.localStorage.setItem(
          bests_prefix + key,
          bests_bests[key]
        );

    }else{
        window.localStorage.removeItem(bests_prefix + key);
    }
}

var bests_bests = {};
var bests_default = 0;
var bests_prefix = '';
