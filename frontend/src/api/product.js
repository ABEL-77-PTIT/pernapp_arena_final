import apiCaller from '../helpers/apiCaller.js'

const find = async (query) => {
  console.log('query', query)
  return await apiCaller(`/api/products${query}`)
}

const findById = async (id) => {
  return await apiCaller(`/api/products/${id}`)
}

const create = async (data) => {
  return await apiCaller(`/api/products`, 'POST', data)
}

const update = async (id, data) => {
  return await apiCaller(`/api/products/${id}`, 'PUT', data)
}

const _delete = async (id) => {
  return await apiCaller(`/api/products/${id}`, 'DELETE')
}

const ProductApi = { find, findById, create, update, delete: _delete }

export default ProductApi
