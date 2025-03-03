<script setup lang="ts">
import { useUsersStore } from '@/stores/users';

const usersStore = useUsersStore();

const tableHeader = [
  { title: 'Метка', value: 'label', key: 'label' },
  { title: 'Тип записи', value: 'type', key: 'type' },
  { title: 'Логин', value: 'login', key: 'login' },
  { title: 'Пароль', value: 'password', key: 'password' },
  { title: '', key: 'actions' },
]

const types = ['LDAP', 'Локальная']

</script>

<template>
  <div>
    <h1>Учетные записи</h1>
    <v-btn @click="usersStore.addUser()">Добавить</v-btn>
    <v-data-table :items="usersStore.users" key="id" :headers="tableHeader">
      <template v-slot:item.type="{ item }">
        <v-select v-model="item.type" :items="types" variant="outlined"></v-select>
      </template>
      <template v-slot:item.login="{ item }">
        <v-text-field v-model="item.login" type="input" variant="outlined"></v-text-field>
      </template>
      <template v-slot:item.password="{ item }">
        <v-text-field v-model="item.password" type="password" variant="outlined"></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-trash-can-outline" @click="usersStore.removeUser(item.id)"></v-btn>
      </template>
      <template v-slot:no-data>
        Данные отсутствуют
      </template>
    </v-data-table>
  </div>
</template>

<style scoped lang="scss"></style>
