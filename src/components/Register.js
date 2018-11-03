import React, {Component} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import {PersonAdd} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";

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

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      fullname: "",
      redirectTo: null
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  postData = () => {
    axios
      .post("/user", {
        fullname: this.state.fullname,
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        if (response.status === 200) {
          axios
            .post("/user/login", {
              username: this.state.username,
              password: this.state.password
            })
            .then(response => {
              console.log("login response: ");
              console.log(response);
              if (response.status === 200) {
                this.props.updateUser({
                  loggedIn: true,
                  username: response.data.username
                });
              }
            })
            .catch(error => {
              console.log("login error: ");
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log("Getting user data error", error);
      });
  };

  componentDidMount() {}

  render() {
    const {loggedIn, classes} = this.props;
    return (
      <React.Fragment>
        {loggedIn && <Redirect to="/profile" />}
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonAdd />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="fullname">Full Name</InputLabel>
                <Input id="fullname" name="fullname" autoFocus value={this.state.fullname} onChange={this.handleChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input id="username" name="username" value={this.state.username} onChange={this.handleChange} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={this.handleChange} />
              </FormControl>
              <Button fullWidth variant="contained" color="primary" className={classes.submit} onClick={this.postData}>
                Register
              </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Register);
