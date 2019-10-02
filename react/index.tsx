import React, { FC } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { BlockClass } from '@vtex/css-handles'
import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: FC<BaseProps & BlockClass> = ({ groupName, conditions, blockClass, orientation }) => {
  const { product } = useProduct()
  return (
    <BaseSpecificationBadges
      product={product}
      conditions={conditions}
      blockClass={blockClass}
      orientation={orientation}
      groupName={groupName}
    />
  )
}

export default ProductSpecificationBadges
