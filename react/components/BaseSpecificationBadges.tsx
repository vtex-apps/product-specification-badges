import React from 'react'
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
  const specification = specifications.find(propEq('originalName', specificationName)) || specifications.find(propEq('name', specificationName))
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

  const { specificationGroups, properties } = product

  const group = specificationGroups?.find(propEq('originalName', groupName))

  let badges = [] as VisibleSpecification[]

  if (baseCondition.visibleWhen && baseCondition.displayValue && group) {
    const { specificationName } = baseCondition
    const specifications =
      specificationName ? group.specifications.filter(propEq('originalName', specificationName)) : group.specifications

    badges = specifications.map(spec => {
      if (checkConditionForSpecification(baseCondition, spec)) {
        return { specification: spec, displayValue: baseCondition.displayValue }
      }
      return null
    }).filter(Boolean) as VisibleSpecification[]
  }

  if (specificationsOptions && (properties || group)) {
    const specifications = group ? group.specifications : properties
    const optionsBadges = specificationsOptions.map(option =>
      getValidSpecificationForCondition(option, specifications))
      .filter(Boolean) as VisibleSpecification[]
    badges = badges.concat(optionsBadges)    
  }

  return badges
}

const getMarginToken = (
  isVertical: boolean,
  isFirst: boolean,
  isLast: boolean
) => {
  let marginTokens = ''

  if (isVertical) {
    if (!isFirst) {
      marginTokens += 'mt2 '
    }
    if (!isLast) {
      marginTokens += 'mb2 '
    }
  }

  if (!isVertical) {
    if (!isFirst) {
      marginTokens += 'ml2 '
    }
    if (!isLast) {
      marginTokens += 'mr2 '
    }
  }

  return marginTokens.trim()
}

const BaseSpecificationBadges: StorefrontFunctionComponent<
  Props & BaseProps
> = ({
  product,
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation = Orientations.vertical,
  multipleValuesSeparator,
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
      <div className={`${handles.groupContainer} ${orientationToken} ma2`}>
        {badges.map((badge, idx) => {
          const { displayValue } = badge
          let valueToShow = displayValue
          if (displayValue === DisplayValues.specificationValue) {
            const specificationValues = badge.specification.values

            if (multipleValuesSeparator != null) {
              valueToShow = specificationValues.join(multipleValuesSeparator)
            } else {
              valueToShow = specificationValues[0]

              if (specificationValues.length > 1) {
                console.warn(
                  `[product-specification-badges] The specification "${badge.specification.name
                  }" have multiple values (${specificationValues.join(
                    ','
                  )}) but the "multipleValuesSeparator" prop was not set. Please refer to this app's documentation for further detail on how to show all the values at once: https://vtex.io/docs/app/vtex.product-specification-badges`
                )
              }
            }
          }

          if (displayValue === DisplayValues.specificationName) {
            valueToShow = badge.specification.name
          }

          if (!displayValue) {
            console.warn('You need to set a `displayValue` for the `product-specification-badges` block, either `SPECIFICATION_VALUE` or `SPECIFICATION_NAME`')
            return null
          }
          const slugifiedName = slugify(badge.specification.name)
          const slugifiedValue = valueToShow && slugify(valueToShow)
          const marginToken = getMarginToken(isVertical, idx === 0, idx === badges.length - 1)
          
          return (
            <div
              key={`${badge.specification.name}-${valueToShow}`}
              className={`${applyModifiers(handles.badgeContainer, slugifiedName)} ${marginToken} bg-base flex items-center justify-center"`}
            >
              <span className={`${applyModifiers(handles.badgeText, slugifiedValue ? slugifiedValue : "")} ma3 t-body c-muted-1 tc`}>{valueToShow}</span>
            </div>
          )
        })}
      </div>
    )
  }

BaseSpecificationBadges.schema = {
  type: 'object',
  properties: {
    specificationGroupName: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.specificationGroupName.title',
      description: 'admin/editor.product-specification-badges.specificationGroupName.description'
    },
    specificationName: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.specificationName.title',
      description: 'admin/editor.product-specification-badges.specificationName.description'
    },
    visibleWhen: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.visibleWhen.title',
      description: 'admin/editor.product-specification-badges.visibleWhen.description'
    },
    displayValue: {
      type: 'string',
      title: 'admin/editor.product-specification-badges.displayValue.title',
      description: 'admin/editor.product-specification-badges.displayValue.description'
    },
    orientation: {
      title: 'admin/editor.product-specification-badges.orientation.title',
      description: 'admin/editor.product-specification-badges.orientation.description',
      enum: ['vertical', 'horizontal'],
      enumNames: ['admin/editor.product-specification-badges.orientation.vertical', 'admin/editor.product-specification-badges.orientation.horizontal'],
      type: 'string',
      default: 'vertical',
      widget: {
        'ui:widget': 'radio',
        'ui:options': {
          inline: true,
        },
      },
    },
    specificationsOptions: {
      type: 'array',
      title: 'admin/editor.product-specification-badges.specificationsOptions.title',
      description: 'admin/editor.product-specification-badges.specificationsOptions.description',
      items: {
        title: 'admin/editor.product-specification-badges.specificationsOptions.item.title',
        type: 'object',
        properties: {
          specificationName: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.specificationName.title',
          },
          visibleWhen: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.visibleWhen.title',
          },
          displayValue: {
            type: 'string',
            title: 'admin/editor.product-specification-badges.displayValue.title',
          },
        }
      }
    }
  }
}

export default BaseSpecificationBadges
