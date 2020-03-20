<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form ref="userRef" :model="user" :rules="loginUserRules" label-width="0px" class="login_form">
        <el-form-item prop="account">
          <el-input prefix-icon="el-icon-user" v-model="user.account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="user.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetUser">重置</el-button>
        </el-form-item>
        <el-form-item class="check">
          <el-checkbox v-model="user.save" true-label="1" false-label="0">记住密码</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        user: {
          account: '',
          password: '',
          save: '0',
        },
        loginUserRules: {
          account: [
            {required: true, message: '请输入用戶名', trigger: 'blur'},
            {min: 3, max: 12, message: '用戶名长度在 3 到 12 个字符', trigger: 'blur'}
          ],
          password:
            [
              {required: true, message: '请输入密码', trigger: 'blur'},
              {min: 4, max: 12, message: '密码长度在 3 到 12 个字符', trigger: 'blur'}
            ]
        }
      }
    },
    methods: {
      login () {
        this.$refs.userRef.validate(async valid => {
          if (!valid) return
          this.$axios.post(`/bdmsUserApi/service.v1.Account/Login`, this.user).then(res => {
            if (res.data.data.result === 'success') {
              this.$notify({
                title: '登录成功',
                message: 'Welcome to BDMSystem!',
                type: 'success'
              })
              //登录获取token令牌；
              //记住密码可以持久化储存，不记住密码就存到sessionStorage；
              if (this.user.save === "1") {
                window.localStorage.setItem('access_token', res.data.data.access_token)
                window.localStorage.setItem('randomKey', res.data.data.randomKey)
              } else {
                window.sessionStorage.setItem('access_token', res.data.data.access_token)
                window.sessionStorage.setItem('randomKey', res.data.data.randomKey)
              }
              this.$router.push({path: '/index/house'})
            } else {
              this.$notify({
                title: '登录失败',
                message: '登录验证失败',
                type: 'warning'
              })
            }
          }, error => {
            this.$notify.error({
              title: '错误',
              message: error
            })
          })
        })
      },
      resetUser () {
        this.$refs.userRef.resetFields()
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10%;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .check {
    display: flex;
  }
</style>
