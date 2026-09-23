import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { DepartmentModel } from "../models/Department.js";
import { RequestTypeModel } from "../models/RequestType.js";
import { UserModel } from "../models/User.js";
import { ApprovalModel } from "../models/Approval.js";

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

const createSubmittedRequest = async (studentToken: string) => {
  const requestType = await RequestTypeModel.findOne({
    code: "BONAFIDE",
    isActive: true,
  });

  expect(requestType).toBeTruthy();

  const createResponse = await request(app)
    .post("/api/v1/requests")
    .set("Authorization", `Bearer ${studentToken}`)
    .send({
      requestTypeId: requestType!._id.toString(),
      title: "Approval workflow test",
      description: "This request is being used to test the approval workflow.",
      priority: "NORMAL",
    })
    .expect(201);

  const requestId = createResponse.body.data.request._id;

  await request(app)
    .post(`/api/v1/requests/${requestId}/submit`)
    .set("Authorization", `Bearer ${studentToken}`)
    .expect(200);

  return requestId;
};

describe("Approval Workflow API", () => {
  it("allows an authorized staff member to create a correction decision", async () => {
    const department = await DepartmentModel.findOne({
      code: "REG",
    });

    expect(department).toBeTruthy();

    const student = await registerAndLogin(
      `approval-student-${Date.now()}@studentops.test`,
      "Approval",
      "Student",
    );

    const staff = await registerAndLogin(
      `approval-staff-${Date.now()}@studentops.test`,
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

    const requestId = await createSubmittedRequest(student.accessToken);

    // Move request into review first.
    await request(app)
      .patch(`/api/v1/requests/${requestId}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "UNDER_REVIEW",
      })
      .expect(200);

    const response = await request(app)
      .post(`/api/v1/requests/${requestId}/approvals`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        decision: "CORRECTION_REQUIRED",
        comment: "Please provide the required supporting document.",
      })
      .expect(201);

    expect(response.body.status).toBe("success");

    const approval = await ApprovalModel.findOne({
      request: requestId,
    });

    expect(approval).toBeTruthy();
    expect(approval!.decision).toBe("CORRECTION_REQUIRED");
    expect(approval!.approver.toString()).toBe(staff.user.id);

    const requestResponse = await request(app)
      .get(`/api/v1/requests/${requestId}`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    expect(requestResponse.body.data.request.status).toBe(
      "CORRECTION_REQUIRED",
    );
  });

  it("rejects an approval from a different department", async () => {
    const requestDepartment = await DepartmentModel.findOne({
      code: "REG",
    });

    const wrongDepartment = await DepartmentModel.findOne({
      code: "FIN",
    });

    expect(requestDepartment).toBeTruthy();
    expect(wrongDepartment).toBeTruthy();

    const student = await registerAndLogin(
      `approval-isolation-student-${Date.now()}@studentops.test`,
      "Approval",
      "Student",
    );

    const staff = await registerAndLogin(
      `approval-isolation-staff-${Date.now()}@studentops.test`,
      "Approval",
      "Staff",
    );

    // Temporarily assign the staff member to the request's department
    // so they can move the request into UNDER_REVIEW.
    await UserModel.findByIdAndUpdate(staff.user.id, {
      role: "STAFF",
      department: requestDepartment!._id,
    });

    const staffLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: staff.user.email,
        password,
      })
      .expect(200);

    const staffToken = staffLogin.body.data.accessToken;

    const requestId = await createSubmittedRequest(student.accessToken);

    // A staff member from the request's department moves the request
    // into UNDER_REVIEW.
    await request(app)
      .patch(`/api/v1/requests/${requestId}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        status: "UNDER_REVIEW",
      })
      .expect(200);

    // Now change the same staff member to a different department.
    await UserModel.findByIdAndUpdate(staff.user.id, {
      department: wrongDepartment!._id,
    });

    // The request belongs to REG, but the staff member now belongs to FIN.
    // The approval must therefore be rejected.
    const response = await request(app)
      .post(`/api/v1/requests/${requestId}/approvals`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({
        decision: "APPROVED",
      })
      .expect(403);

    expect(response.body.status).toBe("error");

    const approval = await ApprovalModel.findOne({
      request: requestId,
    });

    expect(approval).toBeNull();
  });

  it("rejects an invalid approval decision", async () => {
    const student = await registerAndLogin(
      `approval-validation-${Date.now()}@studentops.test`,
      "Approval",
      "Student",
    );

    const requestId = await createSubmittedRequest(student.accessToken);

    const response = await request(app)
      .post(`/api/v1/requests/${requestId}/approvals`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .send({
        decision: "INVALID_DECISION",
      })
      .expect(403);

    expect(response.body.status).toBe("error");
  });
});
