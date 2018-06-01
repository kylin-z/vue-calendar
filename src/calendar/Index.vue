<template>
  <div class="kl-calendar" :style="{width,height}">
    <title-bar :year="renderYear" :month="renderMonth" v-if="showTitle"></title-bar>
    <div class="kl-calendar_body">
      <div class="kl-calendar_body-week-title">

        <div class="kl-calendar_body-week-title-item"
             v-for="weekDay in weekTitle"
             :style="{textAlign:weekTitleAlign}"
        >{{weekDay}}
        </div>
      </div>
      <slot></slot>
      <div class="kl-calendar_body-week"
           :class="{'no-left-border':!border}"
           v-for="week in weekCount">
        <div class="kl-calendar_body-day"
             :class="{'no-right-border':!border}"
             v-for="day in 7"
             @click="dateClick(currentDate(week,day))"
        >
          <Item :source="currentDate(week,day)"></Item>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import ChineseCalendar from './js/ChineseCalendar'
  import Item from './Item'
  import TitleBar from './TitleBar'

  export default {
    name: "KlCalendar",
    components: {Item, TitleBar},
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '100%'
      },
      defaultDate: {
        type: [Date,String],
        default(){
          return new Date()
        }
      },
      //是否显示头部标题栏(年月日/按钮)
      showTitle: {
        type: Boolean,
        default: true
      },
      //是否显示控制按钮
      showControlBtn: {
        type: Boolean,
        default: true
      },
      renderTitle: {
        type: Function,
        default: function (h, year, month) {
          return (
            <div class="kl-calendar_title-bar">
              <div class="kl-calendar_render-info">
                <span class="kl-calendar_year">{year}年</span>
                <span class="kl-calendar_month">{month}月</span>
              </div>
              {this.showControlBtn ? <div class="kl-calendar_tool">
                <div class="kl-calendar_tool-btn" onClick={() => this.turn(-12)}>{'<<'}</div>
                <div class="kl-calendar_tool-btn" onClick={() => this.turn(-1)}>{'<'}</div>
                <div class="kl-calendar_tool-btn" onClick={() => this.turnNow()}>本月</div>
                <div class="kl-calendar_tool-btn" onClick={() => this.turn(1)}>{'>'}</div>
                <div class="kl-calendar_tool-btn" onClick={() => this.turn(12)}>{'>>'}</div>
              </div> : null}
            </div>)
        }
      },
      //是否渲染农历
      showLunar: {
        type: Boolean,
        default: true
      },
      //是否渲染节日
      showFestival: {
        type: Boolean,
        default: true
      },
      //是否渲染节气
      showTerm: {
        type: Boolean,
        default: true
      },
      weekTitleAlign: {
        type: String,
        default: 'right'
      },
      weekCount: {
        type: Number,
        default: 6
      },
      border: {
        type: Boolean,
        default: true
      },
      weekTitle: {
        type: Array,
        default: () => {
          return ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        }
      },
      renderContent: {
        type: Function,
        default: function (h, data) {

          var {isToday, isWeekend, isOtherMonthDay, date, year, month, day, weekDay, lunar, festival, term, renderMonth} = data

          //是否是初一
          var isChuYi = lunar.lunarDay == 1

          var boxClassName = `kl-calendar_day-box
          ${isWeekend ? 'kl-calendar_body-day-weekend' : ''}
          ${isOtherMonthDay ? 'kl-calendar_day-other-month-day' : ''} `

          var lunarClassName = `kl-calendar_day-info-lunar ${isChuYi ? 'kl-calendar_lunar-first' : ''}`

          //农历字符串
          var lunarStr = isChuYi ? (lunar.lunarMonthChiness + lunar.lunarDayChiness) : lunar.lunarDayChiness

          //节日、节气
          var $festival = festival ? (<p class="kl-calendar_day-festival">{festival}</p>) : null
          var $term = term ? (<p class="kl-calendar_day-term">{term}</p>) : null

          var $date = isToday ? (<span class="kl-calendar_day-today">{day}</span>) : (<span>{day}</span>)

          return (<div class={boxClassName}>
            <p class="kl-calendar_day-info">
              {this.showLunar ? (<span class={lunarClassName}>{lunarStr}</span>) : null}
              <span class="kl-calendar_day-info-date">{$date}日</span>
            </p>
            {this.showFestival ? $festival : null}
            {this.showTerm ? $term : null}
          </div>)
        }
      },
      beforeRender: Function
    },
    created() {
      this.render(this.renderYear, this.renderMonth)
    },
    data() {
      var date = new Date(this.defaultDate)
      return {
        renderYear: date.getFullYear(),
        renderMonth: date.getMonth() + 1,
        currentMonthDays: []
      }
    },
    methods: {
      dateClick(date) {
        this.$emit('date-click', date)
      },
      /**
       * 获取当前渲染的月份
       * @returns {{year: number | *, month: methods.renderMonth, days: methods.renderMonth}}
       */
      getRenderedMonth() {
        return {
          year: this.renderYear,
          month: this.renderMonth,
          days: this.currentMonthDays
        }
      },
      /**
       * 强制渲染某个月份
       * @param year
       * @param month
       */
      renderThisMonth(year, month) {
        this.render(year, month)
      },
      /**
       * 渲染
       * @param year
       * @param month
       * @param weekCount
       */
      render(year, month, weekCount = this.weekCount) {
        var result = this.monthDetail(year, month, weekCount);
        var beforeRender = this.beforeRender

        //重新绑定数据->渲染
        var setInfo = () => {
          this.currentMonthDays = result;
          this.renderYear = year;
          this.renderMonth = month;
        }

        //如果有beforeRender回调
        if (beforeRender && (typeof beforeRender === 'function'))
          beforeRender(year, month, setInfo)
        else setInfo()
      },
      /**
       * 计算该月需要渲染的日期信息
       * @param year
       * @param month
       * @param weekCount
       * @returns {Array}
       */
      monthDetail(year, month, weekCount) {

        //计算用的month为传入month - 1
        var monthToUse = month - 1;

        //构建该月第一天date对象
        var firstDate = new Date(year, monthToUse);

        //获取周几信息,0表示周日
        var weekDay = firstDate.getDay();

        //将date设置为该周的第一天
        firstDate.setDate(1 - weekDay);

        //该月要显示的所有日期对象数组,包括前后月补完
        var monthDays = []

        var todayDate = new Date()

        for (let i = 0, cursor = firstDate; i < weekCount * 7; i++) {

          let day = cursor.getDate();
          let thisDate = new Date(cursor)

          let isToday = (todayDate.getFullYear() == thisDate.getFullYear()) &&
            (todayDate.getMonth() == thisDate.getMonth()) &&
            (todayDate.getDate() == thisDate.getDate())

          var defaultDate = new Date(this.defaultDate)
          let isDefaultDate = (defaultDate.getFullYear() == defaultDate.getFullYear()) &&
            (defaultDate.getMonth() == defaultDate.getMonth()) &&
            (defaultDate.getDate() == defaultDate.getDate())

          monthDays.push({
            //当前日期信息
            date: thisDate,
            year: thisDate.getFullYear(),
            month: thisDate.getMonth() + 1,
            day: thisDate.getDate(),
            weekDay: thisDate.getDay(),
            lunar: ChineseCalendar.date2lunar(thisDate),//农历
            festival: ChineseCalendar.lunarFestival(thisDate),//节日
            term: ChineseCalendar.lunarTerm(thisDate),//节气
            isToday,
            //是否是默认的那天
            isDefaultDate,
            //是否是周末
            isWeekend: thisDate.getDay() == 0 || thisDate.getDay() == 6,

            //是否是当前渲染月份中的日子
            isOtherMonthDay: thisDate.getMonth() + 1 !== month,
            //当前面板渲染的年、月
            renderYear: year,
            renderMonth: month
          });

          cursor.setDate(day + 1);
        }

        return monthDays
      },
      /**
       * 从当前渲染的月份中根据第几周，第几天获取日期数据
       * @param week
       * @param day
       * @returns {*}
       */
      currentDate(week, day) {
        var index = (week - 1) * 7 + day - 1;
        return this.currentMonthDays[index];
      },
      /**
       * 向后跳转几月，负数则是向前
       * @param step
       */
      turn(step) {
        var year = this.renderYear, month = this.renderMonth - 1;
        var date = new Date(year, month);
        date.setMonth(date.getMonth() + step);

        //获取要渲染的年份、月份
        var toRenderYear = date.getFullYear();
        var toRenderMonth = date.getMonth() + 1;
        //渲染
        this.render(toRenderYear, toRenderMonth);
      },
      /**
       * 跳转到当前月
       */
      turnNow() {
        var date = new Date();
        //获取要渲染的年份、月份
        var toRenderYear = date.getFullYear();
        var toRenderMonth = date.getMonth() + 1;
        //渲染
        this.render(toRenderYear, toRenderMonth);
      }
    },
    watch: {
      renderYear(year, oldYear) {
        this.$emit('year-change', year, this.renderMonth)
      },
      renderMonth(month, oldMonth) {
        this.$emit('month-change', this.renderYear, month)
      },
      defaultDate(date) {
        var date = new Date(date)

        var year = date.getFullYear()
        var month = date.getMonth() + 1

        this.render(year, month)
      }
    }
  }
</script>

<style lang="scss">
  @import "./css/styles";
</style>
