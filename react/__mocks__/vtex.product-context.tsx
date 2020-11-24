import React, { useContext, createContext, FC } from 'react'

export const ProductContext = createContext({})

export const ProductContextProvider: FC<any> = ({
  product,
  children,
  skuSelector,
}) => {
  return (
    <ProductContext.Provider
      value={{ product, selectedItem: product.items[0], skuSelector }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProduct = () => useContext(ProductContext)

export const ProductDispatchContext = createContext({})
