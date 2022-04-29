<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{grandpa}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{parent}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入课程名称"
                    v-model="queryInfo.query"
                    @keyup.enter.native="handleSearchClick"
                    clearable
                    @clear="handleSearchClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClick"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 菜单列表区域 -->
      <el-table :data="page.page" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="40px"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="150px"></el-table-column>
        <el-table-column prop="class" label="类别" width="90px"></el-table-column>
        <el-table-column prop="difficulty" label="难度" width="50px"></el-table-column>
        <el-table-column prop="introduction" label="简介" width="150px"></el-table-column>
        <el-table-column prop="description" label="描述" width="250px"></el-table-column>
        <el-table-column prop="learnerNumber" label="学习人数" width="80px"></el-table-column>
        <el-table-column prop="path" label="路径" width="200px"></el-table-column>
        <el-table-column prop="duration" label="时长" width="100px"></el-table-column>
        <el-table-column prop="comprehensiveScore" label="综合评分" width="74px"></el-table-column>
        <el-table-column prop="utilityScore" label="内容实用" width="74px"></el-table-column>
        <el-table-column prop="conciseScore" label="简洁易懂" width="74px"></el-table-column>
        <el-table-column prop="logicScore" label="逻辑清晰" width="74px"></el-table-column>
        <el-table-column prop="evaluationNumber" label="评分人数" width="74px"></el-table-column>
        <el-table-column prop="url" label="链接" width="200px"></el-table-column>
        <el-table-column prop="parentUrl" label="上级连接" width="200px"></el-table-column>
        <el-table-column prop="downloadTime" label="数据爬取时间" width="150px"></el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[3, 8, 15, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'sys_menu',
    data () {
      return {
        //权限配置
        grandpa: '',
        parent: '',
        menuObject: {},
        rightMap: {},
        //请求数据
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 3,
        },
        //页面数据
        page: {
          pageNum: 0,
          pageSize: 0,
          page: [],
          total: 0,
        },
        loading: true,
      }
    },
    created () {
      this.init()
      this.getCourseList()
    },
    methods: {
      init () {
        this.grandpa = JSON.parse(Base64.decode(window.sessionStorage.getItem('grandpa')))
        this.parent = JSON.parse(Base64.decode(window.sessionStorage.getItem('parent')))
        let list = JSON.parse(Base64.decode(window.sessionStorage.getItem('children')))
        if (list === null) return
        list.forEach(item => {
          this.rightMap [item.id] = item
        })
      },

      getCourseList () {
        this.loading = true
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/GetCoursePage`, this.queryInfo).then(res => {
          if (res.data.code === 0) {
            this.page = res.data.data
            this.loading = false
          } else {
            this.$message.error('获取慕课网课程数据失败！')
          }
        })
      },

      handleSizeChange (newSize) {
        this.queryInfo.pageSize = newSize
        this.getCourseList()
      },

      handleCurrentChange (newSize) {
        this.queryInfo.pageNum = newSize
        this.getCourseList()
      },

      handleSearchClick () {
        this.queryInfo.pageNum = 1
        this.getCourseList()
      },
    },
  }
</script>

<style lang="less" scoped>
  .el-select {
    float: left;
  }
</style>
