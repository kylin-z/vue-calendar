import ChineseCalendar from './ChineseCalendar'

var tools = (function () {
  var toolsObj = {

    // 月份详情
    renderDetailMonth: function (dayWrapper, recivedYear, recivedMonth,options) {
      var array = []
      var recivedDate = new Date()
      var _html = ``

      var date = new Date(recivedYear, recivedMonth, 1)
      date.setDate(1)
      var week = date.getDay()
      date.setDate(1 - week)
      var month = date.getMonth()
      var year = date.getFullYear()

      for (var i = 0; i < 42; i++) {
        if (month !== recivedMonth) {
          if (date.getDay() === 0 || date.getDay() === 6) {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: 'weekend',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          } else {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: '',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          }
        } else if(tools.curDay(date, recivedDate)) {
          if (date.getDay() === 0 || date.getDay() === 6) {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: 'weekend cur-day',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          } else {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: 'cur-day',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          }
        } else {
          if (date.getDay() === 0 || date.getDay() === 6) {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: 'weekend cur-month',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          } else {
            array.push({
              date,
              year,
              month:month+1,
              week,
              day: date.getDate(),
              lunar: ChineseCalendar.lunarTime(date),
              state: 'cur-month',
              festival: ChineseCalendar.lunarFestival(date),
              term: ChineseCalendar.lunarTerm(date),
              dateStr: tools.returnDateStr(date)
            })
          }
        }

        date.setDate(date.getDate() + 1)
        month = date.getMonth()
      }

      var week_count = Math.ceil(array.length/7)

      for (let w = 0;w<week_count;w++){
        _html+= `<li class="cx-calendar-week"><ul>`

        for (let j = w*7; j < w*7+7; j++) {
          var festival_state = array[j].festival ? 'festival show' : 'festival'
          var term_state = array[j].term ? 'term show' : 'term'
          var first_lunarday = array[j].lunar == '初一' ?
            ChineseCalendar.date2lunar(date).lunarMonthChiness + array[j].lunar:
            array[j].lunar

          if (array[j].lunar == '初一') {
            if (ChineseCalendar.date2lunar(date).lunarMonthChiness == '正月') {
              var lunar_state = 'lunar first-lunarJanuary'
            } else {
              var lunar_state = 'lunar first-lunarday'
            }
          } else {
            var lunar_state = 'lunar'
          }

          array[j] = {
            ...array[j],
            lunar_state,
            first_lunarday,
            festival_state,
            term_state
          }


          var {renderContent} = options


          if(renderContent && (typeof renderContent === 'function'))
            _html += `<li data-time="${array[j].dateStr}" class="${array[j].state} cx-calendar-day">${renderContent(array[j])}</li>`

          else _html += `<li data-time="${array[j].dateStr}" class="${array[j].state} cx-calendar-day">
                    <p class="info">
                      <span class="${lunar_state}">${first_lunarday}</span>
                      <span class="date"><em>${array[j].day}</em>日</span>
                    </p>
                    <p class="${festival_state}">${array[j].festival}</p>
                    <p class="${term_state}">${array[j].term}</p>
                  </li>`

        }
        _html+= `</ul></li>`
      }

      dayWrapper.innerHTML = _html
    },
    returnDateStr: function (date) {
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();

      month = month <= 9 ? ('0' + month) : ('' + month);
      day = day <= 9 ? ('0' + day) : ('' + day);

      return year + month + day;
    },

    // 是否是当天
    curDay: function (oldTime, nowTime) {
      return oldTime.getFullYear() === nowTime.getFullYear() &&
        oldTime.getMonth() === nowTime.getMonth() &&
        oldTime.getDate() === nowTime.getDate()
    }
  }
  return toolsObj

}())

export default tools
