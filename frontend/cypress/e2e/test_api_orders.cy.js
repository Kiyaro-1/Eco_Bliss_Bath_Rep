describe("Accès aux données confidentielles sans être connecté", () => {
  it("Devrait renvoyer une erreur 401", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.not.eq(200);
    });
  });
});

describe("Cart Products API Test", () => {
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");

      const token = response.body.token;
      cy.window().then((win) => {
        win.localStorage.setItem("authToken", token);
      });
    });
  });

  it("Retrieves list of products in the cart", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it("Creates a new order", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      const orderData = {
        firstname: "John",
        lastname: "Doe",
        address: "123 Main St",
        zipCode: "12345",
        city: "Paris",
      };

      cy.request({
        method: "POST",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: orderData,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it("Adds a product to an order", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/products",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array").that.is.not.empty;

        const products = response.body;
        const productId = products[0].id;

        cy.request({
          method: "PUT",
          url: "http://localhost:8081/orders/add",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            product: productId,
            quantity: 1,
          },
        }).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  it("Fails to add a product to an order if it's out of stock", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/products",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array").that.is.not.empty;

        const products = response.body;
        const outOfStockProduct = products.find(
          (product) => product.availableStock <= 0
        );

        if (outOfStockProduct) {
          const productId = outOfStockProduct.id;

          cy.request({
            method: "PUT",
            url: "http://localhost:8081/orders/add",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: {
              product: productId,
              quantity: 1,
            },
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.not.eq(200);
          });
        }
      });
    });
  });

  it("Modifies the quantity of a product in the cart", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("orderLines");

        const orderLines = response.body.orderLines;

        expect(orderLines).to.not.be.empty;

        const orderLineId = orderLines[0].id;

        cy.request({
          method: "PUT",
          url: `http://localhost:8081/orders/${orderLineId}/change-quantity`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            quantity: 1, //
          },
        }).then((putResponse) => {
          expect(putResponse.status).to.eq(200);
        });
      });
    });
  });

  it("Deletes a product from the cart", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/orders",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("orderLines");

        const orderLines = response.body.orderLines;

        expect(orderLines).to.not.be.empty;

        const orderLineId = orderLines[0].id;

        cy.request({
          method: "DELETE",
          url: `http://localhost:8081/orders/${orderLineId}/delete`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      });
    });
  });
});
