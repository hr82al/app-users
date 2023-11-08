const request = require("supertest");
const app = require("../src/app");


const USERS_URL = "/api/v1/users";


test("Get users", async () => {
  const response = await request(app).get(USERS_URL);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.statusCode).toBe(200);
});

async function createUser(user) {
  return await request(app)
    .post(USERS_URL)
    .send({ name: user })
    .set("Accept", "application/json");
}

test("Create users", async () => {
  console.log("Creating users: John, Tomas, Jim");
  const USERS = ["John", "Tomas", "Jim"]
  USERS.forEach(async (user) => {
    const response = await createUser(user);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(user);
  });
});

test("Change user", async () => {
  const newUserResponse = await request(app)
    .post(USERS_URL)
    .send({ name: "John"})
    .set("Accept", "application/json")
  const id = newUserResponse.body.id;
  const response = await request(app)
    .put(USERS_URL)
    .send({ id: id, name: "Joe" })
    .set("Content-Type", "application/json");
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual("Joe");
});
