import {defineField, defineType} from 'sanity'

export const rightOnResource = defineType({
  name: 'rightOnResource',
  title: 'RightOn Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      type: 'array',
      of: [{
        type: 'string',
        options: {
          list: [
            {title: 'Article', value: 'Article'},
            {title: 'Video', value: 'Video'},
            {title: 'Research', value: 'Research'},
            {title: 'Other', value: 'Other'}
          ]
        }
      }]
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'youtubeLink',
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
      name: 'caption',
      type: 'string',
    }),
    defineField({
      name: 'readingTimeMinutes',
      type: 'number',
    }),   
    defineField({
      name: 'contentHeader',
      type: 'string',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [{type: 'block'}],
    }),  
    defineField({
      name: 'isCornerstone',
      type: 'boolean',
    }),
  ],
});