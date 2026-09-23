import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { DepartmentModel } from "../models/Department.js";
import { RequestTypeModel } from "../models/RequestType.js";
import { UserModel } from "../models/User.js";

const password = "TestPassword123!";

const registerAndLogin = async (
  email: string,
  firstName: string,
  lastName: string,
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

  const loginResponse = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email,
      password,
    })
    .expect(200);

  return {
    user: registerResponse.body.data.user,
    accessToken: loginResponse.body.data.accessToken,
  };
};

const createStudentRequest = async (accessToken: string) => {
  const requestType = await RequestTypeModel.findOne({
    code: "BONAFIDE",
    isActive: true,
  });

  expect(requestType).toBeTruthy();

  const response = await request(app)
    .post("/api/v1/requests")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      requestTypeId: requestType!._id.toString(),
      title: "Workflow test request",
      description: "This request is being used to test the request workflow.",
      priority: "NORMAL",
    })
    .expect(201);

  return response.body.data.request;
};

describe("Request workflow and department authorization", () => {
  it("allows staff to move a department request into review", async () => {
    const department = await DepartmentModel.findOne({
      code: "REG",
    });

    expect(department).toBeTruthy();

    const studentEmail = `workflow-student-${Date.now()}@studentops.test`;

    const student = await registerAndLogin(studentEmail, "Workflow", "Student");

    const staffEmail = `workflow-staff-${Date.now()}@studentops.test`;

    const staff = await registerAndLogin(staffEmail, "Workflow", "Staff");

    await UserModel.findByIdAndUpdate(staff.user.id, {
      role: "STAFF",
      department: department!._id,
    });

    // Re-login so the JWT contains the staff role and department.
    const staffLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: staffEmail,
        password,
      })
      .expect(200);

    const staffToken = staffLogin.body.data.accessToken;

    const createdRequest = await createStudentRequest(student.accessToken);

    await request(app)
      .post(`/api/v1/requests/${createdRequest._id}/submit`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    const response = await request(app)
      .patch(`/api/v1/requests/${createdRequest._id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "UNDER_REVIEW",
      })
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(response.body.data.status).toBe("UNDER_REVIEW");
  });

  it("prevents staff from another department from accessing the request", async () => {
    const requestType = await RequestTypeModel.findOne({
      code: "BONAFIDE",
      isActive: true,
    });

    expect(requestType).toBeTruthy();

    const correctDepartment = await DepartmentModel.findOne({
      code: "REG",
    });

    const wrongDepartment = await DepartmentModel.findOne({
      code: "FIN",
    });

    expect(correctDepartment).toBeTruthy();
    expect(wrongDepartment).toBeTruthy();

    const student = await registerAndLogin(
      `isolation-student-${Date.now()}@studentops.test`,
      "Isolation",
      "Student",
    );

    const staff = await registerAndLogin(
      `isolation-staff-${Date.now()}@studentops.test`,
      "Isolation",
      "Staff",
    );

    await UserModel.findByIdAndUpdate(staff.user.id, {
      role: "STAFF",
      department: wrongDepartment!._id,
    });

    const staffLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: staff.user.email,
        password,
      })
      .expect(200);

    const staffToken = staffLogin.body.data.accessToken;

    const createdRequest = await createStudentRequest(student.accessToken);

    const response = await request(app)
      .get(`/api/v1/requests/department/${createdRequest._id}`)
      .set("Authorization", `Bearer ${staffToken}`)
      .expect(404);

    expect(response.body.status).toBe("error");
  });

  it("prevents staff from approving a request", async () => {
    const department = await DepartmentModel.findOne({
      code: "REG",
    });

    expect(department).toBeTruthy();

    const student = await registerAndLogin(
      `staff-approval-student-${Date.now()}@studentops.test`,
      "Approval",
      "Student",
    );

    const staff = await registerAndLogin(
      `staff-approval-${Date.now()}@studentops.test`,
      "Approval",
      "Staff",
    );

    await UserModel.findByIdAndUpdate(staff.user.id, {
      role: "STAFF",
      department: department!._id,
    });

    const staffLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: staff.user.email,
        password,
      })
      .expect(200);

    const staffToken = staffLogin.body.data.accessToken;

    const createdRequest = await createStudentRequest(student.accessToken);

    await request(app)
      .post(`/api/v1/requests/${createdRequest._id}/submit`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    await request(app)
      .patch(`/api/v1/requests/${createdRequest._id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "UNDER_REVIEW",
      })
      .expect(200);

    const response = await request(app)
      .patch(`/api/v1/requests/${createdRequest._id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "APPROVED",
      })
      .expect(403);

    expect(response.body.status).toBe("error");
  });

  it("rejects an invalid request status transition", async () => {
    const department = await DepartmentModel.findOne({
      code: "REG",
    });

    expect(department).toBeTruthy();

    const student = await registerAndLogin(
      `transition-student-${Date.now()}@studentops.test`,
      "Transition",
      "Student",
    );

    const staff = await registerAndLogin(
      `transition-staff-${Date.now()}@studentops.test`,
      "Transition",
      "Staff",
    );

    await UserModel.findByIdAndUpdate(staff.user.id, {
      role: "STAFF",
      department: department!._id,
    });

    const staffLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: staff.user.email,
        password,
      })
      .expect(200);

    const staffToken = staffLogin.body.data.accessToken;

    const createdRequest = await createStudentRequest(student.accessToken);

    // A DRAFT request cannot jump directly to APPROVED.
    const response = await request(app)
      .patch(`/api/v1/requests/${createdRequest._id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "APPROVED",
      })
      .expect(400);

    expect(response.body.status).toBe("error");
  });
});
