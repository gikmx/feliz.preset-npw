'use strict';

const Test = require('feliz.test');

const test$ = Test([
    {
        desc: 'The npw preset',
        test: function(tape){
            tape.skip('should have tests defined')
            tape.end();
        }
    }
]);

test$.subscribe();
