import { request } from '@/utils'

export const apiClassPhoto = {
  // class-photos接口

  readDorm: (params = {}) => request.get('/class/dorm/page', { params }), //分页查询寝室
  readMember: (params = {}) => request.get('/class/member/page', { params }), //分页查询成员

  getAllPhotos: () => request.get('/class/findAllClassPhotos', false),
  getPhotosByRoomId: (params) => request.get(`/class/findOne/${params.id}`, false),
  getAllRoomIds: () => request.get('/class/findAllRomIDs', false),
  createRoom: (params) => request.post('/class/createRoom', params),
  updateRoom: (params) => request.put('/class/updateRoom', params),
  deleteRoom: (id) => request.delete(`/class/deleteRoom/${id}`, false),
  createMember: (params) => request.post('/class/createMember', params),
  updateMember: (params) => request.put(`/class/updateMember/${params.id}`, params),
  deleteMember: (id) => request.delete(`/class/deleteMember/${id}`, ''),
}
