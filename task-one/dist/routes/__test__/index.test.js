"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../../app"));
const supertest_1 = __importDefault(require("supertest"));
describe("Post requests", () => {
    it("returns status code 400 for already existing user", async () => {
        const res = await (0, supertest_1.default)(app_1.default).post("/users/register").send({
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
        const register = await (0, supertest_1.default)(app_1.default).post("/users/register").send({
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
        const login = await (0, supertest_1.default)(app_1.default).post("/users/login").send({
            email: "user@example.com",
            password: "abcdef123",
        });
        expect(login.status).toEqual(302);
    });
});
describe("Get requests", () => {
    test("should get status 404 for bad route", async () => {
        const routePage = await (0, supertest_1.default)(app_1.default).get("/market/home");
        expect(routePage.status).toEqual(404);
    });
    test("should return 401 if user is not logged in", async () => {
        const logout = await (0, supertest_1.default)(app_1.default).get("/users/logout");
        expect(logout.status).toEqual(401);
    });
    test("should not make transactions when user is not logged in", async () => {
        const getUserAccount = await (0, supertest_1.default)(app_1.default).get("/users/make/transfer");
        expect(getUserAccount.status).toEqual(401);
    });
    test("should not get user credit and debit history", async () => {
        const accountInfo = await (0, supertest_1.default)(app_1.default).get("/users/mytransactions/1/5");
        expect(accountInfo.status).toEqual(401);
    });
    test("Should not verify transaction without token", async () => {
        const accountInfo = await (0, supertest_1.default)(app_1.default).get("/users/make-transfer/verify");
        expect(accountInfo.status).toEqual(404);
    });
});
