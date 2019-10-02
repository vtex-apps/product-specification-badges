import React from 'react'
import { render } from '@vtex/test-tools/react'
import Index from '../index'

import { getProduct } from '../__mocks__/productMock'

import ProductContextProvider from '../__mocks__/vtex.product-context/ProductContextProvider'


const renderComponent = (customProps: any = {}) => {

  const product = customProps.product || getProduct()

  return render(
    <ProductContextProvider product={product}>
      <Index conditions={customProps.conditions} groupName={customProps.groupName} />
    </ProductContextProvider>
  )
}

test('show names inside group that meet condition', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
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
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    conditions: {
      type: "equals",
      value: "True",
      show: "SPECIFICATION_NAME",
    },
    groupName: "allSpecifications",
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
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
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
      ],
    },
  ]

  const { getByText, queryByText } = renderComponent({
    conditions: [{
      name: 'On Sale',
      type: "equals",
      value: "True",
      show: "SPECIFICATION_NAME",
    },
    ],
    groupName: "allSpecifications",
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
  expect(queryByText(/PromoExclusion/)).toBeFalsy()
})

test('test show demo, value and custom string', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { getByText } = renderComponent({
    conditions: [{
      name: 'On Sale',
      type: "equals",
      value: "True",
      show: "SPECIFICATION_NAME",
    },
    {
      name: 'Demo',
      type: "exists",
      show: "SPECIFICATION_VALUE",
    },
    {
      name: 'PromoExclusion',
      type: "exists",
      show: "Custom String",
    }],
    groupName: "allSpecifications",
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  getByText(/DemoValue/)
  getByText(/Custom String/)
})

test('dont break if wrong group name', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['DemoValue'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]

  const { queryByText } = renderComponent({
    conditions: [{
      name: 'On Sale',
      type: "equals",
      value: "True",
      show: "SPECIFICATION_NAME",
    }],
    groupName: "adsaadsad",
    product: getProduct({ specificationGroups }),
  })

  expect(queryByText(/On Sale/)).toBeFalsy()
})

test('dont show item with show condition not provided', () => {

  const specificationGroups = [
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
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
      ],
    },
  ]

  const { queryByText, getByText } = renderComponent({
    conditions: [{
      name: 'On Sale',
      type: "equals",
      value: "True",
      show: "SPECIFICATION_NAME",
    },
    {
      name: 'Demo',
      type: "equals",
      value: "True",
    }],
    groupName: "allSpecifications",
    product: getProduct({ specificationGroups }),
  })

  getByText(/On Sale/)
  expect(queryByText(/Demo/)).toBeFalsy()
})
