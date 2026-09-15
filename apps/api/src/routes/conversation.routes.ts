import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createConversationSchema,
  sendMessageSchema,
} from "../validators/message.validator.js";

import {
  createConversationController,
  listConversationsController,
} from "../controllers/conversation.controller.js";

import {
  sendMessageController,
  listMessagesController,
  markMessagesAsReadController,
  unreadMessageCountController,
} from "../controllers/message.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", listConversationsController);

router.post(
  "/",
  validate(createConversationSchema),
  createConversationController,
);

router.patch("/:id/messages/read", markMessagesAsReadController);

router.get("/:id/messages/unread-count", unreadMessageCountController);

router.get("/:id/messages", listMessagesController);

router.post(
  "/:id/messages",
  validate(sendMessageSchema),
  sendMessageController,
);

export default router;