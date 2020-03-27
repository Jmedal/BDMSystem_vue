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
          <el-input placeholder="请输入通知标题"
                    v-model="queryInfo.query"
                    @keyup.enter.native="handleSearchClick"
                    @clear="handleSearchClick"
                    clearable>
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
      <!-- 通知列表区域 -->
      <el-table :data="messagePage.page" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="40px"></el-table-column>
        <el-table-column prop="icon" label="图标" width="50px">
          <template v-slot="scope">
            <i :class="scope.row.icon" style="font-size: 20px"></i>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="200px"></el-table-column>
        <el-table-column prop="publisher" label="发布人" width="150px"></el-table-column>
        <el-table-column prop="content" label="内容">
          <template v-slot="scope">
            <div v-html='scope.row.content'></div>
          </template>
        </el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" width="140px">
          <template v-slot="scope">
            {{scope.row.releaseTime | timeFilter('YYYY-mm-dd HH:MM')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.edit] === undefined ? '禁用' : rightMap[menuObject.edit].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         :icon="rightMap[menuObject.edit] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.edit].icon"
                         size="mini"
                         @click="showEditDialog(scope.row)"
                         :disabled="rightMap[menuObject.edit] === undefined">
                {{rightMap[menuObject.edit] === undefined ? '禁用' : rightMap[menuObject.edit].menuName}}
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.delete] === undefined ? '禁用' : rightMap[menuObject.delete].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         :icon="rightMap[menuObject.delete] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.delete].icon"
                         size="mini"
                         @click="removeMessageById(scope.row.id)"
                         :disabled="rightMap[menuObject.delete] === undefined">
                {{rightMap[menuObject.delete] === undefined ? '禁用' : rightMap[menuObject.delete].menuName}}
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[8, 15, 25, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="messagePage.total">
      </el-pagination>
    </el-card>

    <el-dialog
      :title="rightMap[menuObject.add].menuName"
      :visible.sync="addDialogVisible"
      width="1000px"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="标题" prop="title">
              <el-input v-model="addForm.title"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 2}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <p></p>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="icon">
              <el-select v-model="addForm.icon" placeholder="图标">
                <el-option
                  v-for="item in iconOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <i :class="item.value" style="float: left; font-size: 14px"><span style="color: #8492a6; font-size: 13px"> {{item.label }}</span></i>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker
                v-model="addForm.releaseTime"
                type="datetime"
                placeholder="选择发布时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" style="margin-bottom: 10px">
          <el-col :span="19">
            <el-transfer
              style="text-align: left; display: inline-block"
              v-model="userList"
              :props="userProps"
              filterable
              clearQuery
              :titles="['用户列表', '通知用户']"
              :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
              :data="userOptions">
              <span slot-scope="{ option }">{{ option.label}}</span>
            </el-transfer>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="内容" prop="content">
              <quill-editor v-model="addForm.content"></quill-editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMessage">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="rightMap[menuObject.edit].menuName"
      :visible.sync="editDialogVisible"
      width="1000px"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="标题" prop="title">
              <el-input v-model="editForm.title"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 2}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <p></p>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="icon">
              <el-select v-model="editForm.icon" placeholder="图标">
                <el-option
                  v-for="item in iconOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  <i :class="item.value" style="float: left; font-size: 14px"><span style="color: #8492a6; font-size: 13px"> {{item.label }}</span></i>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="6">
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker
                v-model="editForm.releaseTime"
                type="datetime"
                placeholder="选择发布时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="内容" prop="content">
              <quill-editor v-model="editForm.content"></quill-editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMessage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'sys_message',
    data () {
      return {
        //权限配置
        menuObject: {
          add: 71,
          edit: 72,
          delete: 73,
        },
        rightMap: {},
        //加载分页
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 8,
        },
        messagePage: {
          pageNum: 0,
          pageSize: 0,
          page: [],
          total: 0,
        },
        loading: true,
        //发布通知框
        addDialogVisible: false,
        addForm: {
          title: '',
          icon: '',
          content: '',
          releaseTime: '',
        },
        userList: [],
        addFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 2, max: 50, message: '通知标题的长度在2~50个字符之间', trigger: 'blur'},
          ],
          icon: [
            {required: true, message: '请选择图标', trigger: 'blur'},
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {min: 4, max: 15000, message: '通知内容的过长', trigger: 'blur'},
          ],
          releaseTime: [
            {required: true, message: '请选择发布时间（可预约时间）', trigger: 'blur'},
          ],
        },
        //修改通知
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          title: [
            {required: true, message: '请输入标题', trigger: 'blur'},
            {min: 2, max: 50, message: '通知标题的长度在2~50个字符之间', trigger: 'blur'},
          ],
          icon: [
            {required: true, message: '请选择图标', trigger: 'blur'},
          ],
          content: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {min: 4, max: 15000, message: '通知内容的长度过长', trigger: 'blur'},
          ],
          releaseTime: [
            {required: true, message: '请选择发布时间（可预约时间）', trigger: 'blur'},
          ],
        },
        //选项
        userOptions: [],
        userProps: {
          key: 'value',
          label: 'label',
        },
        iconOptions: [
          {
            value: 'el-icon-info',
            label: '信息',
          },
          {
            value: 'el-icon-warning',
            label: '警告'
          },
          {
            value: 'el-icon-question',
            label: '询问'
          }]
      }
    }, created () {
      this.init()
      this.getMessageList()
    },
    methods: {
      init () {
        this.$axios.post(`/bdmsAccountApi/service.v1.Account/GetUserNameOptions`).then(res => {
          if (res.data.code === 0) {
            this.userOptions = res.data.data.userOptions
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

      getMessageList () {
        this.loading = true
        this.$axios.post(`/bdmsMessageApi/service.v1.Message/GetMessagePage`, this.queryInfo).then(res => {
          if (res.data.code === 0) {
            this.messagePage = res.data.data
            this.loading = false
          } else {
            this.$message.error('获取通知列表失败！')
          }
        })
      },

      handleSizeChange (newSize) {
        this.queryInfo.pageSize = newSize
        this.getMessageList()
      },

      handleCurrentChange (newSize) {
        this.queryInfo.pageNum = newSize
        this.getMessageList()
      },

      handleSearchClick () {
        this.queryInfo.pageNum = 1
        this.getMessageList()
      },

      addDialogClosed () {
        this.userList = []
        this.$refs.addFormRef.resetFields()
      },

      addMessage () {
        if (this.userList.length <= 0) this.$message.warning('请选择通知用户')
        this.$refs.addFormRef.validate(volid => {
          if (!volid) return
          this.addForm.releaseTime = Number(this.addForm.releaseTime / 1000)
          this.$axios.post(`/bdmsMessageApi/service.v1.Message/AddMessage`,
            {
              message: this.addForm,
              userList: this.userList,
            }
          ).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.add].menuName + '成功')
              this.getMessageList()
              this.addDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.add].menuName + '失败！')
              this.addForm.releaseTime = Number(this.addForm.releaseTime * 1000)
            }
          })
        })
      },

      showEditDialog (message) {
        this.editForm = JSON.parse(JSON.stringify(message))
        this.editForm.releaseTime = Number(this.editForm.releaseTime * 1000)
        this.editDialogVisible = true
      },

      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
        this.editForm = {}
      },

      editMessage () {
        this.$refs.editFormRef.validate(volid => {
          if (!volid) return
          this.editForm.releaseTime = Number(this.editForm.releaseTime / 1000)
          this.$axios.post(`/bdmsMessageApi/service.v1.Message/UpdateMessage`,
            {
              id: this.editForm.id,
              message: this.editForm
            }).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.edit].menuName + '成功')
              this.getMessageList()
              this.editDialogVisible = false
            } else {
              this.$message.error(this.rightMap[this.menuObject.edit].menuName + '失败！')
              this.editForm.releaseTime = Number(this.editForm.releaseTime * 1000)
            }
          })
        })
      },

      removeMessageById (id) {
        this.$confirm(
          '此操作将无法撤回, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.$axios.post(`/bdmsMessageApi/service.v1.Message/DeleteMessage`, {id: id}).then(res => {
            if (res.data.code === 0 && res.data.data.result === 'success') {
              this.$message.success(this.rightMap[this.menuObject.delete].menuName + '成功')
              this.getMessageList()
            } else {
              this.$message.error(this.rightMap[this.menuObject.delete].menuName + '失败！')
            }
          })
        }).catch(() => {
          this.$message.info('已取消' + this.rightMap[this.menuObject.edit].menuName)
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .ql-editor {
    min-height: 300px;
  }
</style>
