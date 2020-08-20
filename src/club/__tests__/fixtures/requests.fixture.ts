export const invalidCreationRequest = {
  name: '123',
  area: 'invalid area',
  tla: "ARS",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  address: "75 Drayton Park London N5 1BU",
  website: "http://www.arsenal.com",
  email: "info@arsenal.co.uk",
  founded: 3000,
  clubColors: "Red / White",
  venue: "Emirates Stadium"
}

export const validCreationRequest = {
  area: "England",
  name: "Valid name",
  shortName: "Arsenal",
  tla: "ARS",
  crestUrl: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  address: "75 Drayton Park London N5 1BU",
  phone: "+44 (020) 76195003",
  website: "http://www.arsenal.com",
  email: "info@arsenal.co.uk",
  founded: 1886,
  clubColors: "Red / White",
  venue: "Emirates Stadium"
}

export const invalidUpdateRequest = {
  name: 552,
  area: 'invalid area',
  tla: 'ASDASDAS',
  email: 'this is not an email'
}

export const validUpdateRequest  = {
  name: 'new name',
  area: 'valid area',
  tla: 'ASD',
  email: 'thisIsValidEmail@gmail.com'
}