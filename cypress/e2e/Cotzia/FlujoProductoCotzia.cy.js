describe('Flujo: Producto', () => {
  Cypress.on('uncaught:exception', () => false)

  // Función mejorada para esperar a que la aplicación cargue completamente
  function esperarCargaCompleta() {
    cy.log('Esperando a que la aplicación cargue completamente...')
    
    // Esperar a que desaparezca el indicador de carga
    cy.get('body', { timeout: 30000 }).should(($body) => {
      // Verificar múltiples indicadores de carga
      const indicadoresCarga = [
        'Cargando...',
        'Loading...',
        'Cargando',
        'Loading',
        '.loading',
        '.spinner',
        '[aria-label="loading"]',
        'text/Cargando'
      ]
      
      // Si encontramos algún indicador de carga, fallar el should
      const tieneCarga = indicadoresCarga.some(indicador => {
        if (typeof indicador === 'string') {
          return $body.text().includes(indicador) || 
                 $body.find(indicador).length > 0
        }
        return false
      })
      
      expect(tieneCarga).to.be.false
    }).then(() => {
      cy.log('La aplicación ha terminado de cargar')
    })
    
    // Esperar adicionalmente a que los elementos principales estén visibles
    cy.get('nav, header, [role="navigation"]', { timeout: 10000 }).should('be.visible')
  }

  // Función para navegar a la sección de Productos
  function navegarAProductos() {
    cy.log('Navegando a la sección de Productos...')
    
    // Primero verificar si ya estamos en la sección correcta
    cy.get('body').then(($body) => {
      if ($body.find('h1:contains("Productos"), h2:contains("Productos")').length > 0) {
        cy.log('Ya estamos en la sección de Productos')
        return
      }
      
      // Intentar diferentes formas de encontrar el enlace/button de Productos
      const selectores = [
        'a[href*="productos"]',
        'button:contains("Productos")',
        'span:contains("Productos")',
        'div:contains("Productos")',
        'nav a:contains("Productos")',
        'nav button:contains("Productos")',
        '[data-testid="nav-productos"]',
        '[aria-label*="productos"]'
      ]
      
      let encontrado = false
      
      selectores.forEach(selector => {
        if ($body.find(selector).length > 0 && !encontrado) {
          cy.get(selector).first().then($el => {
            if ($el.is(':visible') && !encontrado) {
              cy.wrap($el).click({ force: true })
              encontrado = true
              cy.log(`Navegación exitosa usando selector: ${selector}`)
            }
          })
        }
      })
      
      if (!encontrado) {
        cy.log('No se encontró el enlace de Productos, intentando con búsqueda general...')
        cy.contains(/productos/i, { timeout: 10000 })
          .should('be.visible')
          .click({ force: true })
      }
    })
    
    // Verificar que llegamos a la sección de Productos
    cy.contains(/productos/i, { timeout: 15000 }).should('exist')
  }

  function validarProductoEnTabla({ nombre, sku, estado, unidad }) {
    cy.contains(nombre, { timeout: 10000 })
      .should('be.visible')
      .parents('tr')
      .within(() => {
        if (sku) cy.contains(sku).should('exist')
        if (estado) cy.contains(estado).should('exist')
        if (unidad) cy.contains(unidad).should('exist')
      })
  }

  function seleccionarOpcionCombobox(selector, opcion) {
    cy.log(`Seleccionando "${opcion}" en combobox`)
    
    cy.get(selector, { timeout: 10000 }).should('be.visible').then($combobox => {
      if ($combobox.is(':disabled')) {
        cy.log('Combobox está deshabilitado, esperando...')
        cy.wait(1000)
        // Intentar nuevamente después de esperar
        return seleccionarOpcionCombobox(selector, opcion)
      }
      
      cy.get(selector).click({ force: true })
      
      // Esperar a que aparezcan las opciones
      cy.get('[role="listbox"], [data-radix-select-viewport], .select-content', { timeout: 5000 })
        .should('be.visible')
        .within(() => {
          cy.contains('[role="option"], div, li', opcion)
            .should('be.visible')
            .click({ force: true })
        })
    })
  }

  it('Agrega un producto básico', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')

    // Login
    cy.get('input[placeholder*="correo electrónico"], input[type="email"]').type('pepito@correo.com')
    cy.get('input[placeholder*="contraseña"], input[type="password"]').type('Pepito666')
    cy.contains('button', 'Iniciar sesión').click()

    // Esperar a que cargue la interfaz con manejo mejorado
    esperarCargaCompleta()
    
    // Navegar a productos
    navegarAProductos()

    // ➕ Abrir formulario para agregar producto
    cy.contains('button', /agregar producto|nuevo producto/i, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true })

    // Esperar a que el formulario se cargue
    cy.contains(/agregar producto|nuevo producto/i, { timeout: 15000 }).should('be.visible')

    // Completar información básica del producto
    cy.get('input[placeholder*="SKU"], input[placeholder*="sku"]', { timeout: 10000 })
      .should('be.visible')
      .type('PROD-TEST-001')
    
    cy.get('input[placeholder*="Nombre del producto"]').type('Producto Test Cypress')

    // Estado de la materia
    seleccionarOpcionCombobox('button:contains("Seleccionar estado"), [aria-label*="estado"]', 'Sólido')

    // Esperar a que se habilite la unidad de medida
    cy.get('button:contains("Seleccionar unidad"), [aria-label*="unidad"]', { timeout: 10000 })
      .should('not.be.disabled')
    
    // Unidad de medida
    seleccionarOpcionCombobox('button:contains("Seleccionar unidad"), [aria-label*="unidad"]', 'Gramos')

    // Cantidad del producto
    cy.get('input[placeholder="1"]').first().should('be.visible').clear().type('100')

    // Tiempo de trabajo
    cy.get('input[placeholder="1"]').eq(1).should('be.visible').clear().type('0.5')

    // Descripción (opcional)
    cy.get('textarea').type('Producto de prueba creado por Cypress')

    // Guardar producto
    cy.contains('button', /agregar producto|guardar/i).click({ force: true })

    // Validar mensaje de éxito con timeout extendido
    cy.contains(/éxito|creado|guardado/i, { timeout: 20000 }).should('exist')

    // Validar que el producto aparece en la lista
    validarProductoEnTabla({
      nombre: 'Producto Test Cypress',
      sku: 'PROD-TEST-001',
      estado: 'Sólido',
      unidad: 'Gramos'
    })
  })

  // Función opcional para debug - tomar screenshots en cada paso
  function debugPaso(pasoNombre) {
    cy.screenshot(`debug-${pasoNombre.replace(/\s+/g, '-').toLowerCase()}`)
    cy.log(`DEBUG: Completado paso - ${pasoNombre}`)
  }
})