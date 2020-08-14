export interface DataToUpdateClub {
  name?: string
  shortName?: string
  tla?: string
  area? : {
    id: number,
    name: string
  }
  crestUrl?: string
  address?: string
  phone?: string
  website?: string
  email?: string
  clubColors?: string
  venue?: string
  active?: 0 | 1
}