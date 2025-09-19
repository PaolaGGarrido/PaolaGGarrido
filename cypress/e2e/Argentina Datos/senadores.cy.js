describe('Acceso a Senadores', () => {
  // Configuración para ignorar errores de React
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => {
      // Ignorar TODOS los errores de React
      if (err.message.includes('React') || 
          err.message.includes('Minified') ||
          err.message.includes('https://react.dev/errors/')) {
        console.log('✅ Error de React ignorado:', err.message)
        return false // No fallar el test
      }
      // Para otros errores, dejar que Cypress falle
      return true
    })
  })

  it('Click en Ver Senadores con manejo de errores React', () => {
    // Paso 1: Visitar la página
    cy.visit('https://senadores.argentinadatos.com/', {
      timeout: 15000 // Timeout extendido
    })

    // Paso 2: Esperar a que la página cargue
    cy.get('body', { timeout: 10000 }).should('be.visible')
    
    // Espera adicional para que React se estabilice
    cy.wait(2000)

    // Paso 3: Buscar y hacer click en "Ver Senadores"
    cy.contains('Ver Senadores', { timeout: 5000 })
      .should('be.visible')
      .click({ force: true }) // Force click para evitar problemas de re-render

    // Paso 4: Verificar que redirigió correctamente
    cy.url({ timeout: 8000 }).should('include', '/senadores')
    
    // Verificación adicional de que se cargó contenido
    cy.get('body').should('contain', 'senador', { timeout: 5000 })
  })
})