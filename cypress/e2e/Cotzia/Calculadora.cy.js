describe('Agregar Cera, cerrar modal y descargar PDF', () => {
  Cypress.on('uncaught:exception', () => false)

  // 🔹 Login
  function loginCotzia(email, password) {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('input[placeholder="Ingresá tu correo electrónico"]').type(email)
    cy.get('input[placeholder="Ingresá tu contraseña"]').type(password)
    cy.contains('button', 'Iniciar sesión').click()
    cy.get('span[aria-label="calculadora"]', { timeout: 20000 }).should('be.visible')
  }

  // 🔹 Esperar que la UI esté lista (versión simplificada)
  function esperarQueLaUIEsteInteractuable() {
    cy.log('Esperando que la UI esté lista...')
    cy.wait(2000) // Espera genérica
    cy.get('body').should('not.have.css', 'pointer-events', 'none')
  }

  // 🔹 Abrir modal de agregar producto
  function abrirModalAgregarProducto() {
    cy.log('Abriendo modal de "Agregar producto"...')
    
    // Buscar y hacer clic en el botón de agregar producto
    cy.contains('button', 'Agregar producto', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    // Esperar a que el modal se abra completamente
    cy.get('input[placeholder="Buscar producto"]', { timeout: 15000 })
      .should('be.visible')
  }

  // 🔹 Buscar y seleccionar producto
  function buscarYSeleccionarProducto(nombre) {
    cy.log(`Buscando producto: "${nombre}"`)
    
    // Buscar el producto
    cy.get('input[placeholder="Buscar producto"]')
      .clear()
      .type(nombre)

    cy.wait(1000) // Esperar a que carguen los resultados

    cy.log(`Seleccionando la opción "${nombre}"`)
    cy.contains('div', nombre, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    cy.log('Agregando a la lista')
    cy.contains('button', 'Agregar a la lista', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    cy.wait(500)
  }

  // 🔹 Agregar producto a la calculadora
  function agregarProductoAlCalculo(nombre) {
    esperarQueLaUIEsteInteractuable()
    
    abrirModalAgregarProducto()
    buscarYSeleccionarProducto(nombre)

    cy.log('Confirmando agregar al cálculo')
    cy.contains('button', 'Agregar', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true })

    cy.log(`Validando que "${nombre}" quedó en la calculadora`)
    cy.contains(nombre, { timeout: 10000 }).should('be.visible')
  }

  // 🔹 Cerrar modal
  function cerrarModalProductos() {
    cy.log('Cerrando modal de productos')
    
    // Intentar cerrar con ESC (método más confiable)
    cy.get('body').type('{esc}')
    
    // Verificar que el modal se cerró
    cy.get('input[placeholder="Buscar producto"]', { timeout: 5000 })
      .should('not.exist')
  }

  // 🔹 Test principal - Solo Cera
  it('Agrega Cera, cierra modal y descarga PDF', () => {
    loginCotzia('pepito@correo.com', 'Pepito666')

    // Ir a calculadora
    cy.get('span[aria-label="calculadora"]').click({ force: true })
    cy.contains('Nuevo cálculo', { timeout: 15000 }).should('be.visible')

    // Agregar solo Cera
    cy.log('--- Agregando Cera ---')
    agregarProductoAlCalculo('Cera')

    // Cerrar el modal
    cerrarModalProductos()

    // Validar que Cera está visible
    cy.contains('Cera', { timeout: 10000 }).should('be.visible')

    // Validar que el total no sea $0.00
    cy.contains('Total', { timeout: 10000 })
      .siblings().last()
      .should('not.contain', '$0.00')

    // Configurar para manejar la descarga de PDF
    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen')
    })

    // Descargar PDF
    cy.log('Buscando botón Descargar PDF...')
    cy.contains('button', 'Descargar PDF', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    // Verificar que se intentó abrir el PDF
    cy.get('@windowOpen').should('be.called')
    cy.log('PDF generado correctamente')

    cy.wait(1000)
  })

  // 🔹 Función de debug para screenshots en caso de error
  afterEach(function() {
    if (this.currentTest.state === 'failed') {
      cy.screenshot('error-screenshot')
      cy.log('Screenshot tomado debido al fallo')
    }
  })
})




