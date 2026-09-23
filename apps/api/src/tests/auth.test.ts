import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("Authenticate API", () => {
  const email = `test-${Date.now()}@studentops.test.com`;
  const password = "TestPassword123!";

  it("registers a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        firstName: "Test",
        lastName: "Student",
        email,
        password,
      })
      .expect(201);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe(email);
    expect(response.body.data.user.role).toBe("STUDENT");
  });

  it("logs in the registered user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password,
      })
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.user.email).toBe(email);

    expect(response.body.data.accessToken).toBeDefined();
  });

  it("rejects an incorrect password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password: "WrongPassword123!",
      })
      .expect(401);

    expect(response.body.status).toBe("error");
  });

  it("rejects unauthenticated access to /users/me", async () => {
    const response = await request(app).get("/api/v1/users/me").expect(401);

    expect(response.body.status).toBe("error");
  });
});
