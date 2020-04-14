<template>
  <div class="profession_container">
    <div class="profession_up_box">
      <el-row :gutter="25">
        <el-col :span="3">
          <div class="profession_data_title">
            <h3>职业分析</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="9" style="border-right: 3px solid #f0f0f0;">
          <div id="profession_choice_echart" class="profession_choice_box">
          </div>
        </el-col>
        <el-col :span="15">
          <div id="profession_salary_echart" class="profession_salary_box">
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="profession_end_box">
      <el-row :gutter="25">
        <el-col :span="4">
          <div class="profession_data_title">
            <h3>职业大类分析</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="9" style="border-right: 3px solid #f0f0f0;">
          <div id="profession_type_choice_echart" class="profession_choice_box">
          </div>
        </el-col>
        <el-col :span="15">
          <div id="profession_type_salary_echart" class="profession_salary_box">
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'profession_heat',
    data () {
      return {
        professionChoice: {
          professionName: [],
          number: []
        },
        professionSalary: {
          professionName: [],
          salary: []
        },
        professionTypeChoice: {
          professionName: [],
          number: []
        },
        professionTypeSalary: {
          professionName: [],
          salary: []
        }
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.professionChoiceEchart()
      this.professionSalaryEchart()
      this.professionTypeNumberEchart()
      this.professionTypeSalaryEchart()
    },
    methods: {
      //初始化
      init () {
        //职业用户选择数量比
        this.$axios.post(`/professionApi/service.v1.WorknetProfession/WorknetProfessionChoice`).then(res => {
          if (res.data.code === 0) {
            this.professionChoice = res.data.data
            this.professionChoiceEchart()
          }
        })

        //职业薪水列表
        this.$axios.post(`/professionApi/service.v1.WorknetProfession/WorknetProfessionSalary`).then(res => {
          if (res.data.code === 0) {
            this.professionSalary = res.data.data
            this.professionSalaryEchart()
          }
        })

        //职业大类拥有职业数量比
        this.$axios.post(`/professionApi/service.v1.WorknetProfession/WorknetProfessionTypeNumber`).then(res => {
          if (res.data.code === 0) {
            this.professionTypeChoice = res.data.data
            this.professionTypeNumberEchart()
          }
        })

        //职业大类平均薪水列表
        this.$axios.post(`/professionApi/service.v1.WorknetProfession/WorknetProfessionTypeSalary`).then(res => {
          if (res.data.code === 0) {
            this.professionTypeSalary = res.data.data
            this.professionTypeSalaryEchart()
          }
        })
      },

      //职业用户选择数量比
      professionChoiceEchart () {
        if (this.professionChoice.professionName === undefined || this.professionChoice.professionName == null) {
          return
        }
        var data = []
        for (let i = 1; i < this.professionChoice.professionName.length; i++) {
          data.push({value: this.professionChoice.number[i], name: this.professionChoice.professionName[i]})
        }
        var myChart = this.$echarts.init(document.getElementById('profession_choice_echart'), 'westeros')
        var option = {
          title: {
            text: '用户选择职业意向比例',
            subtext: 'worknet',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: this.professionChoice.professionName,
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: {
            name: '数量',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            label: {
              show: false
            },
            data: data
          }
        }
        myChart.setOption(option, true)
      },

      //职业薪水列表
      professionSalaryEchart () {
        if (this.professionSalary.professionName === undefined || this.professionSalary.professionName == null) {
          return
        }
        var bar = []
        for (var i = 0; i < this.professionSalary.professionName.length; i++) {
          bar.push({type: 'bar'})
        }
        this.professionSalary.professionName.unshift('product')
        this.professionSalary.salary.unshift('')
        var myChart = this.$echarts.init(document.getElementById('profession_salary_echart'), 'westeros')
        var option = {
          title: {
            text: '职业薪资情况',
            top: 'bottom',
            left: 'center'
          },
          toolbox: {
            show: true,
            top: 'bottom',
            right:40,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              this.professionSalary.professionName,
              this.professionSalary.salary,
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {
            type: 'value',
            name: '每月',
            min: 0,

            axisLabel: {
              formatter: '{value} K'
            }
          },
          series: bar,
        }
        myChart.setOption(option, true)
      },

      //职业大类拥有职业数量比
      professionTypeNumberEchart () {
        if (this.professionTypeChoice.professionName === undefined || this.professionTypeChoice.professionName == null) {
          return
        }
        var data = []
        for (let i = 1; i < this.professionTypeChoice.professionName.length; i++) {
          data.push({value: this.professionTypeChoice.number[i], name: this.professionTypeChoice.professionName[i]})
        }
        var myChart = this.$echarts.init(document.getElementById('profession_type_choice_echart'), 'westeros')
        var option = {
          title: {
            text: '职业大类拥有职业数量比例',
            subtext: 'worknet',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: this.professionTypeChoice.professionName
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: {
            name: '数量',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
            label: {
              show: false
            },
            data: data
          }
        }
        myChart.setOption(option, true)
      },

      //职业大类平均薪水列表
      professionTypeSalaryEchart () {
        if (this.professionTypeSalary.professionName === undefined || this.professionTypeSalary.professionName == null) {
          return
        }
        var bar = []
        for (var i = 0; i < this.professionTypeSalary.professionName.length; i++) {
          bar.push({type: 'bar'})
        }
        this.professionTypeSalary.professionName.unshift('product')
        this.professionTypeSalary.salary.unshift('')

        var myChart = this.$echarts.init(document.getElementById('profession_type_salary_echart'), 'westeros')
        var option = {
          title: {
            text: '职业大类平均薪资情况',
            top: 'bottom',
            left: 'center'
          },
          toolbox: {
            show: true,
            top: 'bottom',
            right:40,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {},
          tooltip: {},
          dataset: {
            source: [
              this.professionTypeSalary.professionName,
              this.professionTypeSalary.salary,
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {
            type: 'value',
            name: '每月',
            min: 0,

            axisLabel: {
              formatter: '{value} K'
            }
          },
          series: bar,
        }
        myChart.setOption(option, true)
      },

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .profession_container {
    height: 100%;
  }

  .profession_up_box {
    height: 440px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .profession_data_title {
    height: 30px;
    background-color: #fff;
    border-radius: 3px;
    border-left: 5px solid #59c4e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .profession_choice_box {
    height: 370px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profession_salary_box {
    height: 370px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profession_end_box {
    height: 440px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 0;
    top: 10px;
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
</style>
