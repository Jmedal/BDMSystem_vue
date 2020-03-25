<template>
  <div style="height: 100%;">
    <el-backtop></el-backtop>
    <el-container>
      <el-aside :style="asideMenu">
        <div class="logo" style="height: 90px">
          <img src="../assets/img/logo1.jpg" style="height: 90px; width:238px;"  v-if="isCollapse" >
          <img src="../assets/img/logo2.jpg" style="height: 70px; width:65px"  v-else>
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
            <el-menu-item :index="item.path" :key="item.id" @click="setChildren(item.children)"
                          v-if="item.children === null">
              <i :class="item.icon"></i>
              <span>{{item.menuName}}</span>
            </el-menu-item>
            <el-submenu :index="item.path" :key="item.id" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.menuName}}</span>
              </template>
              <el-menu-item :index=" subItem.path" v-for="subItem in item.children" :key="subItem.id"
                            @click="setChildren(subItem.children)">
                <template slot="title">
                  <i :class="subItem.icon"></i>
                  <span>{{subItem.menuName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <el-row :gutter="3" style="width: 100%">
            <el-col :span="21">
              <el-button type="text" class="toggle-button" :icon="fold" @click="isCollapse=!isCollapse"></el-button>
            </el-col>
            <el-col :span="5">
              <el-row :gutter="2">
                <el-col :span="12"><div style="height: 5px"></div></el-col>
                <el-col :span="7" class="user-info">
                  <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userInfo-inner"><i class="el-icon-user"></i>  管理员</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <i class="el-icon-house"><a href="/"></a> 首页</i>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="">
                        <i class="el-icon-collection-tag"> 个人信息</i>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="logout">
                        <i class="el-icon-switch-button"> 注销登录</i>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="5">
                  <el-badge :is-dot="true" class="item">
                    <el-dropdown trigger="hover">
                      <span class="el-dropdown-link userInfo-inner"><i class="el-icon-message user-message"></i></span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <i class="el-icon-house"><a href="/"></a> 通知：******** 日期：2020-3-25</i>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-badge>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
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

      setChildren (children) {
        window.sessionStorage.setItem('children', Base64.encode(JSON.stringify(children)))
      }
    },
    computed: {
      fold () {
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
  .toggle-button {
    font-size: 20px;
    color: #8c939d;
    padding: 8px 12px;
  }

  .userInfo-inner {
    cursor: pointer;
    font-size: 15px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 10px 0 10px 10px;
      float: right;
    }
  }

  .user-message{
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: right;
    font-size: 18px;
  }

  .el-header {
    height: 90px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px #c2c2c2;
    padding: 0px;
    color: #2c2c2c;

    > div {
      display: flex;
      align-items: center;

      > span {
        margin-left: 15px;
      }
    }
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
  }

  .el-submenu {
    > div {
      padding-left: 50px
    }
  }

</style>
