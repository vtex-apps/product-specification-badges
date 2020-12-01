import React from 'react'
import { useProduct } from 'vtex.product-context'

import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: StorefrontFunctionComponent<BaseProps> = ({
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation,
  multipleValuesSeparator,
}) => {
  const ctx = useProduct()

  if (ctx?.product == null) {
    return null
  }

  const { product } = ctx

  return (
    <BaseSpecificationBadges
      product={product}
      orientation={orientation}
      specificationGroupName={specificationGroupName}
      visibleWhen={visibleWhen}
      specificationsOptions={specificationsOptions}
      specificationName={specificationName}
      displayValue={displayValue}
      multipleValuesSeparator={multipleValuesSeparator}
    />
  )
}

ProductSpecificationBadges.schema = {
  ...BaseSpecificationBadges.schema,
  title: 'admin/editor.product-specification-badges.title',
  description: 'admin/editor.product-specification-badges.description',
}

export default ProductSpecificationBadges
