export interface Club {
  id: number
  name: string
  shortName?: string
  tla: string
  area: {
    id: number,
    name: string
  }
  crestUrl: string
  address: string
  phone?: string
  website?: string
  email: string
  founded: number
  clubColors?: string
  venue?: string
  active: 0 | 1
  createdAt: string
  updatedAt: string
}