import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/global'
import { v4 as uuidv4 } from 'uuid'

export const draftUser = (): User => {
  return {
    id: uuidv4(),
    label: [],
    type: null,
    login: null,
    password: null,
  }
}

export const useUsersStore = defineStore('users', () => {
  const users = ref<Array<User>>([])

  function addUser() {
    users.value.push(draftUser())
    setLocalUsers()
  }

  function removeUser(id: User['id']) {
    users.value = users.value.filter((item) => item.id !== id)
    setLocalUsers()
  }

  const getLocalUsers = () => {
    users.value = []
    const localUsers: Array<User> = JSON.parse(localStorage.getItem('users') ?? '[]')
    users.value = localUsers
    // for (const [id, user] of localUsers) {
    //   users.set(id, user)
    // }
  }

  const setLocalUsers = () => {
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  return { users, addUser, removeUser, getLocalUsers }
})
