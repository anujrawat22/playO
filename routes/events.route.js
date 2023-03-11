const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");

const eventRouter = express.Router();

// all the events 
eventRouter.get("/", authenticate, async (req, res) => {
  try {
    let data = await EventModel.find({ event_time: { $gte: new Date() } }).sort(
      { event_time: 1 }
    );

    return res.status(201).send({ event: data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Servor Error" });
  }
});


// returns event with the input eventID and all the players who have joined the event
eventRouter.get("/:eventId", authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    let event = await EventModel.findById({ eventId });

    if (!event) {
      return res.status(404).send({ message: "Event Not Found" });
    }

    const players = await PlayerModel.find({event_id : eventId}).populate('organizer_id')

    res.status(200).send({"message" : "Event Data",  event, players})
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server error" });
  }
});


// create an event
eventRouter.post("/create", authenticate, async (req, res) => {
  try {
    const {
      event_name,
      event_description,
      event_time,
      event_location,
      event_duration,
      max_players,
    } = req.body;

    const event_organizer_id = req.UserId;

    const event = await new EventModel({
      event_name,
      event_description,
      event_time,
      event_location,
      event_duration,
      max_players,
      event_organizer_id,
    });

    event.save();

    return res.status(201).send({ message: "Event Created Sucessfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ Error: "Server error" });
  }
});


// update the details of an event
eventRouter.put("/:eventId/update",authenticate,async(req,res)=>{
    try{
        const { eventId } = req.params
        const payload = req.body

        await EventModel.findOneAndUpdate({_id : eventId}, {$set : payload})
        res.status(200).send({"message" : `Event with ${eventId} updated sucessfully`})
    }catch(err){
        console.log(err)
        res.status(500).send({"message" : "Server error"})
    }
})


// update the status of an event
eventRouter.put("/:eventId/status",authenticate,async(req,res)=>{
    try{
        const { eventId } = req.params
        const { updated } = req.query
        await EventModel.findByIdAndUpdate({_id : eventId},{
            $set : { event_status : updated}
        })
    }
    catch(err){
        console.log(err)
        res.status(500).send({"message" : 'Server error'})
    }
})

// delete an event
eventRouter.delete("/delete/:eventId",authenticate,async (req,res)=>{

    try{
        const { eventId } = req.params
        
        await EventModel.findByIdAndDelete({_id : eventId})
        res.status(200).send({"message" : `Event with ${eventId} deleted sucessfully`})
    }catch(err){
        console.log(err)
        res.status(500).send({"message" : "Server error"})
    }
})

module.exports = { eventRouter };
