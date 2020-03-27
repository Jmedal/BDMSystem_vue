// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import ElementUI, {MessageBox} from 'element-ui'
import echarts from 'echarts'
import axios from './assets/js/axios/axios';
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
import 'echarts/extension/bmap/bmap'
import './assets/css/fonts/iconfont.css'

//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入全局样式表
import './assets/css/global.css'
//导入echarts主题
import './assets/js/echarts/walden'
import './assets/js/echarts/macarons'
import './assets/js/echarts/roma'
import './assets/js/echarts/westeros'

Vue.use(ElementUI)
//富文本编辑器注册
Vue.use(VueQuillEditor)
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})



