import ResponseHandler from '../helpers/responseHandler.js'
import Service from '../services/vendor.js'
export default {
  count: async (req, res) => {
    try {
      const data = await Service.count(req)
      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  find: async (req, res) => {
    try {
      const data = await Service.find(req)
      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  findById: async () => {
    try {
    } catch (error) {}
  },

  create: async (req, res) => {
    try {
      const data = await Service.create(req)

      return ResponseHandler.success(res, data)
    } catch (error) {
      return ResponseHandler.error(res, error)
    }
  },

  update: async () => {
    try {
    } catch (error) {}
  },

  delete: async () => {
    try {
    } catch (error) {}
  },
}
