<template>
  <div style="height: 100%;">
    <el-backtop></el-backtop>
    <el-container style="height: 100%;">
      <el-header>
        <div>
          <el-avatar :size="50" :src="circleUrl" class="avatar_box"></el-avatar>
          <span>{{msg}}</span>
        </div>
        <el-button type="info" icon="el-icon-switch-button" @click="logout" size="small" circle></el-button>
      </el-header>
      <el-container>
        <el-aside :style="asideMenu">
          <div class="toggle-button" @click="isCollapse=!isCollapse">
            <el-button type="text" style="color: #8c939d; padding: 8px 12px;" :icon="isFold"></el-button>
          </div>
          <el-menu router
                   :default-active="this.$router.history.current.path"
                   @open="handleOpen"
                   @close="handleClose"
                   background-color="#333744"
                   text-color="#fff"
                   active-text-color="#409EFF"
                   unique-opened
                   :collapse-transition="false"
                   :collapse="!isCollapse">
            <template v-for="item in menus">
              <el-menu-item :index="item.path" :key="item.id" v-if="item.children === null">
                <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
              </el-menu-item>
              <el-submenu :index="item.path" :key="item.id" v-else>
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{item.menuName}}</span>
                </template>
                <el-menu-item :index=" subItem.path" v-for="subItem in item.children" :key="subItem.id">
                  <template slot="title">
                    <i :class="subItem.icon"></i>
                    <span>{{subItem.menuName}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
        msg: 'BDMS 数据分析管理系统',
        circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        isCollapse: true,
        menus: []
      }
    }, created () {
      this.getMenus()
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },

      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },

      logout () {
        let save = window.localStorage.getItem('save')
        save === '1' ? window.localStorage.clear() : window.sessionStorage.clear()
        window.localStorage.setItem('save', save)
        this.$router.push('/login')
      },

      getMenus () {
        let userInfo = window.sessionStorage.getItem('userInfo') ? window.sessionStorage.getItem('userInfo') : window.localStorage.getItem('userInfo')
        userInfo = JSON.parse(Base64.decode(userInfo))
        //获取菜单列表
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetMenus`, {roleId: userInfo.roleId}).then(res => {
          if (res.data.code === 0) {
            this.menus = res.data.data.menus
            let path = {}
            this.menus.forEach(item =>
              this.getPathList(item, path))
            window.localStorage.getItem('save') === '1' ?
              window.localStorage.setItem('path', Base64.encode(JSON.stringify(path))) :
              window.sessionStorage.setItem('path', Base64.encode(JSON.stringify(path)))
          } else {
            this.$message.error('获取菜单失败！')
          }
        })
      },
      getPathList (node, path) {
        if (!node) return
        path[node.path] = true
        if (!node.children) return
        node.children.forEach(item =>
          this.getPathList(item, path))
      },
    },
    computed: {
      isFold () {
        return this.isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'
      },
      asideMenu () {
        return this.isCollapse ? 'width: 235px;' : 'width: auto;'
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: white;
    font-size: 30px;

    > div {
      display: flex;
      align-items: center;

      > span {
        margin-left: 15px;
      }
    }
  }

  .avatar_box {
    border: 3px solid #eee;
    border-radius: 50%;
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #f8f9fa;
    color: #333;
    text-align: center;
    overflow: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .el-submenu {
    > div {
      padding-left: 50px
    }
  }

  .toggle-button {
    background-color: #4A5064;
    text-align: center;
    cursor: pointer;
  }
</style>


<!--<el-menu-item index="/index/house">-->
<!--  <i class="el-icon-house"></i>-->
<!--  <span slot="title">首页</span>-->
<!--</el-menu-item>-->
<!--<el-submenu index="/index">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-s-custom"></i>-->
<!--    <span>用户</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/user_type">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-pie-chart"></i>-->
<!--      <span>类型分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->

<!--<el-submenu index="2">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-data-board"></i>-->
<!--    <span>课程</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/course_activity">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-data-line"></i>-->
<!--      <span>活跃度分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/index/course_study">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-pie-chart"></i>-->
<!--      <span>学习情况分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/index/course_list">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-trophy"></i>-->
<!--      <span>排行榜</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->
<!--<el-submenu index="3">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-collection"></i>-->
<!--    <span>学科</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/curriculum_heat">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-data-line"></i>-->
<!--      <span>热度分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->
<!--<el-submenu index="4">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-s-cooperation"></i>-->
<!--    <span>职业</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/profession_heat">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-data-analysis"></i>-->
<!--      <span>热门分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->
<!--<el-submenu index="5">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-office-building"></i>-->
<!--    <span>公司</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/company_profession">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-map-location"></i>-->
<!--      <i class="el-icon-document"></i>-->
<!--      <span>分布/招聘分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/index/company_contest">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-edit-outline"></i>-->
<!--      <span>笔试分析</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->
<!--<el-submenu index="6">-->
<!--  <template slot="title">-->
<!--    <i class="el-icon-smoking"></i>-->
<!--    <span>管理员权限</span>-->
<!--  </template>-->
<!--  <el-menu-item index="/index/user">-->
<!--    <template slot="title">-->
<!--      <i class="iconfont icon-users"></i>-->
<!--      <span>用户管理</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/index/role">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-postcard"></i>-->
<!--      <span>角色管理</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/index/menu">-->
<!--    <template slot="title">-->
<!--      <i class="el-icon-folder-opened"></i>-->
<!--      <span>菜单管理</span>-->
<!--    </template>-->
<!--  </el-menu-item>-->
<!--</el-submenu>-->
<!--<el-menu-item index="/index/pholcus">-->
<!--  <i class="el-icon-coffee-cup"></i>-->
<!--  <span slot="title">Pholcus爬虫</span>-->
<!--</el-menu-item>-->
<!--<el-menu-item index="/index/config">-->
<!--  <i class="el-icon-setting"></i>-->
<!--  <span slot="title">配置管理</span>-->
<!--</el-menu-item>-->
