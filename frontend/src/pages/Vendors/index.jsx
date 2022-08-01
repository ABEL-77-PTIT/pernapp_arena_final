import { Card, Stack } from '@shopify/polaris'
import { useEffect, useState } from 'react'
import VendorApi from '../../api/vendor.js'
import AppHeader from '../../components/AppHeader/index.jsx'
import PagePreloader from '../../components/PagePreloader/index.jsx'
import ConfirmDelete from './ConfirmDelete.jsx'
import Table from './Table.jsx'

function VendorsPage(props) {
  const { actions, vendors } = props
  console.log('vendors', vendors)

  const [isReady, setIsReady] = useState(false)
  const [created, setCreated] = useState(null)
  const [deleted, setDeleted] = useState(null)

  useEffect(() => {
    if (!isReady && vendors) {
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

  useEffect(() => {
    if (!vendors.vendors) {
      getVendors()
    }
  }, [])

  const handleDelete = async (deleted) => {
    console.log('deleted', deleted)
  }

  if (!isReady) {
    return <PagePreloader />
  }

  return (
    <Stack vertical alignment="fill">
      <AppHeader
        title="Vendors"
        actions={[
          {
            label: 'Add vendor',
            primary: true,
            onClick: () => setCreated({}),
          },
        ]}
      />

      <Card>
        <Card.Section>
          <div>
            Total items: <b>{vendors?.vendors?.length}</b>
          </div>
        </Card.Section>
        <Table
          {...props}
          onEdit={(item) => setCreated(item)}
          onDelete={(item) => setDeleted(item)}
        />
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

export default VendorsPage
