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
      <el-table :data="roleList" border stripe>
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
                    <i class="el-icon-caret-right"></i>
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
        <el-table-column type="index" label="#"></el-table-column>
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
    </el-card>

    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="45%"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
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
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="45%"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="分配权限"
      :visible.sync="setMenuDialogVisible"
      width="45%"
      @close="setMenuDialogClosed">
      <el-tree :data="menuList"
               :props="treeProps"
               node-key="id"
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
      return {
        roleList: [],
        addDialogVisible: false,
        addForm: {
          id: 0,
          roleName: '',
          roleDesc: '',
        },
        addFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '角色名称的长度在4~15个字符之间', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色介绍', trigger: 'blur'},
            {min: 5, max: 30, message: '角色介绍的长度在6~30个字符之间', trigger: 'blur'},
          ],
        },

        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          roleName: [
            {required: true, message: '请输入角色名称', trigger: 'blur'},
            {min: 3, max: 10, message: '角色名称的长度在4~15个字符之间', trigger: 'blur'},
          ],
          roleDesc: [
            {required: true, message: '请输入角色介绍', trigger: 'blur'},
            {min: 5, max: 30, message: '角色介绍的长度在6~30个字符之间', trigger: 'blur'},
          ],
        },

        setMenuDialogVisible: false,
        roleId: 0,
        menuList: [],
        //角色已有三级菜单数组
        defaultKeys: [],
        treeProps: {
          label: 'menuName',
          children: 'children',
        },
      }
    }, created () {
      this.getRoleList()
    }, methods: {
      getRoleList () {
        let data = [
          {
            id: 1,
            roleName: '超级管理员',
            roleDesc: '牛逼就完了',
            children: [
              {
                id: 1,
                menuName: '管理员权限',
                path: '/index/1',
                children: [
                  {
                    id: 2,
                    menuName: '用户管理',
                    path: '/index/user',
                    children: [
                      {
                        id: 5,
                        menuName: '添加用户',
                        path: '',
                      },
                    ]
                  },
                  {
                    id: 3,
                    menuName: '角色管理',
                    path: '/index/role',
                    children: [
                      {
                        id: 6,
                        menuName: '添加角色',
                        path: '',
                      },
                    ]
                  },
                  {
                    id: 4,
                    menuName: '菜单管理',
                    path: '/index/menu',
                    children: [
                      {
                        id: 7,
                        menuName: '添加菜单',
                        path: '',
                      },
                    ]
                  },
                ]
              },
              {
                id: 9,
                menuName: '用户',
                path: '/index/2',
                children: [],
              }
            ]
          },
          {
            id: 2,
            roleName: '普通管理员',
            roleDesc: '就一般牛逼',
            children: [
              {
                id: 1,
                menuName: '管理员权限',
                path: '/index/1',
                children: [
                  {
                    id: 3,
                    menuName: '角色管理',
                    path: '/index/role',
                    children: [],
                  },
                  {
                    id: 4,
                    menuName: '菜单管理',
                    path: '/index/menu',
                    children: [],
                  },
                ]
              },
            ]
          }
        ]

        this.roleList = data
        let result = 'success'
        if (result === 'success') return
        this.$message.error('获取角色列表失败！')
      },

      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      addRole () {
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          //发起添加角色的数据请求
          //addForm

          let result = 'success'
          if (result === 'success') {
            this.$message.success('添加角色成功')
            this.getRoleList()
            this.addDialogVisible = false
          } else {
            this.$message.error('添加角色失败！')
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

      editRoleInfo () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          //发起修改角色的数据请求
          //editForm

          let result = 'success'
          if (result === 'success') {
            this.$message.success('修改角色成功')
            this.getRoleList()
            this.editDialogVisible = false
          } else {
            this.$message.error('修改角色失败！')
          }
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
          //请求删除角色

          let result = 'success'
          if (result === 'success') {
            this.$message.success('删除成功')
            this.getRoleList()
          } else {
            this.$message.error('删除失败！')
          }
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },

      showSetMenuDialog (role) {
        //获取所有权限数据
        let result = 'success'
        if (result === 'success') {
          this.menuList = [
            {
              id: 1,
              menuName: '管理员权限',
              path: '/index/1',
              children: [
                {
                  id: 2,
                  menuName: '用户管理',
                  path: '/index/user',
                  children: [
                    {
                      id: 5,
                      menuName: '添加用户',
                      path: '',
                    },
                  ]
                },
                {
                  id: 3,
                  menuName: '角色管理',
                  path: '/index/role',
                  children: [
                    {
                      id: 6,
                      menuName: '添加角色',
                      path: '',
                    },
                  ]
                },
                {
                  id: 4,
                  menuName: '菜单管理',
                  path: '/index/menu',
                  children: [
                    {
                      id: 7,
                      menuName: '添加菜单',
                      path: '',
                    },
                  ]
                },
              ]
            },
            {
              id: 9,
              menuName: '用户',
              path: '/index/2',
              children: [],
            }
          ]
          this.roleId = role.id
          this.getLeafKey(role, this.defaultKeys)
          this.setMenuDialogVisible = true
        } else {
          this.$message.error('获取权限数据失败！')
        }
      },

      //递归获取三级id
      getLeafKey (node, arr) {
        if (!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item =>
          this.getLeafKey(item, arr))
      },

      setMenuDialogClosed () {
        this.defaultKeys = []
      },

      setMenu () {
        const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
        //请求分配权限
        //this.roleId
        console.log(keys)

        let result = 'success'
        if (result === 'success') {
          this.$message.success('分配权限成功')
          this.getRoleList()
          this.setMenuDialogVisible = false
        } else {
          this.$message.error('分配权限失败！')
        }
      },

      removeMenuById (role, menuId) {
        this.$confirm(
          '此操作将移除角色的该权限, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          //请求移除角色的权限

          let result = 'success'
          if (result === 'success') {
            this.$message.success('移除成功')
            role.children = [
              {
                id: 1,
                menuName: '管理员权限',
                path: '/index/1',
                children: [
                  {
                    id: 2,
                    menuName: '用户管理',
                    path: '/index/user',
                    children: []
                  },
                  {
                    id: 3,
                    menuName: '角色管理',
                    path: '/index/role',
                    children: [
                      {
                        id: 6,
                        menuName: '添加角色',
                        path: '',
                      },
                    ]
                  },
                  {
                    id: 4,
                    menuName: '菜单管理',
                    path: '/index/menu',
                    children: [
                      {
                        id: 7,
                        menuName: '添加菜单',
                        path: '',
                      },
                    ]
                  },
                ]
              },
              {
                id: 9,
                menuName: '用户',
                path: '/index/2',
                children: [],
              }
            ]
          } else {
            this.$message.error('移除失败！')
          }
        }).catch(() => {
          this.$message.info('已取消移除')
        })
      }

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
