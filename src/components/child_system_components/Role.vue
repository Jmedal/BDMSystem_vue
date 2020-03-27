<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{grandpa}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{parent}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary"
                     :icon="rightMap[menuObject.add] === undefined ? 'el-icon-circle-close' : rightMap[menuObject.add].icon "
                     @click="addDialogVisible = true"
                     :disabled="rightMap[menuObject.add] === undefined">
            {{rightMap[menuObject.add] === undefined ? '按钮禁用' : rightMap[menuObject.add].menuName}}
          </el-button>
        </el-col>
      </el-row>
      <!-- 菜单列表区域 -->
      <el-table :data="page.pageList" v-loading="loading" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['menu-bottom',i===0 ? 'menu-top':'','center']" v-for="(item, i) in scope.row.children"
                    :key="item.id">
              <el-col :span="5">
                <el-tag @close="removeMenuById(scope.row,item.id)"
                        :closable="rightMap[menuObject.deleteRoleMenu] !== undefined">
                  {{item.menuName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i1===0 ? '':'menu-top','center']" v-for="(item1, i1) in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            @close="removeMenuById(scope.row,item1.id)"
                            :closable="rightMap[menuObject.deleteRoleMenu] !== undefined">
                      {{item1.menuName}}
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item2 in item1.children"
                            :key="item2.id"
                            @close="removeMenuById(scope.row,item2.id)"
                            :closable="rightMap[menuObject.deleteRoleMenu] !== undefined">
                      {{item2.menuName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="#" width="40px"></el-table-column>
        <el-table-column prop="id" label="角色id" width="80px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200px"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="260px">
          <template v-slot="scope">
            <el-button type="primary"
                       :icon="rightMap[menuObject.edit] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.edit].icon"
                       size="mini"
                       @click="showEditDialog(scope.row)"
                       :disabled="rightMap[menuObject.edit] === undefined">
            </el-button>
            <el-button type="danger"
                       :icon="rightMap[menuObject.delete] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.delete].icon"
                       size="mini"
                       @click="removeRoleById(scope.row.id)"
                       :disabled="rightMap[menuObject.delete] === undefined">
            </el-button>
            <el-button type="warning"
                       :icon="rightMap[menuObject.setRoleMenu] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.setRoleMenu].icon"
                       size="mini"
                       @click="showSetMenuDialog(scope.row)"
                       :disabled="rightMap[menuObject.setRoleMenu] === undefined">
              {{rightMap[menuObject.setRoleMenu] === undefined ? '禁用' : rightMap[menuObject.setRoleMenu].menuName}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[8, 15, 30, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </el-card>

    <el-dialog
      :title="rightMap[menuObject.add].menuName"
      :visible.sync="addDialogVisible"
      width="550px"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-form-item label="序号" prop="num">
          <el-input v-model="addForm.num"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="rightMap[menuObject.edit].menuName"
      :visible.sync="editDialogVisible"
      width="550px"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="序号" prop="num">
          <el-input v-model="editForm.num"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="rightMap[menuObject.setRoleMenu].menuName"
      :visible.sync="setMenuDialogVisible"
      width="45%"
      @close="setMenuDialogClosed">
      <el-tree :data="menuOptions"
               :props="treeProps"
               node-key="value"
               :default-checked-keys="defaultKeys"
               ref="treeRef"
               default-expand-all
               show-checkbox></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setMenuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: 'sys_role',
    data () {
      //验证添加表单序号并转换类型
      let checkAddNum = (rule, value, callback) => {
        const regPath = /^[0-9]+$/
        if (regPath.test(value) && Number(value) > 0) {
          this.addForm.num = Number(value)
          return callback()
        }
        callback(new Error('序号应为正整数'))
      }
      //验证编辑表单序号并转换类型
      let checkEditNum = (rule, value, callback) => {
        const regPath = /^[0-9]+$/
        if (regPath.test(value) && Number(value) > 0) {
          this.editForm.num = Number(value)
          return callback()
        }
        callback(new Error('序号应为正整数'))
      }
      return {
        //权限配置
        menuObject: {
          add: 23,
          edit: 24,
          delete: 25,
          setRoleMenu: 26,
          deleteRoleMenu: 27,
        },
        rightMap: {},
        //
        roleList: [],
        page: {
          pageList: [],
          pageNum: 1,
          pageSize: 8,
          total: 0,
        },
        loading: true,
        //添加角色
        addDialogVisible: false,
        addForm: {
          num: '',
          roleName: '',
          roleDesc: '',
        },
        addFormRules: {
          num: [
            {required: true, message: '请输入序号', trigger: 'blur'},
            {validator: checkAddNum, trigger: 'blur'},
          ],
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 4, max: 15, message: '角色名称的长度在4~15个字符之间', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色介绍', trigger: 'blur'},
            {min: 6, max: 30, message: '角色介绍的长度在6~30个字符之间', trigger: 'blur'},
          ],
        },
        //编辑角色
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          num: [
            {required: true, message: '请输入序号', trigger: 'blur'},
            {validator: checkEditNum, trigger: 'blur'},
          ],
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 4, max: 15, message: '角色名称的长度在4~15个字符之间', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色介绍', trigger: 'blur'},
            {min: 6, max: 30, message: '角色介绍的长度在6~30个字符之间', trigger: 'blur'},
          ],
        },

        setMenuDialogVisible: false,
        roleId: 0,
        menuOptions: [],
        //角色已有三级菜单数组
        defaultKeys: [],
        treeProps: {
          label: 'label',
          children: 'children',
        },
        //
        menuOptionsData: [],
        menuLeafData: [],
      }
    }, created () {
      this.init()
      this.getRoleList()
    }, methods: {
      init () {
        this.grandpa = JSON.parse(Base64.decode(window.sessionStorage.getItem('grandpa')))
        this.parent = JSON.parse(Base64.decode(window.sessionStorage.getItem('parent')))
        let list = JSON.parse(Base64.decode(window.sessionStorage.getItem('children')))
        if (list === null) return
        list.forEach(item => {
          this.rightMap [item.id] = item
        })
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetAllMenuOptions`).then(res => {
          if (res.data.code === 0) {
            this.menuOptionsData = res.data.data.menuOptions[0].children
            this.menuOptionsData.forEach(item =>
              this.getAllLeafKey(item, this.menuLeafData))
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })

      },
      getRoleList () {
        this.loading = true
        this.$axios.post(`/bdmsRoleApi/service.v1.Role/GetRoleList`).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.roleList !== undefined && res.data.data.roleList !== null) {
              this.roleList = res.data.data.roleList
            }
            this.page.total = this.roleList.length
            let maxPageNum = Math.ceil(this.page.total / this.page.pageSize)
            this.page.pageNum = this.page.pageNum <= maxPageNum ? this.page.pageNum : maxPageNum
            this.handleCurrentChange(this.page.pageNum)
            this.loading = false
          } else {
            this.$message.error('获取角色列表失败！')
          }
        })
      },

      handleSizeChange (newSize) {
        this.page.pageSize = newSize
        this.page.pageList = this.roleList.slice(this.page.pageSize * (this.page.pageNum - 1), this.page.pageSize * this.page.pageNum)
      },

      handleCurrentChange (newSize) {
        this.page.pageNum = newSize
        this.page.pageList = this.roleList.slice(this.page.pageSize * (this.page.pageNum - 1), this.page.pageSize * this.page.pageNum)
      },

      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      addRole () {
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          this.$axios.post(`/bdmsRoleApi/service.v1.Role/AddRole`, this.addForm).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.add].menuName + '成功')
              this.getRoleList()
              this.addDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.add].menuName + '失败！')
            }
          })
        })
      },

      showEditDialog (userInfo) {
        this.editForm = JSON.parse(JSON.stringify(userInfo))
        this.editDialogVisible = true
      },

      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
        this.editForm = {}
      },

      editRole () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          this.editForm.childrenId = this.childrenId
          this.$axios.post(`/bdmsRoleApi/service.v1.Role/UpdateRole`, this.editForm).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.edit].menuName + '成功')
              this.getRoleList()
              this.editDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.edit].menuName + '失败！')
            }
          })
        })
      },

      removeRoleById (id) {
        this.$confirm(
          '此操作将无法撤回, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$axios.post(`/bdmsRoleApi/service.v1.Role/DeleteRole`, {id: id}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.delete].menuName + '成功')
              this.getRoleList()
            } else {
              this.$message.error(this.rightMap[this.menuObject.delete].menuName + '失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消' + this.rightMap[this.menuObject.delete].menuName)
        })
      },

      showSetMenuDialog (role) {
        this.menuOptions = JSON.parse(JSON.stringify(this.menuOptionsData))
        this.roleId = role.id
        this.getLeafKey(role, this.defaultKeys)
        this.defaultKeys = this.defaultKeys.filter(v => this.menuLeafData.includes(v))
        this.setMenuDialogVisible = true
      },

      setMenuDialogClosed () {
        this.defaultKeys = []
      },

      setMenu () {
        const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
        this.$axios.post(`/bdmsRoleApi/service.v1.Role/SetRoleRights`,
          {
            roleId: this.roleId,
            menusId: keys
          }).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.setRoleMenu].menuName + '成功')
            this.getRoleList()
            this.setMenuDialogVisible = false
          } else {
            this.$message.error(this.rightMap[this.menuObject.setRoleMenu].menuName + '失败！')
          }
        })
      },

      removeMenuById (role, menuId) {
        this.$confirm(
          '此操作将无法撤回, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$axios.post(`/bdmsRoleApi/service.v1.Role/DeleteRoleRights`,
            {
              roleId: role.id,
              menuId: menuId
            }).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.deleteRoleMenu].menuName + '成功')
              this.removeMenu(role, menuId, null)
            } else {
              this.$message.error(this.rightMap[this.menuObject.deleteRoleMenu].menuName + '失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消' + this.rightMap[this.menuObject.deleteRoleMenu].menuName)
        })
      },

      removeMenu (node, menuId, parent) {
        if (!node.roleName && node.id === menuId) {
          let index = parent.children.indexOf(node)
          parent.children.splice(index, 1)
        }
        if (!node.children) return
        node.children.forEach(item =>
          this.removeMenu(item, menuId, node))
      },

      getLeafKey (node, arr) {
        if (!node.children && !node.roleName) {
          return arr.push(node.id)
        } else if (!node.children) return
        node.children.forEach(item =>
          this.getLeafKey(item, arr))
      },

      getAllLeafKey (node, arr) {
        if (!node.children) {
          return arr.push(node.value)
        }
        node.children.forEach(item =>
          this.getAllLeafKey(item, arr))
      },
    }
  }
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }

  .menu-top {
    border-top: 1px solid #eee;
  }

  .menu-bottom {
    border-bottom: 1px solid #eee;
  }

  .center {
    display: flex;
    align-items: center;
  }
</style>
