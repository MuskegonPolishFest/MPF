import {defineArrayMember, defineField, defineType} from 'sanity'

const mapKeys = [
  '1635',
  '1699',
  '1721',
  '1772',
  '1793',
  '1795',
  '1807',
  '1815',
  '1831',
  '1846',
  '1848',
  '1867',
  '1871',
  '1878',
  '1917',
  '1918',
  '1919',
  '1920',
  '1922',
  '1938',
  '1939',
  '1940',
  '1944',
  '1945',
  '1948',
  '1989',
  '1993',
]

const iconTypes = [
  {title: 'Culture', value: 'culture'},
  {title: 'Biography', value: 'biography'},
  {title: 'History', value: 'history'},
  {title: 'Science', value: 'science'},
]

export const timelineEvent = defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    defineField({
      name: 'year',
      title: 'Era year / timeline node',
      type: 'number',
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'reference',
      to: [{type: 'era'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'displayTitle',
      title: 'Display title override',
      type: 'string',
    }),
    defineField({
      name: 'timePeriodOverride',
      title: 'Time period override',
      type: 'string',
    }),
    defineField({
      name: 'summaryOverride',
      title: 'Summary override',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'borderChangePrompt',
      title: 'Border-change question text',
      type: 'string',
      initialValue: 'What caused the border change?',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'borderChangeText',
      title: 'Border-change answer',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mapKey',
      title: 'Static map key',
      type: 'string',
      options: {list: mapKeys.map((key) => ({title: key, value: key})), layout: 'dropdown'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mapRegionLabel',
      title: 'Map region label',
      type: 'string',
    }),
    defineField({
      name: 'hotspots',
      title: 'Hotspots',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'hotspot',
          title: 'Hotspot',
          type: 'object',
          fields: [
            defineField({
              name: 'hotspotId',
              title: 'Hotspot ID',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'placeName',
              title: 'Place name',
              type: 'string',
            }),
            defineField({
              name: 'metadata',
              title: 'Metadata',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'iconType',
              title: 'Icon type',
              type: 'string',
              options: {list: iconTypes, layout: 'radio'},
              initialValue: 'culture',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'xPercent',
              title: 'X position percent',
              type: 'number',
              validation: (rule) => rule.required().min(0).max(100),
            }),
            defineField({
              name: 'yPercent',
              title: 'Y position percent',
              type: 'number',
              validation: (rule) => rule.required().min(0).max(100),
            }),
            defineField({
              name: 'knowledge',
              title: 'Linked knowledge item',
              type: 'reference',
              to: [{type: 'knowledgeItem'}],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'shortTextOverride',
              title: 'Shortened hotspot text override',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'placeName',
              subtitle: 'hotspotId',
            },
            prepare({title, subtitle}) {
              return {
                title: title || 'Hotspot',
                subtitle,
              }
            },
          },
        }),
      ],
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
      title: 'displayTitle',
      year: 'year',
    },
    prepare({title, year}) {
      return {
        title: title || String(year || 'Timeline event'),
        subtitle: year ? String(year) : undefined,
      }
    },
  },
})
