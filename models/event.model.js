const mongoose = require("mongoose");

// event Schema
const eventSchema = mongoose.Schema({
  event_name: { type: String, required: true },
  event_description: { type: String, required: true },
  event_time: { type: Date, required: true },
  event_location: { type: String, required: true },
  event_duration: { type: Number, required: true },
  max_players: { type: Number, required: true },
  players_joined: { type: Number, default: 0 },
  access: { 
    type: String,
     enum: ["Public", "Private"], 
     default: "Public" },
  event_status : {
    type : String,
    enum : ["Started","Ended","Not-started"],
    default : "Not-started"
  },
  player_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  event_organizer_id: { type: mongoose.Schema.Types.ObjectId },
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = { EventModel };
