<template>
  <div class="userType_container">

    <div class="up_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="course_data_title">
            <h3>Imooc课程分析</h3>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="5">
        <el-col :span="1">
          <div class="score_data">
          </div>
        </el-col>
        <el-col :span="5" v-loading="loading">
          <div id="comprehensive_pie_echart" class="score_data"></div>
        </el-col>
        <el-col :span="5" v-loading="loading">
          <div id="utility_pie_echart" class="score_data"></div>
        </el-col>
        <el-col :span="5" v-loading="loading">
          <div id="concise_pie_echart" class="score_data"></div>
        </el-col>
        <el-col :span="5" v-loading="loading">
          <div id="logic_pie_echart" class="score_data"></div>
        </el-col>
        <el-col :span="3">
          <div class="number_box" style="position: relative; top: 180px;">{{number.allLearnerNumber}}</div>
          <div class="text_box" style="position: relative; top: 170px;"><h3>学习人数</h3></div>
          <div class="number_box" style="position: relative; top: 165px;">{{number.allEvaluationNumber}}</div>
          <div class="text_box" style="position: relative; top:155px;"><h3>评论数</h3></div>
        </el-col>
      </el-row>
    </div>


    <div class="end_box">
      <div class="list_box">
        <el-row :gutter="0">
          <el-col :span="12" v-loading="loadingScoreList">
            <div id="course_score_list_echart" class="course_list_box">
            </div>
            <el-button type="text" class="more_button" @click="handleClickScore" :loading="loadScore">more</el-button>
          </el-col>
          <el-col :span="12" v-loading="loadingLearnerList">
            <div id="course_Learner_list_echart" class="course_list_box">
            </div>
            <el-button type="text" class="more_button" @click="handleClickLearner" :loading="loadLearner">more
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div id="class_pie_echart" class="pie_up_box" v-loading="loadingClass">
      </div>
      <div id="difficulty_pie_echart" class="pie_center_box" v-loading="loadingDifficulty">
      </div>
      <div id="duration_pie_echart" class="pie_end_box" v-loading="loadingDuration">
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: 'imooc_course',
    data () {
      return {
        //评分数据
        score: {
          comprehensive: [],
          utility: [],
          concise: [],
          logic: [],
        },
        loading: false,
        //学习人数/评论数
        number: {
          allLearnerNumber: 0,
          allEvaluationNumber: 0,
        },
        //课程类别
        class: {
          name: []
        },
        loadingClass: false,
        //课程难度
        difficulty: {
          name: []
        },
        loadingDifficulty: false,
        //课程时长
        duration: {
          name: []
        },
        loadingDuration: false,
        //综合评分排行
        scoreList: {
          name: [],
          number: []
        },
        loadingScoreList: false,
        loadScore: false,
        //学习人数排行
        learnerList: {
          name: [],
          number: []
        },
        loadingLearnerList: false,
        loadLearner: false,
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.courseScoreEchart()
      this.courseClassEchart()
      this.courseDifficultyEchart()
      this.courseDurationEchart()
      this.courseScoreListEchart()
      this.courseLearnerListEchart()
    },
    methods: {
      init () {
        //慕课网课程评分比例
        this.loading = true
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseScore`).then(res => {
          if (res.data.code === 0) {
            this.score = res.data.data
            this.courseScoreEchart()
            this.loading = false
          }
        })

        //慕课网课程人数/评论数
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseAllNumber`).then(res => {
          if (res.data.code === 0) {
            this.number = res.data.data
          }
        })

        //课程类别/难度/时长比例
        this.loadingClass = true
        this.loadingDifficulty = true
        this.loadingDuration = true
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseSection`).then(res => {
          if (res.data.code === 0) {
            this.class = res.data.data.class
            this.difficulty = res.data.data.difficulty
            this.duration = res.data.data.duration
            this.courseClassEchart()
            this.loadingClass = false
            this.courseDifficultyEchart()
            this.loadingDifficulty = false
            this.courseDurationEchart()
            this.loadingDuration = false
          }
        })

        //用户综合评分排行
        this.loadingScoreList = true
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseScoreRank`, {location: [0, 30]}).then(res => {
          if (res.data.code === 0) {
            res.data.data.name.forEach((v, i) => {
              res.data.data.name[i] = v.slice(0, 20) + '...'
            })
            this.scoreList = res.data.data
            this.courseScoreListEchart()
            this.loadingScoreList = false
          }
        })

        //用户学习人数排行
        this.loadingLearnerList = true
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseLearnerRank`, {location: [0, 30]}).then(res => {
          if (res.data.code === 0) {
            res.data.data.name.forEach((v, i) => {
              res.data.data.name[i] = v.slice(0, 20) + '...'
            })
            this.learnerList = res.data.data
            this.courseLearnerListEchart()
            this.loadingLearnerList = false
          }
        })
      },

      //评分类
      courseScoreEchart () {
        let nameList = ['10分~9分', '9分~8分', '8分~7分', '7分~6分', '6分~3分', '3分~0分', '无评分']
        let comprehensiveData = []
        let conciseData = []
        let logicData = []
        let utilityData = []
        nameList.forEach((v, i) => {
          comprehensiveData.push({value: this.score.comprehensive[i], name: v})
          utilityData.push({value: this.score.utility[i], name: v})
          conciseData.push({value: this.score.concise[i], name: v})
          logicData.push({value: this.score.logic[i], name: v})
        })
        let myChart1 = this.$echarts.init(document.getElementById('comprehensive_pie_echart'), 'westeros')
        let option1 = {
          title: {
            text: '综合评分比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: nameList
          },
          series: [
            {
              name: '综合评分',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['67%', '57%'],
              data: comprehensiveData,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '17',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        }
        myChart1.setOption(option1, true)
        let myChart2 = this.$echarts.init(document.getElementById('utility_pie_echart'), 'westeros')
        let option2 = {
          title: {
            text: '内容实用评分比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: nameList
          },
          series: [
            {
              name: '内容实用',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['67%', '57%'],
              data: utilityData,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '17',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        }
        myChart2.setOption(option2, true)
        let myChart3 = this.$echarts.init(document.getElementById('concise_pie_echart'), 'westeros')
        let option3 = {
          title: {
            text: '简洁易懂评分比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: nameList
          },
          series: [
            {
              name: '内容实用',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['67%', '57%'],
              data: conciseData,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '17',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        }
        myChart3.setOption(option3, true)
        let myChart4 = this.$echarts.init(document.getElementById('logic_pie_echart'), 'westeros')
        let option4 = {
          title: {
            text: '逻辑清晰评分比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: nameList
          },
          series: [
            {
              name: '内容实用',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['67%', '57%'],
              data: logicData,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '17',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
            }
          ]
        }
        myChart4.setOption(option4, true)
      },

      //课程类别
      courseClassEchart () {
        let myChart = this.$echarts.init(document.getElementById('class_pie_echart'), 'westeros')
        let classData = []
        this.class.name.forEach((v, i) => {
          classData.push({value: this.class.number[i], name: v})
        })
        let option = {
          title: {
            text: '课程类别比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: this.class.name
          },
          series: [
            {
              name: '课程类别',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['65%', '50%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: classData
            }
          ]
        }
        myChart.setOption(option, true)
      },

      //课程难度
      courseDifficultyEchart () {
        let myChart = this.$echarts.init(document.getElementById('difficulty_pie_echart'), 'westeros')
        let difficultyLegend = ['入门', '初级', '中级', '高级']
        let difficultyData = [{}, {}, {}, {}, {}]
        this.difficulty.name.forEach((v, i) => {
          switch (v) {
            case '入门':
              difficultyData[0] = {value: this.difficulty.number[i], name: v}
              break
            case '初级':
              difficultyData[1] = {value: this.difficulty.number[i], name: v}
              break
            case '中级':
              difficultyData[2] = {value: this.difficulty.number[i], name: v}
              break
            case '高级':
              difficultyData[3] = {value: this.difficulty.number[i], name: v}
              break
            default:
              difficultyData.push({value: this.difficulty.number[i], name: v})
              difficultyLegend.push(v)
              break
          }
        })
        let option = {
          title: {
            text: '课程难度比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: difficultyLegend
          },
          series: [
            {
              name: '课程难度',
              type: 'pie',
              radius: '55%',
              center: ['50%', '55%'],
              data: difficultyData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        myChart.setOption(option, true)
      },

      //课程时长
      courseDurationEchart () {
        let myChart = this.$echarts.init(document.getElementById('duration_pie_echart'), 'westeros')
        let durationData = []
        this.duration.name.forEach((v, i) => {
          durationData.push({value: this.duration.number[i], name: v})
        })
        let option = {
          title: {
            text: '课程时长比例',
            subtext: 'imooc',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            top: 43,
            feature: {
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              name: '课程时长',
              type: 'pie',
              radius: '55%',
              center: ['50%', '55%'],
              data: durationData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        myChart.setOption(option, true)
      },

      //课程综合评分排行榜
      courseScoreListEchart () {
        let myChart = this.$echarts.init(document.getElementById('course_score_list_echart'), 'westeros')
        let option = {
          title: {
            text: '课程综合评分排行榜',
            subtext: 'imooc'
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
          color: ['#37a69a'],
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
            boundaryGap: [0, 0.1]
          },
          yAxis: {
            type: 'category',
            data: this.scoreList.name.reverse()
          },
          series: [
            {
              name: '综合评分',
              type: 'bar',
              data: this.scoreList.number.reverse()
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //课程学习人数排行榜
      courseLearnerListEchart () {
        let myChart = this.$echarts.init(document.getElementById('course_Learner_list_echart'), 'westeros')
        let option = {
          title: {
            text: '课程学习人数排行榜',
            subtext: 'imooc'
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
            data: ['学习人数'],
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
            data: this.learnerList.name.reverse(),
          },
          series: [
            {
              name: '学习人数',
              type: 'bar',
              data: this.learnerList.number.reverse(),
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //more综合评分
      handleClickScore () {
        this.loadScore = true
        let length
        if (this.scoreList.name !== undefined && this.scoreList.name !== null) {
          length = this.scoreList.name.length
        } else {
          length = 0
        }
        //课程综合评分
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseScoreRank`, {location: [length, 15]}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.name === undefined || res.data.data.name == null || res.data.data.name.length <= 0) {
              this.$message.info('这已经是全部数据了！')
              this.loadScore = false
              return
            }
            res.data.data.name.forEach((v, i) => {
              res.data.data.name[i] = v.slice(0, 20) + '...'
            })
            this.scoreList.name = this.scoreList.name.reverse().concat(res.data.data.name)
            this.scoreList.number = this.scoreList.number.reverse().concat(res.data.data.number)
            this.courseScoreListEchart()
          }
          this.loadScore = false
        })
      },

      //more学习人数
      handleClickLearner () {
        this.loadLearner = true
        let length
        if (this.learnerList.name !== undefined && this.learnerList.name !== null) {
          length = this.learnerList.name.length
        } else {
          length = 0
        }
        //课程点击量
        this.$axios.post(`/imoocCourseApi/service.v1.ImoocCourse/ImoocCourseLearnerRank`, {location: [length, 15]}).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.name === undefined || res.data.data.name == null || res.data.data.name.length <= 0) {
              this.$message.info('这已经是全部数据了！')
              this.loadLearner = false
              return
            }
            res.data.data.name.forEach((v, i) => {
              res.data.data.name[i] = v.slice(0, 20) + '...'
            })
            this.learnerList.name = this.learnerList.name.reverse().concat(res.data.data.name)
            this.learnerList.number = this.learnerList.number.reverse().concat(res.data.data.number)
            this.courseLearnerListEchart()
          }
          this.loadLearner = false
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .userType_container {
    height: 1550px;
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

  .up_box {
    height: 350px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .score_data {
    height: 250px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text_font {
    color: black;
    font-family: "微软雅黑", serif;
    font-size: 9pt;
  }

  .background_box {
    background-color: #eaeaea;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .number_box {
    color: #59c4e6;
    font-family: "微软雅黑", serif;
    font-size: 14pt;
  }

  .text_box {
    color: black;
    font-family: "微软雅黑", serif;
    font-size: 9pt;
  }

  .end_box {
    height: 835px;
    width: 100%;
    border-radius: 3px;
    position: relative;
    left: 0;
    top: 10px;
  }

  .list_box {
    width: 60%;
    height: 1205px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 40%;
    top: 0;
  }

  .course_list_box {
    height: 1100px;
    padding: 5px;
  }

  .more_button {
    position: relative;
    left: 45%;
    top: 0;
    transform: translate(-100%, 0);
    font-size: 12pt;
  }

  .pie_up_box {
    width: 39%;
    height: 400px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    transform: translate(-0, -1205px);
  }

  .pie_center_box {
    width: 39%;
    height: 400px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    top: 5px;
    transform: translate(-0, -1205px);
  }

  .pie_end_box {
    width: 39%;
    height: 400px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    top: 5px;
    transform: translate(-0, -1205px);
  }

  .el-col {
    border-right: 2px solid #f0f0f0;

    &:first-child {
      border-right: 0
    }

    &:nth-last-child(2) {
      border-right: 0
    }

    &:last-child {
      border-right: 0
    }
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
