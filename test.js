'use strict';

const test = require('tape');
const lib = require('./');

test ('all is ok', (t) => {
    try {
	lib(-1);
	t.notOk(1===1,'time should be [0,1]');
    } catch(e) {
	t.ok(e==='time should be [0,1]');
    }
    try {
	lib(2);
	t.notOk(1===1,'time should be [0,1]');
    } catch(e) {
	t.ok(e==='time should be [0,1]');
    }
    t.ok(lib(0)===0.1, '0 is ok');
    t.ok(lib(1)===0.1,'1 is ok');
    t.ok(lib(0.55)===1.12,'0.55 is ok');
    t.end();
})