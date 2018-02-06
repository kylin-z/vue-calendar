import Calendar from './Index'

Calendar.install = function (Vue) {
  Vue.component(Calendar.name, Calendar)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Calendar);
}
//TODO:给npm包添加信息和关键字、文档、博客
export default Calendar
