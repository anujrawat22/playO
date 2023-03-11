const express = require("express");
const { authenticate } = require("../middlewares/authenticate");
const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");

const requestRouter = express.Router();

// making request to join an event
requestRouter.post("/:eventId/join", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await EventModel.findOne({_id : eventId})
    if(!event){
        // if the event doesn't exists
        return res.status(404).send({"message" : "Event not found"})
    }
    // if event exists create a player document for making request to join the event
    const player = await new PlayerModel({
      player_name: username,
      event_id: eventId,
      organizer_id: event.event_organizer_id,
    });
    player.save()
    res.status(200).send({"message" :  "Request sucessfully created"})
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server error" });
  }
});

// accepting request of an event
requestRouter.post("/:id/accept", authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const UserId = req.UserId;
    const username = req.username;
    const event = await EventModel.findOne({ _id: UserId });

    if (event.players_joined < event.max_players) {
      event.players_joined++;
      event.player_list.push(id);

      await EventModel.findByIdAndUpdate({ _id: UserId }, event);

      await PlayerModel.findByIdAndUpdate({_id : id},{$set : {status : "Approved"}})
      res.status(200).send({"message" : "Request accepted"})
    }else{
      return res.status(403).send({"message" : "No slots available"})
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server error" });
  }
});

// requesting request of an event
requestRouter.post("/:id/reject",authenticate,async(req,res)=>{
    try{
        const { id } = req.params;

        await PlayerModel.findByIdAndUpdate({_id : id},{$set : { status : "Rejected"}})

        res.status(200).send({"message" : `request with ${id} rejected`})
    }
    catch(err){
        console.log(err)
        res.status(500).send({"Error" : "Server error"})
    }
})

// reject all pending requests
requestRouter.put("/:eventId/pendingrequrests",authenticate,async (req,res)=>{
    try{

        const { eventId } = req.params

        await PlayerModel.updateMany({_id : eventId , status : 'Pending'},{
            status : "Rejected"
        })
    }catch(err){
        console.log(err)
        res.status(500).send({"message" : 'Server error'})
    }
})


// deleting request for the event
requestRouter.delete("/:id/cancel" , authenticate ,async(req,res)=>{
    try{
        const { id } = req.params

        const UserId = req.UserId
        
        await PlayerModel.findByIdAndDelete({_id : id})
        res.status(200).send({"message" : "Request canceled Sucessfully"})

    }catch(err){
        console.log(err)
        res.status(500).send({"Error" : 'Server error'})
    }
})

module.exports = { requestRouter };
