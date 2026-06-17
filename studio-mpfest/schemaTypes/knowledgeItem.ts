import {defineArrayMember, defineField, defineType} from 'sanity'

export const knowledgeItem = defineType({
  name: 'knowledgeItem',
  title: 'Knowledge Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / eyebrow',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'yearLabel',
      title: 'Year label',
      type: 'string',
    }),
    defineField({
      name: 'shortSummary',
      title: 'Short card summary',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(180).warning('Keep hotspot and card summaries short.'),
    }),
    defineField({
      name: 'detailText',
      title: 'Full detail text',
      type: 'text',
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageAlt',
      title: 'Image alt text',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'eras',
      title: 'Related eras',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'era'}]})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'relatedKnowledge',
      title: 'Related content',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'knowledgeItem'}]})],
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
      subtitle: 'yearLabel',
      media: 'image',
    },
  },
})
