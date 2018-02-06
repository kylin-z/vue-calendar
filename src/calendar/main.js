import Calendar from './Index'

var CalendarPlugins = {
  install: function (Vue) {
    Vue.component(Calendar.name, Calendar)
  },
  Calendar
}

if (typeof exports == "object") {
  module.exports = CalendarPlugins
// 支持 AMD
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return CalendarPlugins })
// Vue 是全局变量时，自动调用 Vue.use()
} else if (window.Vue) {
  window.CalendarPlugins = CalendarPlugins
  Vue.use(CalendarPlugins)
}

export default CalendarPlugins
