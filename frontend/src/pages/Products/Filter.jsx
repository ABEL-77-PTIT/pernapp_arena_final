import PropTypes from 'prop-types'
import { ActionList, Button, ButtonGroup, Popover, Stack } from '@shopify/polaris'
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
  const { onChange, filter } = props

  const [search, setSearch] = useState(filter.keyword || '')
  const [publish, setPublish] = useState(false)

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
          </ButtonGroup>
        </Stack.Item>
      </Stack>
    </Stack>
  )
}

export default Filter
