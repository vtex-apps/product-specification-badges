interface Condition {
  visibleWhen?: string
  displayValue?: 'SPECIFICATION_NAME' | 'SPECIFICATION_VALUE' | string
}

interface BaseProps extends Condition {
  groupName: string | 'allSpecifications'
  orientation?: 'vertical' | 'horizontal'
  specificationsOptions?: Record<string, Condition>
  specificationName?: string
}

type ConditionWithName = Condition & {
  specificationName: BaseProps['specificationName']
}
