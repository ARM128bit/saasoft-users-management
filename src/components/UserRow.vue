<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/global'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const user = defineModel<User>('user', { required: true })
const emit = defineEmits(['remove'])
const types = ['LDAP', 'Локальная']

const userLabel = computed(() => {
  return user.value.label?.map((l) => l.text).join(';')
})

const handleLabelForm = (val: string) => {
  user.value.label = val.split(';').map((l) => ({ text: l }))
}

const { defineField, errors } = useForm({
  validationSchema: yup.object({
    label: yup.string().max(50, 'Превышено допустимое количество символов. Максимум 50'),
    type: yup.string().required('Значение должно быть заполнено'),
    login: yup
      .string()
      .matches(/^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-]$/i, 'Некорректно заполнено поле')
      .min(3, 'Минимальное количество 3 символа')
      .max(100, 'Допустимое количество 100 символов')
      .required('Значение должно быть заполнено'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/,
        'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол',
      )
      .min(8, 'Минимальное количество 8 символов')
      .max(100, 'Допустимое количество 100 символов')
      .required('Значение должно быть заполнено'),
  }),
})

const [label, labelAttrs] = defineField<string>('label')
const [type, typeAttrs] = defineField<string>('type')
const [login, loginAttrs] = defineField<string>('login')
const [password, passwordAttrs] = defineField<string>('password')
</script>

<template>
  <v-text-field
    v-model="label"
    v-bind="labelAttrs"
    :error-messages="errors.label"
    type="input"
    variant="outlined"
    density="compact"
  ></v-text-field>
  <v-select
    v-model="type"
    v-bind="typeAttrs"
    :error-messages="errors.type"
    :items="types"
    density="compact"
    variant="outlined"
  ></v-select>
  <v-text-field
    v-model="login"
    v-bind="loginAttrs"
    :error-messages="errors.login"
    :class="{ 'login--colspan-2': user.type === 'LDAP' }"
    density="compact"
    variant="outlined"
  ></v-text-field>
  <v-text-field
    v-if="user.type !== 'LDAP'"
    v-model="password"
    v-bind="passwordAttrs"
    :error-messages="errors.password"
    type="password"
    density="compact"
    variant="outlined"
  ></v-text-field>
  <v-btn @click="emit('remove', user.id)">Удалить</v-btn>
</template>

<style scoped>
.login--colspan-2 {
  grid-column: 3 / 5;
}
</style>

<style>
.v-input--horizontal {
  grid-template-rows: 40px auto;
}
.v-input__details {
  align-items: flex-start;
}
</style>
