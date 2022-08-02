import { Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import ProductApi from '../../api/product.js'
import VendorApi from '../../api/vendor.js'
import AppHeader from '../../components/AppHeader/index.jsx'
import MyPagination from '../../components/MyPagination/index.jsx'
import PagePreloader from '../../components/PagePreloader/index.jsx'
import ConfirmDelete from './ConfirmDelete.jsx'
import CreateForm from './CreateForm.jsx'
import Table from './Table.jsx'

function ProductsPage(props) {
  const { actions, products, vendors } = props

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

  const getProducts = async ({ page, limit }) => {
    try {
      actions.showAppLoading()
      let res = await ProductApi.find({ page, limit })

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
    if (!products) {
      getProducts({})
    }
  }, [products])

  useEffect(() => {
    if (!vendors) {
      getVendors()
    }
  }, [vendors])

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
      getProducts({})
    } catch (error) {
      console.log(error)
      actions.showNotify({ message: error.message, error: true })
    } finally {
      actions.hideNotify()
    }
  }

  const handleSubmit = (formData) => {
    console.log('formData', formData)
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
          <div>
            Total items: <b>{products?.items.length}</b>
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
            onChange={({ page, limit }) => getProducts({ page, limit })}
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
