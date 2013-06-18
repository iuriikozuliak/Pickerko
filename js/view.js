/*jshint laxbreak:true */
'use strict';

/**
 * Sets up defaults for all the View methods such as a global template
 *
 * @constructor
 */

function View() {
    this.globalTemplate
        = '<div class="pickerko dropdown-menu">'
        +   '<div class="calendars">'
        +       '{{calendars}}'
        +   '</div>'
        + '</li>';

    this.calendarTemplate
        = '<table>'
        +   '<thead>'
        +       '<tr>'
        +           '{{calendarHead}}'
        +       '</tr>'
        +   '</thead>'
        +   '<tbody>'
        +       '{{calendarDays}}'
        +       '</tbody>'
        + '</table>';

    this.rowTemplate
        = '<tr>'
        +   '{{dayTitle}}'
        + '</tr>';

}

View.prototype.render = function (data) {
    var i, j,
        daysLength = data.length ;

    var view = '',
        rowView = '',
        calendarView = '';

    var template = this.globalTemplate,
        calendar = this.calendarTemplate;

    for (i = 0; i < daysLength; i++) {
        var row = this.rowTemplate;

        for (j = 0; j < 7; j++) {

            if(typeof(data[i][j].date) != 'object'){
                rowView += '<td class="disabled"></td>';
            }
            else{
                var date = new Date(data[i][j].date);
                rowView += '<td class="'+ data[i][j].class +'" data-date='+  date.getTime() +'>' +  date.getDate()  + '</td>';
            }

        }

        row = row.replace('{{dayTitle}}', rowView);

        calendarView = calendarView + row;
        rowView = '';
    }

    calendar = calendar.replace('{{calendarHead}}', 'title')
    calendar = calendar.replace('{{calendarDays}}', calendarView)

    template = template.replace('{{calendars}}', calendar);

    view = view + template;

    return view;
};


