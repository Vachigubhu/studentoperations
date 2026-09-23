import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

type AuthResult = {
  accessToken: string;
  userId: string;
};

const registerAndLogin = async (
  roleEmail: string,
  password = "TestPassword123!",
): Promise<AuthResult> => {
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      firstName: "RBAC",
      lastName: "Test",
      email: roleEmail,
      password,
    })
    .expect(201);

  const userId = registerResponse.body.data.user.id;

  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: roleEmail,
      password,
    })
    .expect(200);

  return {
    accessToken: loginResponse.body.data.accessToken,
    userId,
  };
};

describe("RBAC", () => {
  it("rejects unauthenticated access to admin users", async () => {
    const response = await request(app).get("/api/v1/users").expect(401);

    expect(response.body.status).toBe("error");
  });

  it("rejects a student from admin endpoints", async () => {
    const email = `student-rbac-${Date.now()}@studentops.test`;

    const { accessToken } = await registerAndLogin(email);

    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(response.body.status).toBe("error");
  });
});
