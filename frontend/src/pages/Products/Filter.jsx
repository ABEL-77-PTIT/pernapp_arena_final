import PropTypes from 'prop-types'
import { ActionList, Button, ButtonGroup, Popover, Stack, Tag } from '@shopify/polaris'
import { TextField } from '@shopify/polaris'
import { useState } from 'react'

Filter.propTypes = {
  filter: PropTypes.object,
  onChange: PropTypes.func,
  vendors: PropTypes.array,
}

Filter.defaultProps = {
  filter: {},
  onChange: () => null,
  vendors: [],
}

function Filter(props) {
  const { onChange, filter, vendors } = props

  const [search, setSearch] = useState(filter.keyword || '')
  const [publish, setPublish] = useState(false)
  const [vendorActive, setVendorsActive] = useState(false)

  console.log('vendors', vendors)
  const publishActionList = [
    {
      content: 'True',
      value: 'true',
      onAction: () => onChange({ ...filter, publish: 'true' }) & setPublish(false),
    },
    {
      content: 'False',
      value: 'false',
      onAction: () => onChange({ ...filter, publish: 'false' }) & setPublish(false),
    },
  ]

  const vendorssActionList = vendors.map((item) => ({
    content: item.name,
    value: '' + item.id,
    onAction: () => onChange({ ...filter, vendorId: '' + item.id }) & setVendorsActive(false),
  }))

  console.log('vendorssActionList', vendorssActionList)

  const handleSearch = (value) => {
    setSearch(value)

    if (window.__searchTimeout) {
      clearTimeout(window.__searchTimeout)
    }

    window.__searchTimeout = setTimeout(() => {
      onChange({ ...filter, keyword: value })
    }, 600)
  }

  return (
    <Stack vertical alignment="fill">
      <Stack>
        <Stack.Item fill>
          <TextField
            value={search}
            placeholder="Search.."
            onChange={(value) => handleSearch(value)}
            clearButton
            onClearButtonClick={() => {
              setSearch('')
              onChange({ ...filter, keyword: '' })
            }}
          />
        </Stack.Item>
        <Stack.Item fill>
          <ButtonGroup segemented>
            <Popover
              active={publish}
              activator={
                <Button disclosure onClick={() => setPublish(!publish)}>
                  Publish
                </Button>
              }
              onClose={() => setPublish(false)}
            >
              <ActionList actionRole="menuitem" items={publishActionList} />
            </Popover>
            <Popover
              active={vendorActive}
              activator={
                <Button disclosure onClick={() => setVendorsActive(!vendorActive)}>
                  Vendors
                </Button>
              }
              onClose={() => setVendorsActive(false)}
            >
              <ActionList actionRole="menuitem" items={vendorssActionList} />
            </Popover>
          </ButtonGroup>
        </Stack.Item>

        <Stack>
          {Boolean(filter.publish) && (
            <Tag onRemove={() => onChange({ ...filter, publish: '' })}>
              Status: {publishActionList.find((item) => item.value === filter.publish).content}
            </Tag>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Filter
