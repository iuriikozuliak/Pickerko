'use strict';

function Model() {
    this.data = {
        calendars:[]
    };
}

/**
 * Creates a new calendar model
 */
Model.prototype.create = function (title, days) {
    title = title || '';

    var newItem = {
        title:title.trim(),
        days:days
    };

    this.data.push(newItem);
};

Model.prototype.generateDays = function () {


};
