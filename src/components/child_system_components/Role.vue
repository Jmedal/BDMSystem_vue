<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员权限</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-plus" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 菜单列表区域 -->
      <el-table :data="page.pageList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['menu-bottom',i===0 ? 'menu-top':'','center']" v-for="(item, i) in scope.row.children"
                    :key="item.id">
              <el-col :span="5">
                <el-tag @close="removeMenuById(scope.row,item.id)" closable>
                  {{item.menuName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i1===0 ? '':'menu-top','center']" v-for="(item1, i1) in item.children" :key="item1.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            @close="removeMenuById(scope.row,item1.id)" closable>
                      {{item1.menuName}}
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item2 in item1.children"
                            :key="item2.id"
                            @close="removeMenuById(scope.row,item2.id)" closable>
                      {{item2.menuName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="#" width="30px"></el-table-column>
        <el-table-column prop="id" label="角色id" width="80px"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetMenuDialog(scope.row)">分配权限
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
      title="添加角色"
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
      title="编辑角色"
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
      title="分配权限"
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
        roleList: [],
        page: {
          pageList: [],
          pageNum: 1,
          pageSize: 8,
          total: 0,
        },
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
      }
    }, created () {
      this.getRoleList()
    }, methods: {
      getRoleList () {
        this.$axios.post(`/bdmsRoleApi/service.v1.Role/GetRoleList`).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.roleList !== undefined && res.data.data.roleList !== null) {
              this.roleList = res.data.data.roleList
            }
            this.page.total = this.roleList.length
            let maxPageNum = Math.ceil(this.page.total / this.page.pageSize)
            this.page.pageNum = this.page.pageNum <= maxPageNum ? this.page.pageNum : maxPageNum
            this.handleCurrentChange(this.page.pageNum)
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
              this.$message.success('添加角色成功')
              this.getRoleList()
              this.addDialogVisible = false
            } else {
              this.$message.error('添加角色失败！')
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
              this.$message.success('修改角色成功')
              this.getRoleList()
              this.editDialogVisible = false
            } else {
              this.$message.error('修改角色失败！')
            }
          })
        })
      },

      removeRoleById (id) {
        this.$confirm(
          '此操作将永久删除该角色, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$axios.post(`/bdmsRoleApi/service.v1.Role/DeleteRole`, {id: id}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success('删除成功')
              this.getRoleList()
            } else {
              this.$message.error('删除失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      showSetMenuDialog (role) {
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetAllMenuOptions`
        ).then(res => {
          if (res.data.code === 0) {
            this.menuOptions = res.data.data.menuOptions[0].children
            this.roleId = role.id
            this.getLeafKey(role, this.defaultKeys)
            this.setMenuDialogVisible = true
          } else {
            this.$message.error('获取权限数据失败！')
          }
        })
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
            this.$message.success('分配权限成功')
            this.getRoleList()
            this.setMenuDialogVisible = false
          } else {
            this.$message.error('分配权限失败！')
          }
        })
      },

      removeMenuById (role, menuId) {
        this.$confirm(
          '此操作将移除角色的该权限(包括子权限), 是否继续?',
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
              this.$message.success('移除成功')
              this.removeMenu(role, menuId, null)
            } else {
              this.$message.error('移除失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消移除')
        })
      },

      removeMenu(node, menuId, parent){
        if(!node.roleName && node.id === menuId){
          let index = parent.children.indexOf(node)
          parent.children.splice(index,1);
        }
        if (!node.children) return
        node.children.forEach(item =>
          this.removeMenu(item, menuId, node))
      },

      //递归获取三级id
      getLeafKey (node, arr) {
        if (!node.children && !node.roleName) {
          return arr.push(node.id)
        } else if (!node.children) return
        node.children.forEach(item =>
          this.getLeafKey(item, arr))
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
