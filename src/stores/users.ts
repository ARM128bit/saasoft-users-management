import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/global'
import { v4 as uuidv4 } from 'uuid'

export const draftUser = (): User => {
  return {
    id: uuidv4(),
    label: [],
    type: undefined,
    login: undefined,
    password: undefined,
    isSaved: false,
    isNew: true,
  }
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<Array<User>>([])

  function addUser() {
    users.value.push(draftUser())
    setLocalUsers()
  }

  const editUser = (user: User, idx: number) => {
    users.value[idx] = user
    setLocalUsers()
  }

  function removeUser(id: User['id']) {
    users.value = users.value.filter((item) => item.id !== id)
    setLocalUsers()
  }

  const getLocalUsers = () => {
    const localUsers: Array<User> = JSON.parse(localStorage.getItem('users') ?? '[]')
    users.value = localUsers.filter(
      (user) => user.login && ((user.type === 'Локальная' && user.password) || user.type),
    )
  }

  const setLocalUsers = () => {
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  return { users, addUser, editUser, removeUser, getLocalUsers }
})
