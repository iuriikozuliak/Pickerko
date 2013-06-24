function Pickerko(container, options) {
    this.model = new pickerko.Model();
    this.view = new pickerko.View(this.model);
    this.controller = new pickerko.Controller(container, this.view, this.model, options);

    this.controller._init();
}

Pickerko.prototype.getRange = function () {
    return this.controller.getRangeString();
}

Pickerko.prototype.setDate = function (startDate, endDate) {
    this.controller.setDate(startDate, endDate);
}