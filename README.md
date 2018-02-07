# calendar

 基于vue2.0的轻量展示型日历组件
 
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
| width|宽度|String| - |'100%'|
| height|高度|String| - |'100%'|
|weekCount|每月显示的行的数量|Number|-|5|
|weekTitle|头部展示的内容|Array<String>|-|['周日', '周一', '周二', '周三', '周四', '周五', '周六']|
|renderContent|每日内容的自定义渲染函数|Function(h,date)|-||
|beforeRender|渲染前的回调|Function(year,month,next)|-|-|

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
