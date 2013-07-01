(function (window) {
    'use strict';

    function Controller(container, view, model, options) {

        this.container = container;

        this.view = view;
        this.model = model;
        this.id = this.model.getCount();
        this.today = moment().startOf('day');

        this.defaultsSwap = new this._defaults;
        this.options = extendObject(this.defaultsSwap, options);

        this.clickCount = 0;

        if (this.options.targetInput)
            this.targetInput = document.getElementById(this.options.targetInput);

        this.range = {
            startDate:moment(this.options.startDate, "DD-MM-YYYY"),
            endDate:moment(this.options.endDate || this.options.startDate, "DD-MM-YYYY")
        }
    }

    Controller.prototype = {

        _defaults:function () {
            return {
                startIn:1,
                rangePicker:false,
                rangeClickMode:'left-right',
                startDate:moment().startOf('day')
            }
        },

        _init:function () {

            var self = this;


            this.model
                .create(
                this.id,
                this.today.format('MMMM'),
                this._getDays(this.today.day(), this.today.month(), this.today.year())
            );

            if (this.container.type) {
                this.targetInput = this.container;
                this.container = this.container.parentNode;

                this.targetInput.addEventListener('focus', function () {
                    self.container.className += " open";
                })

                document.addEventListener('click', function (e) {
                    var target = (e && e.target);
                    if ((target != self.container) && (target.parentNode != self.container) && (target != self.calendar)) {
                       self.container.className = self.container.className.replace(/(?:^|\s)open(?!\S)/g, '');;
                    }
                })

                this.container.addEventListener('click', function (e) {
                    e.stopPropagation();
                })
            }


            this.showCalendar(this.id);

            this._initEvents();


        },

        _initEvents:function () {
            var nextMonthBtn = this.container.querySelector('.next'),
                prevMonthBtn = this.container.querySelector('.prev'),
                self = this;

            nextMonthBtn.addEventListener('click', function () {

                self.today = self.today.add('months', 1)

                self._updateCalendar();
            });

            prevMonthBtn.addEventListener('click', function () {

                self.today = self.today.subtract('months', 1)

                self._updateCalendar();
            });

            [].forEach.call(
                this.calendar.querySelectorAll('.available'),
                function(ev){
                    ev.addEventListener('click', function () {

                            var clickedDate = moment(parseInt(ev.getAttribute('data-date')));

                            if (self.options.rangePicker)
                                if (self.options.rangeClickMode == 'left-left' && self.clickCount % 2 != 0) {
                                    if (!clickedDate.isBefore(self.range.startDate))
                                        self.range.endDate = clickedDate;
                                    else {
                                        self.range.endDate = self.range.startDate;
                                        self.range.startDate = clickedDate;
                                    }
                                }
                                else {
                                    if (clickedDate.isBefore(self.range.endDate))
                                        self.range.startDate = clickedDate;
                                    else {
                                        self.range.startDate = self.range.endDate;
                                        self.range.endDate = clickedDate;
                                    }
                                }
                            else
                                self.range.startDate = self.range.endDate = clickedDate;

                            self._updateCalendar();
                            self.clickCount++;
                }
            );

                if (self.options.rangePicker && self.options.rangeClickMode == 'left-right')
                    ev.addEventListener('contextmenu', function (e) {

                        var clickedDate = moment(parseInt(ev.getAttribute('data-date')));

                        if (!clickedDate.isBefore(self.range.startDate))
                            self.range.endDate = clickedDate;
                        else {
                            self.range.endDate = self.range.startDate;
                            self.range.startDate = clickedDate;
                        }

                        self._updateCalendar();

                        e.preventDefault();
                    })
            })

        },

        showCalendar:function (id) {
            this.calendar = document.createElement('div');
            this.calendar.className = "pickerko";

            if(this.container.className.match(new RegExp('(\\s|^)dropdown(\\s|$)')))
                this.calendar.className += " dropdown-menu";

            this.calendar.innerHTML = this.view.render(this.model.getItem(this.id))

            this.container.appendChild(this.calendar);
        },

        getRangeString:function () {

            if (this.options.rangePicker)
                return moment(this.range.startDate).format('DD/MM/YY') + ' - ' + moment(this.range.endDate).format('DD/MM/YY');
            else
                return moment(this.range.startDate).format('DD/MM/YY')

        },

        setDate:function(startDate, endDate){

            this.range.startDate = moment(startDate, "DD-MM-YYYY");
            this.range.endDate = moment(endDate, "DD-MM-YYYY");
            this.today = moment(startDate, "DD-MM-YYYY");

            this._updateCalendar();
        },

        _updateCalendar:function () {

            var calendar = {
                title:this.today.format('MMMM'),
                days:this._getDays(this.today.day(), this.today.month(), this.today.year())
            }

            this.model.update(this.id, calendar);

            this.calendar.innerHTML = this.view.render(this.model.getItem(this.id))

            this.container.appendChild(this.calendar);

            this._initEvents();

            if (this.targetInput)
                this.targetInput.value = this.getRangeString();

            this.options.onUpdate && this.options.onUpdate(this.getRangeString());

        },


        _getDays:function (day, month, year) {

            var firstDay = moment([year, month, 1]);
            var lastMonth = moment(firstDay).subtract('month', 1).month();
            var lastYear = moment(firstDay).subtract('month', 1).year();

            var daysInMonth = moment([year, month]).daysInMonth();
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

            var currentDate,
                minDate = 0,
                maxDate = 0;


            currentDate = moment([lastYear, lastMonth, startDay]).startOf('day');

            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, currentDate = moment(currentDate).add('day', 1)) {

                if (i > 0 && col % 7 == 0) {
                    col = 0;
                    row++;
                }

                var className = 'available ';
                if (currentDate.isBefore(firstDay) || i - (daysInLastMonth - startDay) > daysInMonth) {
                    className += ' off';
                }
                if (currentDate.isSame(minDate)) {
                    className += ' active ';
                    if (currentDate.isSame(this.range.startDate)) {
                        className += ' start ';
                    }
                    if (currentDate.isSame(this.range.endDate)) {
                        className += ' end ';
                    }
                } else if (currentDate >= this.range.startDate && currentDate <= this.range.endDate) {
                    className += ' range ';
                    if (currentDate.isSame(this.range.startDate)) {
                        className += ' start ';
                    }
                    if (currentDate.isSame(this.range.endDate)) {
                        className += ' end ';
                    }
                }

                calendar[row][col] =
                {
                    date:currentDate,
                    class:className
                }
            }


            return calendar;

        }
    }
    window.pickerko.Controller = Controller;

})(window);