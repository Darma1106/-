<template>
  <div class="login">
    <img src="../../assets/image/login-main.png" alt="" />
    <div class="login-box">
      <h1>登陆</h1>
      <div class="input-box">
        <!-- <div class="input-text">
          <span class="iconfont icon-mine"></span>
          <input type="text" placeholder="用户名" />
        </div>
        <div class="input-text">
          <span class="iconfont icon-lock"></span>
          <input type="password" placeholder="密码" />
        </div>
        <div class="input-btn">登陆</div>
        <div class="sign-up">还没账户？<a href="#">立即注册</a></div>
        -->
        <div class="input-btn" @click="handleLogin">登陆</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = () => {
  router.push('home')
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
}
</style>
