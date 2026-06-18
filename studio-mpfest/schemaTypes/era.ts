import {defineField, defineType} from 'sanity'

const eraKeys = [
  {title: 'Golden Age', value: 'golden_age'},
  {title: 'Silver Age & Era of Wars', value: 'wars_partitions'},
  {title: 'Struggle for Independence', value: 'independence'},
  {title: 'Rebirth of Poland', value: 'rebirth'},
  {title: 'World War II & Occupation', value: 'ww2'},
  {title: 'Liberation & Reorganization', value: 'liberation'},
  {title: 'Communist Poland', value: 'communist'},
  {title: 'Growing Discontent', value: 'growingDiscontent'},
  {title: 'Modern Poland', value: 'modern'},
]

export const era = defineType({
  name: 'era',
  title: 'Era',
  type: 'document',
  fields: [
    defineField({
      name: 'eraKey',
      title: 'Stable era key',
      type: 'string',
      options: {list: eraKeys, layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tabLabel',
      title: 'Tab label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'defaultTitle',
      title: 'Default timeline title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'timePeriod',
      title: 'Time period',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary / description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
  ],
  preview: {
    select: {
      title: 'tabLabel',
      subtitle: 'timePeriod',
    },
  },
})
