export type UserLabel = {
  text: string
}

export type User = {
  id: string
  label: UserLabel[] | undefined
  type: 'LDAP' | 'Локальная' | undefined
  login: string | undefined
  password: string | null | undefined
  isSaved?: boolean
  isNew?: boolean
}
