import React, {Component} from "react";
import Typography from "@material-ui/core/Typography";
import {Redirect} from "react-router-dom";
import Results from "./Results";

class Profile extends Component {
  render() {
    if (!this.props.loggedIn) {
      return <Redirect to={{pathname: "/"}} />;
    } else {
      return (
        <React.Fragment>
          <Typography component="h2" variant="h1" gutterBottom>
            Profile Page of {this.props.user.username}
          </Typography>
          <Results user={this.props.user} />
        </React.Fragment>
      );
    }
  }
}
export default Profile;
