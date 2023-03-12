const express = require("express");
const { allevent, event, create, update, create_event, update_event, event_status, delete_event, change_event_status } = require("../controller/events");
const { authenticate } = require("../middlewares/authenticate");

const eventRouter = express.Router();

// all the events 
eventRouter.get("/",  allevent);


// returns event with the input eventID and all the players who have joined the event
eventRouter.get("/:eventId", authenticate, event);


// create an event
eventRouter.post("/create", authenticate, create_event);


// update the details of an event
eventRouter.put("/:eventId/update",authenticate,update_event)


// update the status of an event and if the event status changes to start all the request for that event reject
eventRouter.put("/:eventId/status",authenticate,change_event_status)

// delete an event
eventRouter.delete("/delete/:eventId",authenticate,delete_event)

module.exports = { eventRouter };
