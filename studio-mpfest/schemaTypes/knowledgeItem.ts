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
      name: 'video',
      title: 'Detail page YouTube clip',
      type: 'object',
      description: 'Optional video for the detail page. The image remains the fallback thumbnail.',
      fields: [
        defineField({
          name: 'youtubeUrl',
          title: 'YouTube URL',
          type: 'url',
          validation: (rule) =>
            rule
              .uri({scheme: ['http', 'https']})
              .custom((url) => {
                if (!url) return 'YouTube URL is required when adding a video clip.'

                try {
                  const parsed = new URL(url)
                  const hostname = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '')
                  const isYouTube =
                    hostname === 'youtube.com' ||
                    hostname === 'youtube-nocookie.com' ||
                    hostname === 'youtu.be'

                  return isYouTube || 'Must be a YouTube URL.'
                } catch {
                  return 'Must be a valid YouTube URL.'
                }
              }),
        }),
        defineField({
          name: 'startSeconds',
          title: 'Start time (seconds)',
          type: 'number',
          initialValue: 0,
          validation: (rule) => rule.integer().min(0),
        }),
        defineField({
          name: 'endSeconds',
          title: 'End time (seconds)',
          type: 'number',
          validation: (rule) =>
            rule.integer().min(0).custom((endSeconds, context) => {
              const parent = context.parent as {startSeconds?: number} | undefined
              const startSeconds = parent?.startSeconds

              if (endSeconds == null || startSeconds == null) return true
              return endSeconds > startSeconds || 'End time must be greater than start time.'
            }),
        }),
      ],
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
