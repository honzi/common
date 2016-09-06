'use strict';

function settings_toggle(state){
    state = state !== void 0
      ? state
      : document.getElementById('settings-button').value === '+';

    if(state){
        document.getElementById('settings').style.display = 'inline-block';
        document.getElementById('settings-button').value = '-';

    }else{
        document.getElementById('settings').style.display = 'none';
        document.getElementById('settings-button').value = '+';
    }
}

var interval = 0;
