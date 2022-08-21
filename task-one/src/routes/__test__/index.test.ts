import app from "../../app";
import request from "supertest";

describe("Post requests", () => {
  it("returns status code 400 for already existing user", async () => {
    const res = await request(app).post("/users/register").send({
      firstName: "John",
      lastName: "Bobo",
      email: "jadeyemo002@gmail.com",
      phone: "081234567889",
      dob: "2022-07-01",
      password: "jeda123456",
      confirmPassword: "jeda123456",
    });

    expect(res.status).toEqual(400);
  });

  test("should register a user", async () => {
    const register = await request(app).post("/users/register").send({
      firstName: "John",
      lastName: "Bobo",
      email: "user@example.com",
      password: "abcdef123",
      confirmPassword: "abcdef123",
      phone: "081234567889",
      dob: "2022-07-01",
    });
    expect(register.status).toEqual(302);
  });

  test("should login a user", async () => {
    const login = await request(app).post("/users/login").send({
      email: "user@example.com",
      password: "abcdef123",
    });

    expect(login.status).toEqual(302);
  });
});

describe("Get requests", () => {
  test("should get status 404 for bad route", async () => {
    const routePage = await request(app).get("/market/home");
    expect(routePage.status).toEqual(404);
  });

  test("should return 401 if user is not logged in", async () => {
    const logout = await request(app).get("/users/logout");
    expect(logout.status).toEqual(401);
  });

  test("should not make transactions when user is not logged in", async () => {
    const getUserAccount = await request(app).get("/users/make/transfer");
    expect(getUserAccount.status).toEqual(401);
  });

  test("should not get user credit and debit history", async () => {
    const accountInfo = await request(app).get("/users/mytransactions/1/5");
    expect(accountInfo.status).toEqual(401);
  });

  test("Should not verify transaction without token", async () => {
    const accountInfo = await request(app).get("/users/make-transfer/verify");
    expect(accountInfo.status).toEqual(404);
  });
});
