import request from '@/utils/request'

export function getList() {
  return request({
    url: 'http://localhost:8080/service/sevaluation/course',
    method: 'get'
  })
}

export function getKpiList() {
  return request({
    url: 'http://localhost:8080/service/sevaluation/',
    method: 'get'
  })
}

export function sendEvaluationData(result) {
  return request({
    url: 'http://localhost:8080/service/sevaluation/result',
    method: 'post',
    data: result
  })
}
