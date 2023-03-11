const express = require("express");
const { authenticate } = require("../Authentication/authenticate");
const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");

const eventRouter = express.Router();

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



eventRouter.put("/update/:eventId",authenticate,async(req,res)=>{
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
