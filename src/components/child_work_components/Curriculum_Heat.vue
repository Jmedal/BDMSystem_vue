<template>
  <div class="curriculum_container">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="curriculum_data_title">
          <h3>学科课程数量分析</h3>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="curriculum_pie_title">
          <div>
            <h4>学科拥有课程数量比例 / 按月变化曲线</h4>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="1">
        <div style="height: 10px">
        </div>
      </el-col>
      <el-col :span="22">
        <div id="curriculum_size_pie_echart" class="curriculum_pie_box">
        </div>
      </el-col>
      <el-col :span="1">
        <div style="height: 10px">
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'curriculum_heat',
    data () {
      return {}
    },
    mounted () {
      this.curriculumSizePieEchart()
    },
    methods: {
      curriculumSizePieEchart () {
        var myChart = this.$echarts.init(document.getElementById('curriculum_size_pie_echart'))
        var option = {
          legend: {},
          tooltip: {
            trigger: 'axis',
            showContent: false
          },
          dataset: {
            source: [
              ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
              ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
              ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
              ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
              ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {gridIndex: 0},
          grid: {top: '55%'},
          series: [
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {type: 'line', smooth: true, seriesLayoutBy: 'row'},
            {
              type: 'pie',
              id: 'pie',
              radius: '30%',
              center: ['50%', '25%'],
              label: {
                formatter: '{b}: {@2012} ({d}%)'
              },
              encode: {
                itemName: 'product',
                value: '2012',
                tooltip: '2012'
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
        myChart.setOption(option)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  .curriculum_container {
    height: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .el-row {
    margin-bottom: 25px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .curriculum_data_title {
    height: 30px;
    background-color: #fff;
    border-radius: 3px;
    border-left: 5px solid #59c4e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .curriculum_pie_title {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .curriculum_pie_box {
    height: 500px;
    width: 100%;
  }


</style>
