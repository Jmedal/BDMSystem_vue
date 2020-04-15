<template>
  <div class="curriculum_container">

    <!--科目依赖拓扑图-->
    <div class="curriculum_up_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="curriculum_data_title">
            <h3>科目依赖</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
        <el-col :span="22">
          <div id="curriculum_topological_graph_echart" class="curriculum_graph_box">
          </div>
        </el-col>
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
      </el-row>
    </div>

    <!--科目课程比例图-->
    <div class="curriculum_end_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="curriculum_data_title">
            <h3>科目课程</h3>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
        <el-col :span="22">
          <div id="curriculum_pie_echart" class="curriculum_pie_box">
          </div>
        </el-col>
        <el-col :span="1">
          <div style="height: 10px">
          </div>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'curriculum_heat',
    data () {
      return {
        graph: {},
        legendData: [],
        seriesData: [],
      }
    },
    created () {
      this.init()
    },
    mounted () {
      this.curriculumGraphEchart()
      this.curriculumPieEchart()
    },
    methods: {
      init () {
        //科目依赖
        this.$axios.post(`/curriculumApi/service.v1.WorknetCurriculum/WorknetCurriculumGraph`).then(res => {
          if (res.data.code === 0) {
            this.graph = res.data.data
            this.curriculumGraphEchart()
          }
        })

        //科目课程数量
        this.$axios.post(`/curriculumApi/service.v1.WorknetCurriculum/WorknetCurriculumCourse`).then(res => {
          if (res.data.code === 0) {
            this.legendData = res.data.data.curriculumName
            this.legendData.forEach((v, i) => {
              let data = {}
              data.name = v
              data.value = res.data.data.courseNumber[i]
              this.seriesData.push(data)
            })
            this.curriculumPieEchart()
          }
        })
      },

      curriculumGraphEchart () {
        let myChart = this.$echarts.init(document.getElementById('curriculum_topological_graph_echart'), 'westeros')
        let categories = []
        let nodeMap = {}
        if (this.graph.nodes !== null && this.graph.nodes !== undefined) {
          this.graph.nodes.forEach((node, i) => {
            node.itemStyle = null
            node.symbolSize = 15
            node.value = node.symbolSize
            node.x = node.y = null
            node.draggable = true
            node.category = i
            categories[i] = {name: node.name}
            nodeMap[node.id] = i
          })
          this.graph.links.forEach(e => {
            e.source = nodeMap[e.source]
            e.target = nodeMap[e.target]
          })
        }

        let option = {
          title: {
            text: '科目依赖拓扑图',
            subtext: 'worknet',
            left: 'right'
          },
          toolbox: {
            show: true,
            bottom: 20,
            feature: {
              restore: {show: true},
              saveAsImage: {show: true}
            },
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: 10,
            top: 20,
            bottom: 20,
            data: categories.map(function (a) {
              return a.name
            })
          },
          animation: false,
          series: [
            {
              name: '科目',
              type: 'graph',
              layout: 'force',
              data: this.graph.nodes,
              links: this.graph.links,
              categories: categories,
              roam: true,
              label: {
                show: true,
                position: 'top'
              },
              focusNodeAdjacency: true,
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [0, 7],
              force: {
                repulsion: 350
              }
            }
          ]
        }
        myChart.setOption(option, true)
      },

      curriculumPieEchart () {
        let myChart = this.$echarts.init(document.getElementById('curriculum_pie_echart'), 'westeros')
        let option = {
          title: {
            text: '科目拥有课程数量比例',
            subtext: 'worknet',
            left: 'right'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          toolbox: {
            show: true,
            bottom: 20,
            feature: {
              saveAsImage: {show: true}
            }
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: this.legendData
          },
          series:
            {
              name: '科目名',
              type: 'pie',
              radius: ['40%', '55%'],
              label: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              },
              data: this.seriesData
            }
        }
        myChart.setOption(option, true)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .curriculum_container {
    height: 100%;
  }

  .curriculum_up_box {
    height: 510px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
  }

  .curriculum_graph_title {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12pt;
  }

  .curriculum_graph_box {
    height: 450px;
    width: 100%;
  }

  .curriculum_end_box {
    height: 505px;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 0;
    top: 10px;
  }

  .curriculum_pie_box {
    height: 450px;
    width: 100%;
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

  .el-row {
    margin-bottom: 25px;

    &:last-child {
      margin-bottom: 0px;
    }
  }
</style>
