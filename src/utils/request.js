import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://localhost:8080/service/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(JSON.stringify(res))

    if (res.code === 401) {
      MessageBox.confirm('提示', res.message, {
        confirmButtonText: '重新输入',
        cancelButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }

    if (res.code === 200) {
      return res
    }

    if (res.code === 500) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    /*
    if (res.code !== 200) {
      if (res.code === 500) {
        
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return res
        
      }
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('请检查您是否已经登录', res.message, {
          confirmButtonText: '重新登录',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      
      return Promise.reject(new Error(res.message || 'Error'))
      // return res
    } else {
      return res
    }
    */
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
