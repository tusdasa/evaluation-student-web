<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <h1>重新设置密码</h1>
      </el-header>
      <el-main>
        <div style="width:400px;">
          <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="旧密码">
              <el-input v-model="form.oldPassword" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="form.newPassword" type="password" />
            </el-form-item>
            <el-form-item label="重复一遍新密码">
              <el-input v-model="form.newPasswordAgain" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click.native="updatePassword">修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { restPassword } from '@/api/user'
export default {
  data() {
    return {
      form: {
        newPassword: '',
        oldPassword: '',
        newPasswordAgain: ''
      }
    }
  },
  methods: {
    async updatePassword() {
      if (this.form.oldPassword.length >= 6 && this.form.newPassword.length >= 8 && this.form.newPasswordAgain.length >= 8) {
        if (this.form.newPassword === this.form.newPasswordAgain) {
          await restPassword(this.form).then(response => {
            if (response.code === 200) {
              Message({
                message: '修改成功,请重新登录',
                type: 'success',
                duration: 5 * 1000
              })
            } else {
              Message({
                message: '修改失败, 原密码错误',
                type: 'error',
                duration: 5 * 1000
              })
            }
          })
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=%2Fdashboard`)
        } else {
          Message({
            message: '两次的密码不一致',
            type: 'error',
            duration: 5 * 1000
          })
        }
      } else {
        Message({
          message: '新密码位数不够8位',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
