const mongoose = require("mongoose");


// player schema
const playerSchema = mongoose.Schema({
  player_name: { type: String, required: true },
  event_id: { type: mongoose.Schema.Types.ObjectId },
  organizer_id: { type: mongoose.Schema.Types.ObjectId },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const PlayerModel = mongoose.model("Player", playerSchema);

module.exports = { PlayerModel };
