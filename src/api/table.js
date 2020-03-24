import request from '@/utils/request'

export function getList() {
  return request({
    url: 'sevaluation/course',
    method: 'get'
  })
}

export function getKpiList() {
  return request({
    url: 'sevaluation/',
    method: 'get'
  })
}

export function sendEvaluationData(result) {
  return request({
    url: 'sevaluation/result',
    method: 'post',
    data: result
  })
}
