/*global Store, Model, View, Controller, $$ */
(function () {
	'use strict';

	function Pickerko(container) {
		this.view = new View(); 
		this.controller = new Controller(container, this.view);


        container.innerHTML = this.controller.showCalendar('17/01/2013');
    }

    var container = document.getElementById('pickerko');

	var todo = new Pickerko(container);

})();
