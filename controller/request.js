const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");

exports.join_event = async (req, res) => {
    try {
      const { eventId } = req.params;
      const UserId = req.UserId
      const event = await EventModel.findOne({_id : eventId})
      if(!event){
          // if the event doesn't exists
          return res.status(404).send({"message" : "Event not found"})
      }
      // if event exists create a player document for making request to join the event
      const player = await new PlayerModel({
        player_name: username,
        player_id : UserId,
        event_id: eventId,
        organizer_id: event.event_organizer_id,
      });
      player.save()
      res.status(200).send({"message" :  "Request sucessfully created"})
    } catch (err) {
      console.log(err);
      res.status(500).send({ Error: "Server error" });
    }
  }


  exports.accept_event_request = async (req, res) => {
    try {
      const { id } = req.params;
  
      const UserId = req.UserId;
      const event = await EventModel.findOne({ _id: UserId });
      if(!event){
        return res.status(404).send({"message" : "Event not found , please create an event"})
      }

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
  }

exports.reject_event_request = async(req,res)=>{
    try{
        const { id } = req.params;
        const userId = req.UserId
        const player = await PlayerModel.findOne({_id : id,organizer_id : userId})

        if(!player){
            return res.status(404).send({"message" : `request with ${id} not for your event not found `})
        }

        await PlayerModel.findByIdAndUpdate({_id : id},{$set : {
            status : "Rejected"
        }})


        res.status(200).send({"message" : `request with ${id} rejected`})
    }
    catch(err){
        console.log(err)
        res.status(500).send({"Error" : "Server error"})
    }
}


exports.delete_request = async(req,res)=>{
    try{
        const { id } = req.params
        const UserId = req.UserId
        const request = await PlayerModel.findOne({_id : id,player_id : UserId})

        if(!request){
            return res.status(404).send({"message" : ` request with requestId - ${id} not found`})
        }

        await PlayerModel.findByIdAndDelete({_id : id})
        res.status(200).send({"message" : "Request canceled Sucessfully"})

    }catch(err){
        console.log(err)
        res.status(500).send({"Error" : 'Server error'})
    }
}

exports.reject_allpending_request = async (req, res) => {
    try {
      const { eventId } = req.params;
      const UserId = req.UserId;
      const response = await PlayerModel.updateMany(
        { _id: eventId, status: "Pending", organizer_id: UserId },
        {
          status: "Rejected",
        }
      );

      if (response.modifiedCount === 0) {
        return res.status(404).send({ message: "event not found" });
      }
      return res.status(200).send({
        message: `all pending requests of eventId - ${eventId} rejected`,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: "Server error" });
    }
  }