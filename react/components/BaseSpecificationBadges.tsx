import React, { FC } from 'react'
import { propEq } from 'ramda'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import slugify from '../modules/slug'

import styles from './styles.css'

interface Props {
  product?: Product
}

const checkConditionForSpecification = (condition: Condition, specification: Specification) => {
  const { type, value, show } = condition
  if (!show) {
    return false
  }

  if (type === 'exists') {
    return specification.values && specification.values[0]
  }

  if (type === 'equals') {
    return specification.values && value && specification.values[0] === value
  }

  return false
}

const getValidSpecificationForCondition = (condition: Condition, specifications: Specification[]) => {
  const { show, name } = condition
  const specification = specifications.find(propEq('name', name))
  if (!specification) {
    return null
  }

  const isValid = checkConditionForSpecification(condition, specification)
  return isValid ? { show, specification } : null
}

interface VisibleSpecification {
  specification: Specification
  show: Condition['show']
}

const getVisibleBadges = (product: Product | undefined, conditions: BaseProps['conditions'], groupName: string) => {
  if (!product) {
    return []
  }
  const { specificationGroups } = product
  const group = specificationGroups.find(propEq('name', groupName))

  if (!group) {
    return []
  }

  if (!Array.isArray(conditions)) {
    const condition = conditions as Condition

    // If is an object and not array, apply this rule to all
    return group.specifications.map(spec => {
      if (checkConditionForSpecification(condition, spec)) {
        return { specification: spec, show: condition.show }
      }
      return null
    }).filter(Boolean) as VisibleSpecification[]
  }

  const conditionsArray = conditions as Condition[]
  return conditionsArray.map(cond =>
    getValidSpecificationForCondition(cond, group!.specifications))
    .filter(Boolean) as VisibleSpecification[]
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
  conditions,
  blockClass,
  orientation = 'vertical'
}) => {
  const badges = getVisibleBadges(product, conditions, groupName)

  if (!product || !conditions || badges.length === 0) {
    return null
  }

  const isVertical = orientation === 'vertical'

  const orientationToken = isVertical ? 'inline-flex flex-column' : 'flex'

  return (
    <div className={`${generateBlockClass(`${styles.groupContainer}`, blockClass)} ${orientationToken}`}>
      {badges.map((badge: VisibleSpecification, idx: number) => {
        const { show } = badge
        let valueToShow = show
        if (show === 'SPECIFICATION_VALUE') {
          valueToShow = badge.specification.values[0]
        }

        if (show === 'SPECIFICATION_NAME') {
          valueToShow = badge.specification.name
        }

        if (!show) {
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
