import request from '@/utils/request.js'
/**
 * 获取所有频道
 */

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: 'v1_0/channels'
  })
}
// 修改用户指定频道
export const addUserChannel = data => {
  return request({
    method: 'PATCH',
    url: 'v1_0/user/channels',
    data
  })
}
// 删除用户指定频道
export const deleteUserChannel = channelid => {
  return request({
    method: 'DELETE',
    url: `v1_0/user/channels/${channelid}`

  })
}
