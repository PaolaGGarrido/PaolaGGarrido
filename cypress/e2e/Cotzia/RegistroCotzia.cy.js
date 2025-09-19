describe('Registro', () => {
  it('Credenciales válidas', () => {
    cy.visit('https://cotzia.vercel.app/inicio-de-sesion')  //ingresa a la página de login
    cy.get('.bg-gray-900.text-white').click()  // clic en Crear una cuenta
    cy.get('#_r_0_-form-item').type('PruebaQA')  //Ingresa nombre
    cy.get('#_r_1_-form-item').type('FooTalent') //Ingresa apellido
    cy.get('#_r_2_-form-item').type('Empleado')  //Ingresa rol
    cy.get('#_r_3_-form-item').type('pepito@correo.com') //ingresa correo electrónico  CADA VEZ QUE SE EJECUTE, CAMBIAR CORREO A NUEVO
    cy.get('#password').type('Pepito666')  //ingresa contraseña
    cy.get('#passwordConfirmation').type('Pepito666')  //confirma contraseña
    cy.get('#_r_6_-form-item').click()  // check para aceptar terminos y condiciones
    cy.get('.bg-primary').click() // Click crear cuenta
    cy.get('[data-title=""]').should('be.visible')
    //cy.get('.space-y-1 > .flex > .font-normal').should('be.visible')
  }) //fin del it Credenciales válidas

  //TC crear cuenta con correo ya registrado
  //TC password  y confirmación no son iguales
  //dejar campos en blanco
  //TC ingresar otro rol distinto a empleado y administrador
  //


  })  