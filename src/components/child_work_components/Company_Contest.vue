<template>
  <div class="company_container">

    <div class="company_up_box">
      <div class="company_select_box">
        <el-row :gutter="25">
          <el-col :span="5">
            <div class="company_data_title">
              <h3>公司月发布笔试分析</h3>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="25">
          <el-col :span="1">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="23">
            <div class="company_time_select_options">
              时间范围：
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
          <el-col :span="1">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="23">
            <div class="company_select_options">
              选择公司：
              <el-select v-model="companyValue" filterable placeholder="输入或选择公司">
                <el-option
                  v-for="item in companyOptions"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId">
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
            <div class="company_select_options">
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
      <div class="company_new_contest_box">
        <el-row :gutter="20">
          <el-col :span="2">
            <div style="height: 10px">
            </div>
          </el-col>
          <el-col :span="22">
            <div id="company_new_contest_echart" class="company_new_contest_line_box">
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="company_end_box">
      <el-row :gutter="25">
        <el-col :span="5">
          <div class="company_data_title">
            <h3>公司笔试数量排行榜一览</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="25">
        <el-col :span="8">
          <div id="company_contest_list_echart" class="company_list_box">
          </div>
        </el-col>
        <el-col :span="8">
          <div id="company_contesting_list_echart" class="company_list_box">
          </div>
        </el-col>
        <el-col :span="8">
          <div id="company_apply_list_echart" class="company_list_box">
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'company_contest',
    data () {
      return {
        companyOptions: [],
        companyValue: '',
        tags: [],
        selectValue: {
          companyId: [],
          timeValue: []
        },
        contestChange: {
          time: [],
          contest: []
        },
        contestList: {
          companyName: [],
          number: []
        },
        contestingList: {
          companyName: [],
          number: []
        },
        contestApplyList: {
          companyName: [],
          number: []
        }
      }
    }, created () {
      this.init()
    },
    mounted () {
      this.companyNewConetestEchart()
      this.companyContestListEchart()
      this.companyContestingListEchart()
      this.companyApplyListEchart()
    },
    methods: {
      //初始化
      init () {
        //公司列表
        this.$axios.post(`/companyApi/service.v1.WorknetCompany/WorknetCompanyList`).then(res => {
          if (res.data.code === 0) {
            this.companyOptions = res.data.data.companyList
          }
        })

        //公司发布笔试数量
        this.$axios.post(`/companyApi/service.v1.WorknetCompany/WorknetContestNumberRank`).then(res => {
          if (res.data.code === 0) {
            this.contestList = res.data.data
            this.companyContestListEchart()
          }
        })

        //公司发布笔试（正在进行）数量
        this.$axios.post(`/companyApi/service.v1.WorknetCompany/WorknetContestingNumberRank`).then(res => {
          if (res.data.code === 0) {
            this.contestingList = res.data.data
            this.companyContestingListEchart()
          }
        })

        //公司笔试报名数量
        this.$axios.post(`/companyApi/service.v1.WorknetCompany/WorknetContestApplyNumberRank`).then(res => {
          if (res.data.code === 0) {
            this.contestApplyList = res.data.data
            this.companyApplyListEchart()
          }
        })

        //默认一年的区间变化
        const start = this.$moment().subtract(1, 'years').unix()//一年前的日期
        const end = this.$moment().unix()                       //当前的日期
        this.selectValue.timeValue.push(start * 1000)
        this.selectValue.timeValue.push(end * 1000)
      },

      // 公司发布笔试数量变化
      companyNewConetestEchart () {
        let myChart = this.$echarts.init(document.getElementById('company_new_contest_echart'), 'westeros')
        let companyName = []
        let seriesDate = []
        if (this.contestChange.contest === undefined || this.contestChange.contest == null) {
          this.contestChange.contest = []
        }
        for (let i = 0; i < this.contestChange.contest.length; i++) {
          companyName.push(this.contestChange.contest[i].companyName)
          let option = {
            name: this.contestChange.contest[i].companyName,
            type: 'line',
            stack: this.contestChange.contest[i].companyName,
            areaStyle: {},
            data: this.contestChange.contest[i].contestChange
          }
          seriesDate.push(option)
        }

        let option = {
          title: {
            text: '公司月发布笔试数量变化趋势'
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
            data: companyName
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
              data: this.contestChange.time
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: seriesDate
        }
        myChart.setOption(option, true)
      },

      //标签删除
      handleClose (tag) {
        let tagIndex = this.tags.indexOf(tag)
        let courseIdIndex = this.selectValue.companyId.indexOf(this.tags[tagIndex].id)
        this.selectValue.companyId.splice(courseIdIndex, 1)
        this.tags.splice(tagIndex, 1)
      },

      //公司发布笔试数量排行
      companyContestListEchart () {
        let myChart = this.$echarts.init(document.getElementById('company_contest_list_echart'), 'westeros')
        let option = {
          title: {
            text: '公司发布笔试总数Top15',
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
            top: 20,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#59c4e6'],
          legend: {
            data: ['笔试总数'],
            left: 'right'
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
            data: this.contestList.companyName.reverse(),
          },
          series: [
            {
              name: '笔试总数',
              type: 'bar',
              data: this.contestList.number.reverse(),
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //公司发布笔试（正在进行）数量排行
      companyContestingListEchart () {
        let myChart = this.$echarts.init(document.getElementById('company_contesting_list_echart'), 'westeros')
        let option = {
          title: {
            text: '公司发布笔试(进行中)数量Top15',
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
            top: 20,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#edafda'],
          legend: {
            data: ['笔试数量(进行中)'],
            left: 'right'
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
            data: this.contestingList.companyName.reverse(),
          },
          series: [
            {
              name: '笔试数量(进行中)',
              type: 'bar',
              data: this.contestingList.number.reverse()
            },
          ]
        }
        myChart.setOption(option, true)
      },

      //公司笔试报名数量排行
      companyApplyListEchart () {
        let myChart = this.$echarts.init(document.getElementById('company_apply_list_echart'), 'westeros')
        let option = {
          title: {
            text: '公司笔试报名人数Top15',
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
            top: 20,
            feature: {
              saveAsImage: {show: true}
            }
          },
          color: ['#516b91'],
          legend: {
            data: ['报名人数'],
            left: 'right'
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
            data: this.contestApplyList.companyName.reverse(),
          },
          series: [
            {
              name: '报名人数',
              type: 'bar',
              data: this.contestApplyList.number.reverse()
            },
          ]
        }
        myChart.setOption(option, true)
      }
    },
    watch: {
      //公司和时间监控，加载公司笔试数量变化
      selectValue: {
        handler (newVal, oldVal) {
          this.$axios.post(`/companyApi/service.v1.WorknetCompany/WorknetCompanyContestChange`, {
            companyId: newVal.companyId,
            time: [newVal.timeValue[0] / 1000, newVal.timeValue[1] / 1000]
          }).then(res => {
            if (res.data.code === 0) {
              this.contestChange = res.data.data
              this.companyNewConetestEchart()
            }
          })
        },
        deep: true,
      },

      //选择公司，添加标签
      companyValue: {
        handler (newVal, oldVal) {
          if (newVal !== undefined && newVal !== null && newVal !== '' && !this.selectValue.companyId.includes(newVal)) {
            this.selectValue.companyId.push(newVal)
            this.tags.push({id: newVal, name: this.companyOptions.find(item => item.companyId === newVal).companyName})
          }
        },
        deep: true,
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .company_container {
    height: 100%;
  }

  .company_up_box {
    height: 670px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .company_data_title {
    height: 30px;
    background-color: #fff;
    border-radius: 3px;
    border-left: 5px solid #59c4e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .company_select_box {
    height: 210px;
    width: 100%;
  }

  .company_time_select_options {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 12pt;
  }

  .company_select_options {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 12pt;
  }

  .company_new_contest_box {
    height: 400px;
    width: 100%;
    border-radius: 3px;
  }

  .company_new_contest_line_box {
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .company_end_box {
    height: 700px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 0;
    top: 10px;
  }

  .company_list_box {
    height: 650px;
    padding: 5px;
  }

  .el-row {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .el-col {
    border-right: 3px solid #f0f0f0;

    &:last-child {
      border-right: 0;
    }
  }
</style>
