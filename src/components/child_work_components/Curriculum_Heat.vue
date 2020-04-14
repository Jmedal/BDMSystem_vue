<template>
  <div class="curriculum_container">

    <!--学科依赖拓扑图-->
    <div class="curriculum_up_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="curriculum_data_title">
            <h3>学科依赖</h3>
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

    <!--学科课程比例图-->
    <div class="curriculum_end_box">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="curriculum_data_title">
            <h3>学科课程</h3>
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
      return {}
    },
    created () {
      this.init()
    },
    mounted () {
      this.curriculumGraphEchart()
      this.curriculumPieEchart()
    },
    methods: {
      curriculumGraphEchart () {
        let myChart = this.$echarts.init(document.getElementById('curriculum_topological_graph_echart'), 'westeros')

        let graph = {}

        graph.nodes = [
          {id: 0, name: '类目1'},
          {id: 1, name: '类目2'},
          {id: 2, name: '类目3'},
          {id: 3, name: '类目4'},
          {id: 4, name: '类目5'},
          {id: 5, name: '类目6'},
          {id: 6, name: '类目7'},
          {id: 7, name: '类目8'},
          {id: 8, name: '类目9'},
        ]
        graph.links = [
          {id: 0, source: 1, target: 0},
          {id: 1, source: 2, target: 1},
          {id: 2, source: 3, target: 2},
          {id: 3, source: 3, target: 0},
          {id: 4, source: 4, target: 8},
          {id: 5, source: 5, target: 0},
          {id: 6, source: 6, target: 1},
          {id: 7, source: 7, target: 6},
          {id: 8, source: 8, target: 3},
        ]

        let categories = []
        for (let i = 0; i < 9; i++) {
          categories[i] = {
            name: graph.nodes[i].name
          }
          graph.nodes[i].category = i
        }
        graph.nodes.forEach(function (node) {
          node.itemStyle = null
          node.symbolSize = 15
          node.value = node.symbolSize
          node.x = node.y = null
          node.draggable = true
        })
        let option = {
          title: {
            text: '学科依赖拓扑图',
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
              name: '学科',
              type: 'graph',
              layout: 'force',
              data: graph.nodes,
              links: graph.links,
              categories: categories,
              roam: true,
              label: {
                show:true,
                position: 'top'
              },
              focusNodeAdjacency: true,
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [0, 5],
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
            text: '学科拥有课程数量比例',
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
            data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
          },
          series:
            {
              name: '访问来源',
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
              data: [
                {value: 335, name: '直达'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1048, name: '百度'},
                {value: 251, name: '谷歌'},
                {value: 147, name: '必应'},
                {value: 102, name: '其他'}
              ]
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
