const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.promise = Promise;

// Define userSchema
const recordSchema = new Schema({
  username: {type: String, unique: false, required: false},
  result: {type: String, unique: false, required: false},
  note: {type: String, unique: false, required: false, default: ""},
  time: {type: Date, unique: false, required: false, default: Date.now}
});


const Record = mongoose.model("Record", recordSchema);
module.exports = Record;
