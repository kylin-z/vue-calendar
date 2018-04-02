<template>
  <div id="app">
    <calendar height="800px" width="100%"
              ref="calendar"
              @month-change="renderMonthChange"
              @year-change="renderMonthChange"
              :before-render="beforeRender"
              @date-click="dateClick"
              :default-date="defaultDate"
    />
  </div>
</template>

<script type="text/babel">

  import Calendar from '../src/calendar/main'

  export default {
    name: 'App',
    components: {Calendar},
    data() {
      return {
        defaultDate:'2012-04-18'
      }
    },
    methods: {
      renderMonthChange(year, month) {
        console.log(year, month);
        var month = this.$refs.calendar.getRenderedMonth()
        console.log(month);
      },
      beforeRender(year, month, next) {
        console.log(year, month);
        next()
      },
      dateClick(date) {
        console.log(date);
      }
    }
  }
</script>
<style>
  body {
    background: #666;
  }
</style>
