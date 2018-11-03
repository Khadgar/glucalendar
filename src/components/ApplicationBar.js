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
import SideMenu from "./SideMenu";
import SvgIcon from "@material-ui/core/SvgIcon";

import {Link, withRouter} from "react-router-dom";
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
  },
  username: {}
};

class ApplicationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      anchorEl: null,
      left: false
    };
  }

  handleMenu = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
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
    const {auth, classes, user, currentTheme, changeTheme} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer("left", true)}>
              <MenuIcon />
            </IconButton>
            <SideMenu handleLogout={this.handleLogout} isLoggedIn={auth} open={this.state.left} toggleDrawer={this.toggleDrawer} />
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link to="/" style={{textDecoration: "none", color: "#fff"}}>
                Glucose Calendar
              </Link>
            </Typography>
            {currentTheme === "light" && (
              <IconButton aria-label="LightTheme" color="inherit" onClick={changeTheme}>
                <SvgIcon>
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />{" "}
                </SvgIcon>
              </IconButton>
            )}
            {currentTheme === "dark" && (
              <IconButton aria-label="DarkTheme" color="inherit" onClick={changeTheme}>
                <SvgIcon>
                  <path d="m9,21c0,0.55 0.45,1 1,1l4,0c0.55,0 1,-0.45 1,-1l0,-1l-6,0l0,1zm3,-19c-3.86,0 -7,3.14 -7,7c0,2.38 1.19,4.47 3,5.74l0,2.26c0,0.55 0.45,1 1,1l6,0c0.55,0 1,-0.45 1,-1l0,-2.26c1.81,-1.27 3,-3.36 3,-5.74c0,-3.86 -3.14,-7 -7,-7z" />
                </SvgIcon>
              </IconButton>
            )}

            {!auth && (
              <div>
                <Link to="/login" style={{textDecoration: "none", color: "#fff"}}>
                  <Button color="inherit" to="/login">
                    Login
                  </Button>
                </Link>
                <Link to="/register" style={{textDecoration: "none", color: "#fff"}}>
                  <Button color="inherit" to="/register">
                    Register
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
                  <Link to="/profile" style={{textDecoration: "none", color: "#fff", outline: "none"}}>
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
