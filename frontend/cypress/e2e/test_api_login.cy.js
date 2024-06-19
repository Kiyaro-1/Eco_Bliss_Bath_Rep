describe("Login API Test", () => {
  it("should return 200 with a token", () => {
    const email = "test2@test.fr";
    const password = "testtest";

    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: email,
        password: password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.have.property("token");
    });
  });

  it("should return 401 Invalid credentials", () => {
    const email = "test3@test.fr";
    const password = "testtest2";

    cy.request({
      method: "POST",
      url: "http://localhost:8081/login",
      body: {
        username: email,
        password: password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.not.eq(200);
    });
  });
});
