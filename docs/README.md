# VTEX Product Specification Badges

Use this component to show badges based on your product specifications inside your product page.

### Configuration

This component must be configured to be able to display the specifications properly. Its props can be configured via `blocks.json` and they are:

| Prop name     | Type                         | Description                                                                                                     | Default value |
| ------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| `groupName`   | `String`                     | The name of the specification group in which the desired specifications are                                     | ""            |
| `conditions`  | `Condition` or `Condition[]` | the condition to be applied (or the set of conditions) to determine what specification to show and what to show | `null`        |
| `orientation` | `vertical` or `horizontal`   | Determines if the group of specifications are showed horizontally or vertically                                 | `vertical`    |
| `blockClass`  | `string`                     | Allows to pass a custom name to be added to component css classes                                               | `null`        |

Important note:
All products come with a default `allSpecifications` group, that is a group that combines all specifications in your product. If you manually create another group and add a specification in it, this specification will also appear in the `allSpecifications` group. So, if you want to apply your conditions to all specification, regardless of group, you must pass the value `allSpecifications`.

The `Condition` type:
| Prop name | Type | Description | Default value |
| --------- | -------- | ------------------------------------------------ | ------------- |
| `name` | `String` | Name of the target specification | "" |
| `type` | `equals` or `exists` | Pass `equals` if you want to show the badge if the value of the specification matches exactly with the value you will pass to the `value` prop in this condition. `exists` will make the badge appear if the specification is present, regardless of its value | `""` |
| `value` | `string` | Only valid if you pass a type as `equals`. Will be used to compare with the specification value | `null` |
| `show` | `SPECIFICATION_NAME` or `SPECIFICATION_VALUE` or `string` | Choose the value that will appear if the condition is met and the badge will be showed. Pass `SPECIFICATION_NAME` if you want to show the specification name. Pass `SPECIFICATION_VALUE` if you want to show its value. Pass any other custom string to show it. | `null` |

You may pass a single condition object or an array. If a single object is given, its `name` config will be ignored and the condition will be applied to all specification in the specified group.
If you pass an array, then you must provide a `name` config to each condition, to tell the name of the specification that this condition should be applied to.
Passing invalid `name`, `type` or `show` configs will make your badge never appear.

### Example 1

Let's say your product has this specification groups:

```
// specificationGroups array
[
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]
```

If you want to display all specifications with the value `True`, you could then pass:

```
"product-specification-badges": {
    "props": {
      "groupName": "allSpecifications",
      "conditions": {
        "type": "equals",
        "value": "True",
        "show": "SPECIFICATION_NAME"
      }
    }
  },
```

In this case, it will appear the `On Sale` and `Demo` badges (because you passed the `SPECIFICATION_NAME` in `show`).

### Example 2

Using the specification groups from example 1, we can get the same result with a condition array like:

```
  "product-specification-badges": {
    "props": {
      "groupName": "allSpecifications",
      "conditions": [
        {
          "name": "On Sale",
          "type": "equals",
          "value": "True",
          "show": "SPECIFICATION_NAME"
        }
      ],
      [
        {
          "name": "Demo",
          "type": "equals",
          "value": "True",
          "show": "SPECIFICATION_NAME"
        }
      ]
    }
  },
```

### Example 3

```
// specificationGroups array
[
    {
      name: 'Group',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
      ],
    },
    {
      name: 'Group 2',
      specifications: [
        {
          name: 'Demo',
          values: ['True'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        }
      ],
    },
    {
      name: 'allSpecifications',
      specifications: [
        {
          name: 'On Sale',
          values: ['True'],
        },
        {
          name: 'Demo',
          values: ['My Cool Value'],
        },
        {
          name: 'PromoExclusion',
          values: ['1'],
        },
      ],
    },
  ]
```

If you want to show the value for the `Demo` specification, you could pass:

```
  "product-specification-badges": {
    "props": {
      "groupName": "allSpecifications",
      "conditions": [
        {
          "name": "On Sale",
          "type": "equals",
          "value": "True",
          "show": "SPECIFICATION_NAME"
        }
      ],
      [
        {
          "name": "Demo",
          "type": "exists",
          "show": "SPECIFICATION_VALUE"
        }
      ]
    }
  },
```

Final result: will appear the `On Sale` badge and a badge with `My Cool Value`.

Note the use of the `exists` type and the use of `SPECIFICATION_VALUE` in show.

### Example 4

Using the example given in example 3.

To show a custom string you could do:

```
  "product-specification-badges": {
    "props": {
      "groupName": "allSpecifications",
      "conditions": [
        {
          "name": "On Sale",
          "type": "equals",
          "value": "True",
          "show": "SPECIFICATION_NAME"
        }
      ],
      [
        {
          "name": "Demo",
          "type": "exists",
          "show": "SPECIFICATION_VALUE"
        }
      ],
      [
        {
          "name": "PromoExclusion",
          "type": "exists",
          "show": "Cool Promo"
        }
      ]
    }
  },
```

Final result: will appear the `On Sale` badge, a badge with `My Cool Value` and a badge with the string `Cool Promo`.

Note the usage of a custom value in the `show` config.

### Usage tip

You can use our `stack-layout` to show the badges over your product image for example.

```
  "stack-layout": {
    "children": [
      "product-images",
      "product-specification-badges"
    ]
  },

  "product-specification-badges": {
    "props": {
      "blockClass": "bad",
      "groupName": "Group",
      "conditions": [
        {
          "name": "On Sale",
          "type": "equals",
          "value": "True",
          "show": "SPECIFICATION_NAME"
        }
      ]
    }
  },
  "flex-layout.row#product-image": {
    "children": ["product-images"]
  },
```

### CSS API

| CSS class        | Description                                 |
| ---------------- | ------------------------------------------- |
| `groupContainer` | Container that wrapps the whole badge group |
| `badgeContainer` | Container for each badge                    |
| `badgeText`      | Text displayed inside badge                 |

Note: each badge also receives a class `badgeContainer` with its specification name slug appended to it.
Example: on specification `On Sale` the badge will also have the class `badgeContainer--on-sale`.
