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
      validation: (rule) =>
        rule.required().custom(async (eraKey, context) => {
          if (!eraKey) return true

          const id = context.document?._id?.replace(/^drafts\./, '')
          const draftId = id ? `drafts.${id}` : undefined
          const client = context.getClient({apiVersion: '2026-06-07'})
          const duplicateCount = await client.fetch(
            `count(*[_type == "era" && eraKey == $eraKey && !(_id in [$id, $draftId])])`,
            {eraKey, id, draftId}
          )

          return duplicateCount === 0 || 'Stable era key must be unique. Edit the existing Era instead.'
        }),
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
