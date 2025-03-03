<script setup lang="ts">
import type { User } from '@/global';

const user = defineModel<User>('user', { required: true })
const emit = defineEmits(['remove'])
const types = ['LDAP', 'Локальная']
</script>

<template>
  <tr>
    <td>
      <v-text-field :model-value="user.label?.map(l => l.text).join(';')" type="input" variant="outlined"
        density="compact"
        @update:model-value="(str) => { user.label = str.split(';').map(l => ({ text: l })) }"></v-text-field>
    </td>
    <td>
      <v-select v-model="user.type" :items="types" density="compact" variant="outlined"></v-select>
    </td>
    <td :colspan="user.type === 'LDAP' ? 2 : 1">
      <v-text-field v-model="user.login" density="compact" variant="outlined"></v-text-field>
    </td>
    <td v-if="user.type !== 'LDAP'">
      <v-text-field v-model="user.password" type="password" density="compact" variant="outlined"></v-text-field>
    </td>
    <td>
      <v-btn @click="emit('remove', user.id)">Удалить</v-btn>
    </td>
  </tr>
</template>

<style scoped>
td {
  vertical-align: top;
  padding: 0 10px
}
</style>
