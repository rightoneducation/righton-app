import {defineField, defineType} from 'sanity'

export const videoArticleType = defineType({
  name: 'videoArticle',
  title: 'Video Article',
  type: 'document',
  fields: [
     defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{
        type: 'string',
        options: {
          list: [
            {title: 'Article', value: 'Article'},
            {title: 'Video', value: 'Video'},
            {title: 'Research', value: 'Research'}
          ]
        }
      }]
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'youtubeLink',
      type: 'string',
    }),
    defineField({
      name: 'caption',
      type: 'string',
    }),
    defineField({
      name: 'author',
      type: 'string',
    }),
    defineField({
      name: 'date',
      type: 'string',
    }),
    defineField({
      name: 'monsterSelect',
      type: 'number',
    }),
    defineField({
      name: 'readingTimeMinutes',
      type: 'number',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'isCornerstone',
      type: 'boolean',
    }),
  ],
});