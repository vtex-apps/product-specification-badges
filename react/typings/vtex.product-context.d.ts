declare module 'vtex.product-context/ProductContextProvider'
interface SelectedItem {
  itemId: string
  sellers: Array<{
    sellerId: string
    commertialOffer: {
      AvailableQuantity: number
    }
  }>
}

interface SpecificationGroupItem {
  name: string
  originalName: string
  values: string[]
}

interface SpecificationGroup {
  name: string
  originalName: string
  specifications: SpecificationGroupItem[]
}

interface SpecificationProperty {
  name: string
  values: string[]
}

interface Product {
  specificationGroups?: SpecificationGroup[]
  properties?: SpecificationProperty[]
}

declare module 'vtex.product-context/useProduct' {
  const useProduct: () => ProductContext
  export default useProduct

  interface ProductContext {
    selectedQuantity: number
    product: Product | undefined
    selectedItem: SelectedItem | null
    skuSelector: {
      areAllVariationsSelected: boolean
      isVisible: boolean
    }
  }
}

declare module 'vtex.product-context/ProductDispatchContext' {
  type DispatchFunction = (payload: { type: string; args?: any }) => void
  export const useProductDispatch: () => DispatchFunction
}
