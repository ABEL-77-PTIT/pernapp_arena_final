import apiCaller from '../helpers/apiCaller.js'

const find = async (query) => {
  return await apiCaller(`/api/products`)
}

const findById = async (id) => {
  return await apiCaller(`/api/products/${id}`)
}

const _delete = async (id) => {
  return await apiCaller(`/api/products/${id}`, 'DELETE')
}

const ProductApi = { find, findById, delete: _delete }

export default ProductApi
