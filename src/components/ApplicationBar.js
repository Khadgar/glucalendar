import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import {Link, withRouter, Redirect} from "react-router-dom";
import axios from "axios";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class ApplicationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      anchorEl: null
    };
  }

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  handleLogout = event => {
    this.handleClose();
    event.preventDefault();
    console.log("logging out");
    axios
      .post("/user/logout")
      .then(response => {
        console.log(response.data);
        if (response.status === 200) {
          this.props.updateUser({
            loggedIn: false,
            username: null
          });
        }
      })
      .catch(error => {
        console.log("Logout error", error);
      });
  };

  render() {
    console.log("appbar props", this.props);
    const {auth, classes} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link to="/" style={{textDecoration: "none", color: "#fff"}}>
                GluCalendar
              </Link>
            </Typography>
            {!auth && (
              <div>
                <Link to="/login" style={{textDecoration: "none", color: "#fff"}}>
                  <Button color="inherit" to="/login">
                    Login
                  </Button>
                </Link>
              </div>
            )}
            {auth && (
              <div>
                <IconButton aria-owns={open ? "menu-appbar" : null} aria-haspopup="true" onClick={this.handleMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <Link to="/login" style={{textDecoration: "none", color: "#fff"}}>
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
ApplicationBar.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withRouter(ApplicationBar));
