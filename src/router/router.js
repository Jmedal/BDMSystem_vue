import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Index from '../components/index'
import House from '../components/house'
import User from '../components/child_system_components/user'
import Menu from '../components/child_system_components/menu'
import Role from '../components/child_system_components/role'
import Message from '../components/child_system_components/message'
import PageNoFound from '../components/404NoFound'
import User_Type from '../components/child_work_components/user_type'
import Course_Activity from '../components/child_work_components/course_activity'
import Course_Study from '../components/child_work_components/course_study'
import Course_List from '../components/child_work_components/course_list'
import Curriculum_Heat from '../components/child_work_components/curriculum_heat'
import Profession_Heat from '../components/child_work_components/profession_heat'
import Company_Profession from '../components/child_work_components/company_profession'
import Company_Contest from '../components/child_work_components/company_contest'
import Imooc_Course from '../components/child_work_components/imooc_course'
import Imooc_Course_Data from '../components/child_work_components/Imooc_Course_Data'
import Pholcus from '../components/child_work_components/pholcus'
import Config from '../components/config'


Vue.use(Router)

const router = new Router({
  mode: 'history',

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
          path: 'message',
          name: 'message',
          component: Message
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
          path: 'imooc_course',
          name: 'imooc_course',
          component: Imooc_Course
        },
        {
          path: 'imooc_course_data',
          name: 'imooc_course_data',
          component: Imooc_Course_Data
        },
        {
          path: 'pholcus',
          name: 'pholcus',
          component: Pholcus
        }, {
          path: 'config',
          name: 'config',
          component: Config
        },
      ]
    },
    {
      path: '/404',
      name: 'PageNoFound',
      component: PageNoFound
    },
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/404') {
    return next()
  }
  let tokenStr = window.localStorage.getItem('save') === '1' ? window.localStorage.getItem('access_token') : window.sessionStorage.getItem('access_token')
  //进入登陆页面，需要检查是否已经登录
  if (to.path === '/login') {
    if (!tokenStr) {
      return next()
    } else {
      Vue.prototype.$message.info('您已登录系统！')
      return next('/index/house')
    }
  }
  //对localStorage和sessionStorage同时进行读取token检查
  if (!tokenStr) {
    Vue.prototype.$message.warning('您还未登录系统，请登录帐号！')
    return next('/login')
  }
  let path = window.localStorage.getItem('save') === '1' ? window.localStorage.getItem('path') : window.sessionStorage.getItem('path')
  if (path) {
    path = JSON.parse(Base64.decode(path))
    if (!path[to.path]) {
      return next('/404')
    }
    return next()
  } else {
    if (to.path === '/index/house' || to.path === '/') {
      return next()
    } else {
      return next('/404')
    }
  }
})

export default router
