'use strict';

// Required args: id
// Optional args: properties
function audio_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'properties': {},
      },
    });

    audio_audio[args['id']] = {
      'playing': false,
    };

    for(var property in args['properties']){
        audio_audio[args['id']][property] = core_handle_defaults({
          'default': audio_audio[args['id']],
          'var': args['properties'][property],
        });
    }

    audio_audio[args['id']]['connections'] = args['properties']['connections'] || [
      {
        'frequency': {
          'value': audio_audio[args['id']]['frequency'] || 100,
        },
        'label': 'Oscillator',
        'type': audio_audio[args['id']]['type'] || 'sine',
      },
      {
        'gain': {
          'value': args['properties']['volume'] || audio_volume,
        },
        'label': 'Gain',
      },
    ];

    audio_audio[args['id']]['connections'][0]['id'] = args['id'];
    audio_audio[args['id']]['connections'][0]['onended'] = function(){
        audio_onended({
          'id': this.id,
        });
    };
}

// Optional args: volume
function audio_init(args){
    args = core_args({
      'args': args,
      'defaults': {
        'volume': audio_volume_default,
      },
    });

    audio_context = new window.AudioContext();
    audio_volume = args['volume'];
}

// Optional args: id, properties
function audio_node_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'id': false,
        'properties': {
          'label': 'Oscillator',
        },
      },
    });

    var source = audio_context['create' + args['properties']['label']](
      args['properties']['arg0'],
      args['properties']['arg1'],
      args['properties']['arg2']
    );

    for(var property in args['properties']){
        if(core_type({
          'type': 'object',
          'var': args['properties'][property],
        })){
            for(var subproperty in args['properties'][property]){
                source[property][subproperty] = args['properties'][property][subproperty];
            }

        }else{
            source[property] = args['properties'][property];
        }
    }

    if(args['id'] === false){
        return source;
    }

    audio_sources[args['id']][args['properties']['label']] = source;
}

// Required args: id
function audio_onended(args){
    audio_audio[args['id']]['playing'] = false;

    if(audio_audio[args['id']]['repeat']){
        if(audio_audio[args['id']]['timeout'] <= 0){
            audio_start({
              'id': args['id'],
            });

        }else{
            window.setTimeout(
              'audio_start({id:"' + args['id'] + '"});',
              audio_audio[args['id']]['duration'] * audio_audio[args['id']]['timeout']
            );
        }
    }

    delete audio_sources[args['id']];
}

// Required args: id
// Optional args: volume-multiplier
function audio_source_create(args){
    args = core_args({
      'args': args,
      'defaults': {
        'volume-multiplier': audio_volume_multiplier,
      },
    });

    audio_sources[args['id']] = {
      'duration': audio_audio[args['id']]['duration'] || 0,
      'start': audio_audio[args['id']]['start'] || 0,
      'timeout': audio_audio[args['id']]['timeout'] || 1000,
    };

    // Create audio nodes.
    var connections_length = audio_audio[args['id']]['connections'].length;
    for(var i = 0; i < connections_length; i++){
        audio_node_create({
          'id': args['id'],
          'properties': audio_audio[args['id']]['connections'][i],
        });

        if(audio_audio[args['id']]['connections'][i]['label'] === 'Gain'){
            var volume = audio_audio[args['id']]['volume'] || audio_volume;
            audio_sources[args['id']]['Gain']['gain']['value'] =
              (audio_audio[args['id']]['volume'] || audio_volume)
                * args['volume-multiplier'];
        }
    }

    // Connect audio nodes.
    for(i = 0; i < connections_length - 1; i++){
        audio_sources[args['id']][audio_audio[args['id']]['connections'][i]['label']].connect(
          audio_sources[args['id']][audio_audio[args['id']]['connections'][i + 1]['label']]
        );
    }
    audio_sources[args['id']][audio_audio[args['id']]['connections'][connections_length - 1]['label']].connect(
      audio_context.destination
    );
}

// Required args: id
// Optional args: volume-multiplier
function audio_start(args){
    args = core_args({
      'args': args,
      'defaults': {
        'volume-multiplier': audio_volume_multiplier,
      },
    });

    if(args['volume-multiplier'] === 0){
        return;
    }

    if(audio_audio[args['id']]['playing']){
        audio_stop({
          'id': args['id'],
        });
    }

    audio_source_create({
      'id': args['id'],
      'volume-multiplier': args['volume-multiplier'],
    });

    var startTime = audio_context.currentTime + audio_sources[args['id']]['start'];
    audio_audio[args['id']]['playing'] = true;
    audio_sources[args['id']][audio_audio[args['id']]['connections'][0]['label']].start(startTime);
    audio_stop({
      'id': args['id'],
      'when': startTime + audio_sources[args['id']]['duration'],
    });
}

// Required args: id
// Optional args: when
function audio_stop(args){
    args = core_args({
      'args': args,
      'defaults': {
        'when': void 0,
      },
    });

    audio_sources[args['id']][audio_audio[args['id']]['connections'][0]['label']].stop(args['when']);
}

function audio_stop_all(){
    for(var id in audio_sources){
        audio_stop({
          'id': id,
        });
    }
}

var audio_audio = {};
var audio_context = 0;
var audio_sources = {};
var audio_volume = 1;
var audio_volume_default = 1;
var audio_volume_multiplier = 1;
