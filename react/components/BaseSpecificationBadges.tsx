import React, { FC } from 'react'
import { propEq } from 'ramda'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import slugify from '../modules/slug'

import styles from './styles.css'

interface Props {
  product?: Product
}

const checkConditionForSpecification = (condition: Condition, specification: Specification) => {
  const { displayValue, visibleWhen } = condition
  if (!displayValue) {
    return false
  }

  if (!visibleWhen) {
    return specification.values && specification.values[0]
  }

  return specification.values && visibleWhen && specification.values[0] === visibleWhen
}

const getValidSpecificationForCondition = (condition: ConditionWithName, specifications: Specification[]) => {
  const { displayValue, specificationName } = condition
  const specification = specifications.find(propEq('name', specificationName))
  if (!specification) {
    return null
  }

  const isValid = checkConditionForSpecification(condition, specification)
  return isValid ? { displayValue, specification } : null
}

interface VisibleSpecification {
  specification: Specification
  displayValue: Condition['displayValue']
}

const getVisibleBadges = (
  product: Product | undefined,
  baseCondition: ConditionWithName,
  groupName: string,
  specificationsOptions: BaseProps['specificationsOptions']
) => {
  if (!product) {
    return []
  }
  const { specificationGroups } = product
  const group = specificationGroups.find(propEq('name', groupName))

  if (!group) {
    return []
  }

  let badges = [] as VisibleSpecification[]

  if (baseCondition.visibleWhen && baseCondition.displayValue) {
    const { specificationName } = baseCondition
    const specifications =
      specificationName ? group.specifications.filter(propEq('name', specificationName)) : group.specifications

    badges = specifications.map(spec => {
      if (checkConditionForSpecification(baseCondition, spec)) {
        return { specification: spec, displayValue: baseCondition.displayValue }
      }
      return null
    }).filter(Boolean) as VisibleSpecification[]
  }

  if (specificationsOptions) {
    const conditionsNames = Object.keys(specificationsOptions)
    const optionsBadges = conditionsNames.map(name =>
      getValidSpecificationForCondition({ ...specificationsOptions[name], specificationName: name }, group.specifications))
      .filter(Boolean) as VisibleSpecification[]

    badges = badges.concat(optionsBadges)
  }

  return badges
}

const getMarginToken = (isVertical: boolean, isFirst: boolean, isLast: boolean) => {
  let marginTokens = ""

  if (isVertical) {
    if (!isFirst) {
      marginTokens += "mt2 "
    }
    if (!isLast) {
      marginTokens += "mb2 "
    }
  }

  if (!isVertical) {
    if (!isFirst) {
      marginTokens += "ml2 "
    }
    if (!isLast) {
      marginTokens += "mr2 "
    }
  }

  return marginTokens.trim()
}

const BaseSpecificationBadges: FC<Props & BaseProps & BlockClass> = ({
  product,
  groupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  blockClass,
  orientation = 'vertical'
}) => {
  const badges = getVisibleBadges(
    product,
    { specificationName, displayValue, visibleWhen },
    groupName,
    specificationsOptions
  )

  if (!product || badges.length === 0) {
    return null
  }

  const isVertical = orientation === 'vertical'

  const orientationToken = isVertical ? 'inline-flex flex-column' : 'flex'

  return (
    <div className={`${generateBlockClass(`${styles.groupContainer}`, blockClass)} ${orientationToken}`}>
      {badges.map((badge: VisibleSpecification, idx: number) => {
        const { displayValue } = badge
        let valueToShow = displayValue
        if (displayValue === 'SPECIFICATION_VALUE') {
          valueToShow = badge.specification.values[0]
        }

        if (displayValue === 'SPECIFICATION_NAME') {
          valueToShow = badge.specification.name
        }

        if (!displayValue) {
          return null
        }
        const slugifiedName = slugify(badge.specification.name)
        const marginToken = getMarginToken(isVertical, idx === 0, idx === badges.length - 1)
        return (
          <div
            key={`${badge.specification.name}-${valueToShow}`}
            className={`${styles.badgeContainer} ${styles.badgeContainer}--${slugifiedName} ${marginToken} bg-base flex items-center justify-center`}
            style={{ borderRadius: '50%', minHeight: "3.5em" }}
          >
            <span className={`${styles.badgeText} ma3 t-body c-muted-1 tc`}>{valueToShow}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BaseSpecificationBadges
