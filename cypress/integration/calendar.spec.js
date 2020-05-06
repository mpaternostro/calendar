// eslint-disable-next-line spaced-comment
/// <reference types="Cypress" />

const URL = 'http://localhost:1234';

before(() => {
  cy.visit(URL);
});

describe('Calendar', () => {
  it('Carga la página y sus eventos', () => {
    cy.get('.event').should('have.length', 2);
  });

  it('Abre correctamente un evento al clickearlo', () => {
    cy.get('.event')
      .eq(0)
      .click();
    cy.get('.modal-outer')
      .should('be.visible');
    cy.get('.event-window')
      .should('be.visible');
  });

  it('Manipula el evento correctamente', () => {
    const tituloLargo = 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.';
    const descripcionLarga = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique.';
    cy.get('#summary')
      .clear()
      .type(tituloLargo);
    cy.get('#description')
      .clear()
      .type(descripcionLarga);

    cy.get('#save-button')
      .click();
    cy.get('.event')
      .eq(0)
      .click();

    cy.get('#summary')
      .should('have.value', tituloLargo);
    cy.get('#description')
      .should('have.value', descripcionLarga);
  });

  it('Cierra la vista del evento de diferentes formas', () => {
    cy.get('.modal-outer input')
      .eq(0)
      .type('{esc}');
    cy.get('.modal-outer')
      .should('not.be.visible');

    cy.get('.event')
      .eq(0)
      .click();
    cy.get('.modal-outer')
      .click('top');

    cy.get('.event')
      .eq(0)
      .click();
    cy.get('#close-button')
      .click();
  });

  it('Crea un nuevo evento clickeando en la grilla', () => {
    cy.get('.week-data')
      .click('top');
    cy.get('.modal-outer')
      .should('be.visible');
    cy.get('.event-window')
      .should('be.visible');

    cy.get('[data-event-id="3"]')
      .should('have.class', 'open');
    cy.get('#attendees li')
      .should('have.length', 1);

    cy.get('#new-participants select')
      .select('Test3 Test');
    cy.get('#attendees li')
      .should('have.length', 2);

    cy.get('#new-participants select')
      .select('Test2 Test');
    cy.get('#attendees li')
      .should('have.length', 3);

    cy.get('#attendees li')
      .eq(2)
      .children()
      .eq(0)
      .should('contain', 'Test2 Test');

    cy.get('.attendance')
      .eq(0)
      .select('Going');

    cy.get('#save-button')
      .click();

    cy.get('[data-event-id="3"]')
      .should('have.length', 1);
  });

  it('Chequea que los cambios hayan sido guardados correctamente', () => {
    cy.get('[data-event-id="3"]')
      .click();
    cy.get('#attendees li')
      .should('have.length', 3);
    cy.get('.attendance')
      .eq(0)
      .should('have.value', 'Going');

    cy.get('#close-button')
      .click();
  });

  it('Borra el ultimo evento', () => {
    cy.get('[data-event-id="3"]')
      .click();
    cy.get('#delete-button')
      .click();

    cy.get('.modal-outer')
      .should('not.be.visible');
    cy.get('[data-event-id="3"]')
      .should('not.exist');
  });

  it('Cambia fechas del calendario', () => {
    cy.get('#next-button')
      .click();
    cy.get('.gridY')
      .eq(2)
      .should('have.data', 'day', '05');

    cy.get('#previous-button')
      .click();
    cy.get('#previous-button')
      .click();
    cy.get('.gridY')
      .eq(2)
      .should('have.data', 'day', 21);

    let hoy = new Date().getDate();
    if (hoy < 10) hoy = hoy.toString().replace(hoy, `0${hoy}`);
    cy.get('#today-button')
      .click();
    cy.get('.gridY')
      .eq(0)
      .should('have.data', 'day', hoy);
  });

  it('Ve la lista de usuarios', () => {
    cy.get('#manage-user button')
      .click();
    cy.get('#manage-user-modal')
      .should('have.class', 'open');

    cy.get('#close-user-list')
      .click();
    cy.get('#manage-user-modal')
      .should('not.have.class', 'open');
  });
});
