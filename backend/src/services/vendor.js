import Repository from '../repositories/vendor.js'

export default {
  count: async () => {
    try {
      return await Repository.count()
    } catch (error) {
      throw error
    }
  },

  find: async (req) => {
    try {
      return await Repository.find(req)
    } catch (error) {
      throw error
    }
  },

  findById: async (req) => {
    try {
      const { id } = req.params
      return await Repository.findById(id)
    } catch (error) {
      throw error
    }
  },

  create: async (req) => {
    try {
      const data = { ...req.body }
      return await Repository.create(data)
    } catch (error) {
      throw error
    }
  },

  update: async (req) => {
    try {
      const { id } = req.params
      const data = { ...req.body }
      return await Repository.update(id, data)
    } catch (error) {
      throw error
    }
  },

  delete: async (req) => {
    try {
      const { id } = req.params
      return await Repository.delete(id)
    } catch (error) {
      throw error
    }
  },
}
