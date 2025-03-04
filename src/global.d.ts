export type UserLabel = {
  text: string
}

export type User = {
  id: string
  label: UserLabel[] | undefined
  type: 'LDAP' | 'local' | undefined
  login: string | undefined
  password: string | undefined
}
