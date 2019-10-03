import React, { FC } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { BlockClass } from '@vtex/css-handles'
import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: FC<BaseProps & BlockClass> = ({
  groupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  blockClass,
  orientation
}) => {
  const { product } = useProduct()
  return (
    <BaseSpecificationBadges
      product={product}
      blockClass={blockClass}
      orientation={orientation}
      groupName={groupName}
      visibleWhen={visibleWhen}
      specificationsOptions={specificationsOptions}
      specificationName={specificationName}
      displayValue={displayValue}
    />
  )
}

export default ProductSpecificationBadges
