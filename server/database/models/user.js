const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
mongoose.promise = Promise;
const Settings = require("./settings");

// Define userSchema
const userSchema = new Schema({
  username: {type: String, unique: false, required: false},
  password: {type: String, unique: false, required: false}
});

// Define schema methods
userSchema.methods = {
  checkPassword: function(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  },
  hashPassword: plainTextPassword => {
    return bcrypt.hashSync(plainTextPassword, 10);
  }
};

// Define hooks for pre-saving
userSchema.pre("save", function(next) {
  if (!this.password) {
    console.log("models/user.js =======NO PASSWORD PROVIDED=======");
    next();
  } else {
    console.log("models/user.js hashPassword in pre save");

    this.password = this.hashPassword(this.password);
    next();
  }
});

userSchema.post("save", function(doc) {
  const newSettings = new Settings({
    username: this.username,
    unit: "mg/dL",
    targetFasting: {
      range: {
        min: 80,
        max: 130
      }
    },
    targetBeforeMeal: {
      range: {
        min: 80,
        max: 130
      }
    },
    targetAfterMeal: {
      range: {
        min: 130,
        max: 180
      }
    }
  });
  newSettings.save((err, savedUser) => {
    if (err) return console.log("init settings error");
    console.log("init settings saved");
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
