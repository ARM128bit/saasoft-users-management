<script setup lang="ts">
import type { User } from '@/global'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUsersStore } from '@/stores/users'
import { userTypes } from '@/constants/user'

type UserForm = Omit<User, 'label'> & {
  label: string | null
}

interface DefaultProps {
  index: number
}

defineProps<DefaultProps>()
const emit = defineEmits<{
  (e: 'remove', id: User['id']): void
}>()

const usersStore = useUsersStore()

const user = defineModel<User>('user', { required: true })

const {
  defineField,
  errors,
  values: formValues,
  validate,
} = useForm<UserForm>({
  initialValues: {
    id: user.value.id,
    label: user.value.label?.map((l) => l.text).join(';'),
    type: user.value.type,
    login: user.value.login,
    password: user.value.password,
  },
  validationSchema: yup.object().shape({
    label: yup.string().max(50, 'Превышено допустимое количество символов. Максимум 50 символов'),
    type: yup
      .string()
      .matches(/^(LDAP|Локальная)$/i, 'Некорректно заполнено поле')
      .required('Значение должно быть заполнено'),
    login: yup
      .string()
      .min(3, 'Минимум 3 символа')
      .max(100, 'Превышено допустимое количество символов. Максимум 100 символов')
      .matches(/^[a-zA-Z]([a-zA-Z0-9.-]{0,98}[a-zA-Z0-9])?$/i, 'Некорректно заполнено поле')
      .test(
        'uniqueLogin',
        'Имена пользователей должны быть уникальными',
        function (value: UserForm['login']) {
          const idx = usersStore.users.findIndex((u) => {
            return u.login === value && u.id !== formValues.id
          })
          return idx === -1
        },
      )
      .required('Значение должно быть заполнено'),
    password: yup
      .string()
      .nullable()
      .when('type', {
        is: (type: string) => type === 'Локальная' || type === undefined,
        then: (schema) =>
          schema
            .matches(
              /^[A-Za-z\d@$!%*?&]{8,}$/g,
              'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол из представленных @, $, !, %, *, ?, &',
            )
            .max(100, 'Превышено допустимое количество символов. Максимум 100 символов')
            .required('Значение должно быть заполнено'),
      }),
  }),
})

const onSubmit = async () => {
  const isValid = await validate()
  if (isValid.valid) {
    const preparedUser: User = {
      id: user.value.id,
      label: formValues.label
        ?.split(';')
        .filter((l) => !!l)
        .map((l) => ({ text: l })),
      type: formValues.type,
      login: formValues.login,
      password: formValues.type !== 'LDAP' ? formValues.password : null,
    }
    user.value = preparedUser
    if (formValues.type === 'LDAP') password.value = null
  } else {
    user.value = { ...user.value, isSaved: false }
  }
}

const [label] = defineField('label')
const [type] = defineField('type')
const [login] = defineField('login')
const [password] = defineField('password')
</script>

<template>
  <v-text-field
    :data-cy-id="`label-${index}`"
    v-model="label"
    :error-messages="errors.label"
    type="input"
    variant="outlined"
    density="compact"
    @blur="onSubmit"
  ></v-text-field>
  <v-select
    :data-cy-id="`type-${index}`"
    v-model="type"
    :error-messages="errors.type"
    :items="userTypes"
    density="compact"
    variant="outlined"
    @change="onSubmit"
    @blur="onSubmit"
  ></v-select>
  <v-text-field
    :data-cy-id="`login-${index}`"
    v-model="login"
    :error-messages="errors.login"
    :class="{ 'login--colspan-2': type === 'LDAP' }"
    density="compact"
    variant="outlined"
    @blur="onSubmit"
  ></v-text-field>
  <v-text-field
    v-if="type !== 'LDAP'"
    :data-cy-id="`password-${index}`"
    v-model="password"
    :error-messages="errors.password"
    type="password"
    density="compact"
    variant="outlined"
    @blur="onSubmit"
  ></v-text-field>
  <v-btn
    :data-cy-id="`remove-${index}`"
    color="red"
    prepend-icon="mdi-trash-can-outline"
    @click="emit('remove', user.id)"
  >
    Удалить
  </v-btn>
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
