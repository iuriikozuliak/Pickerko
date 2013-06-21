'use strict';

// Cache the querySelector/All for easier and faster reuse
window.$ = document.querySelectorAll.bind(document);
window.$$ = document.querySelector.bind(document);

// Allow for looping on Objects by chaining:
// $('.foo').each(function () {})

Object.prototype.each = function (callback) {
    for (var x in this) {
        if (this.hasOwnProperty(x)) {
            callback.call(this, this[x]);
        }
    }
};

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

function parseDateFromString(date){
    date = date.replace(/-/gi,'');

    var day = parseInt( date.substring( 0, 2 ), 10 ),
        month = parseInt( date.substring( 4, 6 ), 10 ),
        year = parseInt( date.substring( 6, 10 ), 10 );

    return {
        'month': month,
        'day': day,
        'year': year
    }
}
