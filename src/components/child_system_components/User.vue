<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{grandpa}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{parent}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索和添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户帐号"
                    v-model="queryInfo.query"
                    @keyup.enter.native="handleSearchClick"
                    clearable
                    @clear="handleSearchClick">
            <el-button slot="append" icon="el-icon-search" @click="handleSearchClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     :icon="rightMap[menuObject.add] === undefined ? 'el-icon-circle-close' : rightMap[menuObject.add].icon "
                     @click="addDialogVisible = true"
                     :disabled="rightMap[menuObject.add] === undefined">
            {{rightMap[menuObject.add] === undefined ? '按钮禁用' : rightMap[menuObject.add].menuName}}
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userPage.page" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="40px"></el-table-column>
        <el-table-column prop="account" label="用户名"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100px"></el-table-column>
        <el-table-column prop="roleId" label="角色" width="130px">
          <template v-slot="scope">
            {{scope.row.roleId | roleFilter(roleMap)}}
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" width="100px">
          <template v-slot="scope">
            {{scope.row.birthday | timeFilter('YYYY-mm-dd')}}
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性別" width="50px"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150px"></el-table-column>
        <el-table-column prop="phone" label="电话" width="120px"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="100px">
          <template v-slot="scope">
            {{scope.row.createTime | timeFilter('YYYY-mm-dd')}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.switch] === undefined ? '禁用' : rightMap[menuObject.switch].menuName"
                        placement="top"
                        :enterable="false">
              <el-switch v-model="scope.row.status === 1" @change="userStateChanged(scope.row)"
                         :disabled="rightMap[menuObject.switch] === undefined">
              </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.edit] === undefined ? '禁用' : rightMap[menuObject.edit].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         :icon="rightMap[menuObject.edit] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.edit].icon"
                         size="mini"
                         @click="showEditDialog(scope.row)"
                         :disabled="rightMap[menuObject.edit] === undefined"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.delete] === undefined ? '禁用' : rightMap[menuObject.delete].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         :icon="rightMap[menuObject.delete] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.delete].icon"
                         size="mini"
                         @click="removeUserById(scope.row.id)"
                         :disabled="rightMap[menuObject.delete] === undefined"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.setRole] === undefined ? '禁用' : rightMap[menuObject.setRole].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="warning"
                         :icon="rightMap[menuObject.setRole] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.setRole].icon"
                         size="mini"
                         @click="showRoleDialog(scope.row)"
                         :disabled="rightMap[menuObject.setRole] === undefined"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[6, 15, 25, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userPage.total">
      </el-pagination>
    </el-card>

    <el-dialog
      :title="rightMap[menuObject.add].menuName"
      :visible.sync="addDialogVisible"
      width="700px"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="用户名" prop="account">
              <el-input v-model="addForm.account"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="addForm.birthday"
                type="date"
                placeholder="选择日期">
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
              <el-select v-model="addForm.sex" placeholder="请选择性别">
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
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addForm.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="rightMap[menuObject.edit].menuName"
      :visible.sync="editDialogVisible"
      width="700px"
      @close="editDialogClosed">
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
            <el-form-item label="密码" prop="password">
              <el-input v-model="editForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                placeholder="选择日期">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="rightMap[menuObject.setRole].menuName"
      :visible.sync="setRoleDialogVisible"
      width="500px"
      @close="setRoleDialogClosed">
      <div>
        <p style="text-align:left; margin-left: 26px">用户名：{{userInfo.account}} </p>
        <p style="text-align:left; margin-left: 40px">姓名：{{userInfo.name}} </p>
        <p style="text-align:left; margin-top: 20px;">当前的角色： {{userInfo.roleId | roleFilter(roleMap)}}</p>
        <p style="text-align:left;">请分配角色:
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'sys_user',
    data () {
      //验证帐号的规则
      let checkAccount = (rule, value, callback) => {
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/CheckAccount`, {account: value,}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            callback()
          } else {
            callback(new Error('用户名已存在'))
          }
        })
      }
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
        //权限配置
        menuObject: {
          add: 18,
          switch: 74,
          edit: 19,
          delete: 20,
          setRole: 21,
        },
        rightMap: {},
        //
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 6,
        },
        userPage: {
          pageNum: 0,
          pageSize: 0,
          page: [],
          total: 0,
        },
        loading: true,
        //添加用户框
        addDialogVisible: false,
        addForm: {
          avatar: 'null',
          account: '',
          password: '',
          name: '',
          birthday: '',
          sex: '',
          email: '',
          phone: '',
        },
        addFormRules: {
          account: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 4, max: 20, message: '用户名的长度在4~20个字符之间', trigger: 'blur'},
            {validator: checkAccount, trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
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
        //修改用户
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
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
        //分配角色
        setRoleDialogVisible: false,
        userInfo: {},
        selectedRoleId: '',
        //
        roleMap: {},
        roleOptions: [],
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
    },
    methods: {
      init () {
        this.$axios.post(`/bdmsRoleApi/service.v1.Role/GetRoleOptions`).then(res => {
          if (res.data.code === 0) {
            this.roleOptions = res.data.data.roleOptions
            this.roleOptions.forEach(item => {
              this.roleMap [item.value] = item.label
            })
            this.roleMap [0] = '待分配'
            this.getUserList()
          }
        })
        this.grandpa = JSON.parse(Base64.decode(window.sessionStorage.getItem('grandpa')))
        this.parent = JSON.parse(Base64.decode(window.sessionStorage.getItem('parent')))
        let list = JSON.parse(Base64.decode(window.sessionStorage.getItem('children')))
        if (list === null) return
        list.forEach(item => {
          this.rightMap [item.id] = item
        })
      },

      getUserList () {
        this.loading = true
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/GetUserPage`, this.queryInfo).then(res => {
          if (res.data.code === 0) {
            this.userPage = res.data.data
            this.loading = false
          } else {
            this.$message.error('获取用户列表失败！')
          }
        })
      },

      handleSizeChange (newSize) {
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },

      handleCurrentChange (newSize) {
        this.queryInfo.pageNum = newSize
        this.getUserList()
      },

      handleSearchClick () {
        this.queryInfo.pageNum = 1
        this.getUserList()
      },

      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      addUser () {
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          this.addForm.birthday = Number(this.addForm.birthday / 1000)
          this.$axios.post(`/bdmsAccountApi/service.v1.Account/AddUser`, {user: this.addForm}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.add].menuName + '成功')
              this.getUserList()
              this.addDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.add].menuName + '失败！')
              this.addForm.birthday = Number(this.addForm.birthday * 1000)
            }
          })
        })
      },

      userStateChanged (userInfo) {
        userInfo.status = userInfo.status === 1 ? 2 : 1
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/SetUserStatus`,
          {
            id: userInfo.id,
            status: userInfo.status
          }).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.switch].menuName + '成功')
          } else {
            userInfo.status = userInfo.status === 1 ? 2 : 1
            this.$message.error(this.rightMap[this.menuObject.switch].menuName + '失败！')
          }
        })
      },

      showEditDialog (userInfo) {
        this.editForm = JSON.parse(JSON.stringify(userInfo))
        this.editForm.birthday = Number(this.editForm.birthday * 1000)
        this.editDialogVisible = true
      },

      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
        this.editForm = {}
      },

      editUser () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          this.editForm.birthday = Number(this.editForm.birthday / 1000)
          this.$axios.post(`/bdmsAccountApi/service.v1.Account/UpdateUser`,
            {
              id: this.editForm.id,
              user: this.editForm
            }).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.edit].menuName + '成功')
              this.getUserList()
              this.editDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.edit].menuName + '失败！')
              this.editForm.birthday = Number(this.editForm.birthday * 1000)
            }
          })
        })
      },

      removeUserById (id) {
        this.$confirm(
          '此操作将无法撤回, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$axios.post(`/bdmsAccountApi/service.v1.Account/DeleteUser`, {id: id}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.delete].menuName + '成功')
              this.getUserList()
            } else {
              this.$message.error(this.rightMap[this.menuObject.delete].menuName + '失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消' + this.rightMap[this.menuObject.delete].menuName)
        })
      },
      showRoleDialog (userInfo) {
        this.userInfo = JSON.parse(JSON.stringify(userInfo))
        this.setRoleDialogVisible = true
      },

      setRoleDialogClosed () {
        this.userInfo = {}
        this.selectedRoleId = ''
      },

      setRole () {
        if (this.selectedRoleId === '') {
          return this.$message.error('请选择重新分配的角色！')
        }
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/SetUserRole`,
          {
            id: this.userInfo.id,
            roleId: this.selectedRoleId
          }).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.setRole].menuName + '成功')
            this.getUserList()
            this.setRoleDialogVisible = false
          } else {
            this.$message.error(this.rightMap[this.menuObject.setRole].menuName + '失败！')
          }
        })
      },
    },
    filters: {
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

      roleFilter (roleId, roleMap) {
        return roleMap[roleId] === undefined ? roleMap[0] : roleMap[roleId]
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
