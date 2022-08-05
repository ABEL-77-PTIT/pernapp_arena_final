import apiCaller from '../helpers/apiCaller.js'

const count = async () => {
  return await apiCaller(`/api/vendors/count`)
}

const find = async () => {
  return await apiCaller(`/api/vendors`)
}

// const findById = async (id) => {
//   return await apiCaller(`/api/vendors/${id}`)
// }

// const create = async () => {

// }

const _delete = async (id) => {
  return await apiCaller(`/api/vendors/${id}`, 'DELETE')
}

const VendorApi = { count, find, delete: _delete }

export default VendorApi
