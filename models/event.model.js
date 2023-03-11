const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  event_name: { type: String, required: true },
  event_description: { type: String, required: true },
  event_time: { type: Date, required: true },
  event_location: { type: String, required: true },
  event_duration : { type : Number , required : true},
  max_players: { type: Number, required: true },
  players_joined: { type: Number, default: 0 },
  player_list: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  event_organizer_id: { type: mongoose.Schema.Types.ObjectId },
});

const EventModel = mongoose.model("Event", eventSchema);

module.exports = { EventModel };
