const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tripSchema = new Schema({
  title: { type: String, required: true },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  image: { type: String, required: true },
  date: { type: String, required: true },
  memo: [
    [
      {
        img: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        coordinates: {
          lat: { type: Number, required: true },
          lng: { type: Number, required: true },
        },
      },
    ],
  ],
});

module.exports = mongoose.model("Trip", tripSchema);
