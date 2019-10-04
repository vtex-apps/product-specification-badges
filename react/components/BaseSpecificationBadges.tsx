import React, { FC } from 'react'
import { propEq } from 'ramda'
import slugify from '../modules/slug'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import { Orientations, DisplayValues } from '../modules/constants'

const CSS_HANDLES = ['groupContainer', 'badgeContainer', 'badgeText'] as const

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

const BaseSpecificationBadges: FC<Props & BaseProps> = ({
  product,
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation = Orientations.vertical
}) => {
  const badges = getVisibleBadges(
    product,
    { specificationName, displayValue, visibleWhen },
    specificationGroupName,
    specificationsOptions
  )
  const handles = useCssHandles(CSS_HANDLES)

  if (!product || badges.length === 0) {
    return null
  }

  const isVertical = orientation === Orientations.vertical

  const orientationToken = isVertical ? 'inline-flex flex-column' : 'flex'

  return (
    <div className={`${handles.groupContainer} ${orientationToken}`}>
      {badges.map((badge, idx) => {
        const { displayValue } = badge
        let valueToShow = displayValue
        if (displayValue === DisplayValues.specificationValue) {
          valueToShow = badge.specification.values[0]
        }

        if (displayValue === DisplayValues.specificationName) {
          valueToShow = badge.specification.name
        }

        if (!displayValue) {
          console.warn('You need to set a `displayValue` for the `product-specification-badges` block, either `SPECIFICATION_VALUE` or `SPECIFICATION_NAME`')
          return null
        }
        const slugifiedName = slugify(badge.specification.name)
        const marginToken = getMarginToken(isVertical, idx === 0, idx === badges.length - 1)
        return (
          <div
            key={`${badge.specification.name}-${valueToShow}`}
            className={`${applyModifiers(handles.badgeContainer, slugifiedName)} ${marginToken} bg-base flex items-center justify-center`}
            style={{ borderRadius: '50%', minHeight: "3.5em" }}
          >
            <span className={`${handles.badgeText} ma3 t-body c-muted-1 tc`}>{valueToShow}</span>
          </div>
        )
      })}
    </div>
  )
}

export default BaseSpecificationBadges
