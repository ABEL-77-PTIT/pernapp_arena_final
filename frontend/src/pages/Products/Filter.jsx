import PropTypes from 'prop-types'
import {
  ActionList,
  Button,
  ButtonGroup,
  Card,
  Popover,
  RangeSlider,
  Stack,
  Tag,
} from '@shopify/polaris'
import { TextField } from '@shopify/polaris'
import { useState } from 'react'
import Sort from './Sort'

Filter.propTypes = {
  filter: PropTypes.object,
  onChange: PropTypes.func,
  vendors: PropTypes.object,
}

Filter.defaultProps = {
  filter: {},
  onChange: () => null,
  vendors: {},
}

function Filter(props) {
  const { onChange, filter, vendors } = props
  const initialValue = [1000, 5000000]
  const prefix = '$'
  const min = 0
  const max = 10000000
  const step = 100

  const [search, setSearch] = useState(filter.keyword || '')
  const [publishActive, setPublishActive] = useState(false)
  const [vendorActive, setVendorsActive] = useState(false)
  const [statusActive, setStatusActive] = useState(false)
  const [priceActive, setPriceActive] = useState(false)

  const [rangeValue, setRangeValue] = useState(initialValue)

  const publishActionList = [
    {
      content: 'True',
      value: 'true',
      onAction: () => {
        onChange({ ...filter, publish: true })
        setPublishActive(false)
      },
    },
    {
      content: 'False',
      value: 'false',
      onAction: () => {
        onChange({ ...filter, publish: 'false' })
        setPublishActive(false)
      },
    },
  ]

  const vendorsActionList = vendors?.items.map((item) => ({
    content: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    value: '' + item.id,
    onAction: () => onChange({ ...filter, vendorId: '' + item.id }) & setVendorsActive(false),
  }))

  vendorsActionList.unshift({
    content: 'No vendor',
    value: '0',
    onAction: () => onChange({ ...filter, vendorId: '' + 0 }) & setVendorsActive(false),
  })

  const statusActionList = [
    {
      content: 'Active',
      value: 'ACTIVE',
      onAction: () => onChange({ ...filter, status: 'ACTIVE' }) & setStatusActive(false),
    },
    {
      content: 'Draft',
      value: 'DRAFT',
      onAction: () => onChange({ ...filter, status: 'DRAFT' }) & setStatusActive(false),
    },
    {
      content: 'Archived',
      value: 'ARCHIVED',
      onAction: () => onChange({ ...filter, status: 'ARCHIVED' }) & setStatusActive(false),
    },
  ]

  const handleRangeSliderChange = (priceValue) => {
    setRangeValue(priceValue)
  }

  const handleFilterPrice = () => {
    setPriceActive(!priceActive)
    if (window.__searchTimeout) {
      clearTimeout(window._searchTimeout)
    }

    window.__searchTimeout = setTimeout(() => {
      onChange({ ...filter, price: rangeValue })
    }, 600)
  }

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
        <Stack.Item>
          <ButtonGroup segmented>
            <Popover
              active={publishActive}
              activator={
                <Button
                  disclosure={publishActive ? 'up' : 'down'}
                  onClick={() => setPublishActive(!publishActive)}
                >
                  Publish
                </Button>
              }
              onClose={() => setPublishActive(false)}
            >
              <ActionList actionRole="menuitem" items={publishActionList} />
            </Popover>
            <Popover
              active={vendorActive}
              activator={
                <Button
                  disclosure={vendorActive ? 'up' : 'down'}
                  onClick={() => setVendorsActive(!vendorActive)}
                >
                  Vendors
                </Button>
              }
              onClose={() => setVendorsActive(false)}
            >
              <ActionList actionRole="menuitem" items={vendorsActionList} />
            </Popover>

            <Popover
              active={statusActive}
              activator={
                <Button
                  disclosure={statusActive ? 'up' : 'down'}
                  onClick={() => setStatusActive(!statusActive)}
                >
                  Status
                </Button>
              }
              onClose={() => setStatusActive(false)}
            >
              <ActionList actionRole="menuitem" items={statusActionList} />
            </Popover>

            <Popover
              active={priceActive}
              activator={
                <Button
                  disclosure={priceActive ? 'up' : 'down'}
                  onClick={() => setPriceActive(!priceActive)}
                >
                  Price
                </Button>
              }
              onClose={() => setPriceActive(true)} //MUON TAT THI BO COMMENT DONG NAY
            />

            <Sort onChange={onChange} filter={filter} />
          </ButtonGroup>
        </Stack.Item>

        {priceActive && (
          <Card sectioned title="Filter theo Price">
            <Stack.Item fill>
              <RangeSlider
                output
                label="Price is between"
                value={rangeValue}
                prefix={prefix}
                min={min}
                max={max}
                step={step}
                onChange={handleRangeSliderChange}
              />
            </Stack.Item>
            <Stack.Item fill>
              <div style={{ color: '#008080', marginTop: '10px' }}>
                <Button size="slim" monochrome outline onClick={handleFilterPrice}>
                  Submit
                </Button>
              </div>
            </Stack.Item>
          </Card>
        )}
      </Stack>

      <Stack>
        {Boolean(filter.publish) && (
          <Tag onRemove={() => onChange({ ...filter, publish: '' })}>
            Publish: {publishActionList.find((item) => item.value === filter.publish).content}
          </Tag>
        )}
        {Boolean(filter.vendorId) && (
          <Tag onRemove={() => onChange({ ...filter, vendorId: '' })}>
            Vendor: {vendorsActionList.find((item) => item.value === filter.vendorId).content}
          </Tag>
        )}
        {Boolean(filter.status) && (
          <Tag onRemove={() => onChange({ ...filter, status: '' })}>
            Status: {statusActionList.find((item) => item.value === filter.status).content}
          </Tag>
        )}
        {Boolean(filter.price) && (
          <Tag onRemove={() => onChange({ ...filter, price: [] })}>Price range: {filter.price}</Tag>
        )}
        {Boolean(filter.sort) && (
          <Tag onRemove={() => onChange({ ...filter, sort: '' })}>Sort by: {filter.sort}</Tag>
        )}
      </Stack>
    </Stack>
  )
}

export default Filter
