const express = require("express");
const { authenticate } = require("../Authentication/authenticate");
const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");

const requestRouter = express.Router();

requestRouter.post("/:eventId/join", async (req, res) => {
  try {
    const { eventId } = req.params;

    const player = await new PlayerModel({
      player_name: username,
      event_id: eventId,
      organizer_id: event.event_organizer_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server error" });
  }
});

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
