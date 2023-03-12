const express = require("express");
const {
  join_event,
  accept_event_request,
  reject_event_request,
  delete_request,
  reject_allpending_request,
} = require("../controller/request");
const { authenticate } = require("../middlewares/authenticate");
const requestRouter = express.Router();

// making request to join an event
requestRouter.post("/:eventId/join", authenticate, join_event);

// accepting request of an event
requestRouter.post("/:id/accept", authenticate, accept_event_request);

// requesting request of an event
requestRouter.post("/:id/reject", authenticate, reject_event_request);

// reject all pending requests
requestRouter.put(
  "/:eventId/pendingrequrests",
  authenticate,
  reject_allpending_request
);

// deleting request for the event
requestRouter.delete("/:id/cancel", authenticate, delete_request);

module.exports = { requestRouter };
