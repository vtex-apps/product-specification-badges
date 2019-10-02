interface Condition {
  name?: string
  type: 'equals' | 'exists'
  value?: string
  show: 'SPECIFICATION_NAME' | 'SPECIFICATION_VALUE' | string
}

interface BaseProps {
  groupName: string | 'allSpecifications'
  conditions: Condition | Condition[]
  orientation?: 'vertical' | 'horizontal'
}
