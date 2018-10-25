const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.promise = Promise;

const settingsSchema = new Schema({
  username: {type: String, unique: false, required: false},
  unit: {type: String, unique: false, required: false},
  target_fasting: {
    range: {
      min: {
        type: Number,
        min: 0,
        default: 80,
        validate: {
          validator: function(val) {
            const currMax = this.target_fasting.range.max;
            return currMax !== undefined ? val <= currMax : true;
          },
          message: "The MIN range with value {VALUE} must be <= than the max range!"
        }
      },
      max: {
        type: Number,
        min: 0,
        default: 130,
        validate: {
          validator: function(val) {
            const currMin = this.target_fasting.range.min;
            return currMin !== undefined ? val >= currMin : true;
          },
          message: "The MAX range with value {VALUE} must be >= than the min range!"
        }
      }
    }
  },
  target_before_meal: {
    range: {
      min: {
        type: Number,
        min: 0,
        default: 80,
        validate: {
          validator: function(val) {
            const currMax = this.target_before_meal.range.max;
            return currMax !== undefined ? val <= currMax : true;
          },
          message: "The MIN range with value {VALUE} must be <= than the max range!"
        }
      },
      max: {
        type: Number,
        min: 0,
        default: 130,
        validate: {
          validator: function(val) {
            const currMin = this.target_before_meal.range.min;
            return currMin !== undefined ? val >= currMin : true;
          },
          message: "The MAX range with value {VALUE} must be >= than the min range!"
        }
      }
    }
  },
  target_after_meal: {
    range: {
      min: {
        type: Number,
        min: 0,
        default: 110,
        validate: {
          validator: function(val) {
            const currMax = this.target_after_meal.range.max;
            return currMax !== undefined ? val <= currMax : true;
          },
          message: "The MIN range with value {VALUE} must be <= than the max range!"
        }
      },
      max: {
        type: Number,
        min: 0,
        default: 180,
        validate: {
          validator: function(val) {
            const currMin = this.target_after_meal.range.min;
            return currMin !== undefined ? val >= currMin : true;
          },
          message: "The MAX range with value {VALUE} must be >= than the min range!"
        }
      }
    }
  }
});

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = Settings;
