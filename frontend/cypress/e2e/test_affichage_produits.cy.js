describe("Product Page Test", () => {
  const verifyProductElements = ($el) => {
    cy.wrap($el).children('[data-cy="product-home-img"]').should("be.visible");
    cy.wrap($el).children('[data-cy="product-home-name"]').should("be.visible");
    cy.wrap($el)
      .children('[data-cy="product-home-ingredients"]')
      .should("be.visible");
    cy.wrap($el)
      .children(".add-to-cart")
      .children('[data-cy="product-home-link"]')
      .should("be.visible");
  };

  it("Verify products are displayed correctly", () => {
    cy.visit("http://localhost:8080/");

    cy.get('article[data-cy="product-home"]').each(($el, index) => {
      verifyProductElements($el);

      cy.wrap($el)
        .children(".add-to-cart")
        .children('[data-cy="product-home-link"]')
        .click();

      cy.get('[data-cy="detail-product-img"]').should("be.visible", {
        timeout: 10000,
      });
      cy.get('[data-cy="detail-product-description"]').should("be.visible", {
        timeout: 10000,
      });
      cy.get('[data-cy="detail-product-price"]').should("be.visible", {
        timeout: 10000,
      });
      cy.get('[data-cy="detail-product-stock"]').should("be.visible", {
        timeout: 10000,
      });

      cy.go("back");

      cy.get('article[data-cy="product-home"]').should("exist").wait(4000);

      if (index === 2) {
        cy.get("#other-products").should("exist").wait(4000);
      }
    });
  });
});
