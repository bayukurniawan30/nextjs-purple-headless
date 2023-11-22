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
