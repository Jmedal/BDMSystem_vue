<template>
  <div class="course_container">
    <div class="course_up_box">
      <el-row :gutter="25">
        <el-col :span="5">
          <div class="course_data_title">
            <h3>课程学习完成度分析</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
        <el-col :span="10">
          <div class="course_select_box">
            <el-row :gutter="25">
              <el-col :span="24">
                <div class="course_time_select_options">
                  学习开始时间：
                  <el-date-picker
                    v-model="selectValue.timeValue"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="25" style="margin-bottom: 0px;">
              <el-col :span="24">
                <div class="course_select_options">
                  选择课程：
                  <el-select v-model="courseValue" filterable placeholder="输入或选择课程">
                    <el-option
                      v-for="item in courseOptions"
                      :key="item.courseId"
                      :label="item.courseName"
                      :value="item.courseId">
                    </el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="25">
              <el-col :span="24">
                <div class="course_select_options" style="height: 80px; flex-wrap:wrap;">
                  <el-tag
                    v-for="tag in tags"
                    :key="tag.id"
                    closable
                    @close="handleClose(tag)">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div id="course_study_echart" class="course_study_box">
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="course_end_box">
      <el-row :gutter="25">
        <el-col :span="5">
          <div class="course_data_title">
            <h3>课程平均分情况分析</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
        <el-col :span="12">
          <div id="course_score_list_echart" class="course_score_list_box">
          </div>
        </el-col>
        <el-col :span="11">
          <div id="course_score_pie_echart" class="course_score_pie_box">
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'course_study',
    data () {
      return {
        courseOptions: [],
        courseValue: [],
        selectValue: {
          courseId: [],
          timeValue: []
        },
        tags: [],
        isFinishCourse: {
          courseName: [],
          finish: [],
          unFinish: [],
        },
        averageScoreList: {
          courseName: [],
          averageScore: [],
        }
      }
    }, created () {
      this.init()
    },
    mounted () {
      this.courseStudyEchart()
      this.courseScoreListEchart()
      this.courseScorePieEchart()
    },
    methods: {
      //初始化
      init () {
        //课程列表
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseList`).then(res => {
          if (res.data.code === 0) {
            this.courseOptions = res.data.data.courseList
          }
        })

        //平均分排行榜
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetAverageScoreList`).then(res => {
          if (res.data.code === 0) {
            this.averageScoreList = res.data.data
            this.courseScoreListEchart()
          }

          //默认一年的区间变化
          const start = this.$moment().subtract(1, 'years').unix()//一年前的日期
          const end = this.$moment().unix()                       //当前的日期
          this.selectValue.timeValue.push(start * 1000)
          this.selectValue.timeValue.push(end * 1000)
        })

        //课程平均分区间数
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetAverageScoreSection`).then(res => {
          if (res.data.code === 0) {
            this.courseSectionNumber = [{value: res.data.data.courseNumber[0], name: '90分~100分'},
              {value: res.data.data.courseNumber[1], name: '80分~89分'},
              {value: res.data.data.courseNumber[2], name: '70分~79分'},
              {value: res.data.data.courseNumber[3], name: '60分~69分'},
              {value: res.data.data.courseNumber[4], name: '60分以下'}]
            this.courseScorePieEchart()
          }
        })

      },

      //课程学员完成数
      courseStudyEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_study_echart'), 'westeros')
        var option = {
          title: {
            text: '学员完成课程学习情况',
            subtext: 'worknet',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {          // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          toolbox: {
            show: true,
            left: 'right',
            feature: {
              saveAsImage: {}
            }
          },
          color: ['#59c4e6', '#edafda'],
          legend: {
            data: ['完成', '未完成'],
            left: 'left'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '位',
          },
          yAxis: {
            type: 'category',
            name: '课程名',
            data: this.isFinishCourse.courseName
          },
          series: [
            {
              name: '完成',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideLeft'
              },
              data: this.isFinishCourse.finish
            },
            {
              name: '未完成',
              type: 'bar',
              stack: '总量',
              label: {
                show: true,
                position: 'insideRight'
              },
              data: this.isFinishCourse.unFinish
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //课程平均分排行榜
      courseScoreListEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_score_list_echart'), 'westeros')
        var option = {
          title: {
            text: '课程平均分排行榜',
            subtext: 'worknet',
            left: 'center',
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
              saveAsImage: {}
            }
          },
          legend: {
            left: 'left',
            data: ['平均分'],
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            name: '课程名',
            data: this.averageScoreList.courseName.reverse()
          },
          series: [
            {
              name: '平均分',
              type: 'bar',
              data: this.averageScoreList.averageScore.reverse()
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //课程平均分区间数
      courseScorePieEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_score_pie_echart'), 'westeros')
        var option = {
          title: {
            text: '不同平均分区间含有课程数量比例',
            subtext: 'worknet',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['90分~100分', '80分~89分', '70分~79分', '60分~69分', '60分以下']
          },
          series: [
            {
              name: '平均分',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.courseSectionNumber,
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

      //标签删除
      handleClose (tag) {
        var tagIndex = this.tags.indexOf(tag)
        var courseIdIndex = this.selectValue.courseId.indexOf(this.tags[tagIndex].id)
        this.selectValue.courseId.splice(courseIdIndex, 1)
        this.tags.splice(tagIndex, 1)
      },

    }, watch: {

      //课程和时间监控，加载课程学员完成课程学习数
      selectValue: {
        handler (newVal, oldVal) {
          this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetStudentFinish`, {
            courseId: newVal.courseId,
            time: [newVal.timeValue[0] / 1000, newVal.timeValue[1] / 1000]
          }).then(res => {
            if (res.data.code === 0) {
              this.isFinishCourse = res.data.data
              this.courseStudyEchart()
            }
          })
        },
        deep: true,
      },

      //选择课程，添加标签
      courseValue: {
        handler (newVal, oldVal) {
          if (newVal !== undefined && newVal !== null && newVal !== '' && !this.selectValue.courseId.includes(newVal)) {
            this.selectValue.courseId.push(newVal)
            this.tags.push({id: newVal, name: this.courseOptions.find(item => item.courseId === newVal).courseName})
          }
        },
        deep: true,
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .course_container {
    height: 100%;
  }

  .course_up_box {
    height: 460px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .el-row {
    margin-bottom: 15px;

    &:nth-child(1) {
      margin-bottom: 25px;
    }

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

  .course_select_box {
    height: 300px;
  }

  .course_time_select_options {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 12pt;
  }

  .course_select_options {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 12pt;
  }

  .course_study_box {
    height: 400px;
  }

  .course_end_box {
    height: 575px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 0;
    top: 10px;
  }

  .course_score_list_box {
    height: 500px;
    padding: 5px;
  }

  .course_score_pie_box {
    height: 500px;
    padding: 5px;
  }

  .el-col {
    &:nth-child(2) {
      border-right: 3px solid #f0f0f0;
    }
  }
</style>



