import request from '@/utils/request'

/**
 * 登录
 * @param {workId, password} data 用户信息
 */
export function login(data) {
  const param = new URLSearchParams()
  param.append('studentId', data.studentId)
  param.append('password', data.password)
  return request({
    url: 'http://localhost:8080/service/auth/student',
    method: 'post',
    data: param,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export function getInfo() {
  return request({
    url: 'http://localhost:8080/service/auth/studentinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'http://localhost:8080/service/auth/logout/student',
    method: 'get'
  })
}
