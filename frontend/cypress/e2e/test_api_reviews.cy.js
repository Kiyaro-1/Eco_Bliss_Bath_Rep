describe("Reviews API Test", () => {
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

  it("Retrieves reviews posted on the website", () => {
    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "GET",
        url: "http://localhost:8081/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an("array");
      });
    });
  });

  it("Posts a new review", () => {
    const reviewData = {
      title: "My Review Title",
      comment: "This is my review comment.",
      rating: 5,
    };

    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: reviewData,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it("Attempts XSS attack", () => {
    const reviewData = {
      title: `test XSS`,
      comment: `test XSS <script>alert("XSS")</script>`,
      rating: 5,
    };

    cy.window().then((win) => {
      const token = win.localStorage.getItem("authToken");

      cy.request({
        method: "POST",
        url: "http://localhost:8081/reviews",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: reviewData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.not.eq(200);
      });
    });
  });
});
