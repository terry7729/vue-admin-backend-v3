import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: 'https://api-dev/search/user',
    method: 'get',
    params: { name }
  })
}
