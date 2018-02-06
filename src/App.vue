<template>
  <div id="app">
    <kl-calendar height="800px" width="100%"
                 @month-change="renderMonthChange"
                 @year-change="renderMonthChange"
                 :before-render="beforeRender"

    />
  </div>
</template>

<script type="text/babel">

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
