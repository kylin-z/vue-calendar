<template>
  <div class="kl-calendar" :style="{width,height}">
    <div class="kl-calendar_title-bar">
      <div class="kl-calendar_render-info">
        <span class="kl-calendar_year">{{renderYear}}年</span>
        <span class="kl-calendar_month">{{renderMonth}}月</span>
      </div>
      <div class="kl-calendar_tool">
        <div class="kl-calendar_tool-btn" @click="turn(-12)"><<</div>
        <div class="kl-calendar_tool-btn" @click="turn(-1)"><</div>
        <div class="kl-calendar_tool-btn" @click="turnNow">本月</div>
        <div class="kl-calendar_tool-btn" @click="turn(1)">></div>
        <div class="kl-calendar_tool-btn" @click="turn(12)">>></div>
      </div>
    </div>
    <div class="kl-calendar_body">
      <div class="kl-calendar_body-week-title">

        <div class="kl-calendar_body-week-title-item"
             v-for="weekDay in weekTitle"
        >{{weekDay}}
        </div>
      </div>
      <slot></slot>
      <div class="kl-calendar_body-week" v-for="week in weekCount">
        <div class="kl-calendar_body-day" v-for="day in 7">
          <Item :source="currentDate(week,day)"></Item>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import ChineseCalendar from './js/ChineseCalendar'
  import Item from './Item'

  export default {
    name: "KlCalendar",
    components: {Item},
    props: {
      width: {
        type:String,
        default:'100%'
      },
      height: {
        type:String,
        default:'100%'
      },
      weekCount: {
        type: Number,
        default: 5
      },
      weekTitle: {
        type: Array,
        default: () => {
          return ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        }
      },
      renderContent: {
        type: Function,
        default: (h, data) => {

          var {date, year, month, day, weekDay, lunar, festival, term, renderMonth} = data

          //是否是周末
          var isWeekend = weekDay == 0 || weekDay == 6

          //是否是当前渲染月份中的日子
          var isOtherMonthDay = month !== renderMonth

          //是否是初一
          var isChuYi = lunar.lunarDay == 1

          //是否为今天
          var todayDate = new Date()
          var isToday = (date.getFullYear() === todayDate.getFullYear()) && (date.getMonth() === todayDate.getMonth()) && (date.getDate() === todayDate.getDate())

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
              <span class={lunarClassName}>{lunarStr}</span>
              <span class="kl-calendar_day-info-date">{$date}日</span>
            </p>
            {$festival}
            {$term}
          </div>)
        }
      },
      beforeRender: Function
    },
    created() {
      this.render(this.renderYear, this.renderMonth)
    },
    data() {
      var date = new Date()
      return {
        renderYear: date.getFullYear(),
        renderMonth: date.getMonth() + 1,
        currentMonthDays: []
      }
    },
    methods: {
      render(year, month, weekCount = this.weekCount) {
        var result = this.monthDetail(year, month, weekCount);
        var beforeRender = this.beforeRender

        //重新绑定数据->渲染
        var setInfo = ()=>{
          this.currentMonthDays = result;
          this.renderYear = year;
          this.renderMonth = month;
        }

        //如果有beforeRender回调
        if (beforeRender && (typeof beforeRender === 'function'))
          beforeRender(year,month,setInfo)
        else setInfo()
      },
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

        for (let i = 0, cursor = firstDate; i < weekCount * 7; i++) {

          let day = cursor.getDate();
          let thisDate = new Date(cursor)

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
            //当前面板渲染的年、月
            renderYear: year,
            renderMonth: month
          });

          cursor.setDate(day + 1);
        }

        return monthDays
      },
      currentDate(week, day) {
        var index = (week - 1) * 7 + day - 1;
        return this.currentMonthDays[index];
      },
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
      turnNow() {
        var date = new Date();
        //获取要渲染的年份、月份
        var toRenderYear = date.getFullYear();
        var toRenderMonth = date.getMonth() + 1;
        //渲染
        this.render(toRenderYear, toRenderMonth);
      }
    },
    watch:{
      renderYear(year,oldYear){
        this.$emit('year-change',year,this.renderMonth)
      },
      renderMonth(month,oldMonth){
        this.$emit('month-change',this.renderYear,month)
      }
    }
  }
</script>

<style lang="scss">
  @import "./css/styles";
</style>
