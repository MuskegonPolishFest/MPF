import {defineField, defineType} from 'sanity'

export const map = defineType({
  name: 'map',
  title: 'Map',
  type: 'document',
  fields: [
    defineField({
      name: 'mapKey',
      title: 'Stable map key',
      type: 'string',
      description:
        'Stable identifier used to match the bundled offline fallback map (e.g. "1635"). Keep it unique and avoid changing it once set.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Editor label',
      type: 'string',
      description: 'Human-friendly name shown in Studio (e.g. "1635 – Commonwealth at its height").',
    }),
    defineField({
      name: 'image',
      title: 'Map image',
      type: 'image',
      description: 'Background map artwork with the red territory baked in.',
      options: {hotspot: false},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'regionLabel',
      title: 'Default region label',
      type: 'string',
      description: 'Optional default label for the territory shown. Timeline events may override this.',
    }),
    defineField({
      name: 'floorYear',
      title: 'Applies from year',
      type: 'number',
      description: 'First timeline year this map applies to. Used for year-based map routing.',
      validation: (rule) => rule.integer(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mapKey',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || subtitle || 'Map',
        subtitle: subtitle ? `Key: ${subtitle}` : undefined,
        media,
      }
    },
  },
})
