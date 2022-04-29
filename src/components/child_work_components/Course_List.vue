<template>
  <div class="course_container">
    <el-row :gutter="25">
      <el-col :span="4" style="border-right: 0;">
        <div class="course_data_title">
          <h3>课程排行榜一览</h3>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="25">
      <el-col :span="8">
        <div id="course_star_list_echart" class="course_list_box">
        </div>
        <el-button type="text" class="more_button" @click="handleClickStars" :loading="loadStars">more</el-button>
      </el-col>
      <el-col :span="8">
        <div id="course_click_list_echart" class="course_list_box">
        </div>
        <el-button type="text" class="more_button" @click="handleClickClick" :loading="loadClick">more</el-button>
      </el-col>
      <el-col :span="8">
        <div id="course_video_list_echart" class="course_list_box">
        </div>
        <el-button type="text" class="more_button" @click="handleClickVideo" :loading="loadVideo">more</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'course_list',
    data () {
      return {
        starsList: {
          courseName: [],
          number: []
        },
        loadStars: false,
        clickList: {
          courseName: [],
          number: []
        },
        loadClick: false,
        videoList: {
          courseName: [],
          number: []
        },
        loadVideo: false,
      }
    }, created () {
      this.init()
    },
    mounted () {
      this.courseStarsListEchart()
      this.courseClickListEchart()
      this.courseVideoListEchart()
    },
    methods: {
      //初始化
      init () {
        //课程综合评分
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseStarsRank`, {location: [1, 15]}).then(res => {
          if (res.data.code === 0) {
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.starsList = res.data.data
            this.courseStarsListEchart()
          }
        })

        //课程点击量
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseClickRank`, {location: [1, 15]}).then(res => {
          if (res.data.code === 0) {
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.clickList = res.data.data
            this.courseClickListEchart()
          }
        })

        //课程视频数量
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseVideoRank`, {location: [1, 15]}).then(res => {
          if (res.data.code === 0) {
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.videoList = res.data.data
            this.courseVideoListEchart()
          }
        })
      },

      //综合评分排行
      courseStarsListEchart () {
        let myChart = this.$echarts.init(document.getElementById('course_star_list_echart'), 'westeros')
        let option = {
          title: {
            text: '课程综合评分排行榜',
            subtext: 'worknet'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#516b91'],
          legend: {
            data: ['综合评分'],
            right: 25
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.starsList.courseName.reverse()
          },
          series: [
            {
              name: '综合评分',
              type: 'bar',
              data: this.starsList.number.reverse()
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //课程点击量排行
      courseClickListEchart () {
        let myChart = this.$echarts.init(document.getElementById('course_click_list_echart'), 'westeros')
        let option = {
          title: {
            text: '课程点击量排行榜',
            subtext: 'worknet'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#59c4e6'],
          legend: {
            data: ['点击量'],
            right: 25
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.clickList.courseName.reverse(),
          },
          series: [
            {
              name: '点击量',
              type: 'bar',
              data: this.clickList.number.reverse(),
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //课程视频数量排行镑
      courseVideoListEchart () {
        let myChart = this.$echarts.init(document.getElementById('course_video_list_echart'), 'westeros')
        let option = {
          title: {
            text: '课程视频数量排行榜',
            subtext: 'worknet'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#edafda'],
          legend: {
            data: ['视频数量'],
            right: 25
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.videoList.courseName.reverse(),
          },
          series: [
            {
              name: '视频数量',
              type: 'bar',
              data: this.videoList.number.reverse(),
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //more综合评分
      handleClickStars () {
        this.loadStars = true
        let length
        if (this.starsList.courseName !== undefined && this.starsList.courseName !== null) {
          length = this.starsList.courseName.length
        } else {
          length = 0
        }
        //课程综合评分
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseStarsRank`, {location: [length + 1, length + 16]}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.courseName === undefined || res.data.data.courseName == null || res.data.data.courseName.length <= 0) {
              this.$message.info('这已经是全部数据啦！')
              this.loadStars = false
              return
            }
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.starsList.courseName = this.starsList.courseName.reverse().concat(res.data.data.courseName)
            this.starsList.number = this.starsList.number.reverse().concat(res.data.data.number)
            this.courseStarsListEchart()
          }
          this.loadStars = false
        })
      },

      //more点击量
      handleClickClick () {
        this.loadClick = true
        let length
        if (this.clickList.courseName !== undefined && this.clickList.courseName !== null) {
          length = this.clickList.courseName.length
        } else {
          length = 0
        }
        //课程点击量
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseClickRank`, {location: [length + 1, length + 16]}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.courseName === undefined || res.data.data.courseName == null || res.data.data.courseName.length <= 0) {
              this.$message.info('这已经是全部数据啦！')
              this.loadClick = false
              return
            }
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.clickList.courseName = this.clickList.courseName.reverse().concat(res.data.data.courseName)
            this.clickList.number = this.clickList.number.reverse().concat(res.data.data.number)
            this.courseClickListEchart()
          }
          this.loadClick = false
        })
      },

      //more视频数量
      handleClickVideo () {
        this.loadVideo = true
        let length
        if (this.videoList.courseName !== undefined && this.videoList.courseName !== null) {
          length = this.videoList.courseName.length
        } else {
          length = 0
        }
        //课程视频数量
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseVideoRank`, {location: [length + 1, length + 16]}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.courseName === undefined || res.data.data.courseName == null || res.data.data.courseName.length <= 0) {
              this.$message.info('这已经是全部数据啦！')
              this.loadVideo = false
              return
            }
            res.data.data.courseName.forEach((v, i) => {
              res.data.data.courseName[i] = v.slice(0, 20) + '...'
            })
            this.videoList.courseName = this.videoList.courseName.reverse().concat(res.data.data.courseName)
            this.videoList.number = this.videoList.number.reverse().concat(res.data.data.number)
            this.courseVideoListEchart()
          }
          this.loadVideo = false
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  .course_container {
    height: 900px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .el-row {
    margin-bottom: 30px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .course_data_title {
    height: 30px;
    background-color: #fff;
    border-radius: 3px;
    border-left: 5px solid #59c4e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .course_list_box {
    height: 710px;
    padding: 5px;
  }

  .more_button {
    position: relative;
    left: 45%;
    top: 0;
    transform: translate(-100%, 0);
    font-size: 12pt;
  }

  .el-col {
    border-right: 3px solid #f0f0f0;

    &:last-child {
      border-right: 0;
    }
  }

</style>
