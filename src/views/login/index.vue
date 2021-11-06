<template>
  <div class="login-container">
    <!-- 头部区域 -->
<van-nav-bar
  title="登录"
  class="app-nav-bar"
  left-arrow
  @click-left="$router.back()"
/>
<!-- /头部区域 -->
<!-- 登录表单 -->
<van-form  :show-error-message="false" :show-error="false" validate-first ref="login-form" @submit="onLogin" @failed="onFailed">
  <van-field
    v-model="user.mobile"
    icon-prefix="toutiao"
    left-icon="shouji"
    center
    placeholder="请输入手机号"
    name="mobile"
    :rules="formRules.mobile"
  />
  <van-field
    v-model="user.code"
    clearable
    icon-prefix="toutiao"
    center
    left-icon="yanzhengma"
    placeholder="请输入验证码"
    name="code"
    :rules="formRules.code"
  >
   <template #button>
     <van-count-down v-if="isCountDowShow" :time="1000 * 60" format=" ss s" @finish="isCountDowShow=false" />
    <van-button v-else class="send-btn" size="mini" round  type="info" @click.prevent="onSendSms" :loading="isSendSmsLoading">发送验证码</van-button>
  </template>
  </van-field>
  <div class="login-btn-wrap">
  <van-button class="login-btn" type="info" block >登录</van-button>
</div>
</van-form>

<!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user.js'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      // 登录表单的验证规则
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      msg: '',
      isCountDowShow: false, // 控制倒计时和发送按钮的状态
      isSendSmsLoading: false // 发送验证码按钮的loading状态
    }
  },
  methods: {
    // 点击登录
    async onLogin () {
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true,
        duration: 0 // 展示时间
      })
      try {
        const { data: res } = await login(this.user)

        this.$toast.success('登录成功')
        // 将后端返回的用户登录状态(token等数据)放到vuex容器中
        this.$store.commit('setuser', res.data)
        // 登录成功跳转原来页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('登录失败,手机号或验证码错误')
        }
      }
    },
    onFailed (error) {
      if (error.errors[0]) {
        this.$toast({ message: error.errors[0].message, position: 'top' })
      }
    },
    async onSendSms () {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 展示按钮的loading状态，防止网络慢用户多次点击触发行为
        await sendSms(this.user.mobile)
        // 显示倒计时
        this.isCountDowShow = true
      } catch (err) {
        // try里面任何的错误代码都会进入catch
        // 不同的错误需要不同的提示，就需要判断
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          this.msg = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          this.msg = err.message
        } else {
          this.msg = '发送失败，请稍后重试'
        }
        // 提示用户
        this.$toast({ message: this.msg, position: 'top' })
      }
      // 无论发送验证码发送成功还是失败都要关闭发送按钮的loading状态
      this.isSendSmsLoading = false
    }

  }
}
</script>

<style lang="less" scoped>
.login-container{
.send-btn{
  background-color:#ededed;
  border: none;
  .van-button__text{
        font-size: 11px;
        color:#666;
      }
}
  .login-btn-wrap{
    padding: 26px 16px;
    .login-btn{
      background-color: #6db4fb;
      border: none;
      .van-button__text{
        font-size: 15px;
      }

    }
  }
}
</style>
