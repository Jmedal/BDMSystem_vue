<template>
  <div style="height: 100%;">
    <el-backtop></el-backtop>
    <el-container>
      <el-aside :style="asideMenu">
        <div class="logo" style="height: 90px">
          <img src="../assets/img/logo1.jpg" style="height: 90px; width:235px;" v-if="isCollapse">
          <img src="../assets/img/logo2.jpg" style="height: 70px; width:65px" v-else>
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
                            @click="setChildren(item.menuName, subItem.menuName, subItem.children)">
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
                <el-col :span="12">
                  <div style="height: 5px"></div>
                </el-col>
                <el-col :span="7" class="user-info">
                  <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userInfo-inner"><i class="el-icon-user"></i> {{userInfo.name}}</span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="$router.push('/').catch(error => error)">
                        <i class="el-icon-house"> 首页</i>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="showUserInfo">
                        <i class="el-icon-collection-tag"> 个人信息</i>
                      </el-dropdown-item>
                      <el-dropdown-item @click.native="logout">
                        <i class="el-icon-switch-button"> 注销登录</i>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
                <el-col :span="5">
                  <el-badge :is-dot="badge" class="item">
                    <el-dropdown trigger="hover" style="max-height: 10px">
                      <span class="el-dropdown-link userInfo-inner"><i class="el-icon-message user-message"></i></span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="item in messageList" @click.native="showMessage(item)"
                                          :key="item.id">
                          <i :class="item.icon" style="width: 100%">{{item.title}}
                            <span style="color: #F56C6C">{{item.isTop === 1 ? '（置顶）' : ''}}{{item.isRead === 1 ? '（未读）' : ''}}</span><br/>
                            <span style="float:left; margin-top: 6px; font-size: 12px" disabled>
                              {{item.publisher}}
                            </span><br/>
                            <span style="float:right; margin-top: 3px; margin-bottom: 10px; font-size: 12px" disabled>
                              {{item.releaseTime | timeFilter('YYYY-mm-dd HH:MM')}}
                            </span>
                          </i>
                        </el-dropdown-item>
                        <el-dropdown-item @click.native="clearMessage"
                                          v-if="messageList !== null && messageList.length > 0 ">
                          <span style="float:right;">清空</span>
                        </el-dropdown-item>
                        <el-dropdown-item v-else>
                          <span style="float:right;" disabled="">无通知</span>
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

    <el-drawer
      title="我的信息"
      :visible.sync="userDrawer"
      direction="ltr"
      :before-close="userInfoClose">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="用户名" prop="account">
              <el-input v-model="editForm.account" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="修改密码" prop="password">
              <el-input v-model="editForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期"
                style="width: 155px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="11">
            <p></p>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性別" prop="sex">
              <el-select v-model="editForm.sex" placeholder="请选择性别">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="editForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>

    <el-drawer
      :title="messageInfo.title"
      :visible.sync="messageDrawer"
      direction="ltr"
      :before-close="messageClose">
       <span class="demo-drawer__neck">
            发布者:{{messageInfo.publisher}}&#12288;时间:{{messageInfo.releaseTime | timeFilter('YYYY-mm-dd HH:MM')}}
       </span>
      <div class="message-div" v-html='messageInfo.content'></div>
      <el-button type="danger" icon="el-icon-delete" class="demo-drawer__footer" size="mini" @click="deleteMessage"
                 round>删除
      </el-button>
    </el-drawer>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      //验证邮箱的规则
      let checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      //验证手机号玛的规则
      let checkMobile = (rule, value, callback) => {
        const regEmail = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号码'))
      }
      return {
        msg: 'BDMS 数据分析管理系统',
        //用户信息
        userInfo: {},
        userDrawer: false,
        editForm: {},
        editFormRules: {
          password: [
            {min: 4, max: 20, message: '密码的长度在4~20个字符之间', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          birthday: [
            {required: true, message: '请选择生日日期', trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请输入邮箱(xxxx@xx.com)', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'},
          ],
          phone: [
            {required: true, message: '请输入手机号码(13888888888)', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'},
          ],
        },
        //通知列表
        messageList: [],
        messageInfo: {},
        messageDrawer: false,
        //导航栏
        menus: [],
        isCollapse: true,
        //选项
        sexOptions: [
          {
            value: '男',
            label: '男'
          }, {
            value: '女',
            label: '女'
          }]
      }
    }, created () {
      this.init()
      this.getMessage()
      this.getMenus()
    },
    methods: {
      init () {
        this.userInfo = window.localStorage.getItem('save') === '1' ? window.localStorage.getItem('userInfo') : window.sessionStorage.getItem('userInfo')
        this.userInfo = JSON.parse(Base64.decode(this.userInfo))
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/GetUserRole`, {id: this.userInfo.id}).then(res => {
          if (res.data.code === 0) {
            if (this.userInfo.roleId !== res.data.data.roleId) {
              this.userInfo.roleId = res.data.data.roleId
              window.localStorage.getItem('save') === '1' ?
                window.localStorage.setItem('userInfo', Base64.encode(JSON.stringify(this.userInfo))) :
                window.sessionStorage.setItem('userInfo', Base64.encode(JSON.stringify(this.userInfo)))
            }
          }
        })
        window.setInterval(() => {
          setTimeout(this.getMessage, 0)
        }, 30000)
      },

      getMessage () {
        this.$axios.post(`/bdmsMessageApi/service.v1.Message/GetMessageList`, {}).then(res => {
          if (res.data.code === 0) {
            this.messageList = res.data.data.messageList
          }
        })
      },

      //获取菜单列表
      getMenus () {
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetMenus`, {roleId: this.userInfo.roleId}).then(res => {
          if (res.data.code === 0 && res.data.data.menus !== null) {
            this.menus = res.data.data.menus
            let path = {}
            this.menus.forEach(item =>
              this.getPathList(item, path))
            window.localStorage.getItem('save') === '1' ?
              window.localStorage.setItem('path', Base64.encode(JSON.stringify(path))) :
              window.sessionStorage.setItem('path', Base64.encode(JSON.stringify(path)))
          } else {
            this.$message.warning('无可用菜单！')
          }
        })
      },

      handleOpen (key, keyPath) {
        console.log(key, keyPath)
        this.getMessage()
      },

      handleClose (key, keyPath) {
        console.log(key, keyPath)
        this.getMessage()
      },

      logout () {
        let save = window.localStorage.getItem('save')
        save === '1' ? window.localStorage.clear() : window.sessionStorage.clear()
        window.localStorage.setItem('save', save)
        this.$router.push('/login')
      },

      getPathList (node, path) {
        if (!node) return
        path[node.path] = true
        if (!node.children) return
        node.children.forEach(item =>
          this.getPathList(item, path))
      },

      setChildren (grandpa, parent, children) {
        window.sessionStorage.setItem('grandpa', Base64.encode(JSON.stringify(grandpa)))
        window.sessionStorage.setItem('parent', Base64.encode(JSON.stringify(parent)))
        window.sessionStorage.setItem('children', Base64.encode(JSON.stringify(children)))
      },

      showUserInfo () {
        this.editForm = JSON.parse(JSON.stringify(this.userInfo))
        this.editForm.birthday = Number(this.editForm.birthday * 1000)
        this.userDrawer = true
      },

      userInfoClose (done) {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          this.editForm.birthday = Number(this.editForm.birthday / 1000)
          if (JSON.stringify(this.userInfo) !== JSON.stringify(this.editForm)) {
            this.$confirm(
              '个人信息已修改, 是否保存?',
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              this.$axios.post(`/bdmsAccountApi/service.v1.Account/UpdateUser`,
                {
                  id: this.editForm.id,
                  user: this.editForm
                }).then(res => {
                if (res.data.code === 0 && res.data.data.result === 'success') {
                  this.userInfo = JSON.parse(JSON.stringify(this.editForm))
                  window.localStorage.getItem('save') === '1' ?
                    window.localStorage.setItem('userInfo', Base64.encode(this.userInfo)) :
                    window.sessionStorage.setItem('userInfo', Base64.encode(this.userInfo))
                  this.$message.success('保存成功')
                } else {
                  this.$message.error('保存失败！')
                }
              })
            }).catch(() => {
              this.$message.info('已取消保存')
            })
          }
          done()
        })
      },

      showMessage (message) {
        this.messageInfo = {}
        this.$axios.post(`/bdmsMessageApi/service.v1.Message/GetMessage`, {id: message.id}).then(res => {
          if (res.data.code === 0) {
            this.messageInfo = res.data.data.messageInfo
            this.messageInfo.isRead = message.isRead
            this.messageDrawer = true
          }
        })
      },

      messageClose () {
        if(this.messageInfo.isRead === 1) {
          this.$axios.post(`/bdmsMessageApi/service.v1.Message/SetMessageUserRead`, {messageId: this.messageInfo.id}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.getMessage()
            }
          })
        }
        this.messageDrawer = false
      },

      deleteMessage () {
        this.$axios.post(`/bdmsMessageApi/service.v1.Message/DeleteMessageUser`, {messageId: this.messageInfo.id}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success('删除成功')
            this.getMessage()
            this.messageDrawer = false
            this.messageInfo = {}
          } else {
            this.$message.error('删除失败！')
          }
        })
      },

      clearMessage () {
        this.$axios.post(`/bdmsMessageApi/service.v1.Message/DeleteMessageUser`, {}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success('清空成功')
            this.getMessage()
          } else {
            this.$message.error('清空失败！')
          }
        })
      }
    },
    computed: {
      badge () {
        if (this.messageList === null) return false
        return this.messageList.some(item => {
          return item.isRead === 1
        })
      },
      fold () {
        return this.isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'
      },
      asideMenu () {
        return this.isCollapse ? 'width: 235px;' : 'width: auto;'
      },
    }, filters: {
      //YYYY-mm-dd HH:MM
      timeFilter (time, fmt) {
        let date = new Date(time * 1000)
        let ret
        const opt = {
          'Y+': date.getFullYear().toString(),        // 年
          'm+': (date.getMonth() + 1).toString(),     // 月
          'd+': date.getDate().toString(),            // 日
          'H+': date.getHours().toString(),           // 时
          'M+': date.getMinutes().toString(),         // 分
          'S+': date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        }
        for (let k in opt) {
          ret = new RegExp('(' + k + ')').exec(fmt)
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
          }
        }
        return fmt
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

  section.el-container {
    height: 100%;
  }

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

  .user-message {
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
    height: auto;
    overflow: inherit;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #f8f9fa;
    color: #333;
    text-align: center;
    height: auto;
    overflow: inherit;
    min-height: 800px;
  }

  .el-submenu {
    > div {
      padding-left: 50px
    }
  }

  .message-div {
    height: auto;
    width: auto;
    margin: 10px 20px;
    max-height: 80%;
  }

  /deep/ .el-drawer__header {
    text-align: center;
    color: black;
  }

  .demo-drawer__neck {
    position: absolute;
    top: 63px;
    right: 10px;
    font-size: 12px;
    color: #8c939d;
  }

  /deep/ .el-drawer__body {
    width: 100%;
    overflow-x: inherit;
    overflow-y: auto;
    margin-top: 20px;
    margin-bottom: 50px;
  }

  .demo-drawer__footer {
    position: absolute;
    bottom: 10px;
    right: 20px;
  }

  /deep/ :focus {
    outline: 0;
  }
</style>
