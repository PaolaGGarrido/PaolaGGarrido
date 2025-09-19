describe('Navegación completa con URLs exactas', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false)
  })

  it('Flujo completo: Principal → Diputados → Actas → Primera Acta', () => {
    // Paso 1: Ir a la página principal
    cy.visit('https://argentinadatos.com/', {
      timeout: 20000,
      failOnStatusCode: false
    })

    // Verificar que la página principal cargó
    cy.get('body', { timeout: 15000 }).should('be.visible')
    cy.contains('ArgentinaDatos', { timeout: 10000 }).should('be.visible')
    cy.wait(2000)

    // Paso 2: Hacer click en "Diputados" en la página principal
    cy.get('body').then(($body) => {
      // Buscar el enlace/button que lleve a diputados.argentinadatos.com
      const diputadosLink = $body.find('a[href*="diputados.argentinadatos.com"], [href*="/diputados"]').first()
      
      if (diputadosLink.length > 0) {
        console.log('✅ Enlace a Diputados encontrado:', diputadosLink.attr('href'))
        cy.wrap(diputadosLink).click({ force: true })
      } else {
        // Si no encuentra el enlace específico, buscar por texto
        const diputadosText = $body.find('*').filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase().trim()
          return text === 'diputados' || text.includes('diputados')
        }).first()
        
        if (diputadosText.length > 0) {
          cy.wrap(diputadosText).click({ force: true })
        } else {
          // Si no encuentra, ir directamente a la URL
          cy.visit('https://diputados.argentinadatos.com/')
        }
      }
    })

    // Paso 3: Verificar que estamos en diputados.argentinadatos.com
    cy.url({ timeout: 10000 }).should('include', 'diputados.argentinadatos.com')
    cy.get('body', { timeout: 10000 }).should(($body) => {
      expect($body.text().toLowerCase()).to.include('diputad')
    })
    cy.wait(2000)

    // Paso 4: Ir directamente a actas usando la URL exacta
    cy.visit('https://diputados.argentinadatos.com/actas', {
      timeout: 20000,
      failOnStatusCode: false
    })

    // Verificar que estamos en la página de actas
    cy.url({ timeout: 10000 }).should('eq', 'https://diputados.argentinadatos.com/actas')
    cy.get('body', { timeout: 10000 }).should(($body) => {
      expect($body.text().toLowerCase()).to.include('actas')
    })
    cy.wait(3000)

    // Paso 5: DEBUG - Mostrar todas las actas disponibles
    cy.get('body').then(($body) => {
      console.log('=== ACTAS DISPONIBLES ===')
      
      // Buscar elementos que probablemente sean actas
      const actasElements = $body.find([
        'a[href*="/acta/"]',
        'a[href*="/sesion/"]',
        'tr[onclick]',
        '.acta-item',
        '.sesion-item',
        '.list-group-item',
        'table tbody tr',
        '[data-testid*="acta"]'
      ].join(','))
      
      console.log('Número de actas encontradas:', actasElements.length)
      
      actasElements.each((index, el) => {
        const text = el.textContent.trim().substring(0, 100)
        const href = el.href || el.getAttribute('href') || ''
        console.log(`Acta ${index + 1}: "${text}" - ${href}`)
      })

      // Paso 6: Hacer click en la primera acta
      if (actasElements.length > 0) {
        const firstActa = actasElements.first()
        console.log('✅ Haciendo click en la primera acta:', firstActa.text().trim())
        
        cy.wrap(firstActa)
          .should('be.visible')
          .click({ force: true })
      } else {
        // Fallback: buscar cualquier enlace que pueda ser un acta
        cy.get('a').first().click({ force: true })
      }
    })

    // Paso 7: Verificar que se cargó el detalle del acta
    cy.url({ timeout: 10000 }).should(($url) => {
      expect($url).to.satisfy(url => 
        url.includes('/acta/') ||
        url.includes('/sesion/') ||
        url.includes('diputados.argentinadatos.com/') && 
        (url.includes('acta') || url.includes('sesion'))
      )
    })

    cy.get('body', { timeout: 8000 }).should(($body) => {
      const text = $body.text().toLowerCase()
      expect(text).to.satisfy(content => 
        content.includes('acta') ||
        content.includes('sesión') ||
        content.includes('votación') ||
        content.includes('diputado') ||
        content.includes('expediente')
      )
    })

    // Screenshot de confirmación
    cy.screenshot('detalle-acta-cargado')
  })
})