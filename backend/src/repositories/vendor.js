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

const findById = async (id) => {
  try {
    const entry = await Model.findOne({ where: { id } })

    if (!entry) {
      throw new Error('Not Found')
    }

    return entry
  } catch (error) {
    throw error
  }
}

const create = async (data) => {
  try {
    return await Model.create(data)
  } catch (error) {
    throw error
  }
}

const update = async (id, data) => {
  try {
    const updated = await Model.update(data, { where: { id }, returning: true, plain: true })

    return findById(updated[1].id)
  } catch (error) {
    throw error
  }
}
const _delete = async (id) => {
  try {
    return await Model.destroy({ where: { id } })
  } catch (error) {
    throw error
  }
}

export default {
  count,
  find,
  findById,
  create,
  update,
  delete: _delete,
}
