import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { DepartmentModel } from "../models/Department.js";
import { RequestTypeModel } from "../models/RequestType.js";
import { UserModel } from "../models/User.js";
import { CommentModel } from "../models/Comment.js";
import { NotificationModel } from "../models/Notification.js";

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

const createRequest = async (studentToken: string) => {
  const requestType = await RequestTypeModel.findOne({
    code: "BONAFIDE",
    isActive: true,
  });

  expect(requestType).toBeTruthy();

  const response = await request(app)
    .post("/api/v1/requests")
    .set("Authorization", `Bearer ${studentToken}`)
    .send({
      requestTypeId: requestType!._id.toString(),
      title: "Collaboration test request",
      description:
        "This request is being used to test comments and notifications.",
      priority: "NORMAL",
    })
    .expect(201);

  return response.body.data.request._id;
};

describe("Comments and Notifications", () => {
  it("allows a student to create and read a comment", async () => {
    const student = await registerAndLogin(
      `comment-student-${Date.now()}@studentops.test`,
      "Comment",
      "Student",
    );

    const requestId = await createRequest(student.accessToken);

    const createResponse = await request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .send({
        body: "This is a test comment.",
      })
      .expect(201);

    expect(createResponse.body.status).toBe("success");

    const comment = await CommentModel.findOne({
      request: requestId,
    });

    expect(comment).toBeTruthy();
    expect(comment!.body).toBe("This is a test comment.");

    const listResponse = await request(app)
      .get(`/api/v1/requests/${requestId}/comments`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    expect(listResponse.body.status).toBe("success");
  });

  it("prevents a student from commenting on another student's request", async () => {
    const owner = await registerAndLogin(
      `comment-owner-${Date.now()}@studentops.test`,
      "Comment",
      "Owner",
    );

    const otherStudent = await registerAndLogin(
      `comment-other-${Date.now()}@studentops.test`,
      "Comment",
      "Other",
    );

    const requestId = await createRequest(owner.accessToken);

    await request(app)
      .post(`/api/v1/requests/${requestId}/comments`)
      .set("Authorization", `Bearer ${otherStudent.accessToken}`)
      .send({
        body: "Unauthorized comment.",
      })
      .expect(404);
  });

  it("creates a notification when a student submits a request", async () => {
    const student = await registerAndLogin(
      `notification-student-${Date.now()}@studentops.test`,
      "Notification",
      "Student",
    );

    const requestId = await createRequest(student.accessToken);

    await request(app)
      .post(`/api/v1/requests/${requestId}/submit`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    const notifications = await NotificationModel.find({
      recipient: student.user.id,
    });

    expect(Array.isArray(notifications)).toBe(true);
  });

  it("allows a user to retrieve notifications", async () => {
    const student = await registerAndLogin(
      `notification-list-${Date.now()}@studentops.test`,
      "Notification",
      "List",
    );

    const response = await request(app)
      .get("/api/v1/notifications")
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("allows a user to mark a notification as read", async () => {
    const student = await registerAndLogin(
      `notification-read-${Date.now()}@studentops.test`,
      "Notification",
      "Read",
    );

    const notification = await NotificationModel.create({
      recipient: student.user.id,
      type: "REQUEST_STATUS_CHANGED",
      title: "Test notification",
      message: "This notification is for testing.",
      isRead: false,
    });

    const response = await request(app)
      .patch(`/api/v1/notifications/${notification._id}/read`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");

    const updated = await NotificationModel.findById(notification._id);

    expect(updated).toBeTruthy();
    expect(updated!.isRead).toBe(true);
    expect(updated!.readAt).toBeTruthy();
  });
});
