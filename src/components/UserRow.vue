<script setup lang="ts">
import { watch } from 'vue'
import type { User } from '@/global'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

export type UserForm = Omit<User, 'label'> & {
  label: string | null
}

const user = defineModel<User>('user', { required: true })
const emit = defineEmits(['remove'])
const types = ['LDAP', 'Локальная']

const { defineField, errors, handleSubmit, meta } = useForm<UserForm>({
  initialValues: {
    label: user.value.label?.map((l) => l.text).join(';'),
    type: user.value.type,
    login: user.value.login,
    password: user.value.password,
  },
  validationSchema: yup.object().shape({
    label: yup.string().max(50, 'Превышено допустимое количество символов. Максимум 50'),
    type: yup
      .string()
      .matches(/^(LDAP|Локальная)$/i, 'Некорректно заполнено поле')
      .required('Значение должно быть заполнено'),
    login: yup
      .string()
      .min(3, 'Минимальное количество 3 символа')
      .max(100, 'Допустимое количество 100 символов')
      .matches(/^[a-zA-Z]([a-zA-Z0-9.-]{0,98}[a-zA-Z0-9])?$/i, 'Некорректно заполнено поле')
      .required('Значение должно быть заполнено'),
    password: yup.string().when('type', {
      is: 'Локальная',
      then: (schema) =>
        schema
          .matches(
            /^[A-Za-z\d@$!%*?&]{8,100}$/g,
            'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол из представленных @, $, !, %, *, ?, &',
          )
          .min(8, 'Минимальное количество 8 символов')
          .max(100, 'Допустимое количество 100 символов')
          .required('Значение должно быть заполнено'),
    }),
  }),
})

const onSubmit = handleSubmit((values) => {
  const preparedUser: User = {
    id: user.value.id,
    label: values.label?.split(';').map((l) => ({ text: l })),
    type: values.type,
    login: values.login,
    password: values.password,
  }
  user.value = preparedUser
})

watch(
  () => meta.value.valid,
  (val) => {
    console.log(val)
    if (val) onSubmit()
  },
)

const [label, labelAttrs] = defineField('label')
const [type, typeAttrs] = defineField('type')
const [login, loginAttrs] = defineField('login')
const [password, passwordAttrs] = defineField('password')
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
    :class="{ 'login--colspan-2': type === 'LDAP' }"
    density="compact"
    variant="outlined"
  ></v-text-field>
  <v-text-field
    v-if="type !== 'LDAP'"
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
