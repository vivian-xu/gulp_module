'use strict';

module.exports = {
    greet: function greet(string) {
        if (console) console.log('hello' + string, string);
    },
    fuck: function fuck(string) {
        if (console) console.log('fuck' + string);
    }
};