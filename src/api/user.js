// 用户相关请求模块
import request from '@/utils/request.js'

/** 登录注册 */
export const login = data => {
  return request({
    method: 'POST',
    url: 'v1_0/authorizations',
    data
  })
}
// 发送验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `v1_0/sms/codes/${mobile}`

  })
}
// 获取登录用户信息
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user/'

  })
}
// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/user/channels'

  })
}
// 关注用户
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: 'v1_0/user/followings',
    data: {
      target: userId
    }

  })
}
// 取消关注
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/followings/${userId}`

  })
}
// 收藏
export const addCollect = articleId => {
  return request({
    method: 'POST',
    url: 'v1_0/article/collections',
    data: {
      target: articleId
    }

  })
}
// 取消收藏
export const deleteCollect = articleId => {
  return request({
    method: 'DELETE',
    url: `v1_0/article/collections/${articleId}`

  })
}
// 点赞
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: 'v1_0/article/likings',
    data: {
      target: articleId
    }

  })
}
// 取消点赞
export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `v1_0/article/likings/${articleId}`

  })
}
