import React from 'react'
import useProduct from 'vtex.product-context/useProduct'
import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: StorefrontFunctionComponent<BaseProps> = ({
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation
}) => {
  const { product } = useProduct()
  return (
    <BaseSpecificationBadges
      product={product}
      orientation={orientation}
      specificationGroupName={specificationGroupName}
      visibleWhen={visibleWhen}
      specificationsOptions={specificationsOptions}
      specificationName={specificationName}
      displayValue={displayValue}
    />
  )
}

ProductSpecificationBadges.schema = {
  title: 'admin/editor.product-specification-badges.title',
  description: 'admin/editor.product-specification-badges.description',
  type: 'object',
  properties: {
    specificationGroupName: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.specificationGroupName.title',
      description: 'admin/editor.product-specification-badges.specificationGroupName.description'
    },
    specificationName: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.specificationName.title',
      description: 'admin/editor.product-specification-badges.specificationName.description'
    },
    visibleWhen: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.visibleWhen.title',
      description: 'admin/editor.product-specification-badges.visibleWhen.description'
    },
    displayValue: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.displayValue.title',
      description: 'admin/editor.product-specification-badges.displayValue.description'
    },
    orientation: {
      title: 'admin/editor.product-specification-badges.orientation.title',
      description: 'admin/editor.product-specification-badges.orientation.description',
      enum: ['vertical', 'horizontal'],
      enumNames: ['admin/editor.product-specification-badges.orientation.vertical', 'admin/editor.product-specification-badges.orientation.horizontal'],
      type: 'string',
      default: 'vertical',
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
    specificationsOptions: {
      type: 'array',
      title: 'admin/editor.product-specification-badges.specificationsOptions.title',
      description: 'admin/editor.product-specification-badges.specificationsOptions.description',
      items: {
        title: 'admin/editor.product-specification-badges.specificationsOptions.item.title',
        type: 'object',
        properties: {
          specificationName: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.specificationName.title',
          },
          visibleWhen: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.visibleWhen.title',
          },
          displayValue: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.displayValue.title',
          },
        }
      }
    }
  }
}

export default ProductSpecificationBadges
