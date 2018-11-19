'use strict';

// Required args: id
function uri_get(args){
    let uri = {
      'boost.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAElBMVEUAgP8AAAEAee8ABw8AECAAcOENq+LGAAAAXElEQVQY02PABhSQOayuyLwQkQAkKUdBVyQpQUGgJEJKECiJkAJJIqRAknApiCRMCiGpYmxsCGQbG5uAHMSkpBQsKCgcpKQENVQZyANKDBBPBewsMIA4TglLQAIAPy0P3ZGsPJ4AAAAASUVORK5CYII=',
      'default.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAD1BMVEUAAP8A/wD/AAAAAAD///8hKtLYAAAAIklEQVQoz2NwQQMMTkoQIAgBIiNMwIEBAowhwGSECaAnBwAdPj4tFnzwQgAAAABJRU5ErkJggg==',
      'goal.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAG1BMVEVV0gBW1QABAgAFDQBQxgBLugAKGQAKGABRxwA2xfPoAAAAj0lEQVQY02PABIJAIADnuQCBI4wjmmxsbJwKlWQMVwIC9UCoVJEyUE6pVAAsFaaU2uLiWqQWCJZKUg8EmhmuBNLJ6AakwIJqjkCes3IgWEOwMoTXCOY1Q3ggEkQT5CH0oZrpALavFGxfkZojwi1hEEFGoJtcXFqBYmh+gHoCCNQC0f0OkWwBhwtmmDEiByUAFj8k69IIb08AAAAASUVORK5CYII=',
      'key.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAElBMVEUAAAD/vQDzsgDlqAAbFAAXEQDoG73hAAAAAXRSTlMAQObYZgAAAG9JREFUOMvtkdENgDAIRP3oArBBYQMmcAn3X8VLqdHk8N+YXggf93KE0m3p+wozL0HrIrqXEYG8jpiVoYALWoRgJmYCL0fe8kky+ZS+E54mMkppg9b1GMVbd83il16ErwMvHJ0uCi87/0L47Es/1Al3ehQt3DLTMAAAAABJRU5ErkJggg==',
      'red.png': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAElBMVEX/AAABAADiAAAeAAD9AADSAAAvAfvmAAAAeElEQVQY02WQ0Q2AIAxEL4YBbFxAwwQ6ASNo3H8XW+5Mg/JBc3kcvRZmK3g2m10dFNPe1UJYLZTDAhRHrmrAhtarPw9nYQGhbhDGFXY6biJBo0udhATp4rlcnRgYfj4lTGP2I1IWRcmcSiio+QTf3zi7UMDvzsZ9PrPaFY3mjJ7qAAAAAElFTkSuQmCC',
    };

    if(args['id'] in uri){
        return uris[args['id']];
    }

    return false;
}
