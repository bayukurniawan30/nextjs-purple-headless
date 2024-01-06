export interface ListData<T> {
  data: T[]
  meta: Meta
}

export interface Meta {
  currentPage?: number
  firstPage?: number
  firstPageUrl?: string
  lastPage?: number
  lastPageUrl?: string
  nextPageUrl?: string
  perPage?: number
  previousPageUrl?: string
  total: number
}

export interface User {
  id?: string
  email?: string
  isAdmin?: boolean
  profile: Profile
  createdAt?: string
  updatedAt?: string
}

export interface Profile {
  id: string
  firstName: string
  lastName: string
  fullName: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface Setting {
  id: string
  key: string
  value: string
  selectable: any
  createdAt?: string
  updatedAt?: string
}

export interface Media {
  id: string
  url: string
  publicUrl: string
  thumbnailUrl: string
  publicThumbnailUrl: string
  type: string
  size: number
  width: number
  height: number
  refId?: string
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface Field {
  id: string
  name: string
  slug: string
  additionalText: string
  metadata?: Object
  createdAt?: string
  updatedAt?: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  fields: FieldSchema[]
  status: 'publish' | 'draft'
  sorting: string
  ordering: string
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface CollectionItem {
  id: string
  slug: string
  slugTarget: string
  content: string
  collectionId: string
  collection: Collection
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface Singleton {
  id: string
  name: string
  slug: string
  fields: FieldSchema[]
  status: 'publish' | 'draft'
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface SingletonItem {
  id: string
  content: string
  singletonId: string
  singleton: Singleton
  userId?: string
  user?: User
  createdAt?: string
  updatedAt?: string
}

export interface FieldSchema {
  id: string
  label: string
  helperText: string
  metadata: Object
}
