export const openApiDocument = {
  openapi: "3.0.3",

  info: {
    title: "StudentOps API",
    version: "1.0.0",
    description:
      "REST API for the StudentOps Enterprise Student Operations Platform.",
  },

  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],

  tags: [
    {
      name: "Health",
      description: "API health endpoints",
    },
    {
      name: "Authentication",
      description: "Authentication and token management",
    },
    {
      name: "Users",
      description: "User operations",
    },
    {
      name: "Requests",
      description: "Student request management",
    },
    {
      name: "Documents",
      description: "Request document management",
    },
    {
      name: "Comments",
      description: "Request comments",
    },
    {
      name: "Approvals",
      description: "Request approval workflow",
    },
    {
      name: "Notifications",
      description: "User notifications",
    },
    {
      name: "Conversations",
      description: "Messaging and conversations",
    },
    {
      name: "Audit Logs",
      description: "Administrative audit logging",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: {
            type: "string",
            example: "Trinity",
          },
          lastName: {
            type: "string",
            example: "Chigubhu",
          },
          email: {
            type: "string",
            format: "email",
            example: "student@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "StrongPassword123!",
          },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "student@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "StrongPassword123!",
          },
        },
      },

      RefreshRequest: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
          },
        },
      },

      AuthResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "success",
          },
          data: {
            type: "object",
            properties: {
              accessToken: {
                type: "string",
              },
              refreshToken: {
                type: "string",
              },
              user: {
                $ref: "#/components/schemas/User",
              },
            },
          },
        },
      },

      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          firstName: {
            type: "string",
            example: "Trinity",
          },
          lastName: {
            type: "string",
            example: "Chigubhu",
          },
          email: {
            type: "string",
            format: "email",
            example: "student@example.com",
          },
          role: {
            type: "string",
            enum: ["STUDENT", "STAFF", "MANAGER", "ADMIN", "SUPER_ADMIN"],
            example: "STUDENT",
          },
          isActive: {
            type: "boolean",
            example: true,
          },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          message: {
            type: "string",
            example: "Invalid credentials",
          },
        },
      },

      ValidationErrorResponse: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          message: {
            type: "string",
            example: "validation failed",
          },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                message: {
                  type: "string",
                },
                code: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      RequestPriority: {
        type: "string",
        enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
        example: "NORMAL",
      },

      RequestStatus: {
        type: "string",
        enum: [
          "DRAFT",
          "SUBMITTED",
          "UNDER_REVIEW",
          "CORRECTION_REQUIRED",
          "APPROVED",
          "REJECTED",
          "COMPLETED",
        ],
        example: "SUBMITTED",
      },

      CreateRequest: {
        type: "object",
        required: ["requestTypeId", "title", "description"],
        properties: {
          requestTypeId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          title: {
            type: "string",
            minLength: 5,
            maxLength: 200,
            example: "Request for visa extension",
          },
          description: {
            type: "string",
            minLength: 10,
            maxLength: 5000,
            example: "I need assistance with extending my student visa.",
          },
          priority: {
            $ref: "#/components/schemas/RequestPriority",
            default: "NORMAL",
          },
        },
      },

      TransitionRequest: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: [
              "UNDER_REVIEW",
              "CORRECTION_REQUIRED",
              "APPROVED",
              "REJECTED",
              "COMPLETED",
            ],
            example: "UNDER_REVIEW",
          },
        },
      },

      AssignRequest: {
        type: "object",
        required: ["staffId"],
        properties: {
          staffId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
        },
      },

      Pagination: {
        type: "object",
        properties: {
          page: {
            type: "integer",
            example: 1,
          },
          limit: {
            type: "integer",
            example: 10,
          },
          total: {
            type: "integer",
            example: 25,
          },
          totalPages: {
            type: "integer",
            example: 3,
          },
        },
      },
      DocumentUpload: {
        type: "object",
        required: ["file"],
        properties: {
          file: {
            type: "string",
            format: "binary",
          },
          category: {
            type: "string",
            minLength: 2,
            maxLength: 100,
            example: "IDENTIFICATION",
          },
        },
      },

      CommentCreate: {
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "string",
            minLength: 1,
            maxLength: 2000,
            example: "Please provide the updated document.",
          },
        },
      },

      Comment: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          body: {
            type: "string",
          },
          author: {
            type: "object",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },

      ApprovalCreate: {
        type: "object",
        required: ["decision"],
        properties: {
          decision: {
            type: "string",
            enum: ["APPROVED", "REJECTED", "CORRECTION_REQUIRED"],
            example: "APPROVED",
          },
          comment: {
            type: "string",
            maxLength: 2000,
            example: "All submitted information has been verified.",
          },
        },
      },

      Notification: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          type: {
            type: "string",
          },
          title: {
            type: "string",
          },
          message: {
            type: "string",
          },
          isRead: {
            type: "boolean",
          },
          request: {
            type: "string",
            nullable: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          readAt: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
        },
      },

      ConversationCreate: {
        type: "object",
        required: ["participantId", "subject"],
        properties: {
          participantId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          requestId: {
            type: "string",
            example: "64f123456789abcdef123456",
          },
          subject: {
            type: "string",
            minLength: 1,
            maxLength: 200,
            example: "Visa extension enquiry",
          },
        },
      },

      MessageCreate: {
        type: "object",
        required: ["body"],
        properties: {
          body: {
            type: "string",
            minLength: 1,
            maxLength: 5000,
            example: "I have uploaded the requested document.",
          },
        },
      },
    },
  },

  paths: {
    "/api/v1/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Returns the current API health status.",

        responses: {
          200: {
            description: "API is healthy",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Creates a new StudentOps user account.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegisterRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },

          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },

          409: {
            description: "Email already registered",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login",
        description:
          "Authenticates a user and returns access and refresh tokens.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },

          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },

          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/auth/refresh": {
      post: {
        tags: ["Authentication"],
        summary: "Refresh access token",
        description:
          "Rotates a refresh token and returns a new access token and refresh token.",

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Tokens refreshed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AuthResponse",
                },
              },
            },
          },

          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },

          401: {
            description: "Invalid or expired refresh token",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/auth/logout": {
      post: {
        tags: ["Authentication"],
        summary: "Logout",
        description: "Revokes the current refresh session.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RefreshRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Logout successful",
          },

          401: {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/v1/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user",
        description: "Returns the authenticated user's profile.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        responses: {
          200: {
            description: "Current user returned successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    data: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },

          401: {
            description: "Authentication required",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/requests": {
      post: {
        tags: ["Requests"],
        summary: "Create a request",
        description: "Creates a new student request in DRAFT status.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateRequest",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Request created successfully",
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationErrorResponse",
                },
              },
            },
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Only students can create requests",
          },
        },
      },

      get: {
        tags: ["Requests"],
        summary: "Get student's requests",
        description:
          "Returns the authenticated student's requests with filtering and pagination.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "search",
            in: "query",
            required: false,
            schema: {
              type: "string",
            },
            description: "Search request title or description.",
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              $ref: "#/components/schemas/RequestStatus",
            },
          },
          {
            name: "priority",
            in: "query",
            required: false,
            schema: {
              $ref: "#/components/schemas/RequestPriority",
            },
          },
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
        ],

        responses: {
          200: {
            description: "Requests returned successfully",
          },
          400: {
            description: "Invalid query parameter",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Only students can access this endpoint",
          },
        },
      },
    },

    "/api/v1/requests/{id}": {
      get: {
        tags: ["Requests"],
        summary: "Get a student's request",
        description:
          "Returns a single request belonging to the authenticated student.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Request returned successfully",
          },
          400: {
            description: "Invalid request ID",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/requests/{id}/submit": {
      post: {
        tags: ["Requests"],
        summary: "Submit a request",
        description: "Submits a student's draft request for processing.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Request submitted successfully",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/requests/{id}/resubmit": {
      post: {
        tags: ["Requests"],
        summary: "Resubmit a request",
        description:
          "Resubmits a request after correction when it is in CORRECTION_REQUIRED status.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Request resubmitted successfully",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/requests/department": {
      get: {
        tags: ["Requests"],
        summary: "Get department requests",
        description:
          "Returns requests belonging to the authenticated user's department.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              $ref: "#/components/schemas/RequestStatus",
            },
          },
          {
            name: "priority",
            in: "query",
            required: false,
            schema: {
              $ref: "#/components/schemas/RequestPriority",
            },
          },
        ],

        responses: {
          200: {
            description: "Department requests returned successfully",
          },
          400: {
            description: "Invalid query parameter",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "User is not assigned to a department",
          },
        },
      },
    },

    "/api/v1/requests/department/{id}": {
      get: {
        tags: ["Requests"],
        summary: "Get a department request",
        description:
          "Returns a request accessible to the authenticated user's department.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Request returned successfully",
          },
          400: {
            description: "Invalid request ID",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "User is not assigned to a department",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/requests/{id}/assign": {
      post: {
        tags: ["Requests"],
        summary: "Assign a request",
        description: "Assigns a request to a staff member.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AssignRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Request assigned successfully",
          },
          400: {
            description: "staffId is required or request ID is invalid",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Department access denied",
          },
          404: {
            description: "Request or staff member not found",
          },
        },
      },
    },

    "/api/v1/requests/{id}/status": {
      patch: {
        tags: ["Requests"],
        summary: "Update request status",
        description: "Transitions a request to an allowed workflow status.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TransitionRequest",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Request status updated successfully",
          },
          400: {
            description: "Invalid status or invalid state transition",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Department access denied",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/requests/{id}/activity": {
      get: {
        tags: ["Requests"],
        summary: "Get request activity",
        description: "Returns activity associated with a request.",

        security: [
          {
            bearerAuth: [],
          },
        ],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],

        responses: {
          200: {
            description: "Request activity returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },
    "/api/v1/requests/{id}/documents": {
      post: {
        tags: ["Documents"],
        summary: "Upload a request document",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/DocumentUpload",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Document uploaded successfully",
          },
          400: {
            description: "Invalid document or validation error",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },

      get: {
        tags: ["Documents"],
        summary: "List request documents",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Documents returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/documents/{id}": {
      delete: {
        tags: ["Documents"],
        summary: "Delete a document",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Document deleted successfully",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Document not found",
          },
        },
      },
    },
    "/api/v1/requests/{id}/comments": {
      post: {
        tags: ["Comments"],
        summary: "Create a comment",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommentCreate",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Comment created successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Access denied",
          },
          404: {
            description: "Request not found",
          },
        },
      },

      get: {
        tags: ["Comments"],
        summary: "List request comments",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Comments returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Access denied",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/comments/{id}": {
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CommentCreate",
              },
            },
          },
        },

        responses: {
          200: {
            description: "Comment updated successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Access denied",
          },
          404: {
            description: "Comment not found",
          },
        },
      },

      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Comment deleted successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Access denied",
          },
          404: {
            description: "Comment not found",
          },
        },
      },
    },
    "/api/v1/requests/{id}/approvals": {
      post: {
        tags: ["Approvals"],
        summary: "Create an approval decision",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ApprovalCreate",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Approval decision created successfully",
          },
          400: {
            description: "Validation error or invalid workflow transition",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Approval access denied",
          },
          404: {
            description: "Request not found",
          },
        },
      },

      get: {
        tags: ["Approvals"],
        summary: "List request approvals",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Approvals returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Approval access denied",
          },
          404: {
            description: "Request not found",
          },
        },
      },
    },

    "/api/v1/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Get notifications",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Notifications returned successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/v1/notifications/{id}/read": {
      patch: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Notification marked as read",
          },
          401: {
            description: "Authentication required",
          },
          404: {
            description: "Notification not found",
          },
        },
      },
    },
    "/api/v1/conversations": {
      get: {
        tags: ["Conversations"],
        summary: "List conversations",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Conversations returned successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },

      post: {
        tags: ["Conversations"],
        summary: "Create a conversation",
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ConversationCreate",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Conversation created successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Conversation access denied",
          },
        },
      },
    },

    "/api/v1/conversations/unread-count": {
      get: {
        tags: ["Conversations"],
        summary: "Get total unread message count",
        security: [{ bearerAuth: [] }],

        responses: {
          200: {
            description: "Unread count returned successfully",
          },
          401: {
            description: "Authentication required",
          },
        },
      },
    },

    "/api/v1/conversations/{id}/messages": {
      get: {
        tags: ["Conversations"],
        summary: "Get conversation messages",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 50,
            },
          },
        ],

        responses: {
          200: {
            description: "Messages returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Conversation access denied",
          },
          404: {
            description: "Conversation not found",
          },
        },
      },

      post: {
        tags: ["Conversations"],
        summary: "Send a message",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MessageCreate",
              },
            },
          },
        },

        responses: {
          201: {
            description: "Message sent successfully",
          },
          400: {
            description: "Validation error",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Conversation access denied",
          },
          404: {
            description: "Conversation not found",
          },
        },
      },
    },

    "/api/v1/conversations/{id}/messages/read": {
      patch: {
        tags: ["Conversations"],
        summary: "Mark conversation messages as read",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Messages marked as read",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Conversation access denied",
          },
          404: {
            description: "Conversation not found",
          },
        },
      },
    },

    "/api/v1/conversations/{id}/messages/unread-count": {
      get: {
        tags: ["Conversations"],
        summary: "Get conversation unread count",
        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],

        responses: {
          200: {
            description: "Unread count returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Conversation access denied",
          },
          404: {
            description: "Conversation not found",
          },
        },
      },
    },
    "/api/v1/audit-logs": {
      get: {
        tags: ["Audit Logs"],
        summary: "Get audit logs",
        description:
          "Returns administrative audit records with optional filtering and pagination.",

        security: [{ bearerAuth: [] }],

        parameters: [
          {
            name: "actor",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "action",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "resourceType",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "resourceId",
            in: "query",
            required: false,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 50,
            },
          },
        ],

        responses: {
          200: {
            description: "Audit logs returned successfully",
          },
          401: {
            description: "Authentication required",
          },
          403: {
            description: "Administrator access required",
          },
        },
      },
    },
  },
};
