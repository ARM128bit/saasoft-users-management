export type UserLabel = {
  text: string
}

export type User = {
  id: string
  label: UserLabel[] | null
  type: 'LDAP' | 'local' | null
  login: string | null
  password: string | null
  saved?: boolean
}
