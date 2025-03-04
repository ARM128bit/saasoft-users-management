// https://on.cypress.io/api

describe('Users', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Open page', () => {
    cy.contains('h1', 'Учетные записи')
    cy.get('.label-hint').contains('Для указания меток для пользователя используйте разделитель ;')
    cy.get('.users-table--empty').contains('Данные отсутстуют')
  })

  it('Create user', () => {
    cy.get('[data-cy-id="to-add-user"]').click()
    cy.get('[data-cy-id="to-add-user"]').should('be.disabled')
    cy.get('.users-table--empty').should('not.exist')
    cy.get('div[data-cy-id="type-0"]').click()
    cy.get('div[data-cy-id="login-0"]').click()
    cy.get('div[data-cy-id="password-0"]').click()
    cy.get('div[data-cy-id="label-0"]').click()
    cy.get('h1').click()
    cy.get('div[data-cy-id="label-0"] .v-messages').should('be.empty')
    cy.get('div[data-cy-id="type-0"] .v-messages').contains('Значение должно быть заполнено')
    cy.get('div[data-cy-id="login-0"] .v-messages').contains('Значение должно быть заполнено')
    cy.get('div[data-cy-id="password-0"] .v-messages').contains('Значение должно быть заполнено')
    cy.get('div[data-cy-id="label-0"]').type('dd;ss')
    cy.get('div[data-cy-id="type-0"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("LDAP")').click()
    cy.get('div[data-cy-id="type-0"] .v-field__input input').should('have.value', 'LDAP')
    cy.get('div[data-cy-id="type-0"] .v-messages').should('be.empty')
    cy.get('div[data-cy-id="password-0"]').should('not.exist')
    cy.get('div[data-cy-id="login-0"]').type('dd')
    cy.get('div[data-cy-id="login-0"] .v-messages').contains('Минимум 3 символа')
    cy.get('div[data-cy-id="login-0"]').type('1')
    cy.get('div[data-cy-id="login-0"] .v-messages').should('be.empty')
    cy.get('h1').click()

    // Вторая строка
    cy.get('[data-cy-id="to-add-user"]').should('be.enabled')
    cy.get('[data-cy-id="to-add-user"]').click()
    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("Локальная")').click()
    cy.get('div[data-cy-id="login-1"]').type('dd1')
    cy.get('div[data-cy-id="login-1"] .v-messages').contains(
      'Имена пользователей должны быть уникальными',
    )
    cy.get('div[data-cy-id="login-1"]').type('2')
    cy.get('div[data-cy-id="login-1"] .v-messages').should('be.empty')

    cy.get('div[data-cy-id="password-1"]').type('easypeasy')
    cy.get('div[data-cy-id="password-1"] .v-messages').contains(
      'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол из представленных @, $, !, %, *, ?, &',
    )
    cy.get('div[data-cy-id="password-1"]').type('!@QWE23')
    cy.get('div[data-cy-id="password-1"] .v-messages').should('be.empty')
    cy.get('h1').click()
    cy.reload()
    cy.get('div[data-cy-id="type-1"] .v-field__input input').should('have.value', 'Локальная')
    cy.get('div[data-cy-id="login-1"] .v-field__input').should('have.value', 'dd12')
    cy.get('div[data-cy-id="password-1"] .v-field__input').should('have.value', 'easypeasy!@QWE23')

    // Третья строка
    cy.get('[data-cy-id="to-add-user"]').should('be.enabled')
    cy.get('[data-cy-id="to-add-user"]').click()
    cy.get('div[data-cy-id="type-2"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("Локальная")').click()
    cy.get('div[data-cy-id="login-2"]').type('dd12')
    cy.get('div[data-cy-id="login-2"] .v-messages').contains(
      'Имена пользователей должны быть уникальными',
    )
    cy.get('[data-cy-id="remove-1"]').contains('Удалить')
    cy.get('[data-cy-id="remove-1"]').click()
    cy.get('[data-cy-id="to-reject"]').click()
    cy.get('[data-cy-id="to-reject"]').should('not.exist')
    cy.get('[data-cy-id="remove-1"]').click()
    cy.get('[data-cy-id="to-confirm"]').click()
    cy.get('[data-cy-id="to-confirm"]').should('not.exist')

    cy.get('div[data-cy-id="password-1"]').type('easypeasy')
    cy.get('div[data-cy-id="password-1"] .v-messages').contains(
      'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол из представленных @, $, !, %, *, ?, &',
    )
    cy.get('div[data-cy-id="password-1"]').type('!@QWE23')
    cy.get('div[data-cy-id="password-1"] .v-messages').should('be.empty')
    cy.get('h1').click()

    // Опять третья строка
    cy.get('[data-cy-id="to-add-user"]').should('be.enabled')
    cy.get('[data-cy-id="to-add-user"]').click()
    cy.get('div[data-cy-id="type-2"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("Локальная")').click()
    // 101 символ
    cy.get('div[data-cy-id="login-2"]').type(
      'dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd1251',
    )
    cy.get('div[data-cy-id="login-2"] .v-messages').contains(
      'Превышено допустимое количество символов. Максимум 100 символов',
    )
    // Менее 8 символов
    cy.get('div[data-cy-id="password-2"] input').type('!@QWe23')
    cy.get('div[data-cy-id="password-2"] .v-messages').contains(
      'Пароль должен содержать как минимум 8 символов, один заглавный символ, один строчный символ, одна цифра и один спецсимвол из представленных @, $, !, %, *, ?, &',
    )

    // 101 символ
    cy.get('div[data-cy-id="password-2"] input').type(
      'dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd125dd1251',
    )
    cy.get('[data-cy-id="password-2"] .v-messages').contains(
      'Превышено допустимое количество символов. Максимум 100 символов',
    )
    cy.get('[data-cy-id="remove-2"]').click()
    cy.get('[data-cy-id="to-confirm"]').click()

    // Возвращаемся ко второй строке

    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("LDAP")').click()
    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("Локальная")').click()
    cy.get('div[data-cy-id="password-1"] .v-field__input').should('have.value', 'easypeasy!@QWE23')
    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("LDAP")').click()
    cy.get('h1').click()
    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("Локальная")').click()
    cy.get('div[data-cy-id="password-1"] .v-field__input').should('have.value', '')
    cy.get('div[data-cy-id="password-1"] .v-messages').contains('Значение должно быть заполнено')
    cy.get('div[data-cy-id="type-1"]').click()
    cy.get('div.v-overlay-container .v-list-item-title:contains("LDAP")').click()
    cy.get('h1').click()
  })
})
