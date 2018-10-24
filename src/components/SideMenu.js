import React, {Component} from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import {Home, NoteAdd, History, Settings, Fingerprint, PowerSettingsNew, AccountCircle} from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import {Link, withRouter} from "react-router-dom";

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
};

class SideMenu extends Component {
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  createMenuItems() {
    return (
      <List>
        <ListItem button key={"home"}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={"Home"} />
        </ListItem>
        <ListItem button key={"profile"}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText primary={"Profile"} />
        </ListItem>
        <ListItem button key={"add_new_result"}>
          <ListItemIcon>
            <NoteAdd />
          </ListItemIcon>
          <ListItemText primary={"Add New Result"} />
        </ListItem>
        <ListItem button key={"history"}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText primary={"History"} />
        </ListItem>
        <ListItem button key={"settings"}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
        <Divider />
        {this.props.isLoggedIn && (
          <ListItem button key={"logout"}>
            <ListItemIcon>
              <PowerSettingsNew />
            </ListItemIcon>
            <ListItemText primary={"Logout"} onClick={this.props.handleLogout} />
          </ListItem>
        )}
        {!this.props.isLoggedIn && (
          <Link to="/login" style={{textDecoration: "none", color: "#fff"}}>
            <ListItem button key={"login"}>
              <ListItemIcon>
                <Fingerprint />
              </ListItemIcon>
              <ListItemText primary={"Login"} />
            </ListItem>
          </Link>
        )}
      </List>
    );
  }

  render() {
    return (
      <Drawer open={this.props.open} onClose={this.props.toggleDrawer("left", false)}>
        <div tabIndex={0} role="button" onClick={this.props.toggleDrawer("left", false)} onKeyDown={this.props.toggleDrawer("left", false)}>
          {this.createMenuItems()}
        </div>
      </Drawer>
    );
  }
}

SideMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(SideMenu));
