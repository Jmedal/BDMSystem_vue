import axios from 'axios'
import Vue from 'vue'
import Md5 from 'js-md5'
import {Base64} from 'js-base64'
import router from '../../../router/router'

/*在 request 拦截器实现*/
axios.interceptors.request.use(config => {
  // 每次请求时会从localStorage中获取token
  const localTokenStr = window.localStorage.getItem('access_token')
  const sessionTokenStr = window.sessionStorage.getItem('access_token')
  let token = localTokenStr ? localTokenStr : sessionTokenStr
  let randomKey = ''
  if (token) {
    const localRandomKeyStr = window.localStorage.getItem('randomKey')
    const sessionRandomKeyStr = window.sessionStorage.getItem('randomKey')
    randomKey = localRandomKeyStr ? localRandomKeyStr : sessionRandomKeyStr
    config.headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  } else {
    config.headers = {
      'Content-Type': 'application/json'
    }
  }
  config.responseType = 'json'
  if (config.data !== undefined && config.data !== null) {
    let jsonData = JSON.stringify(config.data)
    let encode = Base64.encode(jsonData)
    let sign = Md5(encode + randomKey)
    config.data = {
      'object': encode,
      'sign': sign
    }
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.data.code === -403 || response.data.code === -401) {
    // 删除已经失效或过期的token
    let save = window.localStorage.getItem('save')
    save === '1' ? window.localStorage.clear() : window.sessionStorage.clear()
    window.localStorage.setItem('save', save)
    //提示
    Vue.prototype.$message.warning('您的登录信息已失效，请重新登录系统！')
    // 到登录页重新获取token
    router.push('/login')
  }
  return response

}, function (error) {
  return Promise.reject(error)
})

export default axios
