import {defineArrayMember, defineField, defineType} from 'sanity'

export const table = defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'headerRow',
      title: 'First row is a header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'tableRow',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [defineArrayMember({type: 'string'})],
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              return {title: (cells ?? []).join(' | ')}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare({rows}) {
      const count = rows?.length ?? 0
      return {title: 'Table', subtitle: `${count} row${count === 1 ? '' : 's'}`}
    },
  },
})
