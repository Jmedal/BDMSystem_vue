<template>
  <div>
    <el-carousel :interval="4000" type="card" height="550px">
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses1.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses2.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses3.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses4.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses5.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium"><img src="../assets/img/courses6.jpg" style="height:550px; width:100%;"></h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  export default {
    name: 'house',
    data () {
      return {
        img: '',
      }
    },
    mounted(){
      this.init()
    },
    methods: {
      init () {
        let path  = window.localStorage.getItem('save') === '1' ? window.localStorage.getItem('path') : window.sessionStorage.getItem('path')
        if (!path) return
        path = JSON.parse(Base64.decode(path))
        //多主页
        if(!path['/index/house']){
          if(path['/index/rl_house'])
            this.$router.push('/index/rl_house').catch(error => error)
        }
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
