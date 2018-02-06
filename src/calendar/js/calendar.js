import tools from './tools'

export default function calendar(options) {

  var {el} = options;
  var $root = document.querySelector(el)

  $root.innerHTML = `<div class="cx-calendar">
    <div class="container">
      <div class="cx-calendar-render_month">
        <h2 class="title"></h2>
        <ul class="week">
          <li>周日</li>
          <li>周一</li>
          <li>周二</li>
          <li>周三</li>
          <li>周四</li>
          <li>周五</li>
          <li>周六</li>
        </ul>
        <ul class="day"></ul>
      </div>
      <div class="cx-calendar-control">
        <div class="btn btn-prev control-btn"><</div>
        <div class="today control-btn">此刻</div>
        <div class="btn btn-next control-btn">></div>
      </div>
    </div>
  </div>`

  var calendar = $root.querySelector('.cx-calendar')

  var detailMonth = calendar.querySelector('.cx-calendar-render_month')
  var detailMonth_title = detailMonth.querySelector('.title')
  var detailMonth_day = detailMonth.querySelector('.day')

  var tab_num = 0 // tab切换记录值
  var today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth()


  initalToday()


  // 初始化渲染日期
  function initalToday() {

    var _html = `<select class="cx-calendar-title_year">`

    for (let i = 1900; i < 2100; i++) {
      if (i == year)
        _html += `<option value="${i}" selected>${i}年</option>`
      else
        _html += `<option value="${i}">${i}年</option>`
    }


    _html += `</select>
      <select class="cx-calendar-title_month">`

    for (let i = 1; i <= 12; i++) {
      if (i == month + 1)
        _html += `<option value="${i}" selected>${i}月</option>`
      else
        _html += `<option value="${i}">${i}月</option>`
    }


    _html += `</select>`

    detailMonth_title.innerHTML = _html

    var $year = detailMonth_title.querySelector('.cx-calendar-title_year')
    var $month = detailMonth_title.querySelector('.cx-calendar-title_month')


    $year.onchange = $month.onchange = function () {
      var year = Number($year.value)
      var month = Number($month.value)
      tools.renderDetailMonth(detailMonth_day, year, month,options)
    }
    tools.renderDetailMonth(detailMonth_day, year, month,options)
    dateEvent()
  }

  function dateEvent() {

    var control = calendar.querySelector('.cx-calendar-control')
    var control_btnPrev = control.querySelector('.btn-prev')
    var control_today = control.querySelector('.today')
    var control_btnNext = control.querySelector('.btn-next')


    control_today.onclick = function () {
      year = today.getFullYear()
      month = today.getMonth()

      initalToday()
    }

    control_btnPrev.onclick = function () {
      if (tab_num == 0) {
        if (month == 0) {
          year--
          month = 11
        } else {
          month--
        }

        tools.renderDetailMonth(detailMonth_day, year, month,options)
      } else {
        year--
      }

      initalToday()
    }

    control_btnNext.onclick = function () {
      if (tab_num == 0) {
        if (month == 11) {
          year++
          month = 0
        } else {
          month++
        }
      } else {
        year++
      }

      initalToday()
    }

  }
}
