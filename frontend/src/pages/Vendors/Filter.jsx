import PropTypes from 'prop-types'
import { Autocomplete, Stack, Tag } from '@shopify/polaris'
import { useCallback, useState } from 'react'
import { useEffect } from 'react'

Filter.propTypes = {
  vendors: PropTypes.object,
  onchange: PropTypes.func,
  filter: PropTypes.object,
}

Filter.defaultProps = {
  vendors: {},
  onChange: () => null,
  filter: {},
}

function Filter(props) {
  const { vendors, onChange, filter } = props

  const paginationInterval = 5
  const vendorsOptions = Array.from(vendors.items).map((item, index) => ({
    value: item.name,
    label: `${index + 1}. ${item.name}`,
  }))

  const [selectedOptions, setSelectedOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState(vendorsOptions)
  const [isLoading, setIsLoading] = useState(false)
  const [willLoadMoreResults, setWillLoadMoreResults] = useState(true)
  const [visibleOptionIndex, setVisibleOptionIndex] = useState(paginationInterval)

  const optionList = options.slice(0, visibleOptionIndex)

  const updateText = (value) => {
    setInputValue(value)

    if (value === '') {
      setOptions(vendorsOptions)
      return
    }

    const filterRegex = new RegExp(value, 'i')
    const resultOptions = vendorsOptions.filter((option) => option.label.match(filterRegex))

    // let endIndex = resultOptions.length - 1
    // if (resultOptions.length === 0) {
    //   endIndex = 0
    // }
    setOptions(resultOptions)
  }

  useEffect(() => {
    if (selectedOptions) {
      onChange({ ...filter, selectedOptions })
    }
  }, [selectedOptions])

  const removeTag = useCallback(
    (tag) => () => {
      const options = [...selectedOptions]
      options.splice(options.indexOf(tag), 1)
      setSelectedOptions(options)
    },
    [selectedOptions],
  )

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label="Filters"
      value={inputValue}
      placeholder="select multi vendors"
    />
  )

  const handleLoadMoreResults = useCallback(() => {
    if (willLoadMoreResults) {
      setIsLoading(true)

      setTimeout(() => {
        const remainingOptionCount = options.length - visibleOptionIndex
        const nextVisibleOptionIndex =
          remainingOptionCount >= paginationInterval
            ? visibleOptionIndex + paginationInterval
            : visibleOptionIndex + remainingOptionCount

        setIsLoading(false)
        setVisibleOptionIndex(nextVisibleOptionIndex)

        if (remainingOptionCount <= paginationInterval) {
          setWillLoadMoreResults(false)
        }
      }, 1000)
    }
  }, [willLoadMoreResults, visibleOptionIndex, options.length])

  const hasSelectedOptions = selectedOptions.length > 0

  const tagsMarkup = hasSelectedOptions
    ? selectedOptions.map((option) => {
        let tagLabel = ''
        tagLabel = option.replace('_', ' ')
        tagLabel = titleCase(tagLabel)
        return (
          <Tag key={`option${option}`} onRemove={removeTag(option)}>
            {tagLabel}
          </Tag>
        )
      })
    : null

  const selectedTagMarkup = hasSelectedOptions ? (
    <Stack spacing="extraTight">{tagsMarkup}</Stack>
  ) : null

  return (
    <Stack vertical>
      <Autocomplete
        allowMultiple
        options={optionList}
        selected={selectedOptions}
        textField={textField}
        onSelect={setSelectedOptions}
        listTitle="Suggested Tags"
        loading={isLoading}
        onLoadMoreResults={handleLoadMoreResults}
        willLoadMoreResults={willLoadMoreResults}
      />
      {selectedTagMarkup}
    </Stack>
  )

  function titleCase(string) {
    return string
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word.replace(word[0], word[0].toUpperCase())
      })
      .join(' ')
  }
}

export default Filter
