<template>
  <div class="userType_container">
    <div class="number_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="user_data_title">
            <h3>用户数据</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">
          <div class="user_data">
          </div>
        </el-col>
        <el-col :span="5">
          <div class="user_data number_font">{{user.commonUser}}</div>
          <div class="user_data text_font"><h3>普通用户数量</h3></div>
        </el-col>
        <el-col :span="5">
          <div class="user_data number_font">{{user.teacherUser}}</div>
          <div class="user_data text_font"><h3>老师用户数量</h3></div>
        </el-col>
        <el-col :span="5">
          <div class="user_data number_font">{{user.companyUser}}</div>
          <div class="user_data text_font"><h3>公司用户数量</h3></div>
        </el-col>
        <el-col :span="5">
          <div class="user_data number_font">{{status.activity}}/<p class="number_font" style="color: red">
            {{status.inactivity}}</p></div>
          <div class="user_data text_font"><h3>总用户数量(激活/未激活)</h3></div>
        </el-col>
        <el-col :span="2">
          <div class="user_data"></div>
        </el-col>
      </el-row>
    </div>
    <div class="pie_box">
      <div id="user_type_echart" class="type_pie_box">
      </div>
      <div id="user_sex_echart" class="sex_pie_box">
      </div>
      <div id="user_activate_echart" class="activate_pie_box">
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: 'user_type',
    data () {
      return {
        user: {
          commonUser: 0,
          companyUser: 0,
          teacherUser: 0,
        },
        sex: {
          man: 0,
          human: 0,
        },
        status: {
          activity: 0,
          inactivity: 0,
        },
        year: '',
        source: [],
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.userTypeEchart()
      this.userSexEchart()
      this.userActivateEchart()
    },
    methods: {
      init () {
        //用户数量
        this.$axios.post(`/userApi/service.v1.WorknetUser/WorknetUserNumber`).then(res => {
          if (res.data.code === 0) {
            this.user = res.data.data
          }
        })

        //用户激活情况
        this.$axios.post(`/userApi/service.v1.WorknetUser/WorknetUserActivity`).then(res => {
          if (res.data.code === 0) {
            this.status = res.data.data
            this.userActivateEchart()
          }
        })

        //用户性别比例情况
        this.$axios.post(`/userApi/service.v1.WorknetUser/WorknetUserSex`).then(res => {
          if (res.data.code === 0) {
            this.sex = res.data.data
            this.userSexEchart()
          }
        })

        //用户每年注册情况
        this.$axios.post(`/userApi/service.v1.WorknetUser/WorknetUserNumberChange`).then(res => {
          if (res.data.code === 0) {
            this.year = res.data.data.time[res.data.data.time.length-1]
            res.data.data.time.unshift('product')
            res.data.data.commonUser.unshift('普通用户')
            res.data.data.companyUser.unshift('公司用户')
            res.data.data.teacherUser.unshift('教师用户')
            this.source.push(res.data.data.time)
            this.source.push(res.data.data.commonUser)
            this.source.push(res.data.data.companyUser)
            this.source.push(res.data.data.teacherUser)
            this.userTypeEchart()
          }
        })
      },

      userTypeEchart () {
        var myChart = this.$echarts.init(document.getElementById('user_type_echart'),'westeros')
        var option = {
          title: {
            text: '各类用户年增长量曲线图',
            subtext: 'worknet',
            left: 'left'
          },
          legend: {},
          tooltip: {
            trigger: 'axis',
            showContent: false
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
            }
          },
          dataset: {
            source: this.source
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '55%'},
          series: [
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              label: {
                formatter: '{b}: {@' + this.year + '} ({d}%)'
              },
              encode: {
                itemName: 'product',
                value: this.year,
                tooltip: this.year
              }
            }
          ]
        }
        myChart.on('updateAxisPointer', function (event) {
          var xAxisInfo = event.axesInfo[0]
          if (xAxisInfo) {
            var dimension = xAxisInfo.value + 1
            myChart.setOption({
              series: {
                id: 'pie',
                label: {
                  formatter: '{b}: {@[' + dimension + ']} ({d}%)'
                },
                encode: {
                  value: dimension,
                  tooltip: dimension
                }
              }
            })
          }
        })
        myChart.setOption(option, true)
      },

      userSexEchart () {
        var myChart = this.$echarts.init(document.getElementById('user_sex_echart'),'westeros')
        var option = {
          title: {
            text: '普通用户男女比例',
            subtext: 'worknet',
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
            orient: 'vertical',
            left: 'left',
            data: ['男', '女']
          },
          series: [
            {
              name: '性别',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: this.sex.man, name: '男'},
                {value: this.sex.human, name: '女'},
              ],
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

      userActivateEchart () {
        var myChart = this.$echarts.init(document.getElementById('user_activate_echart'),'westeros')
        this.option3 = {
          title: {
            text: '用户激活比例',
            subtext: 'worknet',
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
            orient: 'vertical',
            left: 'left',
            data: ['激活', '未激活']
          },
          series: [
            {
              name: '帐号状态',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: this.status.activity, name: '激活'},
                {value: this.status.inactivity, name: '未激活'}
              ],
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
        myChart.setOption(this.option3)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .userType_container {
    height: 1000px;
  }

  .number_box {
    height: 140px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .pie_box {
    height: 835px;
    width: 100%;
    border-radius: 3px;
    position: relative;
    left: 0;
    top: 10px;
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .user_data_title {
    height: 30px;
    background-color: #fff;
    border-radius: 3px;
    border-left: 5px solid #59c4e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .user_data {
    height: 35px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .number_font {
    color: #59c4e6;
    font-family: "微软雅黑", serif;
    font-size: 16pt;
  }

  .text_font {
    color: black;
    font-family: "微软雅黑", serif;
    font-size: 9pt;
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

  .type_pie_box {
    width: 72%;
    height: 835px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 28%;
    top: 0;
  }

  .sex_pie_box {
    width: 27%;
    height: 415px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    transform: translate(-0, -835px);
  }

  .activate_pie_box {
    width: 27%;
    height: 415px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    top: 5px;
    transform: translate(-0, -835px);
  }
</style>
