<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员权限</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-folder-add" @click="showAddDialog">添加菜单</el-button>
        </el-col>
      </el-row>
      <!-- 菜单列表区域 -->
      <el-table :data="page.pageList" border stripe>
        <el-table-column type="index" label="#" width="30px"></el-table-column>
        <el-table-column prop="id" label="菜单id" width="80px"></el-table-column>
        <el-table-column prop="pid" label="父级id" width="80px"></el-table-column>
        <el-table-column prop="num" label="序号" width="80px"></el-table-column>
        <el-table-column prop="menuName" label="菜单名称"></el-table-column>
        <el-table-column label="菜单图标">
          <template v-slot="scope">
            <i :class="scope.row.icon"></i>
            <span>{{scope.row.icon}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="菜单路径"></el-table-column>
        <el-table-column label="菜单层级" width="150px">
          <template v-slot="scope">
            <el-tag v-if="scope.row.levels === 1">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.levels === 2">二级</el-tag>
            <el-tag type="warning" v-else="scope.row.levels === 3">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-folder-delete" size="mini"
                         @click="removeMenuById(scope.row)"></el-button>
            </el-tooltip>
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
      title="添加菜单"
      :visible.sync="addDialogVisible"
      width="700px"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="addForm.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="菜单层级" prop="levels">
              <el-select v-model="addForm.levels" placeholder="请选择等级">
                <el-option
                  v-for="item in levelsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="addForm.icon" :suffix-icon="addForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="父级菜单" prop="pid">
              <el-cascader
                :key="cascaderId"
                v-model="addForm.pid"
                placeholder="请选择父级菜单"
                :options="parentIdOptions"
                :show-all-levels="false"
                :props="{ expandTrigger: 'hover', emitPath: false}"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路径" prop="path">
              <el-input v-model="addForm.path"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="序号" prop="num">
              <el-input v-model="addForm.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑菜单"
      :visible.sync="editDialogVisible"
      width="700px"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="editForm.menuName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="菜单层级" prop="levels">
              <el-select v-model="editForm.levels" placeholder="请选择等级">
                <el-option
                  v-for="item in levelsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-input v-model="editForm.icon" :suffix-icon="editForm.icon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="父级菜单" prop="pid">
              <el-cascader
                :key="cascaderId"
                v-model="editForm.pid"
                placeholder="请选择父级菜单"
                :options="parentIdOptions"
                :show-all-levels="false"
                :props="{expandTrigger: 'hover', emitPath: false}"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路径" prop="path">
              <el-input v-model="editForm.path"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="序号" prop="num">
              <el-input v-model="editForm.num"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'sys_menu',
    data () {
      //验证路径的规则
      let checkPath = (rule, value, callback) => {
        const regPath = /^(\/[0-9a-zA-z.]+)+$/
        if (regPath.test(value)) {
          return callback()
        }
        callback(new Error('请输入合法的路径'))
      }
      //验证添加表单序号并转换类型
      let checkAddNum = (rule, value, callback) => {
        const regPath = /^[0-9]+$/
        if (regPath.test(value) && Number(value) > 0) {
          this.addForm.num = Number(value)
          return callback()
        }
        callback(new Error('序号应为正整数'))
      }
      //验证编辑表单父级菜单
      let checkPid = (rule, value, callback) => {
        if (this.editForm.pid !== this.editForm.id) {
          return callback()
        }
        callback(new Error('父级菜单不能为自身'))
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
        menuList: [],
        page: {
          pageList: [],
          pageNum: 1,
          pageSize: 8,
          total: 0,
        },
        //添加菜单
        addDialogVisible: false,
        addForm: {
          menuName: '',
          icon: '',
          path: '',
          levels: '',
          pid: '',
          num: '',
        },
        addFormRules: {
          menuName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 25, message: '名称的长度在2~25个字符之间', trigger: 'blur'},
          ],
          icon: [
            {required: true, message: '请输入图标代号', trigger: 'blur'},
            {min: 2, max: 50, message: '代号的长度在2~50个字符之间', trigger: 'blur'},
          ],
          levels: [
            {required: true, message: '请选择等级', trigger: 'blur'},
          ],
          pid: [
            {required: true, message: '请选择父级id', trigger: 'blur'},
          ],
          num: [
            {required: true, message: '请输入序号', trigger: 'blur'},
            {validator: checkAddNum, trigger: 'blur'},
          ],
          path: [
            {required: true, message: '请输入路径', trigger: 'blur'},
            {validator: checkPath, trigger: 'blur'},
          ],
        },
        //编辑菜单
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          menuName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {min: 2, max: 25, message: '名称的长度在2~25个字符之间', trigger: 'blur'},
          ],
          icon: [
            {required: true, message: '请输入图标代号', trigger: 'blur'},
            {min: 2, max: 50, message: '代号的长度在2~50个字符之间', trigger: 'blur'},
          ],
          levels: [
            {required: true, message: '请选择等级', trigger: 'blur'},
          ],
          pid: [
            {required: true, message: '请选择父级菜单', trigger: 'blur'},
            {validator: checkPid, trigger: 'blur'},
          ],
          num: [
            {required: true, message: '请输入序号', trigger: 'blur'},
            {validator: checkEditNum, trigger: 'blur'},
          ],
          path: [
            {required: true, message: '请输入路径', trigger: 'blur'},
            {validator: checkPath, trigger: 'blur'},
          ],
        },
        //子菜单id列表
        childrenId: [],
        //菜单下拉框
        levelsOptions: [],
        parentIdOptions: [],
        cascaderId: 0,
        defaultLevelsOptions: [
          {
            value: 1,
            label: '等级一'
          }, {
            value: 2,
            label: '等级二'
          }, {
            value: 3,
            label: '等级三'
          }],
      }
    },
    created () {
      this.getMenuList()
    },
    methods: {
      getMenuList () {
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetMenuList`).then(res => {
          if (res.data.code === 0) {
            if (res.data.data.menuList !== undefined && res.data.data.menuList !== null) {
              this.menuList = res.data.data.menuList
            }
            this.page.total = this.menuList.length
            let maxPageNum = Math.ceil(this.page.total / this.page.pageSize)
            this.page.pageNum = this.page.pageNum <= maxPageNum ? this.page.pageNum : maxPageNum
            this.handleCurrentChange(this.page.pageNum)
          } else {
            this.$message.error('获取菜单列表失败！')
          }
        })
      },

      handleSizeChange (newSize) {
        this.page.pageSize = newSize
        this.page.pageList = this.menuList.slice(this.page.pageSize * (this.page.pageNum - 1), this.page.pageSize * this.page.pageNum)
      },

      handleCurrentChange (newSize) {
        this.page.pageNum = newSize
        this.page.pageList = this.menuList.slice(this.page.pageSize * (this.page.pageNum - 1), this.page.pageSize * this.page.pageNum)
      },

      showAddDialog () {
        this.levelsOptions = this.defaultLevelsOptions
        this.parentIdOptions = []
        this.addDialogVisible = true
      },

      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      addMenu () {
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          this.$axios.post(`/bdmsMenuApi/service.v1.Menu/AddMenu`, this.addForm).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success('添加菜单成功')
              this.getMenuList()
              this.addDialogVisible = false
            } else {
              this.$message.error('添加菜单失败！')
            }
          })
        })
      },

      showEditDialog (menuInfo) {
        let minLevels = this.getMenuChildrenList(menuInfo)
        this.levelsOptions = this.defaultLevelsOptions.slice(0, menuInfo.levels + this.defaultLevelsOptions.length - minLevels)
        this.editForm = JSON.parse(JSON.stringify(menuInfo))
        this.editDialogVisible = true
      },

      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },

      editMenu () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          this.editForm.childrenId = this.childrenId
          this.$axios.post(`/bdmsMenuApi/service.v1.Menu/UpdateMenu`, this.editForm).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success('修改菜单成功')
              this.getMenuList()
              this.editDialogVisible = false
            } else {
              this.$message.error('修改菜单失败！')
            }
          })
        })
      },

      removeMenuById (menuInfo) {
        this.$confirm(
          '此操作将永久删除该菜单(包括子菜单), 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.getMenuChildrenList(menuInfo)
          this.$axios.post(`/bdmsMenuApi/service.v1.Menu/DeleteMenu`, {
            id: menuInfo.id,
            childrenId: this.childrenId
          }).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success('删除成功')
              this.getMenuList()
            } else {
              this.$message.error('删除失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      getMenuOptions (minLevels) {
        this.$axios.post(`/bdmsMenuApi/service.v1.Menu/GetMenuOptions`, {minLevels: minLevels}
        ).then(res => {
          if (res.data.code === 0) {
            this.cascaderId = ++this.cascaderId % 2
            if (minLevels !== 1) {
              res.data.data.menuOptions = res.data.data.menuOptions[0].children
            }
            this.parentIdOptions = res.data.data.menuOptions
          }
        })
      },

      getMenuChildrenList (menuInfo) {
        this.childrenId = []
        let menuIndex = this.menuList.indexOf(menuInfo)
        let minLevels = menuInfo.levels
        let sign = true
        this.menuList.forEach((v, i) => {
          if (sign) {
            if (i > menuIndex) {
              if (v.levels <= menuInfo.levels) {
                sign = false
              } else {
                this.childrenId.push(v.id)
                minLevels = minLevels < v.levels ? v.levels : minLevels
              }
            }
          }
        })
        return minLevels
      },
    },
    watch: {
      'addForm.levels': {
        handler (newVal, oldVal) {
          this.getMenuOptions(newVal)
        },
      },
      'editForm.levels': {
        handler (newVal, oldVal) {
          this.getMenuOptions(newVal)
        },
      },

    }
  }
</script>

<style lang="less" scoped>
  .el-select {
    float: left;
  }
</style>
