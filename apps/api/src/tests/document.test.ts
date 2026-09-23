import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";
import { RequestTypeModel } from "../models/RequestType.js";
import { DocumentModel } from "../models/Document.js";

const password = "TestPassword123!";

const registerAndLogin = async (email: string) => {
  const registerResponse = await request(app)
    .post("/api/v1/auth/register")
    .send({
      firstName: "Document",
      lastName: "Test",
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

const createRequest = async (accessToken: string) => {
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
      title: "Document security test",
      description: "This request is being used to test document security.",
      priority: "NORMAL",
    })
    .expect(201);

  return response.body.data.request._id;
};

describe("Document Management API", () => {
  it("rejects unauthenticated document upload", async () => {
    const fakeRequestId = "507f1f77bcf86cd799439011";

    await request(app)
      .post(`/api/v1/requests/${fakeRequestId}/documents`)
      .expect(401);
  });

  it("rejects a student uploading a document to another student's request", async () => {
    const owner = await registerAndLogin(
      `document-owner-${Date.now()}@studentops.test`,
    );

    const otherStudent = await registerAndLogin(
      `document-other-${Date.now()}@studentops.test`,
    );

    const requestId = await createRequest(owner.accessToken);

    const response = await request(app)
      .post(`/api/v1/requests/${requestId}/documents`)
      .set("Authorization", `Bearer ${otherStudent.accessToken}`)
      .field("category", "IDENTITY")
      .attach("file", Buffer.from("%PDF-1.4 fake pdf"), "test.pdf")
      .expect(404);

    expect(response.body.status).toBe("error");
  });

  it("rejects an invalid file type", async () => {
    const student = await registerAndLogin(
      `document-type-${Date.now()}@studentops.test`,
    );

    const requestId = await createRequest(student.accessToken);

    const response = await request(app)
      .post(`/api/v1/requests/${requestId}/documents`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .field("category", "IDENTITY")
      .attach("file", Buffer.from("this is not a real image"), {
        filename: "malicious.exe",
        contentType: "application/octet-stream",
      })
      .expect(400);

    expect(response.body.status).toBe("error");
  });

  it("returns an empty document list for a request with no documents", async () => {
    const student = await registerAndLogin(
      `document-list-${Date.now()}@studentops.test`,
    );

    const requestId = await createRequest(student.accessToken);

    const response = await request(app)
      .get(`/api/v1/requests/${requestId}/documents`)
      .set("Authorization", `Bearer ${student.accessToken}`)
      .expect(200);

    expect(response.body.status).toBe("success");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("prevents unauthenticated document download", async () => {
    const fakeDocumentId = "507f1f77bcf86cd799439011";

    await request(app)
      .get(`/api/v1/documents/${fakeDocumentId}/download`)
      .expect(401);
  });

  it("does not expose a document belonging to another student's request", async () => {
    const owner = await registerAndLogin(
      `document-download-owner-${Date.now()}@studentops.test`,
    );

    const otherStudent = await registerAndLogin(
      `document-download-other-${Date.now()}@studentops.test`,
    );

    const requestId = await createRequest(owner.accessToken);

    const document = await DocumentModel.create({
      request: requestId,
      uploadedBy: owner.user.id,
      originalName: "private.pdf",
      storageKey: `test/nonexistent-private-${Date.now()}.pdf`,
      mimeType: "application/pdf",
      size: 100,
      category: "IDENTITY",
    });

    const response = await request(app)
      .get(`/api/v1/documents/${document._id}/download`)
      .set("Authorization", `Bearer ${otherStudent.accessToken}`)
      .expect(404);

    expect(response.body.status).toBe("error");
  });
});
