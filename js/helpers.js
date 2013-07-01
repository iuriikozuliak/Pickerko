'use strict';


function extendObject(a, b) {
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
