'use strict';

/**
 * Takes a model and view and acts as the controller between them
 *
 * @constructor
 * @param {object} model The model constructor
 * @param {object} view The view constructor
 */
function Controller(container, view, options) {

    this.view = view;
    this.container = container;
    this.ENTER_KEY = 13;
    this.ESCAPE_KEY = 27;

    this.today = new Date(2013, 5, 17);
    this.startDate = this.today;
    this.endDate = new Date();
    this.endDate.setDate(this.today.getDate() + 5);


    this.options = extend(this.defaults, options);
    this._init();

}

Controller.prototype = {
    defaults:{
        weeks:[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ],
        weekabbrs:[ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
        months:[ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        monthabbrs:[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        // choose between values in options.weeks or options.weekabbrs
        displayWeekAbbr:false,
        // choose between values in options.months or options.monthabbrs
        displayMonthAbbr:false,
        // left most day in the calendar
        // 0 - Sunday, 1 - Monday, ... , 6 - Saturday
        startIn:1,
    }
},

    Controller.prototype._init = function () {
        this.month = ( isNaN(this.options.month) || this.options.month == null) ? this.today.getMonth() : this.options.month - 1;
        this.year = ( isNaN(this.options.year) || this.options.year == null) ? this.today.getFullYear() : this.options.year;
        this.caldata = this.options.caldata || {};
    },

    Controller.prototype.showCalendar = function (startDate) {
        startDate = parseDate(startDate);

        return this.view.render(this._getDays(startDate.day, startDate.month, startDate.year));
    }

Controller.prototype._getDays = function (day, month, year) {

    var d = new Date(this.year, month , 0),
        monthLength = d.getDate(),
        firstDay = new Date(this.year, month -1, 1);

    this.startingDay = firstDay.getDay();
    var rows = Array();
    var day = 1;
    for (var i = 0; i < 7; i++) {
        rows[i] = Array();
        for (var j = 0; j <= 6; j++) {

            var pos = this.startingDay - this.options.startIn,
                p = pos < 0 ? 6 + pos + 1 : pos,
                today = month === this.today.getMonth() && day === this.today.getDate();


            if (day <= monthLength && ( i > 0 || j >= p )) {

                console.log(day);

                var curDate = new Date(this.year, month, day),
                    dayClass = '';

                if (curDate.getTime() == this.today.getTime())
                    dayClass += "today";

                ++day;

                rows[i][j] =
                {
                    date:curDate,
                    class:dayClass
                }

            }
            else {
                rows[i][j] =
                {
                    date:'',
                    class:dayClass
                }
            }

        }

        if (day > monthLength) {
            break;
        }

    }
    return rows;

};
