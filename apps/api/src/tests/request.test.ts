import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { DepartmentModel } from "../models/Department.js";
import { RequestTypeModel } from "../models/RequestType.js";

const password = "TestPassword123!";

const registerAndLogin = async (
  email: string,
  firstName = "Test",
  lastName = "Student",
) => {
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      firstName,
      lastName,
      email,
      password,
    })
    .expect(201);

  const user = registerResponse.body.data.user;

  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email,
      password,
    })
    .expect(200);

  return {
    user,
    accessToken: loginResponse.body.data.accessToken,
  };
};

describe("Request Management API", () => {
  it("allows a student to create and submit a request", async () => {
    const email = `request-student-${Date.now()}@studentops.test`;

    const { accessToken } = await registerAndLogin(email);

    const department = await DepartmentModel.findOne({
      code: "REG",
    });

    expect(department).toBeTruthy();

    const requestType = await RequestTypeModel.findOne({
      code: "BONAFIDE",
      isActive: true,
    });

    expect(requestType).toBeTruthy();

    const createResponse = await request(app)
      .post("/api/v1/requests")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        requestTypeId: requestType!._id.toString(),
        title: "Request for bonafide certificate",
        description:
          "I need a bonafide certificate for official university purposes.",
        priority: "NORMAL",
      })
      .expect(201);

    expect(createResponse.body.status).toBe("success");

    const createdRequest = createResponse.body.data.request;

    expect(createdRequest.status).toBe("DRAFT");
    expect(createdRequest.title).toBe("Request for bonafide certificate");

    const submitResponse = await request(app)
      .post(`/api/v1/requests/${createdRequest._id}/submit`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(submitResponse.body.status).toBe("success");
    expect(submitResponse.body.data.request.status).toBe("SUBMITTED");
  });

  it("prevents a student from accessing another student's request", async () => {
    const studentOneEmail = `request-owner-${Date.now()}@studentops.test`;
    const studentTwoEmail = `request-other-${Date.now()}@studentops.test`;

    const studentOne = await registerAndLogin(studentOneEmail);
    const studentTwo = await registerAndLogin(studentTwoEmail);

    const requestType = await RequestTypeModel.findOne({
      code: "BONAFIDE",
      isActive: true,
    });

    expect(requestType).toBeTruthy();

    const createResponse = await request(app)
      .post("/api/v1/requests")
      .set("Authorization", `Bearer ${studentOne.accessToken}`)
      .send({
        requestTypeId: requestType!._id.toString(),
        title: "Private student request",
        description: "This request belongs only to the first student account.",
        priority: "HIGH",
      })
      .expect(201);

    const requestId = createResponse.body.data.request._id;

    await request(app)
      .get(`/api/v1/requests/${requestId}`)
      .set("Authorization", `Bearer ${studentTwo.accessToken}`)
      .expect(404);
  });

  it("prevents a student from accessing department requests", async () => {
    const email = `department-access-${Date.now()}@studentops.test`;

    const { accessToken } = await registerAndLogin(email);

    await request(app)
      .get("/api/v1/requests/department")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(403);
  });

  it("rejects invalid request creation data", async () => {
    const email = `invalid-request-${Date.now()}@studentops.test`;

    const { accessToken } = await registerAndLogin(email);

    await request(app)
      .post("/api/v1/requests")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Bad",
        description: "Too short",
        priority: "INVALID",
      })
      .expect(400);
  });
});
