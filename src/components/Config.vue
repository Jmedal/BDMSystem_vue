<template>
  <div>
    <el-row :gutter="20" style="height:250px; background-color: white; border-radius: 3px; box-shadow: 0 0 10px #ddd;">
      <el-col :span="1" style="height: 1px">
      </el-col>
      <el-col :span="20">
        <el-steps :active="active" finish-status="success">
          <el-step title="大一"></el-step>
          <el-step title="大二"></el-step>
          <el-step title="大三"></el-step>
          <el-step title="大四"></el-step>
          <el-step :title="msg[i]"></el-step>
        </el-steps>
        <el-button style="margin-top: 20px; float: left;" @click="next">升学</el-button>
      </el-col>
      <el-col :span="1" style="height: 1px">
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'config',
    data () {
      return {
        msg: ['毕业', '退学'],
        i: 0,
        active: 0
      }
    },
    mounted () {
    },
    methods: {
      next () {
        if (this.active++ > 4){
          this.active = 0
          this.i = 0
        }
        if (this.active === 5) this.i = 1
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
</style>
