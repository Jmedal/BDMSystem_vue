<template>
  <div class="NoFound_container" :style="NoFound_container">
    <div class="head404"></div>
    <div class="txtbg404">
      <div class="txtbox">
        <p>对不起，您无权访问该页面，或该页面不存在</p>
        <p class="paddingbox">请点击以下链接继续浏览网页</p>
        <p>》<a style="cursor:pointer" onclick="history.back()">返回上一页面</a></p>
        <p>》<a href="http://localhost:8080/">返回网站首页</a></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageNoFound',
    data () {
      return {
        NoFound_container:{
          height: document.documentElement.clientHeight + 'px'
        }
      }
    },
    methods: {
    }
  }
</script>

<style lang="less" scoped>
  .NoFound_container {
    background-color: #494949;
  }

  .head404 {
    width: 580px;
    height: 234px;
    margin: 0px auto 0 auto;
    background: url(https://www.daixiaorui.com/Public/images/head404.png) no-repeat;
  }

  .txtbg404 {
    width: 499px;
    height: 169px;
    margin: 0px auto 0 auto;
    background: url(https://www.daixiaorui.com/Public/images/txtbg404.png) no-repeat;
  }

  .txtbg404 .txtbox {
    width: 390px;
    position: relative;
    top: 30px;
    left: 60px;
    color: #eee;
    font-size: 13px;
  }

  .txtbg404 .txtbox p {
    margin: 5px 0;
    line-height: 18px;
  }

  .txtbg404 .txtbox .paddingbox {
    padding-top: 5px;
  }

  .txtbg404 .txtbox p a {
    color: #eee;
    text-decoration: none;
  }

  .txtbg404 .txtbox p a:hover {
    color: #FC9D1D;
    text-decoration: underline;
  }
</style>
