<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import UserRow from '@/components/UserRow.vue'
import ConfirmDeleteUserDialog from '@/components/ConfirmDeleteUserDialog.vue'
import type { User } from '@/global'

const usersStore = useUsersStore()

const hasChangedAndNewUsers = computed(() => {
  return usersStore.users.findIndex((u) => u.isSaved === false || u.isNew === true) !== -1
})

const hasNewUsers = computed(() => {
  return usersStore.users.findIndex((u) => u.isNew === true) !== -1
})

const tableHeader = [
  { title: 'Метка', key: 'label' },
  { title: 'Тип записи', key: 'type' },
  { title: 'Логин', key: 'login' },
  { title: 'Пароль', key: 'password' },
  { title: '', key: 'actions' },
]

const dialogVisible = ref(false)
const removableUserId = ref<User['id']>()

const onSuccessRemoveUser = () => {
  if (removableUserId.value) usersStore.removeUser(removableUserId.value)
  dialogVisible.value = false
  removableUserId.value = undefined
}

const onRemoveUser = ($event: User['id']) => {
  removableUserId.value = $event
  dialogVisible.value = true
}

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (hasChangedAndNewUsers.value) {
    event.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div>
    <div class="d-flex align-center ga-5 pb-5">
      <h1>Учетные записи</h1>
      <v-btn
        data-cy-id="to-add-user"
        prepend-icon="mdi-plus"
        :disabled="hasNewUsers"
        @click="usersStore.addUser()"
      >
        Добавить
      </v-btn>
    </div>
    <div class="label-hint">
      <v-icon
        icon="mdi-alert-outline"
        color="orange-darken-2"
      ></v-icon>
      <span>
        Для указания меток для пользователя используйте разделитель <b>;</b> (точка с запятой)
      </span>
    </div>
    <div class="users-table">
      <span
        v-for="header in tableHeader"
        :key="header.key"
      >
        {{ header.title }}
      </span>
      <UserRow
        v-for="(user, index) in usersStore.users"
        :key="user.id"
        :index="index"
        :user="usersStore.users[index]"
        @update:user="usersStore.editUser($event, index)"
        @remove="onRemoveUser"
      />
      <div
        v-if="usersStore.users.length === 0"
        class="users-table--empty"
      >
        <h3>Данные отсутстуют</h3>
      </div>
    </div>
    <ConfirmDeleteUserDialog
      v-model:visible="dialogVisible"
      @confirm="() => onSuccessRemoveUser()"
    />
  </div>
</template>

<style scoped lang="scss">
.label-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #ecf3fa;
  margin-bottom: 20px;
  padding: 10px;
}
.users-table {
  display: grid;
  grid-template-columns: repeat(5, minmax(246px, 1fr));
  gap: 10px;
  &--empty {
    grid-column: 1 / 6;
    margin: 0 auto;
  }
}
</style>
