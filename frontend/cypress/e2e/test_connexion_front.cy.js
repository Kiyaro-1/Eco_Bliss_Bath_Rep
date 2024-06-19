describe("Login Test", () => {
  it("should log in and verify the cart button is visible", () => {
    cy.visit("http://localhost:8080/");

    cy.get('a[data-cy="nav-link-login"]').click();

    cy.get('input[data-cy="login-input-username"]').type("test2@test.fr");

    cy.get('input[data-cy="login-input-password"]').type("testtest");

    cy.get('button[data-cy="login-submit"]').click();

    cy.get('a[data-cy="nav-link-cart"]').should("be.visible");
  });
});
