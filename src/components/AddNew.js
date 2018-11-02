import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Redirect} from "react-router-dom";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DateTimePicker from "material-ui-pickers/DateTimePicker";
import MomentUtils from "material-ui-pickers/utils/moment-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

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

class AddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: 0,
      user: this.props.user,
      note: "",
      dateofmeasurment: moment().format("YYYY-MM-DDTHH:mm")
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleDateChange = date => {
    this.setState({dateofmeasurment: date.format("YYYY-MM-DDTHH:mm")});
  };

  postData = () => {
    axios
      .post("/user/add-record", {
        username: this.state.user.username,
        result: this.state.result,
        note: this.state.note,
        time: this.state.dateofmeasurment
      })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            result: 0,
            note: "",
            dateofmeasurment: moment().format("YYYY-MM-DDTHH:mm")
          });
        }
      })
      .catch(error => {
        console.log("Getting user data error", error);
      });
  };

  componentDidMount() {}

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
                Add new measurment
              </Typography>
              <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                  <Input required id="result" name="result" label="Number" value={this.state.result} type="number" onChange={this.handleChange} />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Select
                    value={this.state.note}
                    inputProps={{
                      name: "note",
                      id: "note"
                    }}
                    required
                    onChange={this.handleChange}
                  >
                    <MenuItem name="note" value={"before meal"}>
                      Before Meal
                    </MenuItem>
                    <MenuItem name="note" value={"after meal"}>
                      After Meal
                    </MenuItem>
                    <MenuItem name="note" value={"fasting"}>
                      Fasting
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker required label="Time of measurment" showTodayButton ampm={false} value={this.state.dateofmeasurment} onChange={this.handleDateChange} />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={this.postData}>
                  Add
                </Button>
              </form>
            </Paper>
          </main>
        </React.Fragment>
      );
    }
  }
}

AddNew.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddNew);
