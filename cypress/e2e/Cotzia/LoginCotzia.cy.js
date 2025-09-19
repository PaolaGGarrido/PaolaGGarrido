describe('TC Login/Olvido de Contraseña', () => {
  it('Credenciales válidas', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('[name="email"]').type('pepito@correo.com')   
    cy.get('#password').type('Pepito666')
    cy.get('.bg-primary').click()    //boton Iniciar sesión
  }) //fin del it Credenciales válidas

  it('Cierre de sesión', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('[name="email"]').type('pepito@correo.com')   
    cy.get('#password').type('Pepito666')
    cy.get('.bg-primary').click()    //boton Iniciar sesión
    cy.get('.flex.gap-2 > .text-primary-foreground').click()  //boton Cerrar sesión

  }) //fin del it Cierre de sesión
  
  it('Campos vacíos', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    //cy.get('#_R_39bsnlb_-form-item').should('be.empty') 
    cy.get('[name="email"]').should('be.empty')
    cy.get('#password').should('be.empty')
    cy.get('.bg-primary').click()    //boton Iniciar sesión
   }) //fin del it 
   
   it('Usuario correcto, Contraseña vacío', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    //cy.get('#_R_39bsnlb_-form-item').type('pepito@correo.com')   
    cy.get('[name="email"]').type('pepito@correo.com')   
    cy.get('#password').should('be.empty')
    cy.get('.bg-primary').click()    //boton Iniciar sesión
    cy.get('.text-red-500').should('be.visible')
    cy.get('.text-red-500').should('contain', 'Ingrese su contraseña')
   }) //fin del it 

   it('Usuario vacío, Contraseña correcta', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('[name="email"]').should('be.empty')
    cy.get('#password').type('Pepito666')   
    cy.get('.bg-primary').click()    //boton Iniciar sesión
    cy.get('.text-red-500').should('be.visible')
    cy.get('.text-red-500').should('contain', 'El correo no es válido')
   }) //fin del it 

   it('Usuario incorrecto, Contraseña incorrecta', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('[name="email"]').type('users@correo.com') 
    cy.get('#password').type('Users2025') 
    cy.get('.bg-primary').click()    //boton Iniciar sesión
    cy.get('[data-title=""]').should('be.visible') // Verifica que el mensaje está visible en la página
    cy.get('[data-title=""]').should('contain', 'Error con el inicio de sesión') // Valida que el texto es el correcto 
   }) //fin del it

   it('Enlace Olvido de contraseña redirige a formulario', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')
    cy.get('.text-gray-600').click()
   }) //fin del it

   it('Enlace Olvido de contraseña envío de contraseña', () => {
    cy.visit('https://cotzia.vercel.app/olvide-mi-contrasena')
    cy.get('[name="email"]').type('users@correo.com') 
    cy.get('.cursor-pointer').click()
    cy.get('[data-title=""]').should('be.visible')
    cy.get('[data-title=""]').should('contain', 'Hemos')
   }) //fin del it

   it('Enlace Olvido de contraseña redirige a Inicia sesión', () => {
    cy.visit('https://cotzia.vercel.app/olvide-mi-contrasena')
    cy.get('.hover\\:text-gray-200').click()
    cy.url().should('eq', 'https://cotzia.vercel.app/inicio-de-sesion') // debe volver a este link
   }) //fin del it


}) // fin del describe