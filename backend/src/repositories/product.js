import { Op, where } from 'sequelize'
import Model from '../models/product.js'
import VendorModel from '../models/vendor.js'

const include = [{ model: VendorModel, as: 'vendor' }]

const count = async () => {
  try {
    return await Model.count()
  } catch (error) {
    throw error
  }
}

const find = async (req) => {
  try {
    const { page, limit, status, price, vendorId, keyword, publish, sort } = req.query
    console.log('🚀 ~ file: product.js ~ line 18 ~ find ~ price', price)
    let _page = page ? (parseInt(page) >= 1 ? parseInt(page) : 1) : 1
    let _limit = limit ? (parseInt(limit) >= 1 ? parseInt(limit) : 20) : 20

    let where = {}
    if (status !== undefined) {
      where = { ...where, status }
    }

    if (price) {
      where = {
        ...where,
        price: {
          [Op.gte]: parseInt(price.split('-')[0]),
          [Op.lte]: parseInt(price.split('-')[1]),
        },
      }
    }

    if (vendorId !== undefined) {
      if (vendorId !== '0') {
        where = { ...where, vendorId: parseInt(vendorId) }
      } else {
        where = { ...where, vendorId: { [Op.is]: null } }
      }
    }

    if (keyword) {
      where = {
        ...where,
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } },
        ],
      }
    }

    if (publish !== undefined) {
      where = { ...where, publish: publish }
    }

    console.log('check where ==>>', where)

    // handle sort product
    let arrSort
    if (sort !== undefined) {
      arrSort = sort.split('-')
    }

    console.log('check Sort ==>>', arrSort)

    const count = await Model.count({ where })
    const items = await Model.findAll({
      where,
      limit: _limit,
      offset: (_page - 1) * _limit,
      include,
      order: [arrSort ? [arrSort[0], arrSort[1]] : ['updatedAt', 'DESC']],
    })

    return {
      items,
      page: _page,
      limit: _limit,
      totalPages: Math.ceil(count / _limit),
      totalItems: count,
    }
  } catch (error) {
    throw error
  }
}

const findById = async (id) => {
  try {
    const entry = await Model.findOne({ where: { id }, include })
    if (!entry) {
      throw new Error('Not found')
    }

    return entry
  } catch (error) {
    throw error
  }
}

const create = async (data) => {
  try {
    const created = await Model.create(data)

    return findById(created.id)
  } catch (error) {
    throw error
  }
}

const update = async (id, data) => {
  try {
    const updated = await Model.update(data, { where: { id }, returning: true, plain: true })
    //sự khác biệt khi co plain: true thì trả về undefined, không có thì trả về mội
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
