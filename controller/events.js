const { EventModel } = require("../models/event.model");
const { PlayerModel } = require("../models/player.model");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.allevent = async (req, res) => {
  try {
    let data = await EventModel.find({ event_time: { $gte: new Date() } }).sort(
      { event_time: 1 }
    );

    return res.status(201).send({ event: data });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Servor Error" });
  }
};

exports.event = async (req, res) => {
  try {
    const { eventId } = req.params;
    let event = await EventModel.findById({ eventId });

    if (!event) {
      return res.status(404).send({ message: "Event Not Found" });
    }

    const players = await PlayerModel.find({ event_id: eventId }).populate(
      "organizer_id"
    );

    res.status(200).send({ message: "Event Data", event, players });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Error: "Server error" });
  }
};

exports.create_event = async (req, res) => {
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
};

exports.update_event = async (req, res) => {
  try {
    const { eventId } = req.params;
    const payload = req.body;

    await EventModel.findOneAndUpdate({ _id: eventId }, { $set: payload });
    res
      .status(200)
      .send({ message: `Event with ${eventId} updated sucessfully` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.change_event_status = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query;

    if (status === "Start") {
      await EventModel.findByIdAndUpdate(
        { _id: eventId },
        {
          $set: { event_status: "Started" },
        }
      );

      return res.status(200).send({ message: "Event Status Updated" });
    } else if (status === "End") {
      await EventModel.findByIdAndUpdate(
        { _id: eventId },
        {
          $set: { event_status: "Ended" },
        }
      );

      await PlayerModel.updateMany(
        { _id: eventId, status: "Pending" },
        {
          status: "Rejected",
        }
      );

      return res.status(200).send({ message: `Event Status Updated and all pending request of eventId - ${eventId} rejected` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
};

exports.delete_event = async (req, res) => {
  try {
    const { eventId } = req.params;

    await EventModel.findByIdAndDelete({ _id: eventId });
    res
      .status(200)
      .send({ message: `Event with ${eventId} deleted sucessfully` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
};
