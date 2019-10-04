import React, { FC } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: FC<BaseProps> = ({
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

export default ProductSpecificationBadges
