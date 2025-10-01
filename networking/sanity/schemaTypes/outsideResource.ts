import {defineField, defineType} from 'sanity'

export const outsideResource = defineType({
  name: 'outsideResource',
  title: 'Outside Resource',
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
      name: 'apaCitation',
      type: 'string',
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
      name: 'abstract',
      type: 'array',
      of: [{type: 'block'}],
    }), 
    defineField({
      name: 'summary',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'resourceLink',
      type: 'string',
    }),
    defineField({
      name: 'isCornerstone',
      type: 'boolean',
    }),
  ],
});