<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员权限</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
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
          <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList.users" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="account" label="用户帐号"></el-table-column>
        <el-table-column prop="name" label="姓名" ></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="birthday" label="生日" ></el-table-column>
        <el-table-column prop="sex" label="性別" ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" ></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRoleDialog(scope.row)"></el-button>
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
        :total="userList.total">
      </el-pagination>
    </el-card>

    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="45%"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="45%"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setRoleDialogVisible"
      width="45%"
      @close="setRoleDialogClosed">
      <div>
        <p style="text-align:left;">当前的用户：{{userInfo.username}} </p>
        <p style="text-align:left; margin-top: 20px;">当前的角色：{{userInfo.role_name}}</p>
        <p style="text-align:left;">分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
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
      //验证邮箱的规则
      var checkEmail = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的邮箱'))
      }
      //验证手机号玛的规则
      var checkMobile = (rule, value, callback) => {
        const regEmail = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regEmail.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的手机号码'))
      }
      return {
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 2,
        },
        userList: {
          pageNum: 0,
          pageSize: 0,
          users: [],
          total: 0,
        },
        //添加用户框
        addDialogVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        addFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 10, message: '密码的长度在6~15个字符之间', trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请输入邮箱(xxxx@xx.com)', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'},
          ],
          mobile: [
            {required: true, message: '请输入手机号码(13888888888)', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'},
          ],
        },
        //修改用户
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur'},
          ],
          email: [
            {required: true, message: '请输入用户邮箱(xxxx@xx.com)', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'},
          ],
          mobile: [
            {required: true, message: '请输入用户手机号码(13888888888)', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'},
          ],
        },

        //分配角色
        setRoleDialogVisible: false,
        userInfo:{},
        roleOptions:[],
        selectedRoleId: '',
      }
    }, created () {
      this.getUserList()
    },
    methods: {
      getUserList () {
        console.log(this.queryInfo)
        //传入数据queryInfo，获取列表
        this.userList = this.queryInfo.pageNum === 1 ? {
          pageNum: 1,
          pageSize: 2,
          total: 4,
          users: [
            {
              id: 25,
              username: 'admin',
              mobile: '18616358651',
              type: 1,
              email: 'tige112@163.com',
              create_time: 1486720211,
              mg_state: true, //当前用户状态
              role_name: '超级管理员', //角色
            },
            {
              id: 26,
              username: 'jyj',
              mobile: '18616358651',
              type: 1,
              email: 'tige113@163.com',
              create_time: 1486720211,
              mg_state: false, //当前用户状态
              role_name: '管理员', //角色
            }
          ]
        } : {
          pageNum: 2,
          pageSize: 2,
          total: 4,
          users: [
            {
              id: 27,
              username: 'lst',
              mobile: '18616358651',
              type: 1,
              email: 'tige114@163.com',
              create_time: 1486720211,
              mg_state: true, //当前用户状态
              role_name: '管理员', //角色
            },
            {
              id: 28,
              username: 'hhf',
              mobile: '18616358651',
              type: 1,
              email: 'tige115@163.com',
              create_time: 1486720211,
              mg_state: false, //当前用户状态
              role_name: '管理员', //角色
            }
          ]
        }
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

      userStateChanged (userInfo) {
        console.log(userInfo)
        //this.$message.error('更新用户状态失败')
        //userInfo.mg_state = !userInfo.mg_state
        this.$message.success('更新用户状态成功')
      },

      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      addUser () {
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          //发起添加用户的数据请求
          //addForm

          let result = 'success'
          if (result === 'success') {
            this.$message.success('添加用户成功')
            this.getUserList()
            this.addDialogVisible = false
          } else {
            this.$message.error('添加用户失败！')
          }
        })
      },

      showEditDialog (userInfo) {
        this.editForm = JSON.parse(JSON.stringify(userInfo))
        this.editDialogVisible = true
      },

      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },

      editUserInfo () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          //发起修改用户的数据请求
          //editForm

          let result = 'success'
          if (result === 'success') {
            this.$message.success('修改用户成功')
            this.getUserList()
            this.editDialogVisible = false
          } else {
            this.$message.error('修改用户失败！')
          }
        })
      },

      removeUserById (id) {
        this.$confirm(
          '此操作将永久删除该用户, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          //请求删除用户

          let result = 'success'
          if (result === 'success') {
            this.$message.success('删除成功')
            this.getUserList()
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      showRoleDialog(userInfo){
        this.userInfo = JSON.parse(JSON.stringify(userInfo))

        //获取角色列表

        let result = 'success'
        if (result === 'success') {
          this.roleOptions = [{
            id: 1,
            roleName: '超级管理员',
          },
            {
              id: 2,
              roleName: '普通管理员',
            }
          ]
          this.setRoleDialogVisible = true
        } else {
          this.$message.error('获取权限列表失败！')

        }
      },

      setRoleDialogClosed(){
        this.userInfo = {}
        this.selectedRoleId = ''
      },

      setRole(){
        if(!this.selectedRoleId){
          return this.$message.error('请选择要分配的角色！')
        }
        //发起分配角色的数据请求
        //selectedRoleId/this.userInfo。id

        let result = 'success'
        if (result === 'success') {
          this.$message.success('更新角色成功')
          this.getUserList()
          this.setRoleDialogVisible = false
        } else {
          this.$message.error('更新角色失败！')
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
