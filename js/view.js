(function (window) {
    'use strict';

    function View(model) {
        this.globalTemplate
            = '<div class="calendars">'
            +   '{{calendars}}'
            + '</div>';

        this.calendarTemplate
            = '<table>'
            +   '<thead>'
            +       '<tr>'
            +           '<th colspan="2"><button class="btn prev"> < </button></th>'
            +           '<th colspan="3">{{calendarHead}}</th>'
            +           '<th colspan="2"><button class="btn next"> > </button></th>'
            +       '</tr>'
            +   '</thead>'
            +   '<tbody>'
            +       '{{calendarDays}}'
            +   '</tbody>'
            + '</table>';

        this.rowTemplate
            = '<tr>'
            +   '{{dayTitle}}'
            + '</tr>';

    }

    View.prototype.render = function (item) {


        var data = item.days;

        var i, j,
            daysLength = data.length;

        var view = '',
            rowView = '',
            calendarView = '';

        var template = this.globalTemplate,
            calendar = this.calendarTemplate;

        for (i = 0; i < daysLength; i++) {
            var row = this.rowTemplate;

            for (j = 0; j < 7; j++) {

                if (typeof(data[i][j].date) != 'object') {
                    rowView += '<td class="disabled"></td>';
                }
                else {
                    var date = new Date(data[i][j].date);
                    rowView += '<td class="' + data[i][j].class + '" data-date=' + date.getTime() + '>' + date.getDate() + '</td>';
                }
            }

            row = row.replace('{{dayTitle}}', rowView);

            calendarView = calendarView + row;
            rowView = '';
        }

        calendar = calendar.replace('{{calendarHead}}', item.title)
        calendar = calendar.replace('{{calendarDays}}', calendarView)

        template = template.replace('{{calendars}}', calendar);

        view = view + template;

        return view;
    }

    window.pickerko.View = View;
})(window);


