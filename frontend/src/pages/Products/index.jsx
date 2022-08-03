import { Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import qs from 'query-string'
import { useLocation, useSearchParams } from 'react-router-dom'

import ProductApi from '../../api/product.js'
import UploadApi from '../../api/upload.js'
import VendorApi from '../../api/vendor.js'

import AppHeader from '../../components/AppHeader/index.jsx'
import MyPagination from '../../components/MyPagination/index.jsx'
import PagePreloader from '../../components/PagePreloader/index.jsx'
import ConfirmDelete from './ConfirmDelete.jsx'
import CreateForm from './CreateForm.jsx'
import Filter from './Filter.jsx'
import Table from './Table.jsx'

function ProductsPage(props) {
  const { actions, products, vendors } = props
  const location = useLocation()

  const [searcParams, setSearchParams] = useSearchParams()
  const [isReady, setIsReady] = useState(false)
  const [created, setCreated] = useState(null)
  const [deleted, setDeleted] = useState(null)

  console.log('products', products)

  useEffect(() => {
    if (!isReady && products) {
      setIsReady(true)
    }
  })

  const getVendors = async () => {
    try {
      actions.showAppLoading()
      let res = await VendorApi.find()

      if (!res.success) {
        throw res.error
      }

      actions.setVendors(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  const getProducts = async (query) => {
    try {
      actions.showAppLoading()
      let res = await ProductApi.find(query)

      if (!res.success) {
        throw res.error
      }

      actions.setProducts(res.data)
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  useEffect(() => {
    if (!vendors) {
      getVendors()
    }
  }, [])

  useEffect(() => {
    console.log('useEffect location')
    console.log('search', qs.parse(location.search))
    //chinhs xacs la bij o day roi
    if (!products || location.search) {
      getProducts(location.search)
    }
  }, [location])

  if (!isReady) {
    return <PagePreloader />
  }

  const handleDelete = async () => {
    try {
      actions.showAppLoading()

      let res = await ProductApi.delete(deleted.id)

      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: 'Deleted' })

      setDeleted(null)
      //xóa đồng thời ở api và bên redux
      getProducts(location.search)
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideNotify()
    }
  }

  const handleSubmit = async (formData) => {
    try {
      actions.showAppLoading()

      //handle upload Thumbnail
      if (formData['thumbnail'].value) {
        let thumbnail = await UploadApi.upload([formData['thumbnail'].value])

        if (!thumbnail.success) {
          actions.showNotify({ error: true, message: thumbnail.error.message })
        }
        formData['thumbnail'].value = thumbnail.data[0]
      }

      //handle upload Images
      if (formData['images'].value) {
        let images = await UploadApi.upload(formData['images'].value)

        if (!images.success) {
          actions.showNotify({ error: true, message: images.error.message })
        }
        formData['images'].value = [...images.data, ...formData['images'].originValue]
      } else if (formData['images'].originValue.length) {
        formData['images'].value = formData['images'].originValue
      }

      let data = {}

      Object.keys(formData).forEach((key) =>
        formData[key].value || key === 'publish' || key === 'thumbnail'
          ? (data[key] = formData[key].value)
          : null,
      )

      if (formData['images'].value.length) {
        data['images'] = formData['images'].value
      }

      let res = null
      if (created?.id) {
        // update
        res = await ProductApi.update(created.id, data)
      } else {
        // create
        res = await ProductApi.create(data)
      }
      if (!res.success) {
        throw res.error
      }

      actions.showNotify({ message: created?.id ? 'Saved' : 'Added' })

      setCreated(null)
      setSearchParams({})
    } catch (error) {
      console.log(error)
      actions.showNotify({ error: true, message: error.message })
    } finally {
      actions.hideAppLoading()
    }
  }

  const handleFilter = (filter) => {
    let params = qs.parse(location.search) || {}

    console.log('filter', filter)

    if ('page' in filter) {
      if (filter.page) {
        params = { ...params, page: filter.page }
      } else {
        delete params.page
      }
    }

    if ('limit' in filter) {
      if (filter.limit) {
        params = { ...params, limit: filter.limit }
      } else {
        delete params.limit
      }
    }

    if ('keyword' in filter) {
      if (filter.keyword) {
        params = { ...params, keyword: filter.keyword }
      } else {
        delete params.keyword
      }
    }

    if ('publish' in filter) {
      if (filter.publish) {
        params = { ...params, publish: filter.publish }
      } else {
        delete params.publish
      }
    }

    console.log('filter', filter)

    setSearchParams(params)
  }

  if (created) {
    return (
      <CreateForm
        {...props}
        created={created}
        onDiscard={() => setCreated(null)}
        onSubmit={(formData) => handleSubmit(formData)}
      />
    )
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        title="Products nha"
        actions={[
          {
            label: 'Add product',
            primary: true,
            onClick: () => {
              setCreated({})
            },
          },
        ]}
      />

      <Card>
        <Card.Section>
          <Filter
            vendors={vendors}
            filter={qs.parse(location.search)}
            onChange={(filter) => handleFilter(filter)}
          />
        </Card.Section>
        <Card.Section>
          <div>
            Total items: <b>{products?.totalItems}</b>
          </div>
        </Card.Section>
        <Table
          {...props}
          onEdit={(item) => setCreated(item)}
          onDelete={(item) => setDeleted(item)}
        />
        <Card.Section>
          <MyPagination
            page={products.page}
            limit={products.limit}
            totalPages={products.totalPages}
            onChange={({ page, limit }) => handleFilter({ page, limit })}
          />
        </Card.Section>
      </Card>
      {deleted && (
        <ConfirmDelete
          onDiscard={() => setDeleted(null)}
          onSubmit={() => handleDelete(deleted) & setDeleted(null)}
        />
      )}
    </Stack>
  )
}

export default ProductsPage
