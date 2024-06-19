describe("Product API Test", () => {
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

  it("Retrieves the list of products", () => {
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
        expect(response.body).to.be.an("array");
      });
    });
  });

  it("Retrieves 3 random products", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/products/random",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(3);
      });
    });
  });

  it("Retrieves the details of a specific product", () => {
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
        expect(response.body).to.be.an("array");
        expect(response.body).to.not.be.empty;

        const productId = response.body[0].id;

        cy.request({
          method: "GET",
          url: `http://localhost:8081/products/${productId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((productResponse) => {
          expect(productResponse.status).to.eq(200);
          expect(productResponse.body).to.have.property("id", productId);
        });
      });
    });
  });
});
