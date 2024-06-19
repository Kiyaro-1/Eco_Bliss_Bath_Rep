describe("Current User Info API Test", () => {
  before(() => {
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

  it("Retrieves information of the current connected user", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/me",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});

describe("User Registration API Test", () => {
  it("Registers a new user / Should come back as an error", () => {
    const email = `test-${Math.random().toString(36).substring(7)}@example.com`;

    const userData = {
      email: email,
      firstname: "John",
      lastname: "Doe",
      plainPassword: "password123",
    };

    cy.request({
      method: "POST",
      url: "http://localhost:8081/register",
      body: userData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.not.eq(200); // because wrong body format
    });
  });
});

describe("User Registration API Test / With correct body format", () => {
  it("Registers a new user", () => {
    const email = `test-${Math.random().toString(36).substring(7)}@example.com`;

    const userData = {
      email: email,
      firstname: "John",
      lastname: "Doe",
      plainPassword: {
        first: "password123",
        second: "password123",
      },
    };

    cy.request({
      method: "POST",
      url: "http://localhost:8081/register",
      body: userData,
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
