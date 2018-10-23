//Connect to Mongo database
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const uri = "mongodb://admin:Khadgar82@ds137283.mlab.com:37283/glucalendar";

mongoose
  .connect(
    uri,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(
    () => {
      /** ready to use. The `mongoose.connect()` promise resolves to undefined. */

      console.log("Connected to Mongo");
    },
    err => {
      /** handle initial connection error */

      console.log("error connecting to Mongo: ");
      console.log(err);
    }
  );

module.exports = mongoose.connection;
