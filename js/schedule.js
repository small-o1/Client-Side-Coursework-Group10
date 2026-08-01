$(function () {

    var CLOSED = {
        '2026-07-12': 'Bank Holiday',
        '2026-07-13': 'Bank Holiday',
        '2026-08-25': 'Bank Holiday',
        '2026-12-25': 'Christmas Day',
        '2026-12-26': 'Boxing Day',
        '2027-01-01': "New Year's Day"
    };
    var LIMITED = {
        '2026-09-12': 'Maintenance'
    };

    var MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
    var DAY_NAMES = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

    var now = new Date();
    var curYear  = now.getFullYear();
    var curMonth = now.getMonth();

    function pad(n) { return String(n).padStart(2, '0'); }
    function key(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }

    function renderCalendar(year, month) {
        $('#cal-title').text(MONTHS[month] + ' ' + year);

        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var rawFirst    = new Date(year, month, 1).getDay();
        var firstDay    = (rawFirst + 6) % 7;

        var today = new Date();
        var html  = '<div class="cal-header-row">';
        DAY_NAMES.forEach(function (d) { html += '<div class="cal-hcell">' + d + '</div>'; });
        html += '</div><div class="cal-body-grid">';

        for (var i = 0; i < firstDay; i++) { html += '<div class="cal-cell cal-empty"></div>'; }

        for (var day = 1; day <= daysInMonth; day++) {
            var k        = key(year, month, day);
            var isToday  = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            var todayCls = isToday ? ' cal-today' : '';

            if (CLOSED[k]) {
                html += '<div class="cal-cell cal-closed' + todayCls + '">'
                      + '<span class="cal-num">' + day + '</span>'
                      + '<span class="cal-tag tag-closed">Closed</span>'
                      + '<span class="cal-reason">' + CLOSED[k] + '</span>'
                      + '</div>';
            } else if (LIMITED[k]) {
                html += '<div class="cal-cell cal-limited' + todayCls + '">'
                      + '<span class="cal-num">' + day + '</span>'
                      + '<span class="cal-tag tag-limited">Limited</span>'
                      + '<span class="cal-reason">' + LIMITED[k] + '</span>'
                      + '</div>';
            } else {
                html += '<div class="cal-cell cal-open' + todayCls + '">'
                      + '<span class="cal-num">' + day + '</span>'
                      + '<span class="cal-tag tag-open">8AM – Midnight</span>'
                      + '</div>';
            }
        }

        var total    = firstDay + daysInMonth;
        var trailing = (7 - (total % 7)) % 7;
        for (var j = 0; j < trailing; j++) { html += '<div class="cal-cell cal-empty"></div>'; }

        html += '</div>';
        $('#cal-grid').html(html);
    }

    $('#btn-list').on('click', function () {
        $(this).addClass('active');
        $('#btn-calendar').removeClass('active');
        $('#list-view').removeClass('hidden');
        $('#calendar-view').addClass('hidden');
    });

    $('#btn-calendar').on('click', function () {
        $(this).addClass('active');
        $('#btn-list').removeClass('active');
        $('#calendar-view').removeClass('hidden');
        $('#list-view').addClass('hidden');
        renderCalendar(curYear, curMonth);
    });

    $('#prev-month').on('click', function () {
        curMonth--;
        if (curMonth < 0) { curMonth = 11; curYear--; }
        renderCalendar(curYear, curMonth);
    });

    $('#next-month').on('click', function () {
        curMonth++;
        if (curMonth > 11) { curMonth = 0; curYear++; }
        renderCalendar(curYear, curMonth);
    });

});
