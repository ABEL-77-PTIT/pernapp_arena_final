import { Button, Popover, ActionList } from '@shopify/polaris'
import { useState, useCallback } from 'react'

function Sort(props) {
  const { onChange, filter } = props
  const [popoverActive, setPopoverActive] = useState(false)
  const [sortPriceAction, setSortPriceAction] = useState(false)
  const [sortCreateAtAction, setSortCreateAtAction] = useState(false)
  const [sortTitleAction, setSortTitleAction] = useState(false)

  console.log('filter', filter)

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  )

  const activator = (
    <Button onClick={togglePopoverActive} disclosure={popoverActive ? 'up' : 'down'}>
      More sorting
    </Button>
  )

  const sortASCActionList = [
    {
      content: 'Price',
      value: 'asc',
      onAction: () => onChange({ ...filter, sortPrice: 'ASC' }) & setSortPriceAction(false),
    },

    {
      content: 'Title',
      value: 'asc',
      onAction: () => onChange({ ...filter, sortTitle: 'ASC' }) & setSortTitleAction(false),
    },

    {
      content: 'CreateAt',
      value: 'asc',
      onAction: () => onChange({ ...filter, sortCreateAt: 'ASC' }) & setSortCreateAtAction(false),
    },
  ]

  const sortDESCActionList = [
    {
      content: 'Price',
      value: 'desc',
      onAction: () => onChange({ ...filter, sortPrice: 'DESC' }) & setSortPriceAction(false),
    },

    {
      content: 'Title',
      value: 'desc',
      onAction: () => onChange({ ...filter, sortTitle: 'DESC' }) & setSortTitleAction(false),
    },

    {
      content: 'CreateAt',
      value: 'desc',
      onAction: () => onChange({ ...filter, sortCreateAt: 'DESC' }) & setSortCreateAtAction(false),
    },
  ]

  console.log('filter sort', filter)

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <Popover.Pane>
        <Popover.Section>
          <p>Sort by A-Z, 0-9</p>
        </Popover.Section>
      </Popover.Pane>
      <Popover.Pane fixed>
        <ActionList actionRole="menuitem" items={sortASCActionList} />
      </Popover.Pane>

      <Popover.Pane>
        <Popover.Section>
          <p>Sort by Z-A, 9-0</p>
        </Popover.Section>
      </Popover.Pane>
      <Popover.Pane fixed>
        <ActionList actionRole="menuitem" items={sortDESCActionList} />
      </Popover.Pane>
    </Popover>
  )
}

export default Sort
