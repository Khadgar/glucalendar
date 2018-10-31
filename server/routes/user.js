const express = require("express");
const router = express.Router();
const User = require("../database/models/user");
const passport = require("../passport");

const Record = require("../database/models/record");
const Settings = require("../database/models/settings");

router.post("/", (req, res) => {
  console.log("user signup");

  const {username, password} = req.body;
  // ADD VALIDATION
  User.findOne({username: username}, (err, user) => {
    if (err) {
      console.log("User.js post error: ", err);
    } else if (user) {
      res.json({
        error: `Sorry, already a user with the username: ${username}`
      });
    } else {
      const newUser = new User({
        username: username,
        password: password
      });
      newUser.save((err, savedUser) => {
        if (err) return res.json(err);
        res.json(savedUser);
      });
    }
  });
});

router.post(
  "/login",
  function(req, res, next) {
    console.log("routes/user.js, login, req.body: ");
    console.log(req.body);
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    console.log("logged in", req.user);
    var userInfo = {
      username: req.user.username
    };
    res.send(userInfo);
  }
);

router.get("/", (req, res, next) => {
  console.log("===== user!!======");
  console.log(req.user);
  if (req.user) {
    res.json({user: req.user});
  } else {
    res.json({user: null});
  }
});

router.post("/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send({msg: "logging out"});
  } else {
    res.send({msg: "no user to log out"});
  }
});

router.post("/add-record", (req, res) => {
  console.log("adding record");

  const {username, result, note, time} = req.body;
  const newRecord = new Record({
    username: username,
    result: result,
    note: note,
    time: time
  });

  newRecord.save((err, savedRecord) => {
    if (err) return res.json(err);
    res.json(savedRecord);
  });
});

router.post("/get-records", (req, res) => {
  //get the records and the corresponding user settings
  console.log("get records");
  const {username} = req.body;
  Settings.find(username ? {username: username} : {}, (err, settings) => {
    if (err) {
      console.log("settings.js post error: ", err);
    } else if (settings) {
      Record.find(username ? {username: username} : {}, (err, records) => {
        if (err) {
          console.log("record.js post error: ", err);
        } else if (records) {
          res.json({
            records: records,
            settings: settings
          });
        }
      });
    }
  });
});

router.post("/add-settings", (req, res) => {
  const {username, unit, targetFasting, targetBeforeMeal, targetAfterMeal} = req.body;
  const newSettings = {
    username: username,
    unit: unit,
    target_fasting: targetFasting,
    target_before_meal: targetBeforeMeal,
    target_after_meal: targetAfterMeal
  };
  const newSettingsSchema = new Settings(newSettings);
  const validateSchema = newSettingsSchema.validateSync();
  if (validateSchema) {
    const errorMessages = Object.keys(validateSchema.errors).map(error => {
      return {field: error, message: validateSchema.errors[error].message};
    });
    return res.status(400).json(errorMessages);
  }

  try {
    Settings.findOneAndUpdate(
      {username: username},
      newSettings,
      {
        new: true,
        upsert: true
      },
      (err, settings) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(settings);
        }
      }
    );
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/get-settings", (req, res) => {
  const {username} = req.body;
  Settings.find(username ? {username: username} : {}, (err, settings) => {
    if (err) {
      console.log("settings.js post error: ", err);
    } else if (settings) {
      res.json(settings);
    }
  });
});

module.exports = router;
