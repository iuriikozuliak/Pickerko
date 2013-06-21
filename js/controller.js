'use strict';

/**
 * Takes a model and view and acts as the controller between them
 *
 * @constructor
 * @param {object} model The model constructor
 * @param {object} view The view constructor
 */
function Controller(container, view, model, options) {

    this.container = container;

    this.view = view;
    this.model = model;

    this.today = moment().startOf('day');
    this.options = extend(this.defaults, options);

    this.range = {
        startDate   :  moment().startOf('day'),
        endDate     :  moment().startOf('day').add('day', 2)
    }

}

Controller.prototype = {

    defaults:{
        startIn:1
    },

    _init:function () {

        this.model.create(0,'left-one', this._getDays(this.today.day(), this.today.month(), this.today.year()));

        this.showCalendar(0);

        this._initEvents();

    },

    _initEvents:function () {
        var nextMonthBtn = this.container.querySelector('.next'),
            prevMonthBtn = this.container.querySelector('.prev'),
            self = this;

        nextMonthBtn.addEventListener('click', function () {

            self.today = self.today.add('months', 1)

            self.updateCalendar();
        });

        prevMonthBtn.addEventListener('click', function () {

            self.today = self.today.subtract('months', 1)

            self.updateCalendar();
        })

        $('.available').each(function (ev) {
            ev.addEventListener('click', function () {

                var clickedDate = moment(parseInt(ev.getAttribute('data-date')));

                if (clickedDate.isBefore(self.range.endDate))
                    self.range.startDate = clickedDate;
                else {
                    self.range.startDate = self.range.endDate;
                    self.range.endDate = clickedDate;
                }


                self.updateCalendar();
            })

            ev.addEventListener('contextmenu', function (e) {

                var clickedDate = moment(parseInt(ev.getAttribute('data-date')));

                if (!clickedDate.isBefore(self.range.startDate))
                    self.range.endDate = clickedDate;
                else {
                    self.range.endDate = self.range.startDate;
                    self.range.startDate = clickedDate;
                }

                self.updateCalendar();

                e.preventDefault();
            })
        })

    },

    showCalendar:function (id) {

        this.container.innerHTML =  this.view.render(this.model.getItem(0));
    },

    updateCalendar:function () {

        var calendar = {
            days : this._getDays(this.today.day(), this.today.month(), this.today.year())
        }

        this.model.update(0, calendar);

        this.container.innerHTML =  this.view.render(this.model.getItem(0));

        this._initEvents();
    }
},


    Controller.prototype._getDays = function (day, month, year) {

        var firstDay = moment([year, month, 1]);
        var lastMonth = moment(firstDay).subtract('month', 1).month();
        var lastYear = moment(firstDay).subtract('month', 1).year();

        var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

        var dayOfWeek = firstDay.day();

        var calendar = [];
        for (var i = 0; i < 6; i++) {
            calendar[i] = [];
        }

        var startDay = daysInLastMonth - dayOfWeek + this.options.startIn + 1;
        if (startDay > daysInLastMonth)
            startDay -= 7;

        if (dayOfWeek == this.options.startIn)
            startDay = daysInLastMonth - 6;

        var curDate,
            minDate = 0,
            maxDate = 0;

        curDate = moment([lastYear, lastMonth, startDay]).startOf('day');

        for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('day', 1)) {

            if (i > 0 && col % 7 == 0) {
                col = 0;
                row++;
            }

            var cname = 'available ';

            if ((minDate && curDate.isBefore(minDate)) || (maxDate && curDate.isAfter(maxDate))) {
                cname = ' off disabled ';
            } else if (curDate.isSame(minDate)) {
                cname += ' active ';
                if (curDate.isSame(this.range.startDate)) {
                    cname += ' start ';
                }
                if (curDate.isSame(this.range.endDate)) {
                    cname += ' end ';
                }
            } else if (curDate >= this.range.startDate && curDate <= this.range.endDate) {
                cname += ' range ';
                if (curDate.isSame(this.range.startDate)) {
                    cname += ' start ';
                }
                if (curDate.isSame(this.range.endDate)) {
                    cname += ' end ';
                }
            }

            calendar[row][col] =
            {
                date:curDate,
                class:cname
            }
        }


        return calendar;

    };
