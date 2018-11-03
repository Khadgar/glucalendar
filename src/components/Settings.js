import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {Redirect} from "react-router-dom";

import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

var moment = require("moment");

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      target_fasting_min: 0,
      target_fasting_max: 0,
      target_before_meal_min: 0,
      target_before_meal_max: 0,
      target_after_meal_min: 0,
      target_after_meal_max: 0,
      unit: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  getSettings = () => {
    axios
      .post("/user/get-settings", {
        username: this.props.user.username
      })
      .then(response => {
        console.log(response.data[0]);
        this.setState({
          target_fasting_min: response.data[0].target_fasting.range.min,
          target_fasting_max: response.data[0].target_fasting.range.max,
          target_before_meal_min: response.data[0].target_before_meal.range.min,
          target_before_meal_max: response.data[0].target_before_meal.range.max,
          target_after_meal_min: response.data[0].target_after_meal.range.min,
          target_after_meal_max: response.data[0].target_after_meal.range.max,
          unit: response.data[0].unit
        });
      })
      .catch(error => {
        console.log("Getting user data error", error);
      });
  };

  postData = () => {
    axios
      .post("/user/add-settings", {
        username: this.props.user.username,
        targetFasting: {range: {min: Number(this.state.target_fasting_min), max: Number(this.state.target_fasting_max)}},
        targetBeforeMeal: {range: {min: Number(this.state.target_before_meal_min), max: Number(this.state.target_before_meal_max)}},
        targetAfterMeal: {range: {min: Number(this.state.target_after_meal_min), max: Number(this.state.target_after_meal_max)}},
        unit: this.state.unit
      })
      .then(response => {
        if (response.status === 200) {
          this.getSettings();
        }
      })
      .catch(error => {
        console.log("Getting user data error", error);
      });
  };

  componentDidMount() {
    this.getSettings();
  }

  render() {
    const {classes, loggedIn} = this.props;
    if (!loggedIn) {
      return <Redirect to={{pathname: "/"}} />;
    } else {
      return (
        <React.Fragment>
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography component="h1" variant="h5">
                Settings
              </Typography>
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <Typography component="h1" variant="h5">
                    Target Fasting
                  </Typography>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_fasting_min">Minimum</InputLabel>
                    <Input required id="target_fasting_min" name="target_fasting_min" value={this.state.target_fasting_min} type="number" onChange={this.handleChange} />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_fasting_max">Maximum</InputLabel>
                    <Input required id="target_fasting_max" name="target_fasting_max" value={this.state.target_fasting_max} type="number" onChange={this.handleChange} />
                  </FormControl>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Typography component="h1" variant="h5">
                    Target Before Meal
                  </Typography>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_before_meal_min">Minimum</InputLabel>
                    <Input required id="target_before_meal_min" name="target_before_meal_min" value={this.state.target_before_meal_min} type="number" onChange={this.handleChange} />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_before_meal_max">Maximum</InputLabel>
                    <Input required id="target_before_meal_max" name="target_before_meal_max" value={this.state.target_before_meal_max} type="number" onChange={this.handleChange} />
                  </FormControl>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Typography component="h1" variant="h5">
                    Target After Meal
                  </Typography>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_after_meal_min">Minimum</InputLabel>
                    <Input required id="target_after_meal_min" name="target_after_meal_min" value={this.state.target_after_meal_min} type="number" onChange={this.handleChange} />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="target_after_meal_max">Maximum</InputLabel>
                    <Input required id="target_after_meal_max" name="target_after_meal_max" value={this.state.target_after_meal_max} type="number" onChange={this.handleChange} />
                  </FormControl>
                </FormControl>
                <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={this.postData}>
                  Submit
                </Button>
              </form>
            </Paper>
          </main>
        </React.Fragment>
      );
    }
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Settings);
