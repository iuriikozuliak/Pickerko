(function (window) {

    'use strict';

    function Model() {
        this.data = {
            calendars:[]
        };
    }

    /**
     * Creates a new calendar model
     */
    Model.prototype.create = function (id, title, days) {
        title = title || '';

        var newItem = {
            id:id,
            title:title,
            days:days
        };

        this.data.calendars.push(newItem);
    };

    Model.prototype.getItem = function (id) {

        return this.data.calendars[id];
    };

    Model.prototype.getCount = function () {

        return this.data.calendars.length;
    };


    Model.prototype.update = function (id, data) {

        var calendars = this.data.calendars;

        for (var i = 0; i < calendars.length; i++) {
            if (calendars[i].id == id) {
                for (var x in data) {
                    calendars[i][x] = data[x];
                }
            }
        }
    }
    window.pickerko.Model = Model;
})(window);
