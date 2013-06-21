/*global Store, Model, View, Controller, $$ */
(function () {
	'use strict';

	function Pickerko(container) {
        this.model = new Model();
        this.view = new View(this.model);

		this.controller = new Controller(container, this.view, this.model, {startDate : '21/06/2013', endDate : '25/06/2013'});

        this.controller._init();

    }

    var container = document.getElementById('pickerko');

	var todo = new Pickerko(container);

})();
