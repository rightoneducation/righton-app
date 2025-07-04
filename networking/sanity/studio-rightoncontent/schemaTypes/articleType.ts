import {defineField, defineType} from 'sanity'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
     defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'author',
      type: 'string',
    }),    
    defineField({
      name: 'affiliation',
      type: 'string',
    }),
    defineField({
      name: 'contact',
      type: 'string',
    }),    
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})