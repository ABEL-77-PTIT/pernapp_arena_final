import Model from '../models/vendor.js'

const count = async () => {
  try {
    return await Model.count()
  } catch (error) {
    throw error
  }
}
const find = async (req) => {
  try {
    return await Model.findAll()
  } catch (error) {
    throw error
  }
}

const findById = async () => {}

const create = async (req) => {
  try {
    const data = { ...req.body }

    return await Model.create(data)
  } catch (error) {
    throw error
  }
}

const update = async () => {}
const _delete = async () => {}

export default {
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}
