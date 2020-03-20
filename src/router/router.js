import Vue from 'vue'
import Router from 'vue-router'
import House from '@/components/house'
import User from '@/components/child_system_components/user'
import Menu from '@/components/child_system_components/menu'
import Role from '@/components/child_system_components/role'
import User_Type from '@/components/child_work_components/user_type'
import Course_Activity from '@/components/child_work_components/course_activity'
import Course_Study from '@/components/child_work_components/course_study'
import Course_List from '@/components/child_work_components/course_list'
import Curriculum_Heat from '@/components/child_work_components/curriculum_heat'
import Profession_Heat from '@/components/child_work_components/profession_heat'
import Company_Profession from '@/components/child_work_components/company_profession'
import Company_Contest from '@/components/child_work_components/company_contest'
import Pholcus from '@/components/child_work_components/pholcus'
import Home from '@/components/home'
import Application from '@/components/application'
import Config from '@/components/config'
import Index from '@/components/index'
import Login from '@/components/Login'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index/house'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'house',
          name: 'house',
          component: House
        },
        {
          path: 'user',
          name: 'user',
          component: User
        },
        {
          path: 'menu',
          name: 'menu',
          component: Menu
        },
        {
          path: 'role',
          name: 'role',
          component: Role
        },
        {
          path: 'user_type',
          name: 'user_type',
          component: User_Type
        },
        {
          path: 'course_activity',
          name: 'course_activity',
          component: Course_Activity
        },
        {
          path: 'course_study',
          name: 'course_study',
          component: Course_Study
        },
        {
          path: 'course_list',
          name: 'course_list',
          component: Course_List
        },
        {
          path: 'curriculum_heat',
          name: 'curriculum_heat',
          component: Curriculum_Heat
        },
        {
          path: 'profession_heat',
          name: 'profession_heat',
          component: Profession_Heat
        },
        {
          path: 'company_profession',
          name: 'company_profession',
          component: Company_Profession
        },
        {
          path: 'company_contest',
          name: 'company_contest',
          component: Company_Contest
        },
        {
          path: 'pholcus',
          name: 'pholcus',
          component: Pholcus
        },
        {
          path: 'home',
          name: 'home',
          component: Home
        },{
          path: 'application',
          name: 'application',
          component: Application
        },
        {
          path: 'config',
          name: 'config',
          component: Config
        },
      ]
    },
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  const localTokenStr = window.localStorage.getItem('access_token')
  const sessionTokenStr = window.sessionStorage.getItem('access_token')
  //进入登陆页面，需要检查是否已经登录
  if (to.path === '/login'){
    if(!localTokenStr && !sessionTokenStr)
      return next()
    else{
      Vue.prototype.$message.info('您已登录系统！')
      return next('/index/house')
    }
  }
  //对localStorage和sessionStorage同时进行读取token检查
  if (!localTokenStr && !sessionTokenStr) {
    Vue.prototype.$message.warning('您还未登录系统，请登录帐号！')
    return next('/login')
  }
  return next()
})

export default router
