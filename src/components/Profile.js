import React, {Component} from "react";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";

class Profile extends Component {
  render() {
    if (!this.props.loggedIn) {
      return <Redirect to={{pathname: "/login"}} />;
    } else {
      return (
        <Typography component="h2" variant="h1" gutterBottom>
          Profile Page
        </Typography>
      );
    }
  }
}
export default Profile;
