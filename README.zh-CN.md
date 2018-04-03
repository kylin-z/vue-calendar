# calendar

 基于vue2.0的轻量展示型日历组件,支持自定义内容
 
 ![](http://7xrqm7.com1.z0.glb.clouddn.com/readme-vue-calendar-example-1.png?imageView2/1/w/1200/h/800/q/100)

## Install

```bash
$ npm install himmas-vue-calendar

```

## Usage

### 全局注册

```js
//main.js
import Vue from 'vue'
import App from './App.vue'
//...

import Calendar from 'himmas-vue-calendar'
Vue.use(Calendar)

//...

new Vue({
  el: '#app',
  render: h => h(App)
})

```

```html
<!--app.vue-->
<template>
  <div id="app">
    <!--全局引入需要加上kl前缀-->
    <kl-calendar height="800px" width="800px"/>
  </div>
</template>

<script>

  export default {
    name: 'App',
    methods: {
      renderMonthChange(year, month) {
        console.log(year, month);
      },
      beforeRender(year,month,next){
        console.log(year, month);
        next()
      }
    }
  }
</script>

```

### 局部注册

```html
<!--app.vue-->
<template>
  <div id="app">
    <calendar height="800px" width="800px"/>
  </div>
</template>

<script>
  import Calendar from 'himmas-vue-calendar'
  export default {
    name: 'App',
    components:{Calendar}
  }
</script>

```

## Attributes

|参数|说明|类型|可选值|默认值|
|---|---|---|---|---|
| width|宽度|String|-|100%|
| height|高度|String|-|100%|
| border|是否开启纵向边框|Boolean|true/false|true|
| default-date|默认渲染日期|Date,String|能被new Date()解析的|new Date()|
| show-lunar|是否渲染农历(若定义了render-content则该属性不起作用)|Boolean|true/false|true|
| show-festival|是否渲染节日(若定义了render-content则该属性不起作用)|Boolean|true/false|true|
| show-term|是否渲染节气(若定义了render-content则该属性不起作用)|Boolean|true/false|true|
|week-count|每月显示的行的数量|Number|-|6|
|week-title-align|头部对其|String|left/right/center|right|
|week-title|头部展示的内容| Array<String> |-|['周日', '周一', '周二', '周三', '周四', '周五', '周六']|
|render-content|每日内容的自定义渲染函数|Function(h,date) h 为vue中的渲染函数，支持jsx，date为当日数据对象，具体字段参考下文|-||
| show-title|是否渲染标题栏|Boolean|true/false|true|
| show-control-btn|是否渲染右侧控制按钮组(若定义了render-title则该属性不起作用)|Boolean|true/false|true|
|render-title|标题栏的自定义渲染函数|Function(h,year,month)|-||
|before-render|渲染前的回调|Function(year,month,next)|-||

## Events

| 事件名	| 说明 | 参数 |
|---|---|---|
| year-change  | 当前渲染的年份变化时会触发该事件  |  year,month |
| month-change  | 当前渲染的月份变化时会触发该事件  |  year,month |
| date-click  | 点击某个日期格子时会触发该事件  |  date |

## Methods
| 函数名	| 说明 | 参数 |
|---|---|---|
|renderThisMonth|强制渲染某个月|year, month|
|getRenderedMonth|获取当前渲染的月份信息||

## date

`render-content`中的第二个参数date，包含以下字段

| 事件名	| 说明  |
|---|---|
| date  | Date对象  | 
| year  | 年  | 
| month  | 月  | 
| day  | 日  | 
| weekDay  | 周几(0-6)  | 
| lunar  | 农历数据 | 
| festival  | 节日 | 
| term  | 节气 | 
| isToday  | 是否为今天 | 
| isWeekend  | 是否为周末 | 
| isOtherMonthDay  | 是否属于当前渲染月份 | 
| renderYear  | 当前渲染年份 | 
| renderMonth  | 当前渲染月份 | 
| isDefaultDate  | 是否是默认日期 | 


## example

- [默认渲染](http://kylin.himmas.cc/vue-calendar/example/index.html)
- [自定义渲染案例](http://kylin.himmas.cc/vue-calendar/example/demo.html)
  
  代码如下
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
  </head>
  <style>
    .date-box {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    .first-info{
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
    }
    .second-info{
      flex: 1;
      display: flex;
      justify-content: center;
      color: #999;
      font-size: 12px;
    }
    .second-info.festival{
      color: #f43;
    }
    .sign{
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      background: #f43;
      width: 20px;
      height: 20px;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }
    .date-box.today{
      background: #fb0;
      color: #fff;
    }
    .date-box.today .second-info{
      color: #fff;
    }
    .weekend{
      background: #f6f8fa;
    }
    .holiday .sign{
      display: block;
    }
    .date-box.other-month .second-info,.date-box.other-month .first-info{
      color: #999;
    }
    .date-box:hover{
      border: 3px solid #fb0;
    }
    .title-box{
      font-size: 20px;
    }
  </style>
  <body>
  <script src="./lib/vue.min.js"></script>
  <script src="../dist/vue-calendar.js"></script>
  <div id="app">
    <kl-calendar width="600px" height="500px"
                 :render-content="renderContent"
                 :week-title="weekTitle"
                 :border="false"
                 :before-render="beforeRender"
                 @year-change="changeHandle"
                 @month-change="changeHandle"
                 :render-title="renderTitle"
  
    />
  </div>
  <script>
  
    Vue.use(Calendar)
  
    new Vue({
      el: '#app',
      data() {
        return {
          weekTitle: ['日', '一', '二', '三', '四', '五', '六'],
          holiday: [
            '2018-01-01',
            '2018-02-15',
            '2018-02-16',
            '2018-02-17',
            '2018-02-18',
            '2018-02-19',
            '2018-02-20',
            '2018-02-21',
          ]
        }
      },
      methods: {
        twoDigit:function(num){ return ('000'+num).slice(-2) },
        renderTitle(h,year,month){
          return h('div', {
            class: {
              'title-box': true
            }
          },[
            h('span',{},year+'年'),
            h('span',{},month+'月')
          ])
        },
        renderContent(h, data) {
          var {isToday,isWeekend,isOtherMonthDay, year, day, month, renderYear, renderMonth, lunar, weekDay, festival, term} = data
  
          // lunar对象中存有农历数据
          var {lunarDayChiness} = lunar
  
          //第二行展示的数据的优先级为 节日>节气>农历日
          var secondInfo = festival ?
            festival : (term ? term : (lunarDayChiness || ''))
  
          var dateStr = `${year}-${this.twoDigit(month)}-${this.twoDigit(day)}`
  
          var isHoliday = (!!~this.holiday.indexOf(dateStr)) || isWeekend
  
          return h('div', {
            class: {
              'date-box': true,
              'today':isToday,
              'weekend':isWeekend,
              'holiday':isHoliday,
              'other-month':isOtherMonthDay
            }
          }, [h('div',{
            class: {
              'first-info': true
            }
          },day),h('div',{
            class: {
              'second-info': true,
              'festival':festival
            }
          },secondInfo),h('div',{
            class: {
              'sign': true
            }
          },'休')])
        },
        beforeRender(year,month,next){
          console.log('before-render',year,month)
          next()
        },
        changeHandle(year,month){
          console.log('change',year,month)
        }
      }
    })
  </script>
  </body>
  </html>


  ```

## tips

- 由于使用了flex布局，在IE9及以下版本的浏览器中会渲染失常
- 最低支持到vue.js v2.1.5


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
