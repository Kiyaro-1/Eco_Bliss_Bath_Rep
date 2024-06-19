describe("Login Page Tests", () => {
  it("should verify username input exists", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get('input[data-cy="login-input-username"]').should("exist");
  });

  it("should verify password input exists", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get('input[data-cy="login-input-password"]').should("exist");
  });
});

describe("Products Page Tests", () => {
  it("should verify add to cart button existence when connected", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      if (response.status === 200) {
        const token = response.body.token;
        cy.window().then((win) => {
          win.localStorage.setItem("authToken", token);
        });

        cy.visit("http://localhost:8080/#/products/4");

        cy.get('button[data-cy="detail-product-add"]').should("exist");
      }
    });
  });

  it("should verify add to cart button doesn't exist when not connected", () => {
    cy.visit("http://localhost:8080/#/products/4");

    cy.get('button[data-cy="detail-product-add"]').should("not.exist");
  });

  it("should verify product stock status is available on site", () => {
    cy.visit("http://localhost:8080/#/products/4");

    cy.get('p[data-cy="detail-product-stock"]').should("exist");
  });
});
