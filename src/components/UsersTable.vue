<script setup lang="ts">
import { useUsersStore } from '@/stores/users';
import UserRow from './UserRow.vue';

const usersStore = useUsersStore();

const tableHeader = [
  { title: 'Метка', value: 'label', key: 'label' },
  { title: 'Тип записи', value: 'type', key: 'type' },
  { title: 'Логин', value: 'login', key: 'login' },
  { title: 'Пароль', value: 'password', key: 'password' },
  { title: '', key: 'actions' },
]


</script>

<template>
  <div>
    <div class="d-flex align-center ga-5 pb-5">
      <h1>Учетные записи</h1><v-btn @click="usersStore.addUser()">Добавить</v-btn>
    </div>
    <div class="users-table">
      <span v-for="header in tableHeader" :key="header.key">
        {{ header.title }}
      </span>
      <UserRow v-for="(user, index) in usersStore.users" :key="user.id" v-model:user="usersStore.users[index]"
        @remove="usersStore.removeUser($event)" />
    </div>
    <div v-if="usersStore.users.length === 0"><span>Данные отсутстуют</span></div>
  </div>
</template>

<style scoped lang="scss">
.users-table {
  display: grid;
  grid-template-columns: repeat(5, minmax(256px, 1fr));
  gap: 10px;
}
</style>
