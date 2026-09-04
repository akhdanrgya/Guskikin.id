import type { CollectionConfig } from 'payload'

export const Scholars: CollectionConfig = {
  slug: 'scholars',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'birthYear',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'deathYear',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'biography',
      type: 'richText',
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'locations',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'teachers',
      type: 'relationship',
      relationTo: 'scholars',
      hasMany: true,
    },
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'scholars',
      hasMany: true,
    },
  ],
}
