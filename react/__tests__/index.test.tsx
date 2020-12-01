import React from 'react'
import { render } from '@vtex/test-tools/react'
import { ProductContextProvider } from 'vtex.product-context'

import Index from '../index'
import { getProduct } from '../__fixtures__/product'

const renderComponent = (customProps: any = {}) => {
  const product = customProps.product || getProduct()

  return render(
    <ProductContextProvider query={{}} product={product}>
      <Index
        visibleWhen={customProps.visibleWhen}
        specificationsOptions={customProps.specificationsOptions}
        specificationGroupName={customProps.specificationGroupName}
        specificationName={customProps.specificationName}
        displayValue={customProps.displayValue}
        multipleValuesSeparator={customProps.multipleValuesSeparator}
      />
    </ProductContextProvider>
  )
}

test('show names inside group that meet condition', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    specificationGroupName: 'allSpecifications',
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/Demo/)

  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('show names inside group that meet conditions array', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    specificationGroupName: 'allSpecifications',
    specificationsOptions: [
      {
        specificationName: 'On Sale',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'True',
      },
    ],
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('show badges of generic condition and for specific options', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['Enabled'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['Enabled'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    specificationGroupName: 'allSpecifications',
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    specificationsOptions: [
      {
        specificationName: 'Demo',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'Enabled',
      },
    ],
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/Demo/)
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('generic condition with specification Name being passed', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    specificationGroupName: 'allSpecifications',
    displayValue: 'SPECIFICATION_NAME',
    visibleWhen: 'True',
    specificationName: 'On Sale',
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('show demo, value and custom string', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText } = renderComponent({
    specificationsOptions: [
      {
        specificationName: 'On Sale',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'True',
      },
      {
        specificationName: 'Demo',
        displayValue: 'SPECIFICATION_VALUE',
      },
      {
        specificationName: 'PromoExclusion',
        displayValue: 'Custom String',
      },
    ],
    specificationGroupName: 'allSpecifications',
    product: getProduct({ specificationGroups }),
  })

  expect(queryByText(/On Sale/)).toBeInTheDocument()
  expect(queryByText(/DemoValue/)).toBeInTheDocument()
  expect(queryByText(/Custom String/)).toBeInTheDocument()
})

test('dont break if wrong group name', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText } = renderComponent({
    specificationsOptions: [
      {
        specificationName: 'On Sale',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'True',
      },
      {
        specificationName: 'Demo',
        displayValue: 'SPECIFICATION_VALUE',
      },
      {
        specificationName: 'PromoExclusion',
        displayValue: 'Custom String',
      },
    ],
    specificationGroupName: 'adsaadsad',
    product: getProduct({ specificationGroups }),
  })

  expect(queryByText(/On Sale/)).toBeFalsy()
})

test('dont show item with displayValue condition not provided', () => {
  const specificationGroups = [
    {
      name: 'Group',
      originalName: 'Group',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      originalName: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          originalName: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          originalName: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          originalName: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText, getByText } = renderComponent({
    specificationsOptions: [
      {
        specificationName: 'On Sale',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'True',
      },
      {
        specificationName: 'Demo',
      },
    ],
    specificationGroupName: 'allSpecifications',
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
})

test('do not break if specificationgroups is undefined', () => {
  const { queryByText } = renderComponent({
    specificationsOptions: [
      {
        specificationName: 'On Sale',
        displayValue: 'SPECIFICATION_NAME',
        visibleWhen: 'True',
      },
      {
        specificationName: 'Demo',
      },
    ],
    specificationGroupName: 'allSpecifications',
    product: getProduct({ specificationGroups: undefined }),
  })

  expect(queryByText(/On Sale/)).toBeFalsy()
})

test('display multiple specification values separated by a string', () => {
  const specificationGroups = [
    {
      name: 'allSpecifications',
      originalName: 'allSpecifications',
      specifications: [
        {
          name: 'Season',
          originalName: 'Season',
          values: ['Spring', 'Summer'],
        },
      ],
    },
  ]

  const { queryByText } = renderComponent({
    specificationsOptions: [
      {
        specificationName: 'Season',
        visibleWhen: 'Spring',
        displayValue: 'SPECIFICATION_VALUE',
      },
    ],
    multipleValuesSeparator: ', ',
    specificationGroupName: 'allSpecifications',
    product: getProduct({ specificationGroups }),
  })

  expect(queryByText(/Spring, Summer/)).toBeInTheDocument()
})

test('works with properties field', () => {
  const properties = [
    {
      name: 'On Sale',
      values: ['True'],
    },
    {
      name: 'Demo',
      values: ['True'],
    },
    {
      name: 'PromoExclusion',
      values: ['1'],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    visibleWhen: 'True',
    displayValue: 'SPECIFICATION_NAME',
    product: getProduct({ properties }),
  })

  getByText(/On Sale/)
  getByText(/Demo/)

  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})
