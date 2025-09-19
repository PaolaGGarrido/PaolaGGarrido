describe('Flujo: Insumo', () => {
  Cypress.on('uncaught:exception', () => false)

  function validarFilaInsumo({ nombre, sku, proveedor, unidad, cantidad }) {
    cy.contains(nombre, { timeout: 5000 })
      .parents('tr')
      .within(() => {
        cy.contains(sku).should('exist')
        cy.contains(proveedor).should('exist')
        cy.contains(unidad).should('exist')
        cy.contains(new RegExp(cantidad.replace('.', '\\.?'))).should('exist')
      })
  }

  function validarTarjetaPorSKU({ sku, nombre, proveedor, unidad, cantidad }) {
    cy.contains(sku, { timeout: 5000 })
      .parentsUntil('section') // o el contenedor que agrupa las tarjetas
      .first()
      .within(() => {
        cy.contains(nombre).should('exist')
        cy.contains(proveedor).should('exist')
        cy.contains(unidad).should('exist')
        cy.contains(new RegExp(cantidad.replace('.', '\\.?'))).should('exist')
      })
  }

  it('Agrega un insumo y verifica que aparezca como tarjeta', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')

    // Login
    cy.get('input[placeholder="Ingresá tu correo electrónico"]').type('pepito@correo.com')
    cy.get('input[placeholder="Ingresá tu contraseña"]').type('Pepito666')
    cy.contains('button', 'Iniciar sesión').click()

    // Ir a sección Insumos
    cy.contains('Insumos').should('exist').click()

    // Abrir formulario para agregar insumo
    cy.contains('button', 'Agregar insumo').click()

    // Completar formulario
    cy.get('input[placeholder="Código referencial del insumo"]').type('SKU-0024')
    cy.get('input[placeholder="Nombre del insumo"]').type('Parafina')
    cy.get('input[placeholder="Nombre o alias del proveedor"]').type('GAMA')

    // Estado de la materia
    cy.contains('button[role="combobox"]', 'Seleccionar estado').click()
    cy.get('[data-radix-portal], [role="listbox"]').within(() => {
      cy.contains('[role="option"], div', 'Sólido').click({ force: true })
    })

    // Unidad de medida
    cy.contains('button[role="combobox"]', 'Seleccionar unidad').click()
    cy.get('[data-radix-portal], [role="listbox"]').within(() => {
      cy.contains('[role="option"], div', 'Gramos').click({ force: true })
    })

    // Costo unitario
    cy.get('input[placeholder="Costo unitario del insumo"]').type('2300')

    // Moneda
    cy.contains('button[role="combobox"]', 'Seleccionar moneda').click()
    cy.get('[data-radix-portal], [role="listbox"]').within(() => {
      cy.contains('[role="option"], div', 'ARS').click({ force: true })
    })

    // Guardar insumo (botón tipo submit)
    cy.get('button[type="submit"][form="create-feedstock-form"]').click({ force: true })

    // Validar mensaje de éxito
    cy.contains('Insumo creado exitosamente', { timeout: 5000 }).should('exist')

    // Validar que la tarjeta contiene los datos
    validarTarjetaPorSKU({
      sku: 'SKU-0021',
      nombre: 'Parafina',
      proveedor: 'GAMA',
      unidad: 'Gramos',
      cantidad: '2300'
    })
  })
})










