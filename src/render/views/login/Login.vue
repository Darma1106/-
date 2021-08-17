<template>
  <div class="login">
    <img src="../../assets/image/login-main.png" alt="" />
    <div class="login-box">
      <h1>登录</h1>
      <div class="input-box">
        <a-form :model="loginFormData" :label-col="{ span: 6 }" class="login-form">
          <a-form-item label="用户名">
            <a-input v-model:value="loginFormData.userName" />
          </a-form-item>
          <a-form-item label="密码">
            <a-input v-model:value="loginFormData.password" type="password" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="margin-left: 10%; width: 100%" @click="handleLogin">登录</a-button>
            <!-- <a-button style="margin-left: 10px">Reset</a-button> -->
          </a-form-item>
        </a-form>

        <!-- <div class="sign-up">还没账户？<a href="#">立即注册</a></div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { User } from '@/services/module/loginService'
import useLogin from '@/store/modules/useLoginStore'

const loginFormData: Ref<User> = ref({ userName: '', password: '' })
const router = useRouter()

const handleLogin = async () => {
  const flag = await useLogin().login(loginFormData.value)
  if (flag) {
    router.push('home')
  }
}
</script>

<style lang="less" scoped>
.login {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  .login-form {
    padding-right: 40px;
  }
  .login-box {
    display: flex;
    justify-content: center;
    align-content: space-around;
    flex-wrap: wrap;
    width: 600px;
    height: 400px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 10px;
    padding: 20px 50px;
    border-radius: 20px;
    h1 {
      width: 100%;
      display: flex;
      justify-content: center;
      color: #fff;
      font-size: 30px;
    }
    .input-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      transform: translateY(-35px);
      .input-text {
        width: 100%;
        display: flex;
        justify-content: center;
        span {
          color: white;
          font-size: 18px;
          margin-top: 20px;
        }
        input {
          border: 0;
          padding: 6px;
          border-bottom: 1px solid white;
          background-color: #ffffff00;
          color: #fff;
          margin-top: 20px;
        }
      }
      .input-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
        width: 145px;
        height: 25px;
        color: #fff;
        background: linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
        border-radius: 25px;
        cursor: pointer;
      }
      .sign-up {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 40px;
        color: white;
        font-size: 15px;
        pointer-events: none;
        a {
          color: #3498db;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
  ::v-deep(.ant-form-item-label > label) {
    color: white;
  }
}
</style>
