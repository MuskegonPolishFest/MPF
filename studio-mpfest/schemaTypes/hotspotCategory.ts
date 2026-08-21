import {defineField, defineType} from 'sanity'

export const hotspotCategory = defineType({
  name: 'hotspotCategory',
  title: 'Hotspot Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Editor-facing and legend label, e.g. "Culture".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Stable key',
      type: 'string',
      description:
        'Stable identifier used by seed/migration scripts and the bundled offline fallback (e.g. "culture"). Keep it unique and avoid changing it once set.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Small glyph shown on the map hotspot and in the legend.',
      options: {hotspot: false},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Legend description',
      type: 'text',
      rows: 2,
      description: 'Short blurb shown under this category in the map legend.',
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
      title: 'title',
      subtitle: 'value',
      media: 'icon',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Hotspot category',
        subtitle,
        media,
      }
    },
  },
})
