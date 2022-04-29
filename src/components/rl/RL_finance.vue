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
          <el-input placeholder="关键字搜索"
                    v-model="queryInfo.query"
                    @keyup.enter.native="handleProjectSearchClick"
                    clearable
                    @clear="handleProjectSearchClick">
            <el-button slot="append" icon="el-icon-search" @click="handleProjectSearchClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     :icon="rightMap[menuObject.build] === undefined ? 'el-icon-circle-close' : rightMap[menuObject.build].icon "
                     @click="buildDialogVisible = true"
                     :disabled="rightMap[menuObject.build] === undefined">
            {{ rightMap[menuObject.build] === undefined ? '按钮禁用' : rightMap[menuObject.build].menuName }}
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table height="750" :data="projectPage.page" v-loading="loading" border stripe>
        <el-table-column type="index" label="#" width="40px" fixed="left"></el-table-column>
        <el-table-column prop="name" label="项目名称" width="150px" fixed="left"></el-table-column>
        <el-table-column prop="development" label="建设单位" width="120px"></el-table-column>
        <el-table-column prop="construction" label="施工单位" width="120px"></el-table-column>
        <el-table-column prop="schedule" label="工期" width="250px"></el-table-column>
        <el-table-column prop="contract" label="合同价格 / 元" width="150px">
          <template v-slot="scope">
            {{scope.row.contract | moneyFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="prepayment" label="预付款 / 元" width="150px">
          <template v-slot="scope">
            {{scope.row.prepayment | moneyFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度款情况" width="100px"></el-table-column>
        <el-table-column prop="signTime" label="签订日期" width="100px">
          <template v-slot="scope">
            {{scope.row.createTime | timeFilter('YYYY-mm-dd')}}
          </template>
        </el-table-column>
        <el-table-column prop="transfer" label="累计进账 / 元" width="150px" >
          <template v-slot="scope">
            {{scope.row.transfer | moneyFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="transferTimes" label="进账次数" width="80px"></el-table-column>
        <el-table-column prop="expense" label="累计转款 / 元" width="150px" >
          <template v-slot="scope">
            {{scope.row.expense | moneyFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="expenseTimes" label="转款次数" width="80px"></el-table-column>
        <el-table-column prop="total" label="收支总计 / 元" width="150px" >
          <template v-slot="scope">
            {{scope.row.transfer | totalFilter(scope.row.expense, ',')}}
          </template>
        </el-table-column>
        <el-table-column prop="judge" label="审定价格 / 元" width="150px">
          <template v-slot="scope">
            {{scope.row.judge | moneyFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="项目状态" width="80px">
          <template v-slot="scope">
            {{scope.row.state |stateFilter()}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="80px"></el-table-column>
        <el-table-column prop="createUserId" label="创建人" width="100px" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="createTime" label="创建日期" width="100px">
          <template v-slot="scope">
            {{scope.row.createTime | timeFilter('YYYY-mm-dd')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" fixed="right">
          <template v-slot="scope">
            <el-tooltip class="item" effect="dark"
                        :content="rightMap[menuObject.management] === undefined ? '禁用' : rightMap[menuObject.management].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="primary"
                         :icon="rightMap[menuObject.management] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.management].icon"
                         size="mini"
                         @click="showManagementDialog(scope.row)"
                         :disabled="rightMap[menuObject.management] === undefined"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.state === '1'" class="item" effect="dark"
                        :content="rightMap[menuObject.termination] === undefined ? '禁用' : rightMap[menuObject.termination].menuName"
                        placement="top"
                        :enterable="false">
              <el-button type="danger"
                         :icon="rightMap[menuObject.termination] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.termination].icon"
                         size="mini"
                         @click="terminationProjectById(scope.row.id)"
                         :disabled="rightMap[menuObject.termination] === undefined"></el-button>
            </el-tooltip>
            <el-tooltip v-else class="item" effect="dark"
                        :content="rightMap[menuObject.restart] === undefined ? '禁用' : rightMap[menuObject.restart].menuName"
                        placement="top" :enterable="false">
              <el-button type="warning"
                         :icon="rightMap[menuObject.restart] === undefined ? 'el-icon-circle-close' :rightMap[menuObject.restart].icon"
                         size="mini"
                         @click="restartProjectById(scope.row.id)"
                         :disabled="rightMap[menuObject.restart] === undefined"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleProjectSizeChange"
        @current-change="handleProjectCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[6, 15, 25, 50]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="projectPage.total">
      </el-pagination>
    </el-card>

    <!--新建项目-->
    <el-dialog
      :title="rightMap[menuObject.build] === undefined ? '禁用' : rightMap[menuObject.build].menuName"
      :visible.sync="buildDialogVisible"
      width="700px"
      @close="buildDialogClosed">
      <el-form :model="buildForm"
               :rules="buildFormRules"
               ref="buildFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="buildForm.name"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="建设单位" prop="development">
              <el-input v-model="buildForm.development"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="施工单位" prop="construction">
              <el-input v-model="buildForm.construction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="工期" prop="schedule">
              <el-input placeholder="格式:YYYY-mm-dd ~ YYYY-mm-dd"
                        v-model="buildForm.schedule"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="合同价格" prop="contract">
              <el-input v-model="buildForm.contract"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签订日期" prop="signTime">
              <el-date-picker
                v-model="buildForm.signTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="预付款" prop="prepayment">
              <el-input v-model="buildForm.prepayment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="进度款" prop="progress">
              <el-input placeholder="进度款情况描述"
                        v-model="buildForm.progress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="审定价格" prop="judge">
              <el-input v-model="buildForm.judge"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="buildForm.remark"></el-input>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="buildDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="buildProject">确 定</el-button>
      </span>
    </el-dialog>

    <!--管理项目-->
    <el-dialog
      :title="rightMap[menuObject.management] === undefined ? '禁用' : rightMap[menuObject.management].menuName"
      :visible.sync="managementVisible"
      width="700px"
      @close="managementDialogClosed">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input placeholder="关键字搜索"
                    v-model="queryBilling.query"
                    @keyup.enter.native="handleBillSearchClick"
                    clearable
                    size="small"
                    @clear="handleBillSearchClick">
            <el-button slot="append" icon="el-icon-search" @click="handleBillSearchClick"></el-button>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-col :span="11">
            <el-button type="primary"
                       :icon="rightMap[menuObject.modify] === undefined ? 'el-icon-circle-close' : rightMap[menuObject.modify].icon "
                       size="small"
                       @click="showModifyDialog()"
                       :disabled="rightMap[menuObject.modify] === undefined">
              {{rightMap[menuObject.modify] === undefined ? '按钮禁用' : rightMap[menuObject.modify].menuName}}
            </el-button>
          </el-col>
          <el-col :span="11">
            <el-button type="primary"
                       :icon="rightMap[menuObject.add] === undefined ? 'el-icon-circle-close' : rightMap[menuObject.add].icon "
                       size="small"
                       @click="addDialogVisible = true"
                       :disabled="rightMap[menuObject.add] === undefined">
              {{rightMap[menuObject.add] === undefined ? '按钮禁用' : rightMap[menuObject.add].menuName}}
            </el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-table
        height="350px"
        style="width: 100%"
        :data="billingPage.page"
        :default-sort = "{prop: 'time', order: 'descending'}"
        v-loading="billLoading"
        border
        stripe>
        <el-table-column prop="time" label="日期" width="120" sortable>
          <template v-slot="scope">
            {{scope.row.time | timeFilter('YYYY-mm-dd')}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额 / 元" width="180">
          <template v-slot="scope">
            {{scope.row | amountFilter(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="direction" label="进账途径 / 转款去向" width="220">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="125">
          <template slot-scope="scope">
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
                         @click="removeBillById(scope.row.id)"
                         :disabled="rightMap[menuObject.delete] === undefined"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleBillSizeChange"
        @current-change="handleBillCurrentChange"
        :current-page="queryBilling.pageNum"
        :page-sizes="[6, 15, 25, 50]"
        :page-size="queryBilling.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="billingPage.total">
      </el-pagination>
    </el-dialog>

    <!--修改项目信息-->
    <el-dialog
      :title="rightMap[menuObject.modify] === undefined ? '禁用' : rightMap[menuObject.modify].menuName"
      :visible.sync="modifyDialogVisible"
      width="700px"
      @close="modifyDialogClosed">
      <el-form :model="modifyForm"
               :rules="modifyFormRules"
               ref="modifyFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="modifyForm.name"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="建设单位" prop="development">
              <el-input v-model="modifyForm.development"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="施工单位" prop="construction">
              <el-input v-model="modifyForm.construction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="22">
            <el-form-item label="工期" prop="schedule">
              <el-input placeholder="格式:YYYY-mm-dd ~ YYYY-mm-dd"
                        v-model="modifyForm.schedule"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="合同价格" prop="contract">
              <el-input v-model="modifyForm.contract"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="签订日期" prop="signTime">
              <el-date-picker
                v-model="modifyForm.signTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="预付款" prop="prepayment">
              <el-input v-model="modifyForm.prepayment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="进度款" prop="progress">
              <el-input v-model="modifyForm.progress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="11">
            <el-form-item label="审定价格" prop="judge">
              <el-input v-model="modifyForm.judge"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="modifyForm.remark"></el-input>
              </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyProject">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加账目-->
    <el-dialog
      :title="rightMap[menuObject.add] === undefined ? '禁用' : rightMap[menuObject.add].menuName"
      :visible.sync="addDialogVisible"
      width="400px"
      @close="addDialogClosed">
      <el-form :model="addForm"
               :rules="addFormRules"
               ref="addFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="账目类型" prop="type">
              <el-select v-model="addForm.type" placeholder="类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易日期" prop="time">
              <el-date-picker
                v-model="addForm.time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易金额" prop="amount">
              <el-input v-model="addForm.amount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易对象" prop="direction">
              <el-input placeholder="进账途径 / 转款去向" v-model="addForm.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBill">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改账目-->
    <el-dialog
      :title="rightMap[menuObject.edit] === undefined ? '禁用' : rightMap[menuObject.edit].menuName"
      :visible.sync="editDialogVisible"
      width="400px"
      @close="editDialogClosed">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-width="80px">
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="账目类型" prop="type">
              <el-select v-model="editForm.type" placeholder="类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易日期" prop="time">
              <el-date-picker
                v-model="editForm.time"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易金额" prop="amount">
              <el-input v-model="editForm.amount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="2">
          <el-col :span="20">
            <el-form-item label="交易对象" prop="direction">
              <el-input v-model="editForm.direction"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBill">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'sys_user',
  data () {
    //验证工期的规则
    let checkSchedule = (rule, value, callback) => {
      const regSchedule = /^\d{4}\-\d{2}\-\d{2} ~ \d{4}\-\d{2}\-\d{2}$/
      if (value === '' ||regSchedule.test(value)) {
        return callback()
      }
      callback(new Error('请按正确格式输入，格式：YYYY-mm-dd ~ YYYY-mm-dd'))
    }
    //验证数字的规则
    let checkNumber = (rule, value, callback) => {
      const regNumber =  /^\d+(\.\d+)?$/
      if (regNumber.test(value)) {
        if(parseFloat(value) <= 0)
          callback(new Error('请输入大于0的阿拉伯数字'))
        return callback()
      }
      callback(new Error('请输入正确的阿拉伯数字'))
    }

    return {
      //权限配置
      menuObject: {
        build: 81,
        management: 87,
        termination: 85,
        restart: 86,
        modify: 88,
        add: 82,
        edit: 83,
        delete: 84,
      },
      rightMap: {},
      //分页数据
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 6,
      },
      projectPage: {
        pageNum: 0,
        pageSize: 0,
        page: [],
        total: 0,
      },
      queryBilling: {
        projectId: '',
        query: '',
        pageNum: 1,
        pageSize: 6,
      },
      billingPage:{
        pageNum: 0,
        pageSize: 0,
        page: [],
        total: 0,
      },
      loading: true,
      billLoading: true,
      //新建项目
      buildDialogVisible: false,
      buildForm: {
        name: '',
        development: '',
        construction: '',
        schedule: '',
        contract: '',
        signTime: '',
        prepayment: '',
        progress: '',
        judge: '',
        remark: '',
        state: '1',
      },
      buildFormRules: {
        name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        development: [
          {required: true, message: '请输入建设单位名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        construction: [
          {required: true, message: '请输入施工单位名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        schedule: [
          {validator: checkSchedule, trigger: 'blur'},
        ],
        contract: [
          {required: true, message: '请输入合同价格', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        signTime: [
          {required: true, message: '请选择签订日期', trigger: 'blur'},
        ],
        prepayment: [
          {required: true, message: '请输入预付款', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        judge: [
          {required: true, message: '请输入审定价格', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
      },
      //管理项目
      managementVisible: false,
      //项目信息
      modifyDialogVisible: false,
      projectInfo: {},
      modifyForm: {},
      modifyFormRules: {
        name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        development: [
          {required: true, message: '请输入建设单位名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        construction: [
          {required: true, message: '请输入施工单位名称', trigger: 'blur'},
          {min: 4, max: 50, message: '名称长度应在4~50个字符之间', trigger: 'blur'},
        ],
        schedule: [
          {validator: checkSchedule, trigger: 'blur'},
        ],
        contract: [
          {required: true, message: '请输入合同价格', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        signTime: [
          {required: true, message: '请选择签订日期', trigger: 'blur'},
        ],
        prepayment: [
          {required: true, message: '请输入预付款', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        judge: [
          {required: true, message: '请输入审定价格', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
      },
      //添加账目
      addDialogVisible: false,
      addForm: {
        projectId: '',
        type: '',
        time: '',
        amount: '',
        direction: '',
        state: '',
      },
      addFormRules: {
        type:  [
          {required: true, message: '请选择账目类型', trigger: 'blur'},
        ],
        time: [
          {required: true, message: '请选择流水日期', trigger: 'blur'},
        ],
        amount: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        direction: [
          {required: true, message: '请输入 进账途径/转款去向', trigger: 'blur'},
        ],
      },
      //修改账目
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        type:  [
          {required: true, message: '请选择账目类型', trigger: 'blur'},
        ],
        time: [
          {required: true, message: '请选择流水日期', trigger: 'blur'},
        ],
        amount: [
          {required: true, message: '请输入金额', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'},
        ],
        direction: [
          {required: true, message: '请输入 进账途径/转款去向', trigger: 'blur'},
        ],
      },
      //选项
      options: [
        {
          value: '1',
          label: '进账'
        }, {
          value: '2',
          label: '转款'
        }]
    }
  }, created () {
    this.init()
    this.getProjectList()
  },
  methods: {
    init () {
      this.grandpa = JSON.parse(Base64.decode(window.sessionStorage.getItem('grandpa')))
      this.parent = JSON.parse(Base64.decode(window.sessionStorage.getItem('parent')))
      let list = JSON.parse(Base64.decode(window.sessionStorage.getItem('children')))
      if (list === null) return
      list.forEach(item => {
        this.rightMap [item.id] = item
      })
    },

    getProjectList () {
      this.loading = true
      this.$axios.post(`/rlFinanceApi/service.v1.Finance/GetProjectPage`, this.queryInfo).then(res => {
        if (res.data.code === 0) {
          this.projectPage = res.data.data
          this.loading = false
        } else {
          this.$message.error('获取项目列表失败！')
        }
      })
    },

    handleProjectSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getProjectList()
    },

    handleProjectCurrentChange (newSize) {
      this.queryInfo.pageNum = newSize
      this.getProjectList()
    },

    handleProjectSearchClick () {
      this.queryInfo.pageNum = 1
      this.getProjectList()
    },

    buildProject () {
      this.$refs.buildFormRef.validate(volid => {
        if (!volid) return
        this.buildForm.signTime = Number(this.buildForm.signTime / 1000)
        this.buildForm.contract = parseFloat(this.buildForm.contract)
        this.buildForm.prepayment = parseFloat(this.buildForm.prepayment)
        this.buildForm.judge = parseFloat(this.buildForm.judge)
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/AddProject`, {project: this.buildForm}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.build].menuName + '成功')
            this.getProjectList()
            this.buildDialogVisible = false
          } else {
            this.$message.error(this.rightMap[this.menuObject.build].menuName + '失败！')
            this.buildForm.signTime = Number(this.buildForm.signTime * 1000)
          }
        })
      })
    },

    buildDialogClosed () {
      this.$refs.buildFormRef.resetFields()
    },

    getBillList() {
      this.queryBilling.projectId = this.projectInfo.id
      this.billingPage.page = []
      this.billLoading = true
      this.$axios.post(`/rlFinanceApi/service.v1.Finance/GetBillPage`, this.queryBilling).then(res => {
        if (res.data.code === 0) {
          this.billingPage = res.data.data
          this.billLoading = false
        } else {
          this.$message.error('获取账单列表失败！')
        }
      })
    },

    handleBillSizeChange (newSize) {
      this.queryBilling.pageSize = newSize
      this.getBillList()
    },

    handleBillCurrentChange (newSize) {
      this.queryBilling.pageNum = newSize
      this.getBillList()
    },

    handleBillSearchClick () {
      this.queryBilling.pageNum = 1
      this.getBillList()
    },

    showManagementDialog (project) {
      this.managementVisible = true
      this.projectInfo = project
      this.getBillList()
    },

    managementDialogClosed () {
      this.managementVisible = false
      this.projectInfo = {}
      this.billingPage.page = []
    },

    terminationProjectById (id) {
      this.$confirm(
        '是否确认完成项目?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/TerminationProject`, {id: id}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.termination].menuName + '成功')
            this.getProjectList()
          } else {
            this.$message.error(this.rightMap[this.menuObject.termination].menuName + '失败！')
          }
        })
      }).catch(() => {
        this.$message.info('已取消' + this.rightMap[this.menuObject.termination].menuName)
      })
    },

    restartProjectById (id) {
      this.$confirm(
        '是否确认重启项目?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/RestartProject`, {id: id}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.restart].menuName + '成功')
            this.getProjectList()
          } else {
            this.$message.error(this.rightMap[this.menuObject.restart].menuName + '失败！')
          }
        })
      }).catch(() => {
        this.$message.info('已取消' + this.rightMap[this.menuObject.restart].menuName)
      })
    },

    showModifyDialog () {
      this.modifyForm = JSON.parse(JSON.stringify(this.projectInfo))
      this.modifyForm.signTime = Number(this.modifyForm.signTime * 1000)
      this.modifyDialogVisible = true
    },

    modifyDialogClosed () {
      this.$refs.modifyFormRef.resetFields()
      this.modifyForm = {}
    },

    modifyProject () {
      this.$refs.modifyFormRef.validate(volid => {
        if (!volid) return
        this.modifyForm.signTime = Number(this.modifyForm.signTime / 1000)
        this.modifyForm.contract = parseFloat(this.modifyForm.contract)
        this.modifyForm.prepayment = parseFloat(this.modifyForm.prepayment)
        this.modifyForm.judge = parseFloat(this.modifyForm.judge)
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/UpdateProject`,
          {
            id: this.modifyForm.id,
            project: this.modifyForm
          }).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.modify].menuName + '成功')
            this.projectInfo = JSON.parse(JSON.stringify(this.modifyForm))
            this.modifyDialogVisible = false
            this.getProjectList()
          } else {
            this.$message.error(this.rightMap[this.menuObject.modify].menuName + '失败！')
            this.modifyForm.signTime = Number(this.modifyForm.signTime * 1000)
          }
        })
      })
    },

    addBill() {
      this.$refs.addFormRef.validate(volid => {
        if (!volid) return
        this.addForm.projectId = this.projectInfo.id
        this.addForm.time = Number(this.addForm.time / 1000)
        this.addForm.amount = parseFloat(this.addForm.amount)
        this.addForm.state = '1'
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/AddBill`, {bill: this.addForm}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.add].menuName + '成功')
            this.getBillList()
            this.getProjectList()
            this.addDialogVisible = false
          } else {
            this.$message.error(this.rightMap[this.menuObject.add].menuName + '失败！')
            this.addForm.time = Number(this.addForm.time * 1000)
          }
        })
      })
    },

    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    showEditDialog (bill) {
      this.editForm = JSON.parse(JSON.stringify(bill))
      this.editForm.time = Number(this.editForm.time * 1000)
      this.editDialogVisible = true
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },

    editBill () {
      this.$refs.editFormRef.validate(volid => {
        if (!volid) return
        this.editForm.projectId = this.projectInfo.id
        this.editForm.time = Number(this.editForm.time / 1000)
        this.editForm.amount = parseFloat(this.editForm.amount)
        this.editForm.state = '1'
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/UpdateBill`,
          {
            id: this.editForm.id,
            bill: this.editForm
          }).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.edit].menuName + '成功')
            this.getBillList()
            this.getProjectList()
            this.editDialogVisible = false
          } else {
            this.$message.error(this.rightMap[this.menuObject.edit].menuName + '失败！')
            this.editForm.time = Number(this.editForm.time * 1000)
          }
        })
      })
    },

    removeBillById (id) {
      this.$confirm(
        '此操作将无法撤回, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$axios.post(`/rlFinanceApi/service.v1.Finance/DeleteBill`, {id: id}).then(res => {
          if (res.data.code === 0 && res.data.data.result === 'success') {
            this.$message.success(this.rightMap[this.menuObject.delete].menuName + '成功')
            if (this.billingPage.page.length === 1 && this.queryBilling.pageNum > 1) {
              this.queryBilling.pageNum--
            }
            this.getBillList()
            this.getProjectList()
          } else {
            this.$message.error(this.rightMap[this.menuObject.delete].menuName + '失败！')
          }
        })
      }).catch(() => {
        this.$message.info('已取消' + this.rightMap[this.menuObject.delete].menuName)
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
    stateFilter (state) {
      return state === '1' ? '正常' : '结束'
    },
    totalFilter (transfer, expense, dot) {
      let s = transfer - expense

      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
      let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      let t = ""
      for(let i = 0; i < l.length; i ++ )   {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? dot : "");
      }
      return t.split("").reverse().join("") + "." + r;
    },
    amountFilter (bill, dot) {
      let s = bill.type === '1' ? Number(bill.amount) : Number(-bill.amount)

      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
      let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      let t = ""
      for(let i = 0; i < l.length; i ++ )   {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? dot : "");
      }
      return t.split("").reverse().join("") + "." + r;
    },
    moneyFilter (s, dot) {
      s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
      let l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
      let t = ""
      for(let i = 0; i < l.length; i ++ )   {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? dot : "");
      }
      return t.split("").reverse().join("") + "." + r;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>

<!--this.userInfo = window.localStorage.getItem('save') === '1' ? window.localStorage.getItem('userInfo') : window.sessionStorage.getItem('userInfo')-->
<!--this.userInfo = JSON.parse(Base64.decode(this.userInfo))-->
<!--this.$axios.post(`/bdmsAccountApi/service.v1.Account/GetUserRole`, {id: this.userInfo.id})-->
