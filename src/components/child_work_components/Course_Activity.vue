<template>
  <div class="course_container">
    <div class="course_up_box">
      <el-row :gutter="25">
        <el-col :span="4">
          <div class="course_data_title">
            <h3>月新增课程分析</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="50">
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
        <el-col :span="7">
          <div id="course_activate_echart" class="course_activate_box">
          </div>
        </el-col>
        <el-col :span="15">
          <div class="course_time_select_options">
            时间范围：
            <el-date-picker
              v-model=" timeValue"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份">
            </el-date-picker>
          </div>
          <div id="course_open_echart" class="course_open_box">
          </div>
        </el-col>
      </el-row>
    </div>


    <div class="course_end_box">
      <div class="course_select_box">
        <el-row :gutter="25">
          <el-col :span="5">
            <div class="course_data_title">
              <h3>课程月新增学员分析</h3>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <el-col :span="1">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="23">
            <div class="course_time_select_options">
              时间范围：
              <el-date-picker
                v-model=" selectValue.timeValue"
                type="monthrange"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份">
              </el-date-picker>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="25" style="margin-bottom: 0px;">
          <el-col :span="1">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="23">
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
          <el-col :span="1">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="23">
            <div class="course_select_options" style="flex-wrap:wrap;">
              <el-tag
                v-for="tag in  tags"
                :key="tag.id"
                closable
                @close="handleClose(tag)">
                {{tag.name}}
              </el-tag>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="course_new_student_box">
        <el-row :gutter="20">
          <el-col :span="2">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="22">
            <div id="course_new_student_echart" class="course_new_student_line_box">
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'course_activity',
    data () {
      return {
        status: {
          activity: 0,
          inactivity: 0,
        },
        timeValue: [],
        courseChange: {
          time: [],
          course: []
        },
        courseOptions: [],
        courseValue: '',
        tags: [],
        selectValue: {
          courseId: [],
          timeValue: []
        },
        studentChange: {
          time: [],
          student: []
        },
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.courseActivateEchart()
      this.courseOpenEchart()
      this.courseNewStudentEchart()
    },
    methods: {
      //初始化
      init () {
        //课程激活情况
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseActivity`).then(res => {
          if (res.data.code === 0) {
            this.status = res.data.data
            this.courseActivateEchart()
          }
        })
        //课程列表
        this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseList`).then(res => {
          if (res.data.code === 0) {
            this.courseOptions = res.data.data.courseList
          }
        })

        //默认一年的区间变化
        const start = this.$moment().subtract(1, 'years').unix()//一年前的日期
        const end = this.$moment().unix()                       //当前的日期
        this.timeValue.push(start * 1000)
        this.timeValue.push(end * 1000)
        this.selectValue.timeValue.push(start * 1000)
        this.selectValue.timeValue.push(end * 1000)
      },

      //用户激活比例
      courseActivateEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_activate_echart'), 'westeros')
        var option = {
          title: {
            text: '课程激活比例',
            subtext: 'worknet',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['激活', '未激活']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {value: this.status.activity, name: '激活'},
                {value: this.status.inactivity, name: '未激活'},
              ]
            }
          ]
        }
        myChart.setOption(option, true)
      },

      //网站新增课程数量变化
      courseOpenEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_open_echart'), 'westeros')
        var option = {
          title: {
            text: '新课程月开设数量变化曲线',
            subtext: 'worknet',
            left: 'center'
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#8ec9ff'],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.courseChange.time
          },
          yAxis: {
            type: 'value',
            name: '课程',
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          series: [{
            data: this.courseChange.course,
            type: 'line',
            areaStyle: {}
          }]
        }
        myChart.setOption(option, true)
      },

      //课程新增学员数量变化
      courseNewStudentEchart () {
        var myChart = this.$echarts.init(document.getElementById('course_new_student_echart'), 'westeros')
        var courseName = []
        var seriesDate = []
        if (this.studentChange.student === undefined || this.studentChange.student == null) {
          this.studentChange.student = []
        }
        for (var i = 0; i < this.studentChange.student.length; i++) {
          courseName.push(this.studentChange.student[i].courseName)
          var option = {
            name: this.studentChange.student[i].courseName,
            type: 'line',
            stack: this.studentChange.student[i].courseName,
            areaStyle: {},
            data: this.studentChange.student[i].studentChange
          }
          seriesDate.push(option)
        }
        var option = {
          title: {
            text: '课程月新增学员数量变化曲线'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: courseName
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.studentChange.time
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '学员',
              axisLabel: {
                formatter: '{value} 位'
              }
            }
          ],
          series: seriesDate
        }
        myChart.setOption(option, true)
      },

      //标签删除
      handleClose (tag) {
        var tagIndex = this.tags.indexOf(tag)
        var courseIdIndex = this.selectValue.courseId.indexOf(this.tags[tagIndex].id)
        this.selectValue.courseId.splice(courseIdIndex, 1)
        this.tags.splice(tagIndex, 1)
      }
    }
    ,
    watch: {
      //时间监控，加载课程变化
      timeValue: {
        handler (newVal, oldVal) {
          this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetCourseNumberChange`, {
            time: [newVal[0] / 1000, newVal[1] / 1000]
          }).then(res => {
            if (res.data.code === 0) {
              this.courseChange = res.data.data
              this.courseOpenEchart()
            }
          })
        },
        deep: true,
      },

      //课程和时间监控，加载课程学员数量变化
      selectValue: {
        handler (newVal, oldVal) {
          this.$axios.post(`/courseApi/service.v1.WorknetCourse/WorknetStudentChange`, {
            courseId: newVal.courseId,
            time: [newVal.timeValue[0] / 1000, newVal.timeValue[1] / 1000]
          }).then(res => {
            if (res.data.code === 0) {
              this.studentChange = res.data.data
              this.courseNewStudentEchart()
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
    height: 410px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
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

  .course_activate_box {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .course_open_box {
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .course_end_box {
    height: 690px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 0;
    top: 10px;
  }

  .course_select_box {
    height: 210px;
    width: 100%;
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

  .course_new_student_box {
    height: 400px;
    width: 100%;
    border-radius: 3px;
  }

  .course_new_student_line_box {
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .el-col {
    &:nth-child(2) {
      border-right: 3px solid #f0f0f0;
    }
  }
</style>
