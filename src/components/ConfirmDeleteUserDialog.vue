<script setup lang="ts">
const emit = defineEmits(['confirm'])
const visible = defineModel('visible', {
  default: false,
  required: true,
  type: Boolean,
})
</script>

<template>
  <v-dialog
    v-model="visible"
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-alert"
      text="Вы подтверждаете удаление пользователя?"
      title="Подтверждение удаления"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          data-cy-id="to-reject"
          text="Нет"
          @click="visible = false"
        ></v-btn>
        <v-btn
          data-cy-id="to-confirm"
          text="Да"
          color="red"
          variant="elevated"
          @click="emit('confirm')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
