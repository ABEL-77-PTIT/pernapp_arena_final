import Repository from '../repositories/vendor.js'

export default {
  count: async (req) => {
    try {
      return Repository.count()
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

  findById: async () => {},

  create: async (req) => {
    try {
      return await Repository.create(req)
    } catch (error) {
      throw error
    }
  },

  update: async () => {},

  delete: async () => {},
}
